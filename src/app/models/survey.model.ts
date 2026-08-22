/** Types shared by the seed data, the service and the components. */

/** One answer option of a seeded question: label and initial vote count. */
export type SeedOption = [string, number];

/** A question as it is written down in the seed file. */
export interface SeedQuestion {
  text: string;
  multiple: boolean;
  options: SeedOption[];
}

/** A survey as it is written down in the seed file. */
export interface SeedSurvey {
  category: string;
  title: string;
  description: string;
  daysLeft: number;
  questions: SeedQuestion[];
}

/** An answer option including its running vote count. */
export interface Option {
  id: number;
  label: string;
  votes: number;
}

/** A question with its options and the current selection of the user. */
export interface Question {
  id: number;
  text: string;
  multiple: boolean;
  options: Option[];
  selectedIds: number[];
}

/** A survey with everything the views need. */
export interface Survey {
  id: number;
  category: string;
  title: string;
  description: string;
  endsAt: number;
  hasVoted: boolean;
  questions: Question[];
}

/** One answer line of the create dialog. */
export interface DraftQuestion {
  text: string;
  multiple: boolean;
  answers: string[];
}

/** The survey that is being written in the create dialog. */
export interface Draft {
  title: string;
  category: string;
  deadline: string;
  description: string;
  questions: DraftQuestion[];
}

/** Validation messages of the create dialog. */
export interface DraftErrors {
  title?: string;
  questions?: string;
}

/** Which list the start page shows. */
export type TabName = 'active' | 'past';
