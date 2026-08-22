import { Component, computed, HostListener, output } from '@angular/core';
import { LabelService } from '../../services/label.service';
import { SurveyService } from '../../services/survey.service';
import { Option, Question, Survey } from '../../models/survey.model';

/** Overlay that shows one survey with its questions and the live evaluation. */
@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.html'
})
export class SurveyDetail {
  readonly close = output<void>();
  readonly create = output<void>();

  /** Reads the open survey from the service so live votes re-render the view. */
  readonly survey = computed<Survey>(() =>
    this.surveys.getSurveyById(this.surveys.openSurveyId()) as Survey);

  constructor(private surveys: SurveyService, private labels: LabelService) {}

  /** Closes the overlay when Escape is pressed. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  /** True while the survey can no longer be answered. */
  get locked(): boolean {
    return this.surveys.isLocked(this.survey());
  }

  /** True once the end date has passed. */
  get past(): boolean {
    return this.surveys.isPast(this.survey());
  }

  /** The status badge text of the survey. */
  get status(): string {
    return this.past ? 'Closed' : 'Published';
  }

  /** The end date line above the headline. */
  get endDate(): string {
    return this.labels.getEndDateLabel(this.survey(), this.past);
  }

  /** The label of the submit button. */
  get submitLabel(): string {
    if (this.past) {
      return 'Survey closed';
    }
    return this.survey().hasVoted ? 'Survey completed' : 'Complete survey';
  }

  /** True while the submit button stays disabled. */
  get submitDisabled(): boolean {
    return this.locked || !this.surveys.hasAnySelection(this.survey());
  }

  /** The headline of the evaluation column. */
  get liveLabel(): string {
    return this.past ? 'FINAL' : 'LIVE';
  }

  /** Converts an index into a letter such as "A". */
  letter(index: number): string {
    return this.labels.getLetter(index);
  }

  /** True if the given option is currently selected. */
  isSelected(question: Question, option: Option): boolean {
    return this.surveys.isOptionSelected(question, option.id);
  }

  /** Share of one option in percent. */
  percentage(question: Question, option: Option): number {
    return this.surveys.getPercentage(question, option);
  }

  /** Selects or deselects an option while the survey is open. */
  selectOption(question: Question, option: Option): void {
    if (this.locked) {
      return;
    }
    this.surveys.toggleSelection(this.survey(), question, option.id);
  }

  /** Counts the selection and closes the survey for further votes. */
  submit(): void {
    this.surveys.submitSurvey(this.survey());
  }
}
