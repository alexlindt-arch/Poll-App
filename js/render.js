/** Writes the generated markup of the home screen into the DOM. */

/**
 * Renders every part of the home screen.
 * @returns {void}
 */
function renderApp() {
  renderEndingSoon();
  renderTabs();
  renderFilterMenu();
  renderFilterLabel();
  renderSurveyList();
}

/**
 * Renders the row of surveys that end next.
 * @returns {void}
 */
function renderEndingSoon() {
  const container = document.getElementById('ending-soon-list');
  container.innerHTML = getEndingSoonSurveys().map(surveyCardTemplate).join('');
}

/**
 * Renders the filtered survey list and the empty state.
 * @returns {void}
 */
function renderSurveyList() {
  const visible = getVisibleSurveys();
  document.getElementById('survey-list').innerHTML = visible.map(surveyRowTemplate).join('');
  document.getElementById('survey-list-empty').classList.toggle('d-none', visible.length > 0);
}

/**
 * Updates the pressed state of both tab buttons.
 * @returns {void}
 */
function renderTabs() {
  const active = currentTab === 'active';
  document.getElementById('tab-active').setAttribute('aria-selected', String(active));
  document.getElementById('tab-past').setAttribute('aria-selected', String(!active));
}

/**
 * Renders the category options of the filter menu.
 * @returns {void}
 */
function renderFilterMenu() {
  const menu = document.getElementById('filter-menu');
  menu.innerHTML = getCategoriesForTab().map(filterOptionTemplate).join('');
}

/**
 * Shows the selected category on the filter button.
 * @returns {void}
 */
function renderFilterLabel() {
  const label = currentCategory === 'All' ? 'Filter by category' : currentCategory;
  document.getElementById('filter-label').textContent = label;
}

/**
 * Opens or closes the category menu.
 * @param {boolean} open - True to show the menu.
 * @returns {void}
 */
function setMenuOpen(open) {
  isMenuOpen = open;
  document.getElementById('filter-menu').classList.toggle('d-none', !open);
  document.getElementById('filter-trigger').setAttribute('aria-expanded', String(open));
}

/**
 * Locks or unlocks scrolling of the page behind an overlay.
 * @param {boolean} locked - True while an overlay is open.
 * @returns {void}
 */
function setScrollLock(locked) {
  document.body.classList.toggle('no-scroll', locked);
}
