/*
 * Responsive image builder for The Great Notch Inn site.
 * Masters: the JPEGs in ../images (max 1600px, real Inn photos from the live site).
 * Output: -400/-800/-1600 WebP (+ AVIF for the hero, + 480/960 for merch) next to each master.
 * Usage:  cd tools && npm install && npm run images
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG = path.join(__dirname, '..', 'images');

async function variants(file, widths, { avif = false, webpQ = 72, avifQ = 50 } = {}) {
  const base = file.replace(/\.jpg$/i, '');
  const meta = await sharp(file).metadata();
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    const pipe = () => sharp(file).resize({ width, withoutEnlargement: true });
    await pipe().webp({ quality: webpQ, effort: 5 }).toFile(`${base}-${w}.webp`);
    if (avif) await pipe().avif({ quality: avifQ, effort: 5 }).toFile(`${base}-${w}.avif`);
  }
}

(async () => {
  await variants(path.join(IMG, 'IMG_0742.jpg'), [800, 1200, 1600], { avif: true });
  for (const f of fs.readdirSync(path.join(IMG, 'photos')).filter(f => /^\d+\.jpg$/.test(f))) {
    await variants(path.join(IMG, 'photos', f), [400, 800, 1600], { webpQ: 70 });
  }
  for (const f of fs.readdirSync(path.join(IMG, 'merch')).filter(f => /^[a-z_0-9]+\.jpg$/i.test(f))) {
    await variants(path.join(IMG, 'merch', f), [480, 960], { webpQ: 74 });
  }
  console.log('done');
})();
