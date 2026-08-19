/** Entry point: start up, global interactions and the live result timer. */

/**
 * Prepares the data, renders the page and starts the live simulation.
 * @returns {void}
 */
function init() {
  initSurveys();
  formDraft = createFormDraft();
  renderApp();
  startLiveResults();
  document.addEventListener('click', closeMenuOnOutsideClick);
  document.addEventListener('keydown', handleEscapeKey);
}

/**
 * Switches between running and finished surveys.
 * @param {string} tab - Either "active" or "past".
 * @returns {void}
 */
function showTab(tab) {
  currentTab = tab;
  currentCategory = 'All';
  setMenuOpen(false);
  renderApp();
}

/**
 * Opens or closes the category menu.
 * @returns {void}
 */
function toggleCategoryMenu() {
  setMenuOpen(!isMenuOpen);
}

/**
 * Applies a category filter to the current tab.
 * @param {string} name - Category name or "All".
 * @returns {void}
 */
function selectCategory(name) {
  currentCategory = name;
  setMenuOpen(false);
  renderApp();
}

/**
 * Closes the category menu when the user clicks somewhere else.
 * @param {Event} event - The click event.
 * @returns {void}
 */
function closeMenuOnOutsideClick(event) {
  if (isMenuOpen && !event.target.closest('.category-filter')) {
    setMenuOpen(false);
  }
}

/**
 * Closes the topmost overlay when Escape is pressed.
 * @param {KeyboardEvent} event - The keyboard event.
 * @returns {void}
 */
function handleEscapeKey(event) {
  if (event.key !== 'Escape') {
    return;
  }
  if (!document.getElementById('create-overlay').classList.contains('d-none')) {
    closeCreateForm();
  } else if (openSurveyId !== null) {
    closeSurvey();
  }
}

/**
 * Starts the timer that simulates incoming votes.
 * @returns {void}
 */
function startLiveResults() {
  liveTimerId = setInterval(handleLiveTick, LIVE_INTERVAL_MS);
}

/**
 * Adds one simulated vote and refreshes the open evaluation.
 * @returns {void}
 */
function handleLiveTick() {
  if (addLiveVote()) {
    refreshOpenResults();
  }
}

/**
 * Shows a short confirmation message.
 * @param {string} message - The text to display.
 * @returns {void}
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerHTML = toastTemplate(message);
  toast.classList.remove('d-none');
  clearTimeout(toastTimerId);
  toastTimerId = setTimeout(hideToast, 2500);
}

/**
 * Hides the confirmation message.
 * @returns {void}
 */
function hideToast() {
  clearTimeout(toastTimerId);
  document.getElementById('toast').classList.add('d-none');
}
