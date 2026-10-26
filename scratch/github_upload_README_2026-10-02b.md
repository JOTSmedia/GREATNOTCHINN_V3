**WARNING: this folder is a set of CHANGES to copy over the live site, NOT a complete copy of the site.**
Upload these files over the existing files on GoDaddy (overwrite only these). Do NOT delete or replace the whole site folder: the server's other images, the press PDFs and its own files (robots.txt, .htaccess, sitemap.xml, favicon.ico and so on) must stay.

Files in this folder (paths relative to the web root):
README.md
css/components.css
css/style.css
images/og-share.jpg
index.html
js/app.js
js/booking.js
js/calendar.js
js/gallery.js
js/merch.js
js/soundboard.js

# Great Notch Inn: files to upload (GoDaddy web root)

Upload these files over the existing site. Built 2026-10-02 from branch `scope-fix`.

- `index.html`, `css/`, `js/`: the original site, with only these changes:
  - the 7 merch photos that weren't loading now point to the real files on the server (`/images/merch/*.png`);
  - all-day calendar entries are hidden, so the band listing shows only band nights;
  - "Bar pies available · 21+ only" under the phone number;
  - a glass pill style on each band entry;
  - share-image tags (og:image / twitter:image).
- `images/og-share.jpg`: the new share image (1200x630 crop of the hero photo).

Don't delete anything on the server. The existing `images/` folder (hero, photos, merch .png/.jpg, press PDFs), `robots.txt`, `sitemap.xml`, `favicon.ico` and `.htaccess` stay as they are; upload over them.

## Share image
The share image only works after the GoDaddy upload; until then, shared links (including from the grok.me preview) show no picture. After the upload is live, run `https://thegreatnotchinn.com/` through Facebook's Sharing Debugger (https://developers.facebook.com/tools/debug/) and click **Scrape Again**.
