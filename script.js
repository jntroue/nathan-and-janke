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

    // Simple on-brand pin (green) drawn as an SVG divIcon.
    // viewBox is 24 wide; tip is at x=12 (center), y≈22 -> at 40px that's (20, 36.7).
    const pin = L.divIcon({
      className: 'venue-pin',
      html: '<svg viewBox="0 0 24 24" width="40" height="40" fill="#5F7355" stroke="#fff" stroke-width="1.2"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5" fill="#fff" stroke="none"/></svg>',
      iconSize: [40, 40],
      iconAnchor: [20, 37],
      popupAnchor: [0, -34],
      tooltipAnchor: [0, -34],
    });

    const marker = L.marker([lat, lng], { icon: pin, title: 'Stofpad Skuur' }).addTo(map);

    // Permanent label that floats above the pin
    marker.bindTooltip('Stofpad Skuur', {
      permanent: true,
      direction: 'top',
      offset: [0, 0],
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


/* ---------- Animated schedule timeline ---------- */
(function () {
  const timeline = document.getElementById('timeline');
  const fill = document.getElementById('spineFill');
  const traveler = document.getElementById('traveler');
  if (!timeline || !fill || !traveler) return;

  const rows = Array.from(timeline.querySelectorAll('.tl-row'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: just reveal everything, no scroll choreography.
  if (reduce) {
    rows.forEach(r => r.classList.add('reached'));
    timeline.classList.add('active');
    fill.style.height = '100%';
    traveler.style.display = 'none';
    return;
  }

  let ticking = false;

  const SPARKLE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 7.2L22 9.6l-6 4.4 2.3 7.6L12 17.4 5.7 21.6 8 14 2 9.6l7.6-2.4z"/></svg>';

  function burstSparkles(host, count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.innerHTML = SPARKLE_SVG;
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 26 + Math.random() * 30;
      s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      s.style.setProperty('--rot', (Math.random() * 360) + 'deg');
      const size = 7 + Math.random() * 7;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.animationDelay = (Math.random() * 0.12) + 's';
      host.appendChild(s);
      setTimeout(() => s.remove(), 1100);
    }
  }

  function update() {
    ticking = false;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;

    // progress 0..1 as the timeline passes a "trigger line" ~55% down the viewport
    const triggerY = vh * 0.55;
    const total = rect.height;
    let progressPx = triggerY - rect.top;
    progressPx = Math.max(0, Math.min(total, progressPx));
    const pct = total > 0 ? progressPx / total : 0;

    // grow the fill + move the ring
    fill.style.height = (pct * 100) + '%';
    traveler.style.top = progressPx + 'px';

    // show traveler only while the section is engaged
    if (rect.top < vh && rect.bottom > 0 && pct > 0 && pct < 1) {
      timeline.classList.add('active');
    } else {
      timeline.classList.remove('active');
    }

    // bloom each node once it comes into view (more forgiving than requiring
    // the traveler to physically reach it — avoids blank cards on deep-link/landing)
    rows.forEach((row) => {
      const node = row.querySelector('.tl-node');
      const nodeTop = node.getBoundingClientRect().top;
      if (nodeTop < vh * 0.85 && !row.classList.contains('reached')) {
        row.classList.add('reached');
        burstSparkles(node, row.classList.contains('tl-ido') ? 16 : 9);
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();

  // gentle recurring gold sparkle on the "exact times" pill while it's visible
  const tbc = document.getElementById('scheduleTbc');
  if (tbc) {
    tbc.style.overflow = 'visible';
    let tbcStarted = false;
    const tbcSparkle = () => {
      const r = tbc.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        // emit 1-2 sparkles from a random point along the pill
        const n = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < n; i++) {
          const s = document.createElement('span');
          s.className = 'sparkle';
          s.innerHTML = SPARKLE_SVG;
          s.style.left = (15 + Math.random() * 70) + '%';
          s.style.top = (Math.random() < 0.5 ? 10 : 80) + '%';
          const ang = (Math.random() - 0.5) * Math.PI - Math.PI / 2;
          const dist = 16 + Math.random() * 18;
          s.style.setProperty('--tx', Math.cos(ang) * dist + 'px');
          s.style.setProperty('--ty', Math.sin(ang) * dist + 'px');
          s.style.setProperty('--rot', (Math.random() * 360) + 'deg');
          const size = 6 + Math.random() * 6;
          s.style.width = size + 'px'; s.style.height = size + 'px';
          tbc.appendChild(s);
          setTimeout(() => s.remove(), 1000);
        }
      }
    };
    setInterval(tbcSparkle, 900);
  }
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
