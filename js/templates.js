/** Pure functions that turn data into HTML strings. No DOM access here. */

/**
 * Converts a zero based index into a letter label.
 * @param {number} index - Position of the option.
 * @returns {string} A letter such as "A".
 */
function getLetter(index) {
  return String.fromCharCode(65 + index);
}

/**
 * Builds a clickable survey teaser showing category, title and deadline.
 * @param {Object} survey - The survey to display.
 * @param {string} cssClass - Either "survey-card" or "survey-row".
 * @returns {string} The teaser markup.
 */
function surveyTeaserTemplate(survey, cssClass) {
  return `
    <button type="button" class="${cssClass}" onclick="openSurvey(${survey.id})">
      <span class="card-category">${escapeHtml(survey.category)}</span>
      <h4 class="card-title">${escapeHtml(survey.title)}</h4>
      <span class="card-deadline">${getDeadlineLabel(survey)}</span>
    </button>`;
}

/**
 * Builds a card for the "ending soon" row.
 * @param {Object} survey - The survey to display.
 * @returns {string} The card markup.
 */
function surveyCardTemplate(survey) {
  return surveyTeaserTemplate(survey, 'survey-card');
}

/**
 * Builds a row for the main survey list.
 * @param {Object} survey - The survey to display.
 * @returns {string} The row markup.
 */
function surveyRowTemplate(survey) {
  return surveyTeaserTemplate(survey, 'survey-row');
}

/**
 * Builds one entry of the category filter menu.
 * @param {string} name - Category name or "All".
 * @returns {string} The list item markup.
 */
function filterOptionTemplate(name) {
  const label = name === 'All' ? 'All categories' : name;
  const current = name === currentCategory ? 'true' : 'false';
  return `
    <li>
      <button type="button" class="filter-option" aria-current="${current}"
        onclick="selectCategory('${escapeHtml(name)}')">${escapeHtml(label)}</button>
    </li>`;
}

/**
 * Builds the shared overlay header with logo and action button.
 * @returns {string} The header markup.
 */
function detailHeaderTemplate() {
  return `
    <div class="overlay-header">
      <button type="button" class="logo-button" onclick="closeSurvey()" aria-label="Back to overview">
        <img src="assets/img/logo-dark.svg" alt="Poll App logo" width="119" height="50">
      </button>
      <button type="button" class="btn btn-primary" onclick="openCreateForm()">
        <span>Create survey</span><span class="btn-icon" aria-hidden="true">+</span>
      </button>
    </div>`;
}

/**
 * Builds status badge, dates and category line of the detail view.
 * @param {Object} survey - The survey being shown.
 * @returns {string} The meta markup.
 */
function detailMetaTemplate(survey) {
  const closed = isPast(survey);
  const statusClass = closed ? 'detail-status detail-status-closed' : 'detail-status';
  return `
    <span class="${statusClass}">${closed ? 'Closed' : 'Published'}</span>
    <div class="detail-meta">
      <span>${getEndDateLabel(survey)}</span>
      <span>Category: ${escapeHtml(survey.category)}</span>
    </div>`;
}

/**
 * Builds a single answer option of the detail view.
 * @param {Object} question - The question the option belongs to.
 * @param {Object} option - The option to render.
 * @param {number} index - Position of the option.
 * @param {boolean} locked - True if voting is disabled.
 * @returns {string} The option markup.
 */
function optionTemplate(question, option, index, locked) {
  const selected = isOptionSelected(question, option.id);
  const mark = selected ? '&#10003;' : '';
  return `
    <li>
      <button type="button" class="option-button${selected ? ' is-selected' : ''}" ${locked ? 'disabled' : ''}
        onclick="selectOption(${question.id}, ${option.id})">
        <span class="option-box" aria-hidden="true">${mark}</span>
        <span><span class="option-letter">${getLetter(index)}.</span> ${escapeHtml(option.label)}</span>
      </button>
    </li>`;
}

