import { Injectable } from '@angular/core';
import { DAY_IN_MS } from '../data/seed-data';
import { Survey } from '../models/survey.model';

/** Builds the date and deadline texts shown on cards and in the detail view. */
@Injectable({ providedIn: 'root' })
export class LabelService {
  /** Formats a timestamp as DD.MM.YYYY. */
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()}`;
  }

  /** Builds the label of a survey that has already ended. */
  private getPastLabel(diff: number): string {
    const past = Math.max(1, Math.round(-diff / DAY_IN_MS));
    return past === 1 ? 'Ended yesterday' : `Ended ${past} days ago`;
  }

  /** Builds the remaining time label such as "Ends in 3 Days". */
  getDeadlineLabel(survey: Survey): string {
    const diff = survey.endsAt - Date.now();
    if (diff <= 0) {
      return this.getPastLabel(diff);
    }
    const left = Math.max(1, Math.ceil(diff / DAY_IN_MS));
    return left === 1 ? 'Ends in 1 Day' : `Ends in ${left} Days`;
  }

  /** Builds the end date line of the detail view. */
  getEndDateLabel(survey: Survey, past: boolean): string {
    const prefix = past ? 'Ended on' : 'Ends on';
    return `${prefix} ${this.formatDate(survey.endsAt)}`;
  }

  /** Converts a zero based index into a letter such as "A". */
  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
