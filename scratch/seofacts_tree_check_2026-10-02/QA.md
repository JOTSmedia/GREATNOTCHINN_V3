# QA notes: steps A–E (local, 2026-09-29)

Tested at `http://127.0.0.1` with Chromium (Playwright) and Lighthouse, at 1440×900 desktop and 390×844 mobile.

## Lighthouse (Performance / Accessibility / Best Practices / SEO)
| | Mobile | Desktop |
|---|---|---|
| **Before** (live site, 2026-09-29) | 76 / 79 / 77 / 92, LCP 2.4 s, CLS 0, TBT 810 ms | 46 / 84 / 77 / 92, LCP 4.4 s, CLS 0.393, TBT 280 ms |
| **After** (local, gzip server like `.htaccess`, 3 runs) | 95–99 / 100 / 100 / 100, LCP 1.4–2.5 s, CLS 0, TBT 100–150 ms | 100 / 100 / 100 / 100, LCP 0.3 s, CLS 0, TBT 0 ms |
| **After** (local, plain server, no gzip) | 93 / 100 / 100 / 100, LCP 2.8 s, CLS 0, TBT 150 ms | 100 / 100 / 100 / 100, LCP 0.5 s, CLS 0, TBT 10 ms |

Local numbers skip the real host's network time and its "One moment, please…" bot check. Expect the live numbers to be
somewhat lower. Re-run on the live URL after deploy.

## Weight
| | Before (live) | After |
|---|---|---|
| Lighthouse page weight | ~4.8–4.9 MB | 0.11 MB mobile / 0.27 MB desktop (gzip) |
| Full scroll, mobile (everything loaded) | ~35.5 MB | 3.3 MB (1.9 MB images; the rest is mostly Google Calendar/Maps) |
| Full scroll, desktop | – | 4.3 MB (2.9 MB images) |
| Site images on disk | 59 files, 34 MB | 51 masters ~5.7 MB + 145 WebP/AVIF sizes, 13 MB in total (browsers download only the size they need) |

## Checked
- 58 images on the page, 0 broken; no console errors; no 4xx/5xx requests; no stock or Unsplash images (external
  images only from Google Maps/Calendar and YouTube thumbnails).
- Mobile: 56 px header with a Menu button (opens, closes, closes on link tap and on Esc, `aria-expanded` updates);
  fixed bottom Call / Directions / Live Tonight bar doesn't cover content (body padding + safe-area); no sideways scroll
  at 390 px.
- Lightbox: photos and merch open it; Prev/Next/Close buttons, arrow keys, Esc and swipe work; focus moves into it and
  back on close.
- Event list: 10 upcoming events, then "more". Title buttons open the details dialog (focus to Close, Esc closes,
  Tab stays inside). Past-events toggle updates `aria-expanded`.
- In-page links (nav, action bar, hero buttons) land exactly on their sections at both sizes.
- Merch shows the real product photos, with the "Ask Bartender to Purchase" label always visible on touch screens.

## Fixed during E
- Gallery and merch images rendered at their full attribute height (up to 1400 px tall) because `height:auto` was
  missing after step B added width/height attributes. Fixed (`img{height:auto}`).
- Section background photos and the Google Calendar embed (~450 KB of Google code, plus a third-party cookie that cost
  the Best Practices score) now load only when scrolled near.
- Off-screen sections use `content-visibility:auto` for faster first render on phones. It switches off as soon as
  someone uses an in-page link or opens a `#section` URL, so jumps stay accurate.

## Known / not done
- The Google Calendar and Maps embeds still set Google cookies once they load (unchanged from the live site).
- Visible placeholders: none left. Hours, live-music nights, payment and the band card were confirmed on 2026-09-29;
  food ("Bar pies available") and age policy ("21+ only") on 2026-10-02.
- The contact form still works by opening the visitor's email app (TODO-JOHN: pick a form service).
- Screenshots: `after-desktop-1440x900.png`, `after-desktop-1440-fullpage.png`, `after-mobile-390x844.png`,
  `after-mobile-390-fullpage.png`. The full-page captures turn off `content-visibility` so every section is drawn.

## Tonight's-act card (seo-facts, 2026-09-29)
- "Business night" is computed in America/New_York for every visitor; 00:00–01:59 NY still counts as the previous night. Monday rule ("Closed Mondays · Open Tue–Sun from 5 PM") applies from 2 AM Monday. The calendar lookup window ("upcoming" list) starts at 2 AM NY of tonight's business date; list/modal times are shown in NY time.
- `tools/tonight-test.js` (Playwright, mocked clock + mocked Calendar API): event tonight, no event, API 500, 1 AM Mon NY with a Sunday act, 3 PM Mon, LA visitor at 10 PM PT Sunday, HTML-in-title escaping, live calendar. 16/16 pass (1440×900 and 390×844); card height identical before/after the swap, CLS 0.
