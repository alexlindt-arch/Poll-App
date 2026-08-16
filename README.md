<div align="center">

<img src="assets/img/logo.svg" alt="Poll App" width="200">

# Poll App

**Collect Feedback, Unlock Ideas**

Umfragen in Minuten erstellen, teilen und live auswerten – vom Team-Event bis zur Unternehmenskultur.

<br>

[![Live Demo](https://img.shields.io/badge/Live_Demo-ansehen-FFB770?style=for-the-badge&logoColor=35273A&labelColor=35273A)](https://alexlindt-arch.github.io/Poll-App/)

![HTML5](https://img.shields.io/badge/HTML5-35273A?style=flat-square&logo=html5&logoColor=FFB770)
![CSS3](https://img.shields.io/badge/CSS3-35273A?style=flat-square&logo=css3&logoColor=FFB770)
![JavaScript](https://img.shields.io/badge/JavaScript-35273A?style=flat-square&logo=javascript&logoColor=FFB770)
![React 18](https://img.shields.io/badge/React_18-35273A?style=flat-square&logo=react&logoColor=FFB770)
![No Build Step](https://img.shields.io/badge/kein_Build--Step-35273A?style=flat-square&logoColor=FFB770)

</div>

<br>

## Über das Projekt

Poll App ist ein voll funktionsfähiger Prototyp einer Umfrage-Plattform. Nutzer legen
eigene Umfragen mit beliebig vielen Fragen und Antworten an, veröffentlichen sie und
sehen die Ergebnisse als Live-Balkendiagramm neben den Fragen.

Die komplette Anwendung – Markup, Styles und Logik – steckt in einer einzigen
`index.html`. Es gibt keinen Build-Schritt, kein `npm install`, kein Framework-Setup:
Ordner in einen Webserver legen, fertig.

<br>

## Screenshots

### Übersicht

Hero-Bereich, bald endende Umfragen und die Liste aller Umfragen mit Filter nach
aktiv/vergangen und Sortierung nach Kategorie.

<img src="docs/screenshots/01-overview.png" alt="Übersicht mit Hero und Umfrage-Listen" width="100%">

<br>

### Umfrage beantworten – mit Live-Ergebnissen

Alle Fragen einer Umfrage, jeweils mit Einfach- oder Mehrfachauswahl. Rechts
aktualisieren sich die Ergebnisse in Echtzeit.

<img src="docs/screenshots/02-survey-detail.png" alt="Umfrage-Detailansicht mit Live-Ergebnissen" width="100%">

<br>

### Umfrage erstellen

Name, Enddatum, Kategorie und Beschreibung, dann Fragen und Antwortoptionen
dynamisch hinzufügen oder entfernen – bis zu sechs Antworten pro Frage.

<img src="docs/screenshots/03-create-survey.png" alt="Formular zum Anlegen einer neuen Umfrage" width="100%">

<br>

## Features

| | Feature | Beschreibung |
|---|---|---|
| 📋 | **Umfragen-Übersicht** | Karten für bald endende Umfragen plus vollständige Liste aller Umfragen |
| 🔀 | **Filter & Sortierung** | Umschalten zwischen aktiven und vergangenen Umfragen, sortieren nach Kategorie |
| ✍️ | **Umfrage-Editor** | Fragen und Antworten dynamisch hinzufügen, bearbeiten und löschen |
| ☑️ | **Einfach- & Mehrfachauswahl** | Pro Frage einstellbar, ob mehrere Antworten erlaubt sind |
| 📊 | **Live-Ergebnisse** | Prozentuale Auswertung als Balkendiagramm direkt neben den Fragen |
| 🏷️ | **Kategorien & Status** | Team activities, Health & Wellness, Gaming, Workplace Culture, Food & Drinks – jeweils als Draft oder Published |
| ⏱️ | **Restlaufzeit** | „Ends in X Days" auf jeder Karte, berechnet aus dem Enddatum |
| 🎨 | **Eigenes Design-System** | Durchgängige Farbwelt, drei Schriftfamilien, animierte Übergänge zwischen den Ansichten |

<br>

## Tech-Stack

| Bereich | Umsetzung |
|---|---|
| Struktur & Styling | HTML5, CSS3 (Flexbox & Grid, Inline-Styles im Komponenten-Markup) |
| Logik | JavaScript (ES2020+), klassenbasierte Komponenten-Logik |
| Rendering | React 18 – zur Laufzeit über CDN geladen, kein Bundler |
| Templating | Design-Component-Runtime (`assets/support.js`), Markup in `<x-dc>` |
| Schriften | Nerko One, Mulish, Nokora (Google Fonts) |
| Assets | SVG-Icons und -Logos, PNG-Illustration |

<br>

## Projektstruktur

```
Poll-App/
├── index.html                  # Die komplette App: Markup, Styles und Logik
├── assets/
│   ├── support.js              # Design-Component-Runtime (lädt React + Babel)
│   └── img/
│       ├── hero-visual.png     # Hero-Illustration
│       ├── logo.svg            # Logo
│       ├── logo-orange.svg     # Logo, orange Variante
│       ├── check.svg           # Icon: Häkchen
│       ├── question-mark.svg   # Icon: Fragezeichen
│       ├── star.svg            # Icon: Stern
│       └── typing-bubble.svg   # Icon: Sprechblase
├── docs/
│   └── screenshots/            # Screenshots für dieses README
└── README.md
```

<br>

## Lokal starten

Die App braucht einen HTTP-Server – per Doppelklick über `file://` funktioniert sie
nicht, weil die Runtime React und Babel nachlädt.

```bash
git clone https://github.com/alexlindt-arch/Poll-App.git
cd Poll-App

# eine dieser Varianten:
python -m http.server 8000
npx serve .
php -S localhost:8000
```

Dann `http://localhost:8000` im Browser öffnen. Eine Internetverbindung ist nötig,
damit React, Babel und die Google Fonts geladen werden können.

<br>

## Design-System

**Farben**

| | Hex | Verwendung |
|---|---|---|
| ![](https://img.shields.io/badge/-35273A-35273A?style=flat-square) | `#35273A` | Seiten-Hintergrund, Fließtext auf hellen Flächen |
| ![](https://img.shields.io/badge/-FFB770-FFB770?style=flat-square) | `#FFB770` | Primärfarbe: Überschriften, Buttons, Links |
| ![](https://img.shields.io/badge/-FFCFA1-FFCFA1?style=flat-square) | `#FFCFA1` | Hover-Zustand der Primärfarbe |
| ![](https://img.shields.io/badge/-FEE9D4-FEE9D4?style=flat-square) | `#FEE9D4` | Badges, Status-Labels |
| ![](https://img.shields.io/badge/-FEFDFF-FEFDFF?style=flat-square) | `#FEFDFF` | Karten- und Panel-Hintergrund |
| ![](https://img.shields.io/badge/-F4E9FB-F4E9FB?style=flat-square) | `#F4E9FB` | Detailansicht, Flächen mit leichtem Lila-Stich |
| ![](https://img.shields.io/badge/-221227-221227?style=flat-square) | `#221227` | Tiefen, Schatten, dunkelste Ebene |

**Typografie**

| Schrift | Einsatz |
|---|---|
| **Nerko One** | Überschriften und Logo-Schriftzug – handschriftlicher Charakter |
| **Mulish** | Fließtext, Formulare, Buttons |
| **Nokora** | Kleine Labels und Hinweistexte |

<br>

## Hinweise

- Die Umfragen sind Beispieldaten. Es gibt kein Backend – angelegte Umfragen und
  abgegebene Antworten leben im Speicher der Seite und sind nach einem Reload weg.
- Das Layout ist für Desktop-Breiten gebaut; auf schmalen Screens läuft die
  Headline über den Rand hinaus.
- React, Babel und die Google Fonts werden zur Laufzeit über CDN geladen –
  offline läuft die App nicht.

<br>

## Autor

**Alexander Lindt** – Freelance Webdesigner, Ingolstadt
[alexanderlindtwebdesign.com](https://alexanderlindtwebdesign.com) · [GitHub](https://github.com/alexlindt-arch)
