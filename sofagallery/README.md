# SofaGallery — snelle start (Next.js + Vercel)

Deze repo is kant‑en‑klaar om te deployen naar Vercel. Zonder Airtable‑sleutels draait de app in **demo‑modus** met 1 voorbeeldwerk (Het drijvend veertje).

## 🚀 Snel starten

1) **Upload naar GitHub** (of push via git)  
2) **Maak een nieuw project in Vercel** en kies deze repo.  
3) Stel **Environment Variables** in voor productie:

```
AIRTABLE_TOKEN=pat_xxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE=Artworks
# (optioneel) veldnamen overschrijven als jouw kolommen anders heten:
# FIELD_TITLE=Title
# FIELD_ARTIST=Artist
# FIELD_YEAR=Year
# FIELD_THEME=Theme
# FIELD_AUDIO=AudioText
# FIELD_IMAGE_URL=ImageURL
# FIELD_SOURCE=Source
# (optioneel) sorteren op een ander veld:
# SORT_FIELD=Title
```

4) Klik **Deploy**. Klaar ✅

> **Belangrijk:** Sluit je Airtable token nooit in frontend code in. In deze setup gaat alle data via een **API route** op Vercel (server‑side), dus je token blijft veilig.

## 📦 Structuur

- `app/page.jsx` — UI (kaarten + viewer). **Toont de voorlees‑tekst eerst**, nooit de algemene beschrijving.
- `app/api/artworks/route.js` — haalt data uit Airtable of geeft demo‑data terug.
- `app/globals.css` — eenvoudige styling (donker thema).
- `next.config.mjs`, `package.json` — Next.js configuratie.
- `public/` — statische assets.

## 🧪 Lokale ontwikkeling

```
npm install
npm run dev
```

Open daarna http://localhost:3000

## ✅ Airtable veldnamen

Standaard verwacht de app deze kolomnamen (pas aan met `FIELD_*` env vars):
- `Title` (titel)
- `Artist` (kunstenaar)
- `Year` (jaar)
- `Theme` (thema/tour)
- `AudioText` (voorlees‑tekst)
- `ImageURL` (url naar afbeelding)
- `Source` (bron/collectie)

Je kunt in Vercel elk van deze velden overschrijven met bv. `FIELD_TITLE=Naam`.

## 🔒 Veiligheid

- Airtable token staat **alleen** in server‑omgeving (Vercel Env).
- Frontend vraagt data via `/api/artworks` (geen secrets in de browser).

## 🧰 Tips

- Voeg extra pagina’s/tours toe door te filteren op `theme` of meerdere API routes te maken.
- Zet Open Graph afbeeldingen in `public/` voor deelbare links.
- Voor tekst‑naar‑spraak kun je later een `/api/tts` route toevoegen.