/**
 * Builds one question block including all of its options.
 * @param {Object} question - The question to render.
 * @param {number} index - Position of the question.
 * @param {boolean} locked - True if voting is disabled.
 * @returns {string} The question markup.
 */
function questionTemplate(question, index, locked) {
  const hint = question.multiple ? '<p class="question-hint">More than one answer is possible.</p>' : '';
  const options = question.options
    .map((option, position) => optionTemplate(question, option, position, locked))
    .join('');
  return `
    <div class="question">
      <h4 class="question-heading">${index + 1}. ${escapeHtml(question.text)}</h4>
      ${hint}
      <ul class="option-list">${options}</ul>
    </div>`;
}

/**
 * Builds the submit button of the detail view.
 * @param {Object} survey - The survey being shown.
 * @returns {string} The button markup.
 */
function submitButtonTemplate(survey) {
  const disabled = isLocked(survey) || !hasAnySelection(survey);
  let label = 'Complete survey';
  if (isPast(survey)) {
    label = 'Survey closed';
  } else if (survey.hasVoted) {
    label = 'Survey completed';
  }
  return `<button type="button" class="btn detail-submit" ${disabled ? 'disabled' : ''}
    onclick="submitCurrentSurvey()">${label}</button>`;
}

/**
 * Builds the left column of the detail view.
 * @param {Object} survey - The survey being shown.
 * @returns {string} The main column markup.
 */
function detailMainTemplate(survey) {
  const locked = isLocked(survey);
  const questions = survey.questions
    .map((question, index) => questionTemplate(question, index, locked))
    .join('');
  return `
    <div class="detail-main">
      ${detailMetaTemplate(survey)}
      <h3 class="detail-title">${escapeHtml(survey.title)}</h3>
      <p class="detail-description">${escapeHtml(survey.description)}</p>
      <div class="question-grid">${questions}</div>
      ${submitButtonTemplate(survey)}
    </div>`;
}

/**
 * Builds one result bar of the evaluation column.
 * @param {Object} question - The question the option belongs to.
 * @param {Object} option - The option to measure.
 * @param {number} index - Position of the option.
 * @returns {string} The result row markup.
 */
function resultRowTemplate(question, option, index) {
  const percent = getPercentage(question, option);
  return `
    <div class="result-row">
      <span class="option-letter">${getLetter(index)}</span>
      <span class="result-track"><span class="result-bar" style="width: ${percent}%"></span></span>
      <span class="result-percent">${percent}%</span>
    </div>`;
}

/**
 * Builds the result block of a single question.
 * @param {Object} question - The question to evaluate.
 * @param {number} index - Position of the question.
 * @returns {string} The result block markup.
 */
function resultQuestionTemplate(question, index) {
  const rows = question.options
    .map((option, position) => resultRowTemplate(question, option, position))
    .join('');
  return `
    <div class="result-question">
      <h4 class="question-heading">${index + 1}. ${escapeHtml(question.text)}</h4>
      ${rows}
    </div>`;
}

/**
 * Builds the live evaluation column of the detail view.
 * @param {Object} survey - The survey being evaluated.
 * @returns {string} The results markup.
 */
function detailResultsTemplate(survey) {
  const blocks = survey.questions.map(resultQuestionTemplate).join('');
  const live = isPast(survey) ? 'FINAL' : 'LIVE';
  return `
    <aside class="detail-results" aria-live="polite">
      <h3 class="results-headline">Survey results <span class="results-live">${live}</span></h3>
      ${blocks}
    </aside>`;
}

/**
 * Builds the complete detail overlay.
 * @param {Object} survey - The survey to display.
 * @returns {string} The overlay markup.
 */
function detailTemplate(survey) {
  return `
    ${detailHeaderTemplate()}
    <div class="detail-body">
      ${detailMainTemplate(survey)}
      <div id="results-slot">${detailResultsTemplate(survey)}</div>
    </div>`;
}

/**
 * Builds the header of the create dialog.
 * @returns {string} The header markup.
 */
