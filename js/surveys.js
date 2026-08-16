/** Query and mutation helpers for surveys, questions, options and results. */

/**
 * Escapes characters that would otherwise break the generated markup.
 * @param {string} text - Raw text, typically entered by the user.
 * @returns {string} The escaped text.
 */
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Checks whether a survey has already ended.
 * @param {Object} survey - The survey to check.
 * @returns {boolean} True if the end date has passed.
 */
function isPast(survey) {
  return survey.endsAt <= Date.now();
}

/**
 * Checks whether voting is disabled for a survey.
 * @param {Object} survey - The survey to check.
 * @returns {boolean} True if the survey is closed or already answered.
 */
function isLocked(survey) {
  return isPast(survey) || survey.hasVoted;
}

/**
 * Finds a survey by its id.
 * @param {number} id - The survey id.
 * @returns {Object|undefined} The matching survey.
 */
function getSurveyById(id) {
  return surveys.find(survey => survey.id === id);
}

/**
 * Returns all running surveys, soonest deadline first.
 * @returns {Object[]} The sorted active surveys.
 */
function getActiveSurveys() {
  return surveys.filter(survey => !isPast(survey)).sort((a, b) => a.endsAt - b.endsAt);
}

/**
 * Returns all finished surveys, most recently ended first.
 * @returns {Object[]} The sorted past surveys.
 */
function getPastSurveys() {
  return surveys.filter(isPast).sort((a, b) => b.endsAt - a.endsAt);
}

/**
 * Returns the surveys of the currently selected tab.
 * @returns {Object[]} Active or past surveys.
 */
function getSurveysForTab() {
  return currentTab === 'active' ? getActiveSurveys() : getPastSurveys();
}

/**
 * Returns the surveys of the current tab after applying the category filter.
 * @returns {Object[]} The surveys shown in the list.
 */
function getVisibleSurveys() {
  const pool = getSurveysForTab();
  if (currentCategory === 'All') {
    return pool;
  }
  return pool.filter(survey => survey.category === currentCategory);
}

/**
 * Returns the categories that actually occur in the current tab.
 * @returns {string[]} Category names, starting with "All".
 */
function getCategoriesForTab() {
  const pool = getSurveysForTab();
  const used = CATEGORIES.filter(name => pool.some(survey => survey.category === name));
  return ['All'].concat(used);
}

/**
 * Returns the three running surveys that end next.
 * @returns {Object[]} Up to three surveys.
 */
function getEndingSoonSurveys() {
  return getActiveSurveys().slice(0, 3);
}

/**
 * Builds the remaining-time label of a survey.
 * @param {Object} survey - The survey to describe.
 * @returns {string} A label such as "Ends in 3 Days".
 */
function getDeadlineLabel(survey) {
  const diff = survey.endsAt - Date.now();
  if (diff <= 0) {
    const past = Math.max(1, Math.round(-diff / DAY_IN_MS));
    return past === 1 ? 'Ended yesterday' : `Ended ${past} days ago`;
  }
  const left = Math.max(1, Math.ceil(diff / DAY_IN_MS));
  return left === 1 ? 'Ends in 1 Day' : `Ends in ${left} Days`;
}

/**
 * Formats a timestamp as DD.MM.YYYY.
 * @param {number} timestamp - Milliseconds since epoch.
 * @returns {string} The formatted date.
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

/**
 * Builds the end date line of the detail view.
 * @param {Object} survey - The survey to describe.
 * @returns {string} A label such as "Ends on 24.08.2026".
 */
function getEndDateLabel(survey) {
  const prefix = isPast(survey) ? 'Ended on' : 'Ends on';
  return `${prefix} ${formatDate(survey.endsAt)}`;
}

/**
 * Sums up all votes of a question.
 * @param {Object} question - The question to count.
 * @returns {number} The total number of votes, at least 1.
 */
function getTotalVotes(question) {
  const total = question.options.reduce((sum, option) => sum + option.votes, 0);
  return total || 1;
}

/**
 * Calculates the share of votes an option received.
 * @param {Object} question - The question the option belongs to.
 * @param {Object} option - The option to measure.
 * @returns {number} The rounded percentage.
 */
function getPercentage(question, option) {
  return Math.round((option.votes / getTotalVotes(question)) * 100);
}

/**
 * Checks whether an option is currently selected.
 * @param {Object} question - The question the option belongs to.
 * @param {number} optionId - The option id.
 * @returns {boolean} True if the option is selected.
 */
function isOptionSelected(question, optionId) {
  return question.selectedIds.includes(optionId);
}

/**
 * Selects or deselects an option, honouring the single/multiple setting.
 * @param {Object} question - The question to update.
 * @param {number} optionId - The option that was clicked.
 * @returns {void}
 */
function toggleSelection(question, optionId) {
  if (isOptionSelected(question, optionId)) {
    question.selectedIds = question.selectedIds.filter(id => id !== optionId);
  } else if (question.multiple) {
    question.selectedIds.push(optionId);
  } else {
    question.selectedIds = [optionId];
  }
}

/**
 * Checks whether at least one option of the survey is selected.
 * @param {Object} survey - The survey to check.
 * @returns {boolean} True if the survey can be submitted.
 */
function hasAnySelection(survey) {
  return survey.questions.some(question => question.selectedIds.length > 0);
}

/**
 * Adds the user's selection to the vote counts and locks the survey.
 * @param {Object} survey - The survey being submitted.
 * @returns {void}
 */
function applyVotes(survey) {
  survey.questions.forEach(question => {
    question.options.forEach(option => {
      if (isOptionSelected(question, option.id)) {
        option.votes += 1;
      }
    });
  });
  survey.hasVoted = true;
}

/**
 * Picks a random element of an array.
 * @param {Array} list - The list to pick from.
 * @returns {*} One random entry.
 */
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Chooses the survey that receives the next simulated vote.
 * An opened survey wins so the evaluation visibly moves while it is read.
 * @returns {Object|null} The survey to vote on.
 */
function getLiveTarget() {
  const opened = getSurveyById(openSurveyId);
  if (opened && !isPast(opened)) {
    return opened;
  }
  const running = getActiveSurveys();
  return running.length > 0 ? pickRandom(running) : null;
}

/**
 * Simulates one incoming vote on a running survey.
 * @returns {boolean} True if a vote was added.
 */
function addLiveVote() {
  const survey = getLiveTarget();
  if (!survey) {
    return false;
  }
  pickRandom(pickRandom(survey.questions).options).votes += 1;
  return true;
}
