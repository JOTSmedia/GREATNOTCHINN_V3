/**
 * THE GREAT NOTCH INN — Official Swag Store & Interactive Cart
 * Manages product inventory, size selection, dynamic drawer, and order processing.
 */

const MERCH_ITEMS = [
  {
    id: 'merch-1',
    title: 'Vintage 1939 Biker Tee',
    price: 28.00,
    badge: 'Best Seller',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    category: 'apparel',
    svgType: 'tshirt',
    desc: 'Ultra-soft washed black 100% ring-spun cotton featuring distressed 1939 Route 46 roadhouse crest on back & chest logo.'
  },
  {
    id: 'merch-2',
    title: 'Route 46 Survivor Heavyweight Hoodie',
    price: 58.00,
    badge: 'Staff Favorite',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    category: 'apparel',
    svgType: 'hoodie',
    desc: 'Heavy 10oz fleece with jersey-lined hood, antique nickel eyelets, and "Route 46 Survivor • Est. 1939" sleeve print.'
  },
  {
    id: 'merch-3',
    title: 'Embroidered Notch Snapback Hat',
    price: 32.00,
    badge: 'Classic',
    sizes: ['One Size Fits All'],
    category: 'headwear',
    svgType: 'cap',
    desc: 'Classic structured 6-panel flat brim snapback with high-density gold & ember 3D embroidered Great Notch Inn badge.'
  },
  {
    id: 'merch-4',
    title: 'Roadhouse Heavy Pint Glass (Set of 2)',
    price: 24.00,
    badge: 'Barware',
    sizes: ['16 oz Set'],
    category: 'drinkware',
    svgType: 'glass',
    desc: 'Commercial-grade 16oz frosted pub pint glasses with fired ceramic Great Notch Inn crest. Built for ice-cold draft beer.'
  },
  {
    id: 'merch-5',
    title: 'Biker Patch & Enamel Pin Collector Set',
    price: 18.00,
    badge: 'Limited',
    sizes: ['Collector Pack'],
    category: 'accessories',
    svgType: 'patch',
    desc: 'Heavy iron-on embroidered 4-inch back vest patch plus antique bronze embossed enamel lapel pin.'
  },
  {
    id: 'merch-6',
    title: 'Cold Beer Neoprene Koozie 4-Pack',
    price: 15.00,
    badge: 'Popular',
    sizes: ['4-Pack'],
    category: 'accessories',
    svgType: 'koozie',
    desc: 'Set of 4 high-density neoprene can and bottle sleeves keeping your longnecks ice cold on the Notch porch.'
  }
];

class MerchStore {
  constructor() {
    this.items = MERCH_ITEMS;
    this.cart = [];
    this.selectedSizes = {};
  }

  init() {
    this.items.forEach(item => {
      this.selectedSizes[item.id] = item.sizes[0];
    });
    this.bindEvents();
    this.renderStore();
    this.renderCart();
  }

