import { Component, HostListener, signal } from '@angular/core';
import { SurveyTeaser } from './components/survey-teaser/survey-teaser';
import { SurveyDetail } from './components/survey-detail/survey-detail';
import { SurveyForm } from './components/survey-form/survey-form';
import { SurveyService } from './services/survey.service';
import { ToastService } from './services/toast.service';
import { Survey, TabName } from './models/survey.model';

/** Root component: start page, both overlays and the confirmation message. */
@Component({
  selector: 'app-root',
  imports: [SurveyTeaser, SurveyDetail, SurveyForm],
  templateUrl: './app.html'
})
export class App {
  readonly isMenuOpen = signal(false);
  readonly isCreateOpen = signal(false);

  constructor(readonly surveys: SurveyService, readonly toast: ToastService) {}

  /** The survey behind the open detail overlay, if there is one. */
  get openSurvey(): Survey | undefined {
    return this.surveys.getSurveyById(this.surveys.openSurveyId());
  }

  /** The text on the category filter button. */
  get filterLabel(): string {
    const category = this.surveys.currentCategory();
    return category === 'All' ? 'Filter by category' : category;
  }

  /** The visible name of a category entry in the filter menu. */
  optionLabel(name: string): string {
    return name === 'All' ? 'All categories' : name;
  }

  /** Locks or releases the scrolling of the page behind an overlay. */
  private setScrollLock(locked: boolean): void {
    document.body.classList.toggle('no-scroll', locked);
  }

  /** Switches between running and finished surveys. */
  showTab(tab: TabName): void {
    this.surveys.showTab(tab);
    this.isMenuOpen.set(false);
  }

  /** Opens or closes the category menu. */
  toggleCategoryMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  /** Stores the chosen category and closes the menu. */
  selectCategory(name: string): void {
    this.surveys.selectCategory(name);
    this.isMenuOpen.set(false);
  }

  /** Closes the category menu when the user clicks somewhere else. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isMenuOpen() && !target.closest('.category-filter')) {
      this.isMenuOpen.set(false);
    }
  }

  /** Opens the detail overlay of a survey. */
  openSurveyById(id: number): void {
    this.surveys.openSurveyId.set(id);
    this.isCreateOpen.set(false);
    this.setScrollLock(true);
  }

  /** Closes the detail overlay. */
  closeSurvey(): void {
    this.surveys.openSurveyId.set(null);
    this.setScrollLock(false);
  }

  /** Opens the create dialog with an empty draft. */
  openCreateForm(): void {
    this.surveys.openSurveyId.set(null);
    this.isCreateOpen.set(true);
    this.isMenuOpen.set(false);
    this.setScrollLock(true);
  }

  /** Closes the create dialog without saving. */
  closeCreateForm(): void {
    this.isCreateOpen.set(false);
    this.setScrollLock(false);
  }

  /** Adds the published survey to the list and confirms it. */
  onPublished(survey: Survey): void {
    this.surveys.addSurvey(survey);
    this.closeCreateForm();
    this.toast.show('Your survey is now published!');
  }
}
