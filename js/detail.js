/** Opens, updates and closes the survey detail overlay. */

/**
 * Opens the detail view of a survey.
 * @param {number} id - Id of the survey to open.
 * @returns {void}
 */
function openSurvey(id) {
  openSurveyId = id;
  setMenuOpen(false);
  setScrollLock(true);
  renderDetail();
}

/**
 * Closes the detail view and returns to the overview.
 * @returns {void}
 */
function closeSurvey() {
  openSurveyId = null;
  document.getElementById('detail-overlay').classList.add('d-none');
  setScrollLock(false);
  renderApp();
}

/**
 * Renders the currently opened survey into the overlay.
 * @returns {void}
 */
function renderDetail() {
  const survey = getSurveyById(openSurveyId);
  const overlay = document.getElementById('detail-overlay');
  if (!survey) {
    return;
  }
  overlay.className = 'overlay overlay-detail';
  overlay.innerHTML = detailTemplate(survey);
}

/**
 * Handles a click on an answer option.
 * @param {number} questionId - Id of the question.
 * @param {number} optionId - Id of the clicked option.
 * @returns {void}
 */
function selectOption(questionId, optionId) {
  const survey = getSurveyById(openSurveyId);
  if (!survey || isLocked(survey)) {
    return;
  }
  const question = survey.questions.find(entry => entry.id === questionId);
  toggleSelection(question, optionId);
  renderDetail();
}

/**
 * Submits the opened survey and updates the evaluation.
 * @returns {void}
 */
function submitCurrentSurvey() {
  const survey = getSurveyById(openSurveyId);
  if (!survey || isLocked(survey) || !hasAnySelection(survey)) {
    return;
  }
  applyVotes(survey);
  renderDetail();
  showToast('Thanks! Your vote has been counted.');
}

/**
 * Refreshes only the evaluation column so live votes do not interrupt clicks.
 * @returns {void}
 */
function refreshOpenResults() {
  const survey = getSurveyById(openSurveyId);
  const slot = document.getElementById('results-slot');
  if (!survey || !slot) {
    return;
  }
  slot.innerHTML = detailResultsTemplate(survey);
}
