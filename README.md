<div align="center">

<img src="assets/img/logo-orange.svg" alt="Poll App" width="200">

# Poll App

**Collect Feedback, Unlock Ideas**

Umfragen in Minuten erstellen, teilen und live auswerten – vom Team-Event bis zur Unternehmenskultur.

<br>

[![Live Demo](https://img.shields.io/badge/Live_Demo-ansehen-FFB770?style=for-the-badge&logoColor=35273A&labelColor=35273A)](https://alexander-lindt.developerakademie.net/Poll-App/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Spiegel-35273A?style=for-the-badge&logoColor=FFB770&labelColor=35273A)](https://alexlindt-arch.github.io/Poll-App/)

![HTML5](https://img.shields.io/badge/HTML5-35273A?style=flat-square&logo=html5&logoColor=FFB770)
![CSS3](https://img.shields.io/badge/CSS3-35273A?style=flat-square&logo=css3&logoColor=FFB770)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-35273A?style=flat-square&logo=javascript&logoColor=FFB770)
![Kein Framework](https://img.shields.io/badge/kein_Framework-35273A?style=flat-square&logoColor=FFB770)
![Responsive](https://img.shields.io/badge/responsive-35273A?style=flat-square&logoColor=FFB770)

</div>

<br>

## Über das Projekt

Poll App ist eine Umfrage-Plattform: Nutzer legen eigene Umfragen mit beliebig vielen
Fragen und Antworten an, veröffentlichen sie, stimmen ab und sehen die Auswertung als
Live-Balkendiagramm direkt neben den Fragen.

Gebaut mit reinem HTML, CSS und JavaScript – ohne Framework, ohne Build-Schritt und
ohne Abhängigkeiten. Ordner in einen Webserver legen, fertig.

<br>

## Screenshots

### Übersicht

Hero-Bereich, bald endende Umfragen und die Liste aller Umfragen mit Umschalter für
laufende/abgeschlossene Umfragen und Kategoriefilter.

<img src="docs/screenshots/01-overview.png" alt="Übersicht mit Hero und Umfrage-Listen" width="100%">

<br>

### Umfrage beantworten – mit Live-Auswertung

Alle Fragen einer Umfrage, je nach Einstellung mit Einfach- oder Mehrfachauswahl.
Rechts aktualisieren sich die Ergebnisse in Echtzeit. Oben rechts führen der
„New survey"-Button und das Schließen-Kreuz zurück in den Ablauf.

<img src="docs/screenshots/02-survey-detail.png" alt="Umfrage-Detailansicht mit Live-Ergebnissen" width="100%">

<br>

### Umfrage erstellen

Pflichtfelder sind mit `*` markiert und werden validiert. Fragen und Antwortoptionen
lassen sich dynamisch hinzufügen und entfernen – bis zu sechs Antworten pro Frage.
Zwei Fragen stehen nebeneinander, sobald beide genug Platz haben, sonst füllt eine
Frage die ganze Breite.

<img src="docs/screenshots/03-create-survey.png" alt="Formular zum Anlegen einer neuen Umfrage" width="100%">

<br>

### Mobil

Eigenes Layout ab 320 px: Startseite mit horizontal schiebbaren Karten und der
Erstellen-Dialog als dunkler Block auf heller Seite.

<div align="center">
  <img src="docs/screenshots/04-mobile.png" alt="Mobile Ansicht der Startseite" width="300">
  <img src="docs/screenshots/05-mobile-create.png" alt="Mobile Ansicht des Erstellen-Dialogs" width="300">
</div>

<br>

## Features

| | Feature | Beschreibung |
|---|---|---|
| ⏳ | **Bald endende Umfragen** | Eigener Bereich über der Liste, chronologisch nach Enddatum sortiert |
| 🔀 | **Laufend / Abgeschlossen** | Reiter zum Umschalten; abgelaufene Umfragen sind einsehbar, aber gesperrt |
| 🏷️ | **Kategoriefilter** | Getrennt je Reiter, zeigt nur tatsächlich vorhandene Kategorien, jederzeit auf „Alle" zurücksetzbar |
| ✍️ | **Umfrage-Editor** | Overlay-Dialog mit Pflicht- und optionalen Feldern, Validierung und dynamischen Fragen |
| ☑️ | **Einfach- & Mehrfachauswahl** | Pro Frage einstellbar |
| 📊 | **Live-Auswertung** | Prozentbalken neben den Fragen, die sich laufend aktualisieren |
| 📱 | **Responsive** | Zwei ausgearbeitete Layouts: Mobil ab 320 px, Laptop ab 769 px; Überschrift und Spalten wachsen stufenlos mit dem Platz |
| 🎠 | **Schiebbare Highlights** | Die Karten bleiben immer in einer Reihe und lassen sich seitlich schieben, wenn sie nicht nebeneinander passen |
| ⌨️ | **Tastatur & A11y** | Escape schließt Overlays, ARIA-Rollen für Dialoge, Tabs und Live-Region |

<br>

## Tech-Stack

| Bereich | Umsetzung |
|---|---|
| Struktur | Semantisches HTML5, keine Inline-Styles |
| Styling | CSS3 mit Custom Properties, Flexbox und Grid, aufgeteilt in sechs Dateien |
| Logik | Vanilla JavaScript (ES2021), aufgeteilt in acht Module |
| Rendering | Template-Funktionen erzeugen HTML-Strings, `render.js` schreibt sie ins DOM |
| Abhängigkeiten | keine – nur Google Fonts (Nerko One, Mulish, Nokora) |

<br>

## Projektstruktur

```
Poll-App/
├── index.html              # Semantisches Grundgerüst, leere Container fürs Rendering
├── style/
│   ├── variables.css       # Design-Tokens: Farben, Fonts, Abstände
│   ├── base.css            # Reset, Typografie, Hilfsklassen, Keyframes
│   ├── layout.css          # Header, Hero, Umfragen-Sektion
│   ├── components.css      # Buttons, Karten, Reiter, Filter, Toast
│   ├── overlay.css         # Detailansicht und Erstellen-Dialog
│   └── responsive.css      # Breakpoints
├── js/
│   ├── data.js             # Konstanten und Seed-Daten
│   ├── state.js            # Zustand und Objekt-Factories
│   ├── surveys.js          # Abfragen, Sortierung, Auswertung, Abstimmen
│   ├── templates.js        # HTML-Templates (kein DOM-Zugriff)
│   ├── render.js           # Schreibt die Startseite ins DOM
│   ├── detail.js           # Detail-Overlay
│   ├── form.js             # Erstellen-Dialog inkl. Validierung
│   └── main.js             # Einstiegspunkt, Reiter, Filter, Live-Timer
├── assets/img/             # Logos, Icons (Papierkorb, Plus), Hero-Illustration
└── docs/screenshots/       # Screenshots für dieses README
```

<br>

## Lokal starten

Die App braucht einen HTTP-Server, weil die Schriften über eine externe Domain geladen
werden:

```bash
git clone https://github.com/alexlindt-arch/Poll-App.git
cd Poll-App

# eine dieser Varianten:
python -m http.server 8000
npx serve .
php -S localhost:8000
```

Dann `http://localhost:8000` im Browser öffnen.

<br>

## Code-Konventionen

Das Projekt folgt den Coding-Konventionen der Developer Akademie:

| Regel | Stand |
|---|---|
| Funktionen maximal 14 Zeilen | 108 Funktionen, **0 Verstöße** |
| JSDoc über jeder Funktion | **108 von 108** dokumentiert |
| Keine Inline-Styles im HTML | **0** `style`-Attribute |
| Trennung von HTML, CSS und JS | 1 HTML-Datei, 6 CSS-Dateien, 8 JS-Module |
| Sprechende Namen, kein `var` | durchgehend `const`/`let`, camelCase |
| Keine Duplikate | gemeinsame Bausteine z. B. in `surveyTeaserTemplate()` |

Nutzereingaben werden vor dem Einfügen ins DOM über `escapeHtml()` maskiert.

<br>

## Design-System

**Farben**

| | Hex | Verwendung |
|---|---|---|
| ![](https://img.shields.io/badge/-35273A-35273A?style=flat-square) | `#35273A` | Seiten-Hintergrund, Fließtext auf hellen Flächen |
| ![](https://img.shields.io/badge/-FFB770-FFB770?style=flat-square) | `#FFB770` | Primärfarbe: Überschriften, Buttons, Balken |
| ![](https://img.shields.io/badge/-FFCFA1-FFCFA1?style=flat-square) | `#FFCFA1` | Hover-Zustand der Primärfarbe |
| ![](https://img.shields.io/badge/-FEE9D4-FEE9D4?style=flat-square) | `#FEE9D4` | Badges, Status-Labels |
| ![](https://img.shields.io/badge/-FEFDFF-FEFDFF?style=flat-square) | `#FEFDFF` | Karten- und Panel-Hintergrund |
| ![](https://img.shields.io/badge/-F4E9FB-F4E9FB?style=flat-square) | `#F4E9FB` | Flächen mit leichtem Lila-Stich |
| ![](https://img.shields.io/badge/-EE9236-EE9236?style=flat-square) | `#EE9236` | Akzent: Prozentwerte, Fehlerrahmen |

**Typografie**

| Schrift | Einsatz |
|---|---|
| **Nerko One** | Überschriften und Logo-Schriftzug |
| **Mulish** | Fließtext, Formulare, Listen |
| **Nokora** | Buttons und kleine Labels |

<br>

## Hinweise

- Die Umfragen sind Beispieldaten. Es gibt kein Backend – angelegte Umfragen und
  abgegebene Stimmen leben im Speicher der Seite und sind nach einem Reload weg.
- Die Live-Auswertung simuliert eingehende Stimmen im Sekundentakt, damit sich die
  Balken sichtbar bewegen.
- Der ursprüngliche Design-Export (React über CDN) liegt weiterhin im Branch
  [`design-export`](https://github.com/alexlindt-arch/Poll-App/tree/design-export).

<br>

## Autor

**Alexander Lindt** – Freelance Webdesigner, Ingolstadt
[alexanderlindtwebdesign.com](https://alexanderlindtwebdesign.com) · [GitHub](https://github.com/alexlindt-arch)
