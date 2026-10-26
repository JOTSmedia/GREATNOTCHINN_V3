/**
 * THE GREAT NOTCH INN — Booking & Contact Form Handlers
 * Handles band gig submissions, private event reservations, and newsletter signups.
 */

class BookingManager {
  init() {
    this.bindBandBookingForm();
    this.bindGeneralContactForm();
    this.bindNewsletterForm();
  }

  bindBandBookingForm() {
    const form = document.getElementById('bandBookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const bandName = document.getElementById('bookBandName')?.value.trim();
      const genre = document.getElementById('bookGenre')?.value;
      const contactName = document.getElementById('bookContactName')?.value.trim();
      const email = document.getElementById('bookEmail')?.value.trim();
      const epkLink = document.getElementById('bookEpkLink')?.value.trim();
      const dates = document.getElementById('bookDates')?.value.trim();

      if (!bandName || !email || !epkLink) {
        if (window.showToast) window.showToast('⚠️ Please fill in all required fields (Band Name, Email, EPK/Audio Link).');
        return;
      }

      // Simulate successful submission
      form.reset();
      if (window.showToast) {
        window.showToast(`🎸 Rock on! Gig inquiry for "${bandName}" received. Rich & the booking team will review your audio and reach out!`);
      }
    });
  }

  bindGeneralContactForm() {
    const form = document.getElementById('generalContactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !message) {
        if (window.showToast) window.showToast('⚠️ Please fill out your name, email, and message.');
        return;
      }

      form.reset();
      if (window.showToast) {
        window.showToast(`✉️ Thanks ${name}! Your message has been sent to The Great Notch Inn team.`);
      }
    });
  }

  bindNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail')?.value.trim();
      if (!email) return;

      form.reset();
      if (window.showToast) {
        window.showToast('🔥 Welcome to The Notch VIP Rocker Club! Weekly lineups sent straight to your inbox.');
      }
    });
  }
}

// Attach globally
window.bookingManager = new BookingManager();
