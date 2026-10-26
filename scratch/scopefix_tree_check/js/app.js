/**
 * THE GREAT NOTCH INN — Main Interactive Engine
 * Est. 1939 • Little Falls / Woodland Park, NJ
 * Google Calendar Integration, Lightbox Gallery, Image Error Fallbacks & Event Modal
 */

// Fallback image map for local preview resilience
const FALLBACK_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
  stage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  biker: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
  wood: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
  merch: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
};

function handleImageError(image) {
  if (image.getAttribute('data-has-fallback')) {
    image.style.display = 'none';
    return;
  }
  image.setAttribute('data-has-fallback', 'true');
  
  const alt = (image.alt || '').toLowerCase();
  const src = (image.src || '').toLowerCase();

  if (src.includes('merch') || alt.includes('t-shirt') || alt.includes('beanie') || alt.includes('hat')) {
    image.src = FALLBACK_IMAGES.merch;
  } else if (alt.includes('bike') || alt.includes('motorcycle')) {
    image.src = FALLBACK_IMAGES.biker;
  } else if (src.includes('img_0742') || alt.includes('exterior')) {
    image.src = FALLBACK_IMAGES.hero;
  } else {
    image.src = FALLBACK_IMAGES.stage;
  }
  image.onerror = null;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('=== The Great Notch Inn App Initialized ===');

  // 1. Live Tonight Jump Button
  const liveTonightBtn = document.getElementById('liveTonightBtn');
  if (liveTonightBtn) {
    liveTonightBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const cal = document.querySelector('#calendar');
      if (cal) cal.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 2. Setup Lightbox
  setupLightbox();

  // 3. Setup Contact Form
  setupContactForm();

  // 4. Initialize Google Calendar API & Table
  initGoogleCalendar();
});

/* --------------------------------------------------------------------------
   Lightbox Gallery for Photos & Merch
   -------------------------------------------------------------------------- */
function setupLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  if (!lb || !lbImg) return;

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || 'Expanded Photo';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.removeAttribute('src');
  }

  function navLightbox(dir) {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    const target = currentGallery[currentIndex];
    lbImg.src = target.src;
    lbImg.alt = target.alt || 'Expanded Photo';
  }

  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.navLightbox = navLightbox;

  lb.addEventListener('click', function(e) {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navLightbox(1);
    if (e.key === 'ArrowLeft') navLightbox(-1);
  });

  // Attach click to all photos & merchandise images
  const allImages = Array.from(document.querySelectorAll('#photos .gallery img, #merchandise figure img'));
  allImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      currentGallery = allImages;
      currentIndex = currentGallery.findIndex(g => g.src === img.src);
      openLightbox(img.src, img.alt);
    });
  });
}

/* --------------------------------------------------------------------------
   Contact Form Handler (Mailto & Direct Client)
   -------------------------------------------------------------------------- */
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  const openMailBtn = document.getElementById('openMailBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = contactForm.name ? contactForm.name.value.trim() : '';
      const email = contactForm.email ? contactForm.email.value.trim() : '';
      const phone = contactForm.phone ? contactForm.phone.value.trim() : '';
      const message = contactForm.message ? contactForm.message.value.trim() : '';

      if (!name || !message) {
        alert('Please provide your name and message.');
        return;
      }

      const subject = encodeURIComponent('Inquiry from ' + name + ' — The Great Notch Inn');
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n\n' +
        'Message:\n' + message
      );

      window.location.href = 'mailto:greatnotchinn@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  if (openMailBtn) {
    openMailBtn.addEventListener('click', function() {
      window.location.href = 'mailto:greatnotchinn@gmail.com';
    });
  }
}

/* --------------------------------------------------------------------------
   Google Calendar API Fetcher & Table Generator
   -------------------------------------------------------------------------- */
