# Elin & Isac — Bröllopssajt

En statisk, ensidig bröllopssajt. Ren HTML/CSS/JS — inget byggsteg.
Den publiceras automatiskt av GitHub Pages från detta repo.

## Live-sajt
https://isacjeppsson1.github.io

## Snabbstart (anpassning)
De flesta sakerna finns på två ställen:

1. **`js/main.js`** — `CONFIG`-objektet högst upp:
   - `weddingDate` — styr nedräkningen i hero (`ÅÅÅÅ-MM-DDTHH:MM:SS`)
   - `mapQuery` — lokalens adress (uppdaterar kartan + "Få vägbeskrivning")
   - `rsvpEmail` — var RSVP-mejl skickas till

2. **`index.html`** — sök efter markören `>>> EDIT <<<`:
   - Hero-datum & plats
   - Schema/tidslinjens tider & rubriker
   - Lokalens namn, adress & anteckningar
   - Presentlista / månfond-länkar
   - RSVP "svar senast"-datum

## Foton
Lägg bilder i `assets/img/` och byt ut de platshållande gallerirutinerna i
`index.html` mot riktiga `<img>`-taggar (se `assets/img/README.txt`).

## RSVP-formulär
Formuläret öppnar besökarens e-postapp ifylld (mailto), så det fungerar utan
något backend. För att istället samla svar i ett formulär/tabell, peka
formuläret mot en tjänst som Formspree:

```html
<form class="rsvp reveal" id="rsvpForm" action="https://formspree.io/f/YOUR_ID" method="POST">
```

## Publicera
Pusha till `main` — GitHub Pages bygger automatiskt från repo-roten.
Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)`.
