import { Component, input, output } from '@angular/core';
import { LabelService } from '../../services/label.service';
import { Survey } from '../../models/survey.model';

/** Clickable teaser of a survey, used as a highlight card and as a list row. */
@Component({
  selector: 'app-survey-teaser',
  templateUrl: './survey-teaser.html'
})
export class SurveyTeaser {
  readonly survey = input.required<Survey>();
  readonly variant = input<'card' | 'row'>('card');
  readonly open = output<number>();

  constructor(private labels: LabelService) {}

  /** The class that decides whether the teaser looks like a card or a row. */
  get cssClass(): string {
    return this.variant() === 'card' ? 'survey-card' : 'survey-row';
  }

  /** The remaining time label of this survey. */
  get deadline(): string {
    return this.labels.getDeadlineLabel(this.survey());
  }
}
