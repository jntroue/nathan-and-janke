// ---------- Personalized invite via URL ----------
// Usage: yoursite.github.io/?to=Aunt+Sarah
(function () {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('to');
  if (name) {
    const el = document.getElementById('guest-name');
    if (el) el.textContent = decodeURIComponent(name.replace(/\+/g, ' '));
  }
})();

// ---------- RSVP link ----------
// Replace the URL below with your Google Form link once it's ready.
const RSVP_URL = "https://forms.gle/REPLACE_ME";
const rsvpLink = document.getElementById('rsvp-link');
if (rsvpLink) rsvpLink.href = RSVP_URL;

// ---------- Scroll-reveal animations ----------
(function () {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();
