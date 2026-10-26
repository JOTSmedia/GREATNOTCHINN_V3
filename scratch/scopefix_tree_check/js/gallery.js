/**
 * THE GREAT NOTCH INN — Media Vault & Lightbox Gallery
 * Manages category filtering, responsive full-screen lightbox, keyboard navigation, and captions.
 */

const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    category: 'music',
    title: 'Wild Bill Ripping Guitar Solos on Stage',
    desc: 'Packed house during Friday night blues overdrive.',
    src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-2',
    category: 'biker',
    title: 'Sunday Afternoon Throttle Meet & Porch Hangs',
    desc: 'Harleys, Indians, and custom choppers lined along Route 46 West.',
    src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-3',
    category: 'history',
    title: 'Historic 1939 Timber Roadhouse Architecture',
    desc: 'The original log cabin roadhouse structure that survived decades of highway expansion.',
    src: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-4',
    category: 'bar',
    title: 'Ice Cold Pints at the Historic Notch Bar',
    desc: 'Three generations of tap pulls, neon bar lights, and great company.',
    src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-5',
    category: 'music',
    title: 'Hammond Organ & Blues Trio in Full Swing',
    desc: 'Saturday night rock & blues jam in the wood-paneled stage corner.',
    src: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-6',
    category: 'biker',
    title: 'Charity Poker Run Arrival at The Notch',
    desc: 'Annual North Jersey biker benefit ride ending at our outdoor porch.',
    src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-7',
    category: 'history',
    title: 'Vintage Neon Signs & Roadhouse Artifacts',
    desc: 'Authentic 20th-century license plates, musical memorabilia, and neon glow.',
    src: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'gal-8',
    category: 'bar',
    title: 'The Legendary Wood-Burning Stove & Fireplace',
    desc: 'Keeping road-trippers and regulars warm through Jersey winters since 1939.',
    src: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80'
  }
];

class MediaVault {
  constructor() {
    this.items = GALLERY_ITEMS;
    this.activeCategory = 'all';
    this.currentIndex = 0;
    this.filteredList = [...this.items];
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Category Filter Buttons
    const filterBtns = document.querySelectorAll('.gallery-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-cat');
        this.render();
      });
    });

    // Lightbox Controls
    const modal = document.getElementById('lightboxModal');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigateLightbox(1));

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeLightbox();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
      if (e.key === 'ArrowRight') this.navigateLightbox(1);
    });
  }

  getFilteredItems() {
    if (this.activeCategory === 'all') return this.items;
    return this.items.filter(item => item.category === this.activeCategory);
  }

  render() {
    const container = document.getElementById('galleryGridContainer');
    if (!container) return;

    this.filteredList = this.getFilteredItems();

    container.innerHTML = this.filteredList.map((item, index) => `
      <div class="gallery-item" data-index="${index}" onclick="window.mediaVault.openLightbox(${index})">
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <div class="gallery-overlay">
          <div class="gallery-caption">${item.title}</div>
        </div>
      </div>
    `).join('');
  }

  openLightbox(index) {
    this.currentIndex = index;
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');

    if (!modal || !img || !caption) return;

    const item = this.filteredList[this.currentIndex];
    if (!item) return;

    img.src = item.src;
    img.alt = item.title;
    caption.textContent = `${item.title} — ${item.desc}`;
    modal.classList.add('active');
  }

  closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.classList.remove('active');
  }

  navigateLightbox(direction) {
    this.currentIndex = (this.currentIndex + direction + this.filteredList.length) % this.filteredList.length;
    const item = this.filteredList[this.currentIndex];
    const img = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');

    if (img && item) {
      img.src = item.src;
      img.alt = item.title;
    }
    if (caption && item) {
      caption.textContent = `${item.title} — ${item.desc}`;
    }
  }
}

// Attach globally
window.mediaVault = new MediaVault();