function initGoogleCalendar() {
  const calendarId = encodeURIComponent('greatnotchinn@gmail.com');
  const apiKey = 'AIzaSyDXDA1_OaHw-OV3JQwdIT6RmV8yl3rNVvM';
  const CACHE_KEY = 'gni_calendar_cache_v3';
  const CACHE_TTL = 15 * 60 * 1000; // 15 mins

  const now = new Date();
  const todayStr = now.toDateString();

  const futureBody = document.querySelector('#future tbody');
  const pastBody = document.querySelector('#past tbody');
  const showMoreBtn = document.getElementById('showMoreBtn');
  const togglePastBtn = document.getElementById('togglePastBtn');
  const eventModal = document.getElementById('eventModal');

  let allFutureEvents = [];
  let displayedCount = 0;
  const INITIAL_EVENTS = 60;
  const MORE_EVENTS = 30;

  function getCache() {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return parsed.data;
    } catch {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }

  function setCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch(e) {}
  }

  function fetchEvents() {
    const pastStart = new Date();
    pastStart.setDate(pastStart.getDate() - 30);

    const futureUrl =
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
      `?key=${apiKey}&singleEvents=true&orderBy=startTime&timeMin=${now.toISOString()}&maxResults=250`;

    const pastUrl =
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
      `?key=${apiKey}&singleEvents=true&orderBy=startTime` +
      `&timeMin=${pastStart.toISOString()}&timeMax=${now.toISOString()}&maxResults=250`;

    Promise.all([fetch(futureUrl), fetch(pastUrl)])
      .then(responses => Promise.all(responses.map(res => {
        if (!res.ok) throw new Error(`API status ${res.status}`);
        return res.json();
      })))
      .then(([future, past]) => {
        const payload = {
          future: (future.items || []).filter(e => e.start && (e.start.dateTime || e.start.date)),
          past: (past.items || []).filter(e => e.start && (e.start.dateTime || e.start.date))
        };
        setCache(payload);
        renderEvents(payload);
      })
      .catch(err => {
        console.warn('Google Calendar API fetch error, using local fallback:', err);
        renderFallbackEvents();
      });
  }

  function renderFallbackEvents() {
    const fallbackList = [
      { summary: 'The Wild Bill Mojo Band', start: { dateTime: new Date(Date.now() + 2*3600000).toISOString() }, description: 'High-energy electric blues and roots rock at The Notch.', location: '400 US-46, Little Falls, NJ' },
      { summary: 'Uptown Boogie Band', start: { dateTime: new Date(Date.now() + 86400000 * 3).toISOString() }, description: 'Classic rock and Allman Brothers style southern grooves.', location: '400 US-46, Little Falls, NJ' },
      { summary: 'Dead End Blues Band', start: { dateTime: new Date(Date.now() + 86400000 * 5).toISOString() }, description: 'Chicago and Texas roadhouse blues.', location: '400 US-46, Little Falls, NJ' },
      { summary: 'Route 46 All-Stars', start: { dateTime: new Date(Date.now() + 86400000 * 6).toISOString() }, description: 'Grateful dead jams and classic rock favorites.', location: '400 US-46, Little Falls, NJ' },
      { summary: 'Sunday Throttle & Blues Jam', start: { dateTime: new Date(Date.now() + 86400000 * 7).toISOString() }, description: 'Open Sunday jam session on the porch.', location: '400 US-46, Little Falls, NJ' }
    ];
    renderEvents({ future: fallbackList, past: [] });
  }

  function renderEvents({ future, past }) {
    if (!futureBody) return;
    // Band nights only: skip all-day calendar entries (e.g. "Open 5pm to 2am" hours notes).
    future = future.filter(e => e.start && e.start.dateTime);
    past = past.filter(e => e.start && e.start.dateTime);
    allFutureEvents = future;
    displayedCount = 0;
    futureBody.innerHTML = '';
    if (pastBody) pastBody.innerHTML = '';

    if (!allFutureEvents.length) {
      futureBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px;">No upcoming events currently scheduled. Check the Google Calendar below!</td></tr>';
      if (showMoreBtn) showMoreBtn.style.display = 'none';
    } else {
      loadMoreEvents();
    }

    if (pastBody && past.length) {
      const recentPast = past
        .sort((a, b) => new Date(b.start.dateTime || b.start.date) - new Date(a.start.dateTime || a.start.date))
        .slice(0, 14);
      recentPast.forEach(e => renderRow(e, pastBody));
    }
  }

  function loadMoreEvents() {
    const eventsToLoad = displayedCount === 0 ? INITIAL_EVENTS : MORE_EVENTS;
    const nextBatch = allFutureEvents.slice(displayedCount, displayedCount + eventsToLoad);
    nextBatch.forEach(e => renderRow(e, futureBody));
    displayedCount += nextBatch.length;

    if (showMoreBtn) {
      showMoreBtn.style.display = displayedCount >= allFutureEvents.length ? 'none' : 'block';
    }
  }

  function renderRow(event, tbody) {
    const startTimeStr = event.start.dateTime || event.start.date;
    if (!startTimeStr) return;

    const start = new Date(startTimeStr);
    const date = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = event.start.dateTime
      ? start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : 'All Day';

    const tr = document.createElement('tr');
    const isToday = start.toDateString() === todayStr;

    const eventHTML = isToday
      ? `${escapeHTML(event.summary || 'Live Music')} <span class="live-badge">LIVE TONIGHT</span>`
      : `${escapeHTML(event.summary || 'Live Music')}`;

    tr.innerHTML = `<td><strong>${date}</strong></td><td>${eventHTML}</td><td><span style="color:var(--accent-yellow)">${time}</span></td>`;

    if (isToday) tr.classList.add('today');

    tr.onclick = function(e) {
      e.preventDefault();
      openEventModal(event);
    };

    tbody.appendChild(tr);
  }

  function openEventModal(event) {
    if (!eventModal) return;
    const startTimeStr = event.start.dateTime || event.start.date;
    const start = new Date(startTimeStr);
    const end = event.end && (event.end.dateTime || event.end.date) ? new Date(event.end.dateTime || event.end.date) : null;

    const dateStr = start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = event.start.dateTime
      ? start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) +
        (end ? ' – ' + end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '')
      : 'All Day';

    const titleEl = document.getElementById('modalTitle');
    const timeEl = document.getElementById('modalTime');
    const descEl = document.getElementById('modalDesc');
    const locEl = document.getElementById('modalLocation');
    const linkEl = document.getElementById('modalLink');

    if (titleEl) titleEl.textContent = event.summary || 'Live Music Performance';
    if (timeEl) timeEl.textContent = `${dateStr} • ${timeStr}`;
    if (descEl) descEl.textContent = event.description || 'Live rock & blues at The Great Notch Inn. No cover charge.';
    if (locEl) locEl.textContent = event.location ? `📍 ${event.location}` : '📍 The Great Notch Inn, 400 Route 46 West, Little Falls, NJ';
    if (linkEl) {
      linkEl.href = event.htmlLink || 'https://calendar.google.com/calendar/u/0/embed?src=greatnotchinn@gmail.com';
    }

    eventModal.classList.add('active');
    eventModal.setAttribute('aria-hidden', 'false');
  }

  function closeEventModal() {
    if (eventModal) {
      eventModal.classList.remove('active');
      eventModal.setAttribute('aria-hidden', 'true');
    }
  }

  function togglePast() {
    const p = document.getElementById('past-wrap');
    if (!p || !togglePastBtn) return;
    const open = p.style.display === 'none';
    p.style.display = open ? 'block' : 'none';
    togglePastBtn.textContent = open ? 'Hide Past Events ▲' : 'Show Past Events ▼';
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  window.openEventModal = openEventModal;
  window.closeEventModal = closeEventModal;
  window.togglePast = togglePast;

  if (eventModal) {
    eventModal.addEventListener('click', function(e) {
      if (e.target === eventModal) closeEventModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && eventModal && eventModal.classList.contains('active')) {
      closeEventModal();
    }
  });

  if (showMoreBtn) showMoreBtn.addEventListener('click', loadMoreEvents);
  if (togglePastBtn) togglePastBtn.addEventListener('click', togglePast);

  // Initialize
  const cached = getCache();
  if (cached) {
    renderEvents(cached);
  } else {
    fetchEvents();
  }
}