function createHeaderTemplate() {
  return `
    <div class="overlay-header">
      <div>
        <span class="detail-status detail-status-closed">Draft</span>
        <h3 class="create-title">Create new survey</h3>
      </div>
      <button type="button" class="btn btn-ghost" onclick="closeCreateForm()">Cancel &#10005;</button>
    </div>`;
}

/**
 * Builds the option list of the category select box.
 * @returns {string} The option markup.
 */
function categorySelectOptions() {
  return CATEGORIES.map(name => {
    const selected = name === formDraft.category ? ' selected' : '';
    return `<option value="${escapeHtml(name)}"${selected}>${escapeHtml(name)}</option>`;
  }).join('');
}

/**
 * Builds the survey name field including its error message.
 * @returns {string} The field markup.
 */
function titleFieldTemplate() {
  const error = formErrors.title;
  return `
    <div class="form-field${error ? ' has-error' : ''}">
      <label for="survey-title">Survey name <span class="label-required">*</span></label>
      <input id="survey-title" type="text" required aria-required="true" value="${escapeHtml(formDraft.title)}"
        placeholder="Let’s Plan the Next Team Event Together" oninput="updateDraftField('title', this.value)">
      ${error ? `<span class="field-error">${error}</span>` : ''}
    </div>`;
}

/**
 * Builds the optional end date field.
 * @returns {string} The field markup.
 */
function deadlineFieldTemplate() {
  return `
    <div class="form-field">
      <label for="survey-deadline">Set end date <span class="label-optional">(optional)</span></label>
      <input id="survey-deadline" type="date" value="${formDraft.deadline}"
        oninput="updateDraftField('deadline', this.value)">
    </div>`;
}

/**
 * Builds the category select field.
 * @returns {string} The field markup.
 */
function categoryFieldTemplate() {
  return `
    <div class="form-field">
      <label for="survey-category">Choose category <span class="label-required">*</span></label>
      <select id="survey-category" required onchange="updateDraftField('category', this.value)">
        ${categorySelectOptions()}
      </select>
    </div>`;
}

/**
 * Builds the row holding the end date and the category field.
 * @returns {string} The row markup.
 */
function metaFieldsTemplate() {
  return `<div class="form-row">${deadlineFieldTemplate()}${categoryFieldTemplate()}</div>`;
}

/**
 * Builds the description field.
 * @returns {string} The field markup.
 */
function descriptionFieldTemplate() {
  return `
    <div class="form-column">
      <div class="form-field">
        <label for="survey-description">Describing text <span class="label-optional">(optional)</span></label>
        <textarea id="survey-description" rows="5" placeholder="We want to create team activities that everyone will enjoy…"
          oninput="updateDraftField('description', this.value)">${escapeHtml(formDraft.description)}</textarea>
      </div>
    </div>`;
}

/**
 * Builds one answer input row of the create form.
 * @param {number} questionIndex - Position of the question.
 * @param {number} answerIndex - Position of the answer.
 * @param {string} value - Current answer text.
 * @returns {string} The answer row markup.
 */
function answerRowTemplate(questionIndex, answerIndex, value) {
  return `
    <div class="answer-row">
      <span class="answer-letter">${getLetter(answerIndex)}.</span>
      <input type="text" value="${escapeHtml(value)}" placeholder="Answer ${getLetter(answerIndex)}"
        aria-label="Answer ${getLetter(answerIndex)}" oninput="updateAnswer(${questionIndex}, ${answerIndex}, this.value)">
      <button type="button" class="icon-button" title="Remove this answer"
        onclick="removeAnswer(${questionIndex}, ${answerIndex})">&#128465;</button>
    </div>`;
}

/**
 * Builds the head line of a question block with its action buttons.
 * @param {number} index - Position of the question.
 * @returns {string} The head markup.
 */
function questionDraftHeadTemplate(index) {
  return `
    <div class="question-block-head">
      <span>${index + 1}. Question <span class="label-required">*</span></span>
      <button type="button" class="icon-button" title="Delete this question"
        onclick="removeQuestion(${index})">&#128465;</button>
    </div>`;
}

