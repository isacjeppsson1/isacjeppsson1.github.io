# Elin & Isac — Wedding Landing Page

A static, single-page wedding site. Plain HTML/CSS/JS — no build step.
It is published automatically by GitHub Pages from this repo.

## Live site
https://isacjeppsson1.github.io

## Quick start (customize)
Most things live in two places:

1. **`js/main.js`** — the `CONFIG` object at the top:
   - `weddingDate` — drives the hero countdown (`YYYY-MM-DDTHH:MM:SS`)
   - `mapQuery` — the venue address (updates the map + "Get directions")
   - `rsvpEmail` — where RSVP emails are sent

2. **`index.html`** — search for the marker `>>> EDIT <<<`:
   - Hero date & place text
   - Schedule/timeline times & titles
   - Venue name, address & notes
   - Registry / honeymoon links
   - RSVP "reply by" date

## Photos
Drop images into `assets/img/` and swap the placeholder gallery tiles in
`index.html` for real `<img>` tags (see `assets/img/README.txt`).

## RSVP form
The form opens the visitor's email app pre-filled (mailto), so it works with
zero backend. To collect responses in a form/table instead, point the form at
a service like Formspree:

```html
<form class="rsvp reveal" id="rsvpForm" action="https://formspree.io/f/YOUR_ID" method="POST">
```

## Deploy
Push to `main` — GitHub Pages builds from the repo root automatically.
Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)`.
