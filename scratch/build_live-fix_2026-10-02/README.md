**WARNING: copy these files OVER the live site. Do NOT delete or replace anything else.**
This folder is only the changed and new files, not a complete copy of the site. Upload them over the existing files on GoDaddy (overwrite only these) and leave everything else in place: the server's other images, the press PDFs and its own files (robots.txt, .htaccess, sitemap.xml, favicon.ico and so on) must stay.

Files in this folder (paths relative to the web root):
README.md
images/og-share.jpg
index.html

# Great Notch Inn: changes to the live page (GoDaddy web root)

Built 2026-10-02 from branch `live-fix`. `index.html` is the live page ("The Great Notch Inn — Official (v2)") with only these changes:
- "Bar pies available · 21+ only" under the phone number;
- share-image tags (og:image, og:image:width/height/alt, twitter:card, twitter:image);
- a glass pill style on each dates/artists entry (CSS only).

`images/og-share.jpg` is new: a 1200x630 crop of the hero photo.

## Share image
The share image only works after the GoDaddy upload; until then, shared links (including from the grok.me preview) show no picture. After the upload is live, run `https://thegreatnotchinn.com/` through Facebook's Sharing Debugger (https://developers.facebook.com/tools/debug/) and click **Scrape Again**.
