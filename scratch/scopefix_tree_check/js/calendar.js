/**
 * THE GREAT NOTCH INN — Live Music Calendar & Gig Finder
 * Features genre filtering, real-time search, .ics calendar export, and band spotlight modals.
 */

const GIG_DATA = [
  {
    id: 'gig-1',
    band: 'The Wild Bill Mojo Band',
    genre: 'blues',
    genreLabel: 'Electric Blues / Roots',
    date: '2026-08-23',
    displayDate: 'TONIGHT • AUG 23',
    dayOfWeek: 'Sunday',
    time: '8:30 PM - 12:00 AM',
    cover: 'NO COVER',
    isTonight: true,
    bio: 'North Jersey’s premier high-voltage blues & roots roadhouse powerhouse. Wild Bill and the crew bring searing Fender Stratocaster riffs, howling harmonica, and legendary swamp blues rhythms that shake the timber walls of Route 46.',
    members: 'Bill "Mojo" Callahan (Lead Guitar/Vocals), Bobby Keys (Harmonica), Sal Ragusa (Bass), Tony "Sticks" DeLuca (Drums)',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com'
  },
  {
    id: 'gig-2',
    band: 'Uptown Boogie Band',
    genre: 'rock',
    genreLabel: 'Classic & Southern Rock',
    date: '2026-08-27',
    displayDate: 'THU • AUG 27',
    dayOfWeek: 'Thursday',
    time: '9:00 PM - 1:00 AM',
    cover: 'NO COVER',
    isTonight: false,
    bio: 'Ripping guitar harmonies, Allman Brothers soul, Lynyrd Skynyrd anthems, and timeless classic rock grooves. Uptown Boogie has been rocking North Jersey roadhouses for over two decades with non-stop high-energy sets.',
    members: 'Richie Vance (Guitar/Vocals), Dave Miller (Slide Guitar), Chris Nolan (Keyboards), Marky B (Drums)',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gig-3',
    band: 'Dead End Blues Trio',
    genre: 'blues',
    genreLabel: 'Chicago & Delta Blues',
    date: '2026-08-28',
    displayDate: 'FRI • AUG 28',
    dayOfWeek: 'Friday',
    time: '9:30 PM - 1:30 AM',
    cover: 'NO COVER',
    isTonight: false,
    bio: 'Gritty, low-down Chicago blues in the vein of Muddy Waters, Buddy Guy, and Stevie Ray Vaughan. Pure raw tone, deep groove basslines, and unmatched slide guitar mastery.',
    members: 'Frankie "Slide" Torrez (Guitar), Leo King (Upright/Electric Bass), Jimmy "Groove" Boyd (Drums)',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gig-4',
    band: 'Route 46 All-Stars',
    genre: 'jamband',
    genreLabel: 'Grateful Jam & Southern Soul',
    date: '2026-08-29',
    displayDate: 'SAT • AUG 29',
    dayOfWeek: 'Saturday',
    time: '9:30 PM - 1:30 AM',
    cover: 'NO COVER',
    isTonight: false,
    bio: 'A legendary collective of veteran Jersey rock improvisers paying tribute to the Grateful Dead, The Band, Little Feat, and extensive exploratory jams that keep the roadhouse dancing all night.',
    members: 'Gerry Ross (Lead Guitar), Kenny Ward (Vocals/Acoustic), Danny "Hammond" Scott (Organ), Pete Rossi (Drums)',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gig-5',
    band: 'Sunday Throttle & Blues Jam',
    genre: 'acoustic',
    genreLabel: 'Open Blues Jam / Acoustic',
    date: '2026-08-30',
    displayDate: 'SUN • AUG 30',
    dayOfWeek: 'Sunday',
    time: '4:00 PM - 8:00 PM',
    cover: 'NO COVER',
    isTonight: false,
    bio: 'Our signature Sunday afternoon porch hang & motorcycle gathering! Hosted by Notch resident musicians. Amps & drum kit provided — bring your ax or harmonica and jump up on stage for the best open jam in the Garden State.',
    members: 'Host Band & Guest Musicians from all across the Tri-State',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gig-6',
    band: 'The Blue Sparks',
    genre: 'rock',
    genreLabel: 'Rockabilly & Vintage Rock',
    date: '2026-09-03',
    displayDate: 'THU • SEP 03',
    dayOfWeek: 'Thursday',
    time: '9:00 PM - 1:00 AM',
    cover: 'NO COVER',
    isTonight: false,
    bio: 'Slap-back echo, twangy Gretsch guitars, and driving stand-up bass. The Blue Sparks deliver vintage 1950s rockabilly, Sun Records hits, and stomping roadhouse swing.',
    members: 'Johnny Sparks (Vocals/Guitar), Billy "Slap" Higgins (Doghouse Bass), Ricky Ramone (Drums)',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gig-7',
    band: 'Jersey Shore Shakedown',
    genre: 'jamband',
    genreLabel: 'Soul / Funk & Rock',
    date: '2026-09-04',
    displayDate: 'FRI • SEP 04',
    dayOfWeek: 'Friday',
    time: '9:30 PM - 1:30 AM',
    cover: 'NO COVER',
    isTonight: false,
    bio: 'A 6-piece freight train of horn-driven soul, greasy funk rhythms, and soaring Southern rock solos. Get ready for a high-octane weekend kickoff.',
    members: 'Marcus Reed (Lead Vocals), Tommy Sax (Tenor Sax), Lou Bell (Trumpet), Greg Hall (Guitar), Ed Diaz (Drums)',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gig-8',
    band: 'Sweet Little Rockers',
    genre: 'rock',
    genreLabel: 'Classic 70s & 80s Rock',
    date: '2026-09-05',
    displayDate: 'SAT • SEP 05',
    dayOfWeek: 'Saturday',
    time: '9:30 PM - 1:30 AM',
    cover: 'NO COVER',
    isTonight: false,
    bio: 'AC/DC, Led Zeppelin, Aerosmith, Bad Company, and Tom Petty favorites performed with authentic vintage tube tone, grit, and crowd-singalong fervor.',
    members: 'Brett Harris (Vocals), Steve Novak (Lead Guitar), Carl Schmidt (Bass), Mick O’Connor (Drums)',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80'
  }
];

