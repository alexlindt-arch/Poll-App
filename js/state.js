/** Central application state and the factories that build survey objects. */

let surveys = [];
let currentTab = 'active';
let currentCategory = 'All';
let openSurveyId = null;
let isMenuOpen = false;
let liveTimerId = null;
let toastTimerId = null;
let nextId = 1;
let formDraft = null;
let formErrors = {};

/**
 * Returns a new unique id and advances the counter.
 * @returns {number} The next free id.
 */
function createId() {
  nextId += 1;
  return nextId;
}

/**
 * Builds a single answer option.
 * @param {Array} raw - Tuple of label and initial vote count.
 * @returns {Object} The option object.
 */
function buildOption(raw) {
  return { id: createId(), label: raw[0], votes: raw[1] };
}

/**
 * Builds a question including its options.
 * @param {Object} raw - Raw question data from the seed file.
 * @returns {Object} The question object.
 */
function buildQuestion(raw) {
  return {
    id: createId(),
    text: raw.text,
    multiple: raw.multiple,
    options: raw.options.map(buildOption),
    selectedIds: []
  };
}

/**
 * Builds a survey and converts `daysLeft` into an absolute timestamp.
 * @param {Object} raw - Raw survey data from the seed file.
 * @returns {Object} The survey object.
 */
function buildSurvey(raw) {
  return {
    id: createId(),
    category: raw.category,
    title: raw.title,
    description: raw.description,
    endsAt: Date.now() + raw.daysLeft * DAY_IN_MS,
    hasVoted: false,
    questions: raw.questions.map(buildQuestion)
  };
}

/**
 * Fills the survey list with the seed data.
 * @returns {void}
 */
function initSurveys() {
  surveys = SEED_SURVEYS.map(buildSurvey);
}

/**
 * Creates an empty question for the create form.
 * @returns {Object} A question draft with two blank answers.
 */
function createQuestionDraft() {
  return { text: '', multiple: false, answers: ['', ''] };
}

/**
 * Creates an empty draft for the create form.
 * @returns {Object} A survey draft with one blank question.
 */
function createFormDraft() {
  return {
    title: '',
    category: CATEGORIES[0],
    description: '',
    deadline: '',
    questions: [createQuestionDraft()]
  };
}
