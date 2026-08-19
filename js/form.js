/** Everything around the "create new survey" dialog. */

/**
 * Opens the create dialog with an empty draft.
 * @returns {void}
 */
function openCreateForm() {
  formDraft = createFormDraft();
  formErrors = {};
  openSurveyId = null;
  document.getElementById('detail-overlay').classList.add('d-none');
  setMenuOpen(false);
  setScrollLock(true);
  renderCreateForm();
}

/**
 * Closes the create dialog without saving.
 * @returns {void}
 */
function closeCreateForm() {
  document.getElementById('create-overlay').classList.add('d-none');
  setScrollLock(false);
  formErrors = {};
}

/**
 * Renders the dialog markup from the current draft.
 * @returns {void}
 */
function renderCreateForm() {
  const overlay = document.getElementById('create-overlay');
  overlay.className = 'overlay overlay-create';
  overlay.innerHTML = createFormTemplate();
}

/**
 * Stores a value of a simple draft field.
 * @param {string} field - Name of the draft property.
 * @param {string} value - The new value.
 * @returns {void}
 */
function updateDraftField(field, value) {
  formDraft[field] = value;
}

/**
 * Empties one of the simple draft fields.
 * @param {string} field - Name of the draft property.
 * @returns {void}
 */
function clearDraftField(field) {
  formDraft[field] = '';
  renderCreateForm();
}

/**
 * Stores the text of a question.
 * @param {number} index - Position of the question.
 * @param {string} value - The new question text.
 * @returns {void}
 */
function updateQuestionText(index, value) {
  formDraft.questions[index].text = value;
}

/**
 * Stores the text of a single answer.
 * @param {number} questionIndex - Position of the question.
 * @param {number} answerIndex - Position of the answer.
 * @param {string} value - The new answer text.
 * @returns {void}
 */
function updateAnswer(questionIndex, answerIndex, value) {
  formDraft.questions[questionIndex].answers[answerIndex] = value;
}

/**
 * Switches a question between single and multiple choice.
 * @param {number} index - Position of the question.
 * @returns {void}
 */
function toggleMultiple(index) {
  const question = formDraft.questions[index];
  question.multiple = !question.multiple;
  renderCreateForm();
}

/**
 * Appends an empty question to the draft.
 * @returns {void}
 */
function addQuestion() {
  formDraft.questions.push(createQuestionDraft());
  renderCreateForm();
}

/**
 * Removes a question, or clears it if it is the only one left.
 * @param {number} index - Position of the question.
 * @returns {void}
 */
function removeQuestion(index) {
  if (formDraft.questions.length === 1) {
    formDraft.questions[0] = createQuestionDraft();
  } else {
    formDraft.questions.splice(index, 1);
  }
  renderCreateForm();
}

/**
 * Adds an empty answer field to a question.
 * @param {number} index - Position of the question.
 * @returns {void}
 */
function addAnswer(index) {
  const question = formDraft.questions[index];
  if (question.answers.length < MAX_ANSWERS) {
    question.answers.push('');
    renderCreateForm();
  }
}

/**
 * Removes an answer field as long as two remain.
 * @param {number} questionIndex - Position of the question.
 * @param {number} answerIndex - Position of the answer.
 * @returns {void}
 */
function removeAnswer(questionIndex, answerIndex) {
  const question = formDraft.questions[questionIndex];
  if (question.answers.length > MIN_ANSWERS) {
    question.answers.splice(answerIndex, 1);
    renderCreateForm();
  }
}

/**
 * Collects all questions that carry a text and at least two answers.
 * @returns {Object[]} The usable questions of the draft.
 */
function getValidQuestions() {
  return formDraft.questions
    .map(question => ({
      text: question.text.trim(),
      multiple: question.multiple,
      answers: question.answers.map(answer => answer.trim()).filter(Boolean)
    }))
    .filter(question => question.text !== '' && question.answers.length >= MIN_ANSWERS);
}

/**
 * Validates the draft and fills the error object.
 * @param {Object[]} questions - The usable questions of the draft.
 * @returns {boolean} True if the draft can be published.
 */
function validateDraft(questions) {
  formErrors = {};
  if (formDraft.title.trim() === '') {
    formErrors.title = 'Please enter a survey name.';
  }
  if (questions.length === 0) {
    formErrors.questions = 'Add at least one question with two answers.';
  }
  return Object.keys(formErrors).length === 0;
}

/**
 * Turns the chosen deadline into a timestamp, defaulting to one week.
 * @returns {number} The end date in milliseconds.
 */
function getDeadlineTimestamp() {
  if (formDraft.deadline === '') {
    return Date.now() + 7 * DAY_IN_MS;
  }
  const chosen = new Date(`${formDraft.deadline}T23:59:59`).getTime();
  return Math.max(chosen, Date.now() + DAY_IN_MS / 2);
}

/**
 * Converts a draft question into a real question object.
 * @param {Object} question - The validated draft question.
 * @returns {Object} The question object.
 */
function buildDraftQuestion(question) {
  return {
    id: createId(),
    text: question.text,
    multiple: question.multiple,
    options: question.answers.map(answer => ({ id: createId(), label: answer, votes: 0 })),
    selectedIds: []
  };
}

/**
 * Builds the finished survey from the current draft.
 * @param {Object[]} questions - The validated draft questions.
 * @returns {Object} The new survey.
 */
function buildDraftSurvey(questions) {
  return {
    id: createId(),
    category: formDraft.category,
    title: formDraft.title.trim(),
    description: formDraft.description.trim(),
    endsAt: getDeadlineTimestamp(),
    hasVoted: false,
    questions: questions.map(buildDraftQuestion)
  };
}

/**
 * Validates the draft and adds the new survey to the list.
 * @param {Event} event - The submit event of the form.
 * @returns {void}
 */
function publishSurvey(event) {
  event.preventDefault();
  const questions = getValidQuestions();
  if (!validateDraft(questions)) {
    renderCreateForm();
    return;
  }
  surveys.unshift(buildDraftSurvey(questions));
  currentTab = 'active';
  currentCategory = 'All';
  closeCreateForm();
  renderApp();
  showToast('Your survey is now published!');
}
