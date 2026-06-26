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

/* ---------- Minimalist map (Leaflet + CartoDB Positron) ---------- */
(function () {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  const lat = -25.919595728515365;
  const lng = 28.452461696224077;
  let built = false;

  function buildMap() {
    if (built) return;
    built = true;

    const map = L.map(el, {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Soft highlighted area around the venue
    L.circle([lat, lng], {
      radius: 350,
      color: '#5F7355',
      weight: 1.5,
      opacity: 0.6,
      fillColor: '#9CAF88',
      fillOpacity: 0.18,
    }).addTo(map);

    // Simple on-brand pin (green) drawn as an SVG divIcon
    const pin = L.divIcon({
      className: 'venue-pin',
      html: '<svg viewBox="0 0 24 24" width="40" height="40" fill="#5F7355" stroke="#fff" stroke-width="1.2"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5" fill="#fff" stroke="none"/></svg>',
      iconSize: [40, 40],
      iconAnchor: [20, 38],
      popupAnchor: [0, -34],
    });

    const marker = L.marker([lat, lng], { icon: pin, title: 'Stofpad Skuur' }).addTo(map);

    // Permanent label that floats above the pin
    marker.bindTooltip('Stofpad Skuur', {
      permanent: true,
      direction: 'top',
      offset: [0, -36],
      className: 'venue-label',
    });

    // Richer popup on click
    marker.bindPopup(
      '<strong>Stofpad Skuur</strong><br><span class="popup-sub">Bashewa &middot; Pretoria East</span>'
    );

    // Critical: recalculate size once the container is actually rendered/visible.
    // Runs a few times to cover layout settling and reveal transitions.
    const fix = () => map.invalidateSize();
    requestAnimationFrame(fix);
    setTimeout(fix, 200);
    setTimeout(fix, 600);
    window.addEventListener('resize', fix);
  }

  // Build only once the section is on screen (it starts hidden / far down the page,
  // so building immediately would give Leaflet a zero-size container = blank map).
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          buildMap();
          io.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(el);
  } else {
    buildMap();
  }

  // Safety net: if it's already in view on load, or observer never fires, build after load.
  window.addEventListener('load', () => setTimeout(buildMap, 800));
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
