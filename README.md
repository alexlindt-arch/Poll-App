# Poll App

Umfrage-/Poll-Anwendung, exportiert 1:1 aus einem Claude-Design-Projekt.

## Inhalt

| Datei | Beschreibung |
| --- | --- |
| `Poll App.dc.html` | Die komplette App (Markup, Styles und Logik in einer Datei) |
| `support.js` | Design-Component-Runtime (lädt React + Babel per CDN) |
| `hero-visual.png` | Hero-Illustration |
| `logo.svg`, `logo-orange.svg` | Logo-Varianten |
| `check.svg`, `question-mark.svg`, `star.svg`, `typing-bubble.svg` | Icons / Illustrationen |

## Lokal starten

Die Seite braucht einen HTTP-Server (nicht per Doppelklick öffnen), weil die
Runtime React und Babel per CDN nachlädt:

```bash
python -m http.server 8000
# dann http://localhost:8000/Poll%20App.dc.html öffnen
```

Eine Internetverbindung ist nötig, damit React/Babel geladen werden können.