class GigCalendar {
  constructor() {
    this.gigs = GIG_DATA;
    this.activeGenre = 'all';
    this.searchQuery = '';
    this.currentView = 'grid'; // 'grid' or 'list'
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Genre Filter Buttons
    const genreBtns = document.querySelectorAll('.genre-btn');
    genreBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        genreBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeGenre = btn.getAttribute('data-genre');
        this.render();
      });
    });

    // Search Input
    const searchInput = document.getElementById('calendarSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // View Toggle Buttons
    const gridBtn = document.getElementById('viewGridBtn');
    const listBtn = document.getElementById('viewListBtn');

    if (gridBtn && listBtn) {
      gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        this.currentView = 'grid';
        this.render();
      });

      listBtn.addEventListener('click', () => {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        this.currentView = 'list';
        this.render();
      });
    }

    // Modal Close Trigger
    const modalBackdrop = document.getElementById('bandModal');
    const modalClose = document.getElementById('bandModalClose');
    if (modalClose && modalBackdrop) {
      modalClose.addEventListener('click', () => modalBackdrop.classList.remove('active'));
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
      });
    }
  }

  getFilteredGigs() {
    return this.gigs.filter(gig => {
      const matchesGenre = this.activeGenre === 'all' || gig.genre === this.activeGenre;
      const matchesSearch = !this.searchQuery || 
        gig.band.toLowerCase().includes(this.searchQuery) ||
        gig.genreLabel.toLowerCase().includes(this.searchQuery) ||
        gig.dayOfWeek.toLowerCase().includes(this.searchQuery);
      return matchesGenre && matchesSearch;
    });
  }

  render() {
    const container = document.getElementById('calendarDisplayContainer');
    if (!container) return;

    const filtered = this.getFilteredGigs();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-gold);">
          <i class="fas fa-guitar" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 16px; display: block;"></i>
          <h3 style="font-size: 1.8rem; color: #fff; margin-bottom: 8px;">No Gigs Found</h3>
          <p style="color: var(--text-muted);">Try selecting a different genre or clearing your search term.</p>
        </div>
      `;
      return;
    }

    if (this.currentView === 'grid') {
      container.innerHTML = `
        <div class="gig-grid">
          ${filtered.map(gig => this.renderGigCard(gig)).join('')}
        </div>
      `;
    } else {
      container.innerHTML = `
        <table class="gig-list-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Band / Act</th>
              <th>Genre</th>
              <th>Cover</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(gig => this.renderGigTableRow(gig)).join('')}
          </tbody>
        </table>
      `;
    }

    // Bind dynamic card buttons (spotlight modal & ical)
    this.bindCardActions();
  }

  renderGigCard(gig) {
    return `
      <div class="gig-card" data-id="${gig.id}">
        <div class="gig-card-header" style="background-image: url('${gig.image}');">
          <div class="gig-header-top">
            <span class="gig-date-badge">${gig.displayDate}</span>
            <span class="gig-time-badge"><i class="far fa-clock"></i> ${gig.time}</span>
          </div>
        </div>
        <div class="gig-card-body">
          <div class="genre-tag" style="width: fit-content;">${gig.genreLabel}</div>
          <h3 class="gig-band-title">${gig.band}</h3>
          <p class="gig-desc">${gig.bio}</p>
          <div class="gig-meta-row">
            <div class="gig-no-cover"><i class="fas fa-check-circle"></i> ${gig.cover}</div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-gold);">400 US-46 W</div>
          </div>
          <div class="gig-card-actions">
            <button class="btn-card btn-card-secondary btn-spotlight" data-id="${gig.id}">
              <i class="fas fa-info-circle"></i> Band Info
            </button>
            <button class="btn-card btn-card-primary btn-ical" data-id="${gig.id}">
              <i class="far fa-calendar-plus"></i> Add to Cal
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderGigTableRow(gig) {
    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--accent-gold);">${gig.displayDate}</div>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${gig.time}</div>
        </td>
        <td>
          <div style="font-size: 1.25rem; font-family: var(--font-display); color: #fff;">${gig.band}</div>
          <div style="font-size: 0.82rem; color: var(--text-dim);">${gig.members ? gig.members.split(',')[0] + ' & Crew' : ''}</div>
        </td>
        <td><span class="genre-tag">${gig.genreLabel}</span></td>
        <td><span class="gig-no-cover"><i class="fas fa-check-circle"></i> ${gig.cover}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn-card btn-card-secondary btn-spotlight" data-id="${gig.id}" style="padding: 6px 10px; font-size: 0.82rem;">Info</button>
            <button class="btn-card btn-card-primary btn-ical" data-id="${gig.id}" style="padding: 6px 10px; font-size: 0.82rem;"><i class="far fa-calendar-plus"></i></button>
          </div>
        </td>
      </tr>
    `;
  }

  bindCardActions() {
    // Spotlight Modal triggers
    document.querySelectorAll('.btn-spotlight').forEach(btn => {
      btn.addEventListener('click', () => {
        const gigId = btn.getAttribute('data-id');
        this.openSpotlightModal(gigId);
      });
    });

    // iCal Export triggers
    document.querySelectorAll('.btn-ical').forEach(btn => {
      btn.addEventListener('click', () => {
        const gigId = btn.getAttribute('data-id');
        this.exportICalendar(gigId);
      });
    });
  }

  openSpotlightModal(gigId) {
    const gig = this.gigs.find(g => g.id === gigId);
    if (!gig) return;

    const modalBackdrop = document.getElementById('bandModal');
    const modalContent = document.getElementById('bandModalContent');
    if (!modalBackdrop || !modalContent) return;

    modalContent.innerHTML = `
      <div style="position: relative; height: 220px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px; background: url('${gig.image}') center/cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(12, 10, 9, 0.95) 100%);"></div>
        <div style="position: absolute; bottom: 16px; left: 16px; right: 16px;">
          <span class="genre-tag" style="background: var(--accent-red); color: #fff; border: none;">${gig.genreLabel}</span>
          <h2 style="font-size: 2.2rem; color: #fff; margin-top: 6px;">${gig.band}</h2>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); padding: 12px 16px; border-radius: var(--radius-md); border-left: 3px solid var(--accent-gold);">
          <div>
            <div style="font-family: var(--font-display); font-size: 1.25rem; color: var(--accent-gold);">${gig.displayDate}</div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">${gig.time}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-green);">${gig.cover}</div>
            <div style="font-size: 0.78rem; color: var(--text-dim);">Must be 21+</div>
          </div>
        </div>

        <div>
          <h4 style="font-size: 1.1rem; color: var(--accent-gold); margin-bottom: 6px;">About The Band</h4>
          <p style="font-size: 0.95rem; line-height: 1.65; color: var(--text-muted);">${gig.bio}</p>
        </div>

        ${gig.members ? `
          <div>
            <h4 style="font-size: 1.1rem; color: var(--accent-gold); margin-bottom: 6px;">Lineup</h4>
            <p style="font-family: var(--font-mono); font-size: 0.84rem; color: var(--accent-cyan);">${gig.members}</p>
          </div>
        ` : ''}

        <div style="display: flex; gap: 12px; margin-top: 10px;">
          <button class="btn btn-primary" onclick="window.calendarApp.exportICalendar('${gig.id}')" style="flex: 1; padding: 12px;">
            <i class="far fa-calendar-plus"></i> Save to Calendar
          </button>
          <a href="https://maps.google.com/?q=The+Great+Notch+Inn+400+US-46+Woodland+Park+NJ" target="_blank" class="btn btn-secondary" style="flex: 1; padding: 12px;">
            <i class="fas fa-directions"></i> Get Directions
          </a>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');
  }

  exportICalendar(gigId) {
    const gig = this.gigs.find(g => g.id === gigId);
    if (!gig) return;

    const startDateStr = gig.date.replace(/-/g, '') + 'T210000';
    const endDateStr = gig.date.replace(/-/g, '') + 'T235900';

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//The Great Notch Inn//Live Music Gig Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${gig.id}-${Date.now()}@thegreatnotchinn.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startDateStr}`,
      `DTEND:${endDateStr}`,
      `SUMMARY:${gig.band} LIVE at The Great Notch Inn`,
      `DESCRIPTION:${gig.bio.replace(/\n/g, ' ')} - NO COVER CHARGE. 400 US Highway 46 W, Woodland Park / Little Falls, NJ.`,
      'LOCATION:The Great Notch Inn, 400 US-46, Woodland Park, NJ 07424',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${gig.band.replace(/\s+/g, '_')}_Great_Notch_Inn.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.showToast) {
      window.showToast(`📅 Calendar event created for ${gig.band}!`);
    }
  }
}

// Attach globally
window.calendarApp = new GigCalendar();
