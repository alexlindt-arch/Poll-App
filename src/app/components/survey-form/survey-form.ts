import { Component, HostListener, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BinIcon } from '../bin-icon/bin-icon';
import { CATEGORIES, DAY_IN_MS, MAX_ANSWERS, MIN_ANSWERS } from '../../data/seed-data';
import { SurveyService } from '../../services/survey.service';
import { LabelService } from '../../services/label.service';
import { Draft, DraftErrors, DraftQuestion, Question, Survey } from '../../models/survey.model';

/** Overlay dialog that collects a new survey and hands it back when published. */
@Component({
  selector: 'app-survey-form',
  imports: [FormsModule, BinIcon],
  templateUrl: './survey-form.html'
})
export class SurveyForm {
  readonly close = output<void>();
  readonly published = output<Survey>();

  readonly categories = CATEGORIES;
  readonly maxAnswers = MAX_ANSWERS;
  draft: Draft = this.createDraft();
  errors: DraftErrors = {};

  constructor(private surveys: SurveyService, private labels: LabelService) {}

  /** Closes the dialog when Escape is pressed. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  /** Builds an empty question with the minimum number of answers. */
  private createQuestionDraft(): DraftQuestion {
    return { text: '', multiple: false, answers: Array(MIN_ANSWERS).fill('') };
  }

  /** Builds an empty draft with one question. */
  private createDraft(): Draft {
    return {
      title: '', category: CATEGORIES[0], deadline: '', description: '',
      questions: [this.createQuestionDraft()]
    };
  }

  /** Empties one of the simple draft fields. */
  clearField(field: 'title' | 'deadline' | 'description'): void {
    this.draft[field] = '';
  }

  /** Converts an index into a letter such as "A". */
  letter(index: number): string {
    return this.labels.getLetter(index);
  }

  /** Switches a question between single and multiple choice. */
  toggleMultiple(question: DraftQuestion): void {
    question.multiple = !question.multiple;
  }

  /** Appends an empty question to the draft. */
  addQuestion(): void {
    this.draft.questions.push(this.createQuestionDraft());
  }

  /** Removes a question, or clears it if it is the only one left. */
  removeQuestion(index: number): void {
    if (this.draft.questions.length === 1) {
      this.draft.questions[0] = this.createQuestionDraft();
      return;
    }
    this.draft.questions.splice(index, 1);
  }

  /** Adds an empty answer field as long as the limit allows it. */
  addAnswer(question: DraftQuestion): void {
    if (question.answers.length < MAX_ANSWERS) {
      question.answers.push('');
    }
  }

  /** Removes an answer field as long as two remain. */
  removeAnswer(question: DraftQuestion, index: number): void {
    if (question.answers.length > MIN_ANSWERS) {
      question.answers.splice(index, 1);
    }
  }

  /** Keeps ngModel bound to the answer at the given position. */
  trackAnswer(index: number): number {
    return index;
  }

  /** Collects the questions that carry a text and at least two answers. */
  private getValidQuestions(): DraftQuestion[] {
    return this.draft.questions
      .map(question => ({
        text: question.text.trim(),
        multiple: question.multiple,
        answers: question.answers.map(answer => answer.trim()).filter(Boolean)
      }))
      .filter(question => question.text !== '' && question.answers.length >= MIN_ANSWERS);
  }

  /** Validates the draft and fills the error object. */
  private validate(questions: DraftQuestion[]): boolean {
    this.errors = {};
    if (this.draft.title.trim() === '') {
      this.errors.title = 'Please enter a survey name.';
    }
    if (questions.length === 0) {
      this.errors.questions = 'Add at least one question with two answers.';
    }
    return Object.keys(this.errors).length === 0;
  }

  /** Turns the chosen deadline into a timestamp, defaulting to one week. */
  private getDeadline(): number {
    if (this.draft.deadline === '') {
      return Date.now() + 7 * DAY_IN_MS;
    }
    const chosen = new Date(`${this.draft.deadline}T23:59:59`).getTime();
    return Math.max(chosen, Date.now() + DAY_IN_MS / 2);
  }

  /** Turns the valid draft questions into real questions. */
  private buildQuestions(questions: DraftQuestion[]): Question[] {
    return questions.map(question =>
      this.surveys.createQuestion(question.text, question.multiple, question.answers));
  }

  /** Validates the draft and hands the finished survey to the parent. */
  publish(): void {
    const questions = this.getValidQuestions();
    if (!this.validate(questions)) {
      return;
    }
    const survey = this.surveys.createSurvey(this.draft.category, this.draft.title.trim(),
      this.draft.description.trim(), this.getDeadline(), this.buildQuestions(questions));
    this.published.emit(survey);
  }
}