  bindEvents() {
    // Open Cart Drawer
    const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
    cartToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close Cart Drawer
    const closeBtn = document.getElementById('cartCloseBtn');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
    if (backdrop) backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeDrawer();
    });

    // Checkout button
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          if (window.showToast) window.showToast('⚠️ Your merch cart is currently empty.');
          return;
        }
        const total = this.getCartTotal();
        this.cart = [];
        this.renderCart();
        this.closeDrawer();
        if (window.showToast) {
          window.showToast(`🎉 Order reserved ($${total.toFixed(2)})! Pick up at the bar or check email for shipping confirmation.`);
        }
      });
    }
  }

  openDrawer() {
    const backdrop = document.getElementById('cartDrawerBackdrop');
    const drawer = document.getElementById('cartDrawer');
    if (backdrop && drawer) {
      backdrop.classList.add('active');
      drawer.classList.add('open');
    }
  }

  closeDrawer() {
    const backdrop = document.getElementById('cartDrawerBackdrop');
    const drawer = document.getElementById('cartDrawer');
    if (backdrop && drawer) {
      backdrop.classList.remove('active');
      drawer.classList.remove('open');
    }
  }

  selectSize(itemId, size) {
    this.selectedSizes[itemId] = size;
    const card = document.querySelector(`.merch-card[data-id="${itemId}"]`);
    if (card) {
      card.querySelectorAll('.size-pill').forEach(pill => {
        if (pill.getAttribute('data-size') === size) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }
  }

  addToCart(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const size = this.selectedSizes[itemId] || item.sizes[0];
    const existing = this.cart.find(c => c.id === itemId && c.size === size);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        id: item.id,
        title: item.title,
        price: item.price,
        size: size,
        quantity: 1,
        svgType: item.svgType
      });
    }

    this.renderCart();
    this.openDrawer();
    if (window.showToast) {
      window.showToast(`🛒 Added ${item.title} (${size}) to cart!`);
    }
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.renderCart();
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  renderStore() {
    const container = document.getElementById('merchGridContainer');
    if (!container) return;

    container.innerHTML = this.items.map(item => {
      const selectedSize = this.selectedSizes[item.id];
      return `
        <div class="merch-card" data-id="${item.id}">
          <div class="merch-thumb">
            <span class="merch-badge">${item.badge}</span>
            ${this.getMerchSvg(item.svgType)}
          </div>
          <div class="merch-info">
            <h4 class="merch-title">${item.title}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">${item.desc}</p>
            
            <div class="merch-size-select">
              ${item.sizes.map(s => `
                <button type="button" class="size-pill ${s === selectedSize ? 'active' : ''}" 
                  data-size="${s}" 
                  onclick="window.merchStore.selectSize('${item.id}', '${s}')">${s}</button>
              `).join('')}
            </div>

            <div class="merch-price-row">
              <span class="merch-price">$${item.price.toFixed(2)}</span>
            </div>

            <button type="button" class="btn-add-cart" onclick="window.merchStore.addToCart('${item.id}')">
              <i class="fas fa-shopping-bag"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderCart() {
    const countBadges = document.querySelectorAll('.cart-count-badge');
    const count = this.getCartCount();
    countBadges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });

    const itemsContainer = document.getElementById('cartItemsList');
    const totalVal = document.getElementById('cartTotalDisplay');

    if (totalVal) {
      totalVal.textContent = `$${this.getCartTotal().toFixed(2)}`;
    }

    if (!itemsContainer) return;

    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-msg">
          <i class="fas fa-shopping-bag" style="font-size: 2.5rem; color: var(--text-dim); margin-bottom: 12px; display: block;"></i>
          <p>Your roadhouse cart is empty.</p>
          <p style="font-size: 0.8rem; margin-top: 6px;">Grab a shirt, hoodie, or pint glass before the next show!</p>
        </div>
      `;
      return;
    }

    itemsContainer.innerHTML = this.cart.map((item, idx) => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">Size / Type: <strong>${item.size}</strong> • Qty: ${item.quantity}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <button class="cart-remove-btn" onclick="window.merchStore.removeFromCart(${idx})" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');
  }

  getMerchSvg(type) {
    if (type === 'tshirt') {
      return `
        <svg class="merch-svg-preview" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 15 L40 25 L60 25 L70 15 L90 28 L80 44 L72 38 L72 88 L28 88 L28 38 L20 44 L10 28 Z" fill="#1f1813" stroke="#f7a81b" stroke-width="2"/>
          <circle cx="50" cy="52" r="16" fill="#e6281e" opacity="0.8"/>
          <text x="50" y="50" fill="#fff" font-size="6" font-family="'Rye', serif" text-anchor="middle" font-weight="bold">NOTCH</text>
          <text x="50" y="58" fill="#f7a81b" font-size="5" font-family="monospace" text-anchor="middle">1939</text>
        </svg>
      `;
    }
    if (type === 'hoodie') {
      return `
        <svg class="merch-svg-preview" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 18 C38 12 62 12 68 18 L88 32 L78 48 L70 42 L70 90 L30 90 L30 42 L22 48 L12 32 Z" fill="#14110e" stroke="#e6281e" stroke-width="2"/>
          <path d="M42 22 C46 32 54 32 58 22" stroke="#f7a81b" stroke-width="2" fill="none"/>
          <rect x="38" y="60" width="24" height="18" rx="3" fill="#221a14" stroke="#f7a81b" stroke-width="1.5"/>
          <text x="50" y="48" fill="#fff" font-size="6" font-family="'Bebas Neue', sans-serif" text-anchor="middle">SURVIVOR 46</text>
        </svg>
      `;
    }
    if (type === 'cap') {
      return `
        <svg class="merch-svg-preview" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 55 C18 30 42 22 55 22 C70 22 82 32 82 55 Z" fill="#1c1611" stroke="#f7a81b" stroke-width="2"/>
          <path d="M15 55 L88 55 L96 68 L10 68 Z" fill="#140f0b" stroke="#e6281e" stroke-width="2"/>
          <rect x="36" y="34" width="28" height="14" rx="2" fill="#e6281e"/>
          <text x="50" y="44" fill="#fff" font-size="5" font-family="'Rye', serif" text-anchor="middle">GNI</text>
        </svg>
      `;
    }
    if (type === 'glass') {
      return `
        <svg class="merch-svg-preview" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 20 L72 20 L64 88 L36 88 Z" fill="rgba(247,168,27,0.15)" stroke="#00e5ff" stroke-width="2"/>
          <path d="M34 50 L66 50 L64 84 L36 84 Z" fill="rgba(247,168,27,0.6)"/>
          <text x="50" y="40" fill="#fff" font-size="6" font-family="'Bebas Neue', sans-serif" text-anchor="middle">GREAT NOTCH</text>
        </svg>
      `;
    }
    return `
      <svg class="merch-svg-preview" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,15 85,38 72,82 28,82 15,38" fill="#1c140e" stroke="#f7a81b" stroke-width="2.5"/>
        <text x="50" y="52" fill="#e6281e" font-size="8" font-family="'Rye', serif" text-anchor="middle">ROUTE 46</text>
        <text x="50" y="64" fill="#fff" font-size="5" font-family="monospace" text-anchor="middle">EST. 1939</text>
      </svg>
    `;
  }
}

// Attach globally
window.merchStore = new MerchStore();
