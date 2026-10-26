# The Great Notch Inn: website source

A single-page static site for The Great Notch Inn (Est. 1939), 400 Route 46 West, Little Falls, NJ 07424 · (973) 256-7742.
It runs as plain HTML, CSS and JS, with no build step needed to serve it.

## Files
```
index.html        the whole page
css/style.css     all styles
js/app.js         Google Calendar events list, event modal, photo/merch lightbox, contact form (mailto)
images/           real Great Notch Inn photos only (see "Images")
```

## Images
Every image comes from the Inn's own live site (`https://thegreatnotchinn.com/images/`), downloaded on 2026-09-29.
The untouched originals are archived at `clients/_archive/greatnotch_2026-09-29/live_mirror/`.
There are **no stock photos**. Don't add Unsplash or other stock images, and don't caption any photo as something it isn't.

- `images/IMG_0742.jpg`: hero, the neon-lit exterior
- `images/photos/1-39.jpg`: the gallery (same 39 photos as the live site); some also serve as section backgrounds
- `images/merch/*.jpg`: merchandise photos (the live site's .png files, converted to .jpg)

## Events
The events list and the monthly view both come from the Inn's public Google Calendar (`greatnotchinn@gmail.com`).
To update the schedule, edit that calendar. No code change is needed.

## Deploy & QA

Not deployed. See `DEPLOY.md` (backup, `.htaccess` merge, rollback) and `QA.md` (Lighthouse before/after, checks).
