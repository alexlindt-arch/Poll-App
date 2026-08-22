<div align="center">

<img src="assets/img/logo-orange.svg" alt="Poll App" width="200">

# Poll App

**Collect Feedback, Unlock Ideas**

Create, share and evaluate surveys in minutes – from the team event to workplace culture.

<br>

[![Live Demo](https://img.shields.io/badge/Live_Demo-open-FFB770?style=for-the-badge&logoColor=35273A&labelColor=35273A)](https://alexander-lindt.developerakademie.net/Poll-App/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-mirror-35273A?style=for-the-badge&logoColor=FFB770&labelColor=35273A)](https://alexlindt-arch.github.io/Poll-App/)

![HTML5](https://img.shields.io/badge/HTML5-35273A?style=flat-square&logo=html5&logoColor=FFB770)
![CSS3](https://img.shields.io/badge/CSS3-35273A?style=flat-square&logo=css3&logoColor=FFB770)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-35273A?style=flat-square&logo=javascript&logoColor=FFB770)
![No framework](https://img.shields.io/badge/no_framework-35273A?style=flat-square&logoColor=FFB770)
![Responsive](https://img.shields.io/badge/responsive-35273A?style=flat-square&logoColor=FFB770)

</div>

<br>

## About the project

Poll App is a survey platform: users create their own surveys with any number of
questions and answers, publish them, cast their vote and watch the evaluation as a
live bar chart right next to the questions.

Built with plain HTML, CSS and JavaScript – no framework, no build step and no
dependencies. Drop the folder onto a web server and it runs.

<br>

## Screenshots

### Overview

Hero area, surveys that end soon and the list of all surveys with a switch between
running and finished surveys plus the category filter.

<img src="docs/screenshots/01-overview.png" alt="Overview with hero and survey lists" width="100%">

<br>

### Answering a survey – with live evaluation

Every question of a survey, with single or multiple choice depending on the setting.
The results on the right update in real time. In the top right the "New survey"
button and the closing cross lead back into the flow.

<img src="docs/screenshots/02-survey-detail.png" alt="Survey detail view with live results" width="100%">

<br>

### Creating a survey

Required fields are marked with `*` and are validated. Questions and answer options
can be added and removed on the fly – up to six answers per question. Two questions
sit side by side as soon as both have enough room, otherwise one question fills the
whole width.

<img src="docs/screenshots/03-create-survey.png" alt="Form for creating a new survey" width="100%">

<br>

### Mobile

A layout of its own from 320 px: the start page with cards that can be dragged
sideways and the create dialog as a dark block on a light page.

<div align="center">
  <img src="docs/screenshots/04-mobile.png" alt="Mobile view of the start page" width="300">
  <img src="docs/screenshots/05-mobile-create.png" alt="Mobile view of the create dialog" width="300">
</div>

<br>

## Features

| | Feature | Description |
|---|---|---|
| ⏳ | **Surveys ending soon** | Own section above the list, sorted chronologically by end date |
| 🔀 | **Running / finished** | Tabs to switch; finished surveys can be read but no longer answered |
| 🏷️ | **Category filter** | Separate per tab, only offers categories that actually occur, can be reset to "All" at any time |
| ✍️ | **Survey editor** | Overlay dialog with required and optional fields, validation and dynamic questions |
| ☑️ | **Single & multiple choice** | Configurable per question |
| 📊 | **Live evaluation** | Percentage bars next to the questions that keep updating |
| 📱 | **Responsive** | Two fully built layouts: mobile from 320 px, laptop from 769 px; headline and columns grow steplessly with the available room |
| 🎠 | **Draggable highlights** | The cards always stay in one row and can be dragged sideways when they no longer fit next to each other |
| ⌨️ | **Keyboard & a11y** | Escape closes overlays, ARIA roles for dialogs, tabs and the live region |

<br>

## Tech stack

| Area | Implementation |
|---|---|
| Structure | Semantic HTML5, no inline styles |
| Styling | CSS3 with custom properties, flexbox and grid, split into six files |
| Logic | Vanilla JavaScript (ES2021), split into eight modules |
| Rendering | Template functions build HTML strings, `render.js` writes them into the DOM |
| Dependencies | none – only Google Fonts (Nerko One, Mulish, Nokora) |

<br>

## Project structure

```
Poll-App/
├── index.html              # Semantic skeleton, empty containers for rendering
├── style/
│   ├── variables.css       # Design tokens: colours, fonts, spacing
│   ├── base.css            # Reset, typography, helper classes, keyframes
│   ├── layout.css          # Header, hero, surveys section
│   ├── components.css      # Buttons, cards, tabs, filter, toast
│   ├── overlay.css         # Detail view and create dialog
│   └── responsive.css      # Breakpoints
├── js/
│   ├── data.js             # Constants and seed data
│   ├── state.js            # State and object factories
│   ├── surveys.js          # Queries, sorting, evaluation, voting
│   ├── templates.js        # HTML templates (no DOM access)
│   ├── render.js           # Writes the start page into the DOM
│   ├── detail.js           # Detail overlay
│   ├── form.js             # Create dialog including validation
│   └── main.js             # Entry point, tabs, filter, live timer
├── assets/img/             # Logos, icons (bin, plus), hero illustration
└── docs/screenshots/       # Screenshots for this README
```

<br>

## Running it locally

The app needs an HTTP server because the fonts are loaded from an external domain:

```bash
git clone https://github.com/alexlindt-arch/Poll-App.git
cd Poll-App

# pick one of these:
python -m http.server 8000
npx serve .
php -S localhost:8000
```

Then open `http://localhost:8000` in the browser.

<br>

## Code conventions

The project follows the coding conventions of the Developer Akademie:

| Rule | Status |
|---|---|
| Functions of 14 lines at most | 108 functions, **0 violations** |
| JSDoc above every function | **108 of 108** documented |
| No inline styles in the HTML | **0** `style` attributes |
| HTML, CSS and JS kept apart | 1 HTML file, 6 CSS files, 8 JS modules |
| Meaningful names, no `var` | `const`/`let` throughout, camelCase |
| No duplication | shared building blocks such as `surveyTeaserTemplate()` |

User input is escaped through `escapeHtml()` before it is written into the DOM.

<br>

## Design system

**Colours**

| | Hex | Usage |
|---|---|---|
| ![](https://img.shields.io/badge/-35273A-35273A?style=flat-square) | `#35273A` | Page background, body text on light surfaces |
| ![](https://img.shields.io/badge/-FFB770-FFB770?style=flat-square) | `#FFB770` | Primary colour: headlines, buttons, bars |
| ![](https://img.shields.io/badge/-FFCFA1-FFCFA1?style=flat-square) | `#FFCFA1` | Hover state of the primary colour |
| ![](https://img.shields.io/badge/-FEE9D4-FEE9D4?style=flat-square) | `#FEE9D4` | Badges, status labels |
| ![](https://img.shields.io/badge/-FEFDFF-FEFDFF?style=flat-square) | `#FEFDFF` | Card and panel background |
| ![](https://img.shields.io/badge/-F4E9FB-F4E9FB?style=flat-square) | `#F4E9FB` | Surfaces with a slight purple tint |
| ![](https://img.shields.io/badge/-EE9236-EE9236?style=flat-square) | `#EE9236` | Accent: percentages, error outlines |

**Typography**

| Typeface | Used for |
|---|---|
| **Nerko One** | Headlines and the logo wordmark |
| **Mulish** | Body text, forms, lists |
| **Nokora** | Buttons and small labels |

<br>

## Notes

- The surveys are sample data. There is no backend – created surveys and cast votes
  live in the memory of the page and are gone after a reload.
- The live evaluation simulates incoming votes every couple of seconds so the bars
  visibly move.
- The original design export (React via CDN) still lives in the
  [`design-export`](https://github.com/alexlindt-arch/Poll-App/tree/design-export) branch.

<br>

## Author

**Alexander Lindt** – freelance web designer, Ingolstadt
[alexanderlindtwebdesign.com](https://alexanderlindtwebdesign.com) · [GitHub](https://github.com/alexlindt-arch)