/**
 * Builds the text input of a question block.
 * @param {Object} question - The question draft.
 * @param {number} index - Position of the question.
 * @returns {string} The input markup.
 */
function questionInputTemplate(question, index) {
  return `
    <input type="text" value="${escapeHtml(question.text)}" required aria-required="true"
      placeholder="Choose the activities you prefer" aria-label="Question ${index + 1}"
      oninput="updateQuestionText(${index}, this.value)">`;
}

/**
 * Builds the "Answers" head line with the multiple choice toggle.
 * @param {Object} question - The question draft.
 * @param {number} index - Position of the question.
 * @returns {string} The head markup.
 */
function answersHeadTemplate(question, index) {
  return `
    <div class="answers-head">
      <span>Answers <span class="label-required">*</span></span>
      <button type="button" class="multi-toggle" aria-pressed="${question.multiple}" onclick="toggleMultiple(${index})">
        <span class="multi-box" aria-hidden="true"></span>Allow multiple answers.
      </button>
    </div>`;
}

/**
 * Builds the answers section of a question block.
 * @param {Object} question - The question draft.
 * @param {number} index - Position of the question.
 * @returns {string} The answers markup.
 */
function answersSectionTemplate(question, index) {
  const rows = question.answers
    .map((value, position) => answerRowTemplate(index, position, value))
    .join('');
  const full = question.answers.length >= MAX_ANSWERS;
  return `
    ${rows}
    <div>
      <button type="button" class="add-answer" ${full ? 'disabled' : ''}
        onclick="addAnswer(${index})">Add answer &#8853;</button>
      <span class="answer-hint">You can add up to ${MAX_ANSWERS} answer fields.</span>
    </div>`;
}

/**
 * Builds one complete question block of the create form.
 * @param {Object} question - The question draft.
 * @param {number} index - Position of the question.
 * @returns {string} The question block markup.
 */
function questionDraftTemplate(question, index) {
  return `
    <div class="question-block">
      ${questionDraftHeadTemplate(index)}
      ${questionInputTemplate(question, index)}
      ${answersHeadTemplate(question, index)}
      ${answersSectionTemplate(question, index)}
    </div>`;
}

/**
 * Builds the footer of the create form including the global error message.
 * @returns {string} The footer markup.
 */
function createFooterTemplate() {
  const error = formErrors.questions;
  return `
    <div class="create-footer">
      <div>
        <button type="button" class="btn btn-ghost" onclick="addQuestion()">Add next question &#8853;</button>
        <p class="form-note">Fields marked with * are required.</p>
      </div>
      ${error ? `<span class="field-error">${error}</span>` : ''}
      <button type="submit" class="btn btn-primary">Publish</button>
    </div>`;
}

/**
 * Builds the panel of the create dialog with all fields and questions.
 * @returns {string} The panel markup.
 */
function createPanelTemplate() {
  const questions = formDraft.questions.map(questionDraftTemplate).join('');
  return `
    <div class="create-panel">
      <div class="form-grid">
        <div class="form-column">${titleFieldTemplate()}${metaFieldsTemplate()}</div>
        ${descriptionFieldTemplate()}
      </div>
      <div class="form-grid">${questions}</div>
      ${createFooterTemplate()}
    </div>`;
}

/**
 * Builds the complete create dialog.
 * @returns {string} The dialog markup.
 */
function createFormTemplate() {
  return `
    ${createHeaderTemplate()}
    <form class="create-body" novalidate onsubmit="publishSurvey(event)">
      ${createPanelTemplate()}
    </form>`;
}

/**
 * Builds the toast message.
 * @param {string} message - Text to display.
 * @returns {string} The toast markup.
 */
function toastTemplate(message) {
  return `
    <span>${escapeHtml(message)}</span>
    <button type="button" class="toast-close" aria-label="Close message" onclick="hideToast()">&#10005;</button>`;
}
