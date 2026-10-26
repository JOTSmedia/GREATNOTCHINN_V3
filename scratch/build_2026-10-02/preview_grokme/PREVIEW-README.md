# Great Notch Inn: grok.me PREVIEW build (not the live site)

**Publish these files exactly as they are. Ask the Grok chat not to rewrite, reformat or regenerate any page**, because a rewrite could drop the noindex tag.

Pages that must carry `<meta name="robots" content="noindex, nofollow">` (spot-check after publishing, e.g. view-source):
- `index.html` (the only HTML page in this build)

## How this differs from `github_upload/` (the real GoDaddy upload)
| | preview_grokme/ | github_upload/ |
|---|---|---|
| robots meta | `noindex, nofollow` on every page | none (the live site must be indexable) |
| robots.txt | allow-all (`User-agent: *` / `Allow: /`), so crawlers can see the noindex | real one, with `Sitemap:` |
| canonical / og:url | **removed**, so the preview doesn't claim to be thegreatnotchinn.com | `https://thegreatnotchinn.com/` |
| sitemap.xml | not included | included |
| .htaccess | not included (preview hosts don't run it; no redirects or cache headers there, as expected) | included |
| Press Archive PDFs | link to the live `https://thegreatnotchinn.com/images/*.pdf` | relative `images/*.pdf` (already on the server) |
| everything else | identical (same HTML/CSS/JS/images from the same commit) | |

## Share image
The share image (`og:image` = `https://thegreatnotchinn.com/images/og-share.jpg`) only works after the GoDaddy upload, so preview share links show no picture until then. After the upload is live, run `https://thegreatnotchinn.com/` through Facebook's Sharing Debugger (https://developers.facebook.com/tools/debug/) and click **Scrape Again**.

## Notes
- All image paths are relative, so the folder also works opened locally or from any subfolder.
- The Calendar list and the Tonight card use the site's Google Calendar API key. If John restricts that key by HTTP referrer (recommended), **add the preview host too** (e.g. `https://greatnotchinn.grok.me/*`). Otherwise the preview falls back to "Live music tonight" and a "Couldn't load the schedule" link.
- This is a preview only. The GoDaddy upload still needs John's separate yes.
