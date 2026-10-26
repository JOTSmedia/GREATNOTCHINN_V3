# The Great Notch Inn — Official Website (Original Aesthetic + Enhanced Functionality)

> **"Established 1939 — Home of Live Rock & Blues"**
> 400 Route 46 West, Little Falls / Woodland Park, NJ 07424 • (973) 256-7742

This version restores the **exact authentic visual identity and layout** of the original [thegreatnotchinn.com](https://thegreatnotchinn.com/) while providing robust, modern performance and functional enhancements.

---

## 🎸 Architecture & Key Features

### 1. Authentic Visual Identity & Layout Restored
- **Original Parallax Flow**: Fullscreen background panels (`#home`, `#about`, `#calendar`, `#articles`, `#photos`, `#videos`, `#links`, `#merchandise`, `#history`, `#contact`).
- **Signature Styling**: Wood and paper textures, molten red glow animations (`@keyframes glow`), neon cyan/yellow/lime accents, translucent backdrop panels, and the glowing fixed `LIVE TONIGHT` button.

### 2. Official Google Calendar Integration
- **Owner's Preferred Google Calendar Embed**: Official responsive monthly Google Calendar embed (`greatnotchinn@gmail.com`) with dark mode integration.
- **Live Event Table via Google Calendar API**: Fetches real-time upcoming shows, highlights today's gigs with `<span class="live-badge">LIVE TONIGHT</span>`, and caches data in `localStorage` for instant loading.
- **Event Modal**: Clicking any event displays full details, timing, location, and a direct `"View on Google Calendar"` deep link.
- **Past Events Archive**: Collapsible table for past events.

### 3. Enhanced Gallery & Lightbox
- 39-photo gallery with responsive grid, smooth hover zoom, and a fullscreen modal lightbox with keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`).
- Direct link to the official Instagram feed `@greatnotchinn`.

### 4. Press & Articles Archive
- Complete 9-article historical clippings archive (USA Today / NorthJersey.com top dive bar feature, NJ Monthly, Passaic County Historical Society, highway expansion history, Montclair Film Festival, eGullet).

### 5. Videos & Band Links
- Responsive embedded YouTube video showcases and 30+ clickable band directory cards.

### 6. Merchandise Showcase
- Zoomable merchandise gear showcase with item titles and "Ask Bartender to Purchase" badges.

### 7. Working Contact & Directions
- Direct mailto handler prefilling `greatnotchinn@gmail.com`, copy client button, phone dialer `(973) 256-7742`, and direct Route 46 Google Maps links.

---

## 📁 File Structure

```
clients/Great_Notch_Inn/
├── index.html          # Master HTML5 single-page site (Original look, enhanced code)
├── css/
│   └── style.css       # Core stylesheet with authentic colors, glow effects & responsive fixes
├── js/
│   └── app.js          # Google Calendar API, Lightbox, event modal, form handler & error fallbacks
└── README.md           # Documentation
```
