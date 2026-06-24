/* ============================================================
   Nathan & Janke — wedding site
   ============================================================ */

/* ---------- Personalized invite via URL ----------
   Usage: yoursite.github.io/?to=Aunt+Sarah                       */
(function () {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('to');
  if (name) {
    const el = document.getElementById('guest-name');
    if (el) el.textContent = decodeURIComponent(name.replace(/\+/g, ' '));
  }
})();

/* ---------- RSVP link ----------
   Replace the URL below with your Google Form link once it's ready. */
const RSVP_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdc5HSkGMcbARGIfoABw8hUQs6NV7SsPnCZ-sTf8C5I8g_UFA/viewform?usp=publish-editor";
const rsvpLink = document.getElementById('rsvp-link');
if (rsvpLink) rsvpLink.href = RSVP_URL;

/* ---------- Countdown ---------- */
(function () {
  // 27 March 2027, ceremony assumed early afternoon SAST (UTC+2)
  const target = new Date('2027-03-27T14:00:00+02:00').getTime();
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };
  const note = document.getElementById('countdown-note');
  if (!els.days) return;

  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = '00';
      if (note) note.textContent = 'Today we say "I do" 💍';
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent  = d;
    els.hours.textContent = pad(h);
    els.mins.textContent  = pad(m);
    els.secs.textContent  = pad(s);
  }
  tick();
  const timer = setInterval(tick, 1000);
})();

/* ---------- Nav: scrolled state + mobile toggle + smooth links ---------- */
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }
})();

/* ---------- Add to Calendar (.ics download) ---------- */
(function () {
  const btn = document.getElementById('add-to-calendar');
  if (!btn) return;

  // 27 March 2027, 14:00–22:00 SAST (UTC+2) -> stored in UTC
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nathan & Janke//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:nathan-janke-wedding-2027@stofpadskuur',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20270327T120000Z',
    'DTEND:20270327T200000Z',
    'SUMMARY:Nathan & Janke\'s Wedding',
    'DESCRIPTION:Join us to celebrate at our Bring & Braai wedding! Bring your own braai food and drinks. Smart & formal dress.',
    'LOCATION:Stofpad Skuur, Portion 32 Farm Rietfontein, Garsfontein Rd, Bashewa, 0084',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  btn.addEventListener('click', () => {
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Nathan-and-Janke-Wedding.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();

/* ---------- Scroll-reveal animations ---------- */
(function () {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
