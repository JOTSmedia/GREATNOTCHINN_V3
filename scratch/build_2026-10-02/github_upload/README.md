.htaccess must be uploaded too. Finder hides dot-files, press Cmd+Shift+. to show it.

# Great Notch Inn: files to upload (GoDaddy web root)
Built 2026-10-02 from branch `seo-facts` (see the commit hash in the handoff report). **Nothing has been uploaded.** Uploading needs John's explicit yes.

## What's here
- `index.html`, `css/style.css`, `js/app.js`, `favicon.ico`
- `images/`: only the image files the page actually references (WebP/AVIF sizes), plus `images/IMG_0742.jpg` (used by the Google structured data) and `images/og-share.jpg` (1200x630 social share image, a crop of the hero). Every path is relative (`images/...`, `../images/...` in CSS), and every name matches exactly, lowercase included. GoDaddy's Linux server is case-sensitive.
- `robots.txt`, `sitemap.xml`
- `.htaccess`: one-hop 301 (http → https, www and greatnotchinn.com → https://thegreatnotchinn.com), gzip, caching and security headers. **Merge it with the live .htaccess, don't blindly overwrite it.** Replace the live http→https rule with this block, keep any GoDaddy/PHP lines, and back up the live file first.

## Before / at upload
1. Back up the live site (whole web root + the live `.htaccess`).
2. Upload into the **web root** (e.g. `public_html/`). Order: `images/` → `css/`, `js/`, `favicon.ico` → `index.html` → `robots.txt`, `sitemap.xml` → `.htaccess` last, then test straight away (`curl -sI http://www.thegreatnotchinn.com/` should give one 301 to https://thegreatnotchinn.com/).
3. **Keep the existing press PDFs on the server.** The 16 files `images/*.pdf` (patnews, hnewsold, dileo, waterbury, heraldnews, heraldnews2, stledger, bluesrevue, blues2, hn4, hn4a, record, gazette, betterout, betterin, njcom) are linked from the Press Archive and are **not** in this folder. Don't delete them, and don't delete `images/` on the server; upload over it.
4. **Google Calendar API key:** it's embedded in `js/app.js` (needed for the calendar list and the Tonight card). John must restrict it in Google Cloud Console → Credentials: HTTP referrers `https://thegreatnotchinn.com/*` (plus `https://www.thegreatnotchinn.com/*`, and any preview host such as the grok.me preview if it should show live events), API restriction = Google Calendar API only.
5. **GoDaddy bot check:** relax/allow-list it so Googlebot, Bingbot etc. can read the page, `robots.txt` and `sitemap.xml` (right now crawlers get a "One moment, please…" challenge).

## Share image (og:image)
The share image (`images/og-share.jpg`, absolute URL `https://thegreatnotchinn.com/images/og-share.jpg`) only works after the GoDaddy upload; until then, shared links (including from the grok.me preview) show no picture. After the upload is live, run `https://thegreatnotchinn.com/` through Facebook's Sharing Debugger (https://developers.facebook.com/tools/debug/) and click **Scrape Again**.

## Still open (TODO-JOHN)
- Price range (structured data `priceRange`): not on the page; add once John confirms. (Food "Bar pies available" and "21+ only" are done, 2026-10-02.)
- Holiday-hours exceptions, if any.
- Old PDFs/pages (aboutus2.html, aboutus3.html): keep, redirect or remove. Old-URL redirects are prepared in `.htaccess` but commented out.
- Contact form service (currently opens the visitor's email app).
