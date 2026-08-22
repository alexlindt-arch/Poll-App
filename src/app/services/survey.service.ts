import { computed, Injectable, signal } from '@angular/core';
import { CATEGORIES, DAY_IN_MS, LIVE_INTERVAL_MS, SEED_SURVEYS } from '../data/seed-data';
import { Option, Question, SeedQuestion, SeedSurvey, Survey, TabName } from '../models/survey.model';

/** Holds every survey and answers the questions the views ask about them. */
@Injectable({ providedIn: 'root' })
export class SurveyService {
  private nextId = 1;
  readonly surveys = signal<Survey[]>([]);
  readonly currentTab = signal<TabName>('active');
  readonly currentCategory = signal<string>('All');
  readonly openSurveyId = signal<number | null>(null);
  private liveTimerId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.surveys.set(SEED_SURVEYS.map(seed => this.buildSurvey(seed)));
    this.startLiveResults();
  }

  /** Returns the next free id. */
  private createId(): number {
    this.nextId += 1;
    return this.nextId;
  }

  /** Turns one seeded option into an option object. */
  private buildOption(raw: [string, number]): Option {
    return { id: this.createId(), label: raw[0], votes: raw[1] };
  }

  /** Turns one seeded question into a question object. */
  private buildQuestion(raw: SeedQuestion): Question {
    return {
      id: this.createId(),
      text: raw.text,
      multiple: raw.multiple,
      options: raw.options.map(option => this.buildOption(option)),
      selectedIds: []
    };
  }

  /** Turns one seeded survey into a survey object with a real end date. */
  private buildSurvey(raw: SeedSurvey): Survey {
    return {
      id: this.createId(),
      category: raw.category,
      title: raw.title,
      description: raw.description,
      endsAt: Date.now() + raw.daysLeft * DAY_IN_MS,
      hasVoted: false,
      questions: raw.questions.map(question => this.buildQuestion(question))
    };
  }

  /** Checks whether a survey has already ended. */
  isPast(survey: Survey): boolean {
    return survey.endsAt <= Date.now();
  }

  /** Checks whether voting is disabled for a survey. */
  isLocked(survey: Survey): boolean {
    return this.isPast(survey) || survey.hasVoted;
  }

  /** Finds a survey by its id. */
  getSurveyById(id: number | null): Survey | undefined {
    return this.surveys().find(survey => survey.id === id);
  }

  /** Returns all running surveys, the one ending next comes first. */
  getActiveSurveys(): Survey[] {
    return this.surveys().filter(survey => !this.isPast(survey))
      .sort((a, b) => a.endsAt - b.endsAt);
  }

  /** Returns all finished surveys, most recently ended first. */
  getPastSurveys(): Survey[] {
    return this.surveys().filter(survey => this.isPast(survey))
      .sort((a, b) => b.endsAt - a.endsAt);
  }

  /** Returns the surveys of the selected tab. */
  getSurveysForTab(): Survey[] {
    return this.currentTab() === 'active' ? this.getActiveSurveys() : this.getPastSurveys();
  }

  /** The surveys of the current tab after the category filter was applied. */
  readonly visibleSurveys = computed<Survey[]>(() => {
    const pool = this.getSurveysForTab();
    const category = this.currentCategory();
    return category === 'All' ? pool : pool.filter(survey => survey.category === category);
  });

  /** The categories that actually occur in the current tab. */
  readonly categoriesForTab = computed<string[]>(() => {
    const pool = this.getSurveysForTab();
    const used = CATEGORIES.filter(name => pool.some(survey => survey.category === name));
    return ['All'].concat(used);
  });

  /** The three running surveys that end next. */
  readonly endingSoon = computed<Survey[]>(() => this.getActiveSurveys().slice(0, 3));

  /** Switches the tab and resets the category filter. */
  showTab(tab: TabName): void {
    this.currentTab.set(tab);
    this.currentCategory.set('All');
  }

  /** Stores the chosen category. */
  selectCategory(name: string): void {
    this.currentCategory.set(name);
  }

  /** Adds a finished survey to the top of the list. */
  addSurvey(survey: Survey): void {
    this.surveys.update(list => [survey, ...list]);
    this.currentTab.set('active');
    this.currentCategory.set('All');
  }

  /** Builds an option for a survey created by the user. */
  createOption(label: string): Option {
    return { id: this.createId(), label, votes: 0 };
  }

  /** Builds a question for a survey created by the user. */
  createQuestion(text: string, multiple: boolean, answers: string[]): Question {
    return {
      id: this.createId(),
      text,
      multiple,
      options: answers.map(answer => this.createOption(answer)),
      selectedIds: []
    };
  }

  /** Builds the survey object for a survey created by the user. */
  createSurvey(category: string, title: string, description: string,
    endsAt: number, questions: Question[]): Survey {
    return { id: this.createId(), category, title, description, endsAt, hasVoted: false, questions };
  }

  /** Sums up all votes of a question, never below one. */
  getTotalVotes(question: Question): number {
    const total = question.options.reduce((sum, option) => sum + option.votes, 0);
    return Math.max(total, 1);
  }

  /** Returns the share of a single option in percent. */
  getPercentage(question: Question, option: Option): number {
    return Math.round((option.votes / this.getTotalVotes(question)) * 100);
  }

  /** Checks whether an option is currently selected. */
  isOptionSelected(question: Question, optionId: number): boolean {
    return question.selectedIds.includes(optionId);
  }

  /** Builds the selection a question has after one option was clicked. */
  private nextSelection(question: Question, optionId: number): number[] {
    if (this.isOptionSelected(question, optionId)) {
      return question.selectedIds.filter(id => id !== optionId);
    }
    return question.multiple ? [...question.selectedIds, optionId] : [optionId];
  }

  /** Puts an updated survey back into the list as a new object. */
  private replaceSurvey(updated: Survey): void {
    this.surveys.update(list => list.map(survey => survey.id === updated.id ? updated : survey));
  }

  /** Selects or deselects an option, honouring the single/multiple setting. */
  toggleSelection(survey: Survey, question: Question, optionId: number): void {
    const selectedIds = this.nextSelection(question, optionId);
    const questions = survey.questions.map(entry =>
      entry.id === question.id ? { ...entry, selectedIds } : entry);
    this.replaceSurvey({ ...survey, questions });
  }

  /** Checks whether the user picked at least one option. */
  hasAnySelection(survey: Survey): boolean {
    return survey.questions.some(question => question.selectedIds.length > 0);
  }

  /** Returns a copy of the question where the given options gained a vote. */
  private questionWithVotes(question: Question, optionIds: number[]): Question {
    return {
      ...question,
      options: question.options.map(option =>
        optionIds.includes(option.id) ? { ...option, votes: option.votes + 1 } : option)
    };
  }

  /** Adds the selection to the vote counts and locks the survey. */
  submitSurvey(survey: Survey): void {
    const questions = survey.questions.map(question =>
      this.questionWithVotes(question, question.selectedIds));
    this.replaceSurvey({ ...survey, questions, hasVoted: true });
  }

  /** Picks a random entry of a list. */
  private pickRandom<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
  }

  /** Chooses the survey that receives the next simulated vote. */
  private getLiveTarget(): Survey | null {
    const opened = this.getSurveyById(this.openSurveyId());
    if (opened && !this.isPast(opened)) {
      return opened;
    }
    const running = this.getActiveSurveys();
    return running.length > 0 ? this.pickRandom(running) : null;
  }

  /** Adds one simulated vote so the evaluation keeps moving. */
  private addLiveVote(): void {
    const survey = this.getLiveTarget();
    if (!survey) {
      return;
    }
    const question = this.pickRandom(survey.questions);
    const option = this.pickRandom(question.options);
    const questions = survey.questions.map(entry =>
      entry.id === question.id ? this.questionWithVotes(entry, [option.id]) : entry);
    this.replaceSurvey({ ...survey, questions });
  }

  /** Starts the timer behind the live evaluation. */
  private startLiveResults(): void {
    this.liveTimerId = setInterval(() => this.addLiveVote(), LIVE_INTERVAL_MS);
  }

  /** Stops the timer, used when the app is destroyed. */
  stopLiveResults(): void {
    if (this.liveTimerId !== null) {
      clearInterval(this.liveTimerId);
    }
  }
}
