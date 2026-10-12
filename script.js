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

/* ---------- RSVP settings ----------
   RSVP_ENDPOINT: the Google Apps Script "Web app" URL (ends in /exec) that saves
   replies to the RSVP sheet. See README.md > "RSVP form".
   RSVP_URL: the old Google Form. Used as the fallback if RSVP_ENDPOINT is empty
   or the pop-up form can't reach the sheet.                                    */
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbzGHKY4rmf1G20rGvw77UxUc_KXtFoBRdCH144koVrX-UcFSOtw-BvB2sYmOba0q5wp/exec";
const RSVP_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdc5HSkGMcbARGIfoABw8hUQs6NV7SsPnCZ-sTf8C5I8g_UFA/viewform?usp=publish-editor";
const rsvpLink = document.getElementById('rsvp-link');
if (rsvpLink) rsvpLink.href = RSVP_URL;

/* ---------- Countdown ---------- */
(function () {
  // 27 March 2027, late-morning ceremony, SAST (UTC+2).
  // Update this once the exact time is confirmed.
  const target = new Date('2027-03-27T11:00:00+02:00').getTime();
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

  // All-day entry for 27 March 2027 (exact times aren't published yet;
  // swap in DTSTART/DTEND with times once they're confirmed)
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nathan & Janke//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:nathan-janke-wedding-2027@stofpadskuur',
    'DTSTAMP:20260101T000000Z',
    'DTSTART;VALUE=DATE:20270327',
    'DTEND;VALUE=DATE:20270328',
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

/* ---------- Shared: motion preference + sparkle bursts ---------- */
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPARKLE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 7.2L22 9.6l-6 4.4 2.3 7.6L12 17.4 5.7 21.6 8 14 2 9.6l7.6-2.4z"/></svg>';
const HEART_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5.2-8-11.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8C20 15.8 12 21 12 21z"/></svg>';

// Throws `count` little shapes outward from a point inside `host`
// (host needs to be positioned; x / y default to its centre).
function burst(host, count, opts) {
  opts = opts || {};
  const colors = opts.colors || null;
  const minSize = opts.size || 7;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.innerHTML = opts.svg || SPARKLE_SVG;
    if (colors) s.style.color = colors[i % colors.length];
    if (opts.x) s.style.left = opts.x;
    if (opts.y) s.style.top = opts.y;
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const dist = (opts.dist || 26) + Math.random() * (opts.spread || 30);
    s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    s.style.setProperty('--rot', (Math.random() * 360) + 'deg');
    const size = minSize + Math.random() * minSize;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.animationDelay = (Math.random() * 0.12) + 's';
    host.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

/* ---------- Map (Leaflet) ----------
   Tiles come from OpenStreetMap (street map) and Esri (satellite).
   Neither needs an account or an API key.                          */
(function () {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  const wrap = el.parentElement;
  const toggles = Array.from(wrap.querySelectorAll('.map-toggle button'));
  const lat = -25.919595728515365;
  const lng = 28.452461696224077;
  let built = false;

  function buildMap() {
    if (built) return;
    built = true;

    const map = L.map(el, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    const layers = {
      map: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
        maxNativeZoom: 17,
        maxZoom: 19,
      }),
    };
    let current = null;

    function show(name) {
      if (name === current || !layers[name]) return;
      if (current) map.removeLayer(layers[current]);
      layers[name].addTo(map);
      current = name;
      wrap.classList.toggle('map-style-map', name === 'map');
      toggles.forEach((b) => {
        const on = b.dataset.layer === name;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
    }
    toggles.forEach((b) => b.addEventListener('click', () => show(b.dataset.layer)));

    // If the street map ever stops loading, fall back to satellite rather than a blank box.
    let streetLoaded = false, streetErrors = 0;
    layers.map.on('tileload', () => { streetLoaded = true; });
    layers.map.on('tileerror', () => {
      if (!streetLoaded && ++streetErrors >= 4 && current === 'map') show('satellite');
    });

    show('map');

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


/* ---------- Details: the wedding ring that hops from card to card ---------- */
(function () {
  const grid = document.getElementById('detailGrid');
  const ring = document.getElementById('detailRing');
  if (!grid || !ring) return;

  const inner = ring.querySelector('.detail-ring-inner');
  const cards = Array.from(grid.querySelectorAll('.detail'));
  if (REDUCE_MOTION || !ring.animate || !('IntersectionObserver' in window) || !cards.length) {
    ring.remove();
    return;
  }

  // centre of the band inside the ring's 76x88 box, and how far an active card lifts
  const RING_CX = 38, RING_CY = 50, LIFT = 4;
  let current = -1;       // card the ring is on (or heading to)
  let hopToken = 0;
  let inView = false;
  let holdUntil = 0;      // auto-hopping pauses while a guest is exploring

  function spot(i) {
    const card = cards[i];
    const icon = card.querySelector('.detail-icon');
    return {
      x: card.offsetLeft + card.clientLeft + icon.offsetLeft + icon.offsetWidth / 2 - RING_CX,
      y: card.offsetTop + card.clientTop + icon.offsetTop + icon.offsetHeight / 2 - RING_CY - LIFT,
    };
  }
  const place = (pt) => { ring.style.transform = 'translate(' + pt.x + 'px,' + pt.y + 'px)'; };

  function hopTo(i) {
    if (i === current) return;
    const to = spot(i);
    let from;
    if (current < 0) {
      from = { x: to.x, y: to.y - 70 };                 // first appearance: drops in from above
    } else {
      const m = new DOMMatrixReadOnly(getComputedStyle(ring).transform);
      from = { x: m.m41, y: m.m42 };                    // wherever it is right now, even mid-hop
    }
    current = i;
    const token = ++hopToken;
    ring.getAnimations().concat(inner.getAnimations()).forEach((a) => a.cancel());
    cards.forEach((c) => c.classList.remove('is-active'));

    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const duration = Math.max(520, Math.min(950, 420 + dist * 0.9));
    const height = Math.max(46, Math.min(120, 34 + dist * 0.22));

    place(to);
    const travel = ring.animate(
      [{ transform: 'translate(' + from.x + 'px,' + from.y + 'px)' },
       { transform: 'translate(' + to.x + 'px,' + to.y + 'px)' }],
      { duration: duration, easing: 'cubic-bezier(.4,0,.6,1)' }
    );
    inner.animate(
      [{ transform: 'translateY(0) rotateY(0deg) scale(1,1)', easing: 'cubic-bezier(.2,.7,.4,1)' },
       { transform: 'translateY(' + (-height) + 'px) rotateY(180deg) scale(1,1)', offset: 0.5, easing: 'cubic-bezier(.6,0,.8,.3)' },
       { transform: 'translateY(0) rotateY(360deg) scale(1,1)', offset: 0.9 },
       { transform: 'translateY(2px) rotateY(360deg) scale(1.1,.9)', offset: 0.95 },
       { transform: 'translateY(0) rotateY(360deg) scale(1,1)' }],
      { duration: duration }
    );
    travel.onfinish = () => {
      if (token !== hopToken) return;
      cards[i].classList.add('is-active');
      burst(ring, 8, { y: '57%' });
    };
  }

  cards.forEach((card, i) => {
    const explore = () => { holdUntil = Date.now() + 6000; hopTo(i); };
    card.addEventListener('pointerenter', explore);
    card.addEventListener('focusin', explore);
  });

  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView && current < 0) {
      ring.classList.add('on');
      hopTo(0);
    }
  }, { threshold: 0.25 }).observe(grid);

  setInterval(() => {
    if (!inView || document.hidden || Date.now() < holdUntil || current < 0) return;
    hopTo((current + 1) % cards.length);
  }, 3400);

  // keep the ring on its card when the layout changes
  const settle = () => {
    if (current < 0 || ring.getAnimations().length) return;
    place(spot(current));
  };
  if ('ResizeObserver' in window) new ResizeObserver(settle).observe(grid);
  else window.addEventListener('resize', settle);
})();


/* ---------- Schedule: the sun crosses the sky as the day unfolds ----------
   Stops 0-4 match the five .day-step cards in index.html:
   morning arrival, ceremony, photos, afternoon braai, night.
   Adding or removing a card means adding or removing a stop in PATH and KEYS. */
(function () {
  const day = document.getElementById('day');
  const sky = document.getElementById('daySky');
  const stepsEl = document.getElementById('daySteps');
  if (!day || !sky || !stepsEl) return;

  const steps = Array.from(stepsEl.querySelectorAll('.day-step'));
  const sun = document.getElementById('skySun');
  const moon = document.getElementById('skyMoon');
  const pill = document.getElementById('skyPill');
  const arc = document.getElementById('skyArc');
  const starsEl = document.getElementById('skyStars');
  const COUNT = steps.length;
  const LAST = COUNT - 1;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const smooth = (v) => { v = clamp(v, 0, 1); return v * v * (3 - 2 * v); };

  // The sun's path, in % of the sky box. Entries 2..6 are the five stops (each sits
  // above its card); the rest only shape the curve as it comes up from / drops below the horizon.
  const PATH = [[-30, 126], [-10, 90], [10, 48], [30, 23], [50, 15], [70, 40], [90, 98], [110, 140]];
  function sunAt(p) {
    const c = clamp(p, -1, LAST);
    const i = Math.min(LAST - 1, Math.floor(c));
    const t = c - i;
    const p0 = PATH[i + 1], p1 = PATH[i + 2], p2 = PATH[i + 3], p3 = PATH[i + 4];
    const at = (k) => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t +
      (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t +
      (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t);
    return [at(0), at(1)];
  }

  // Colours at each stop; everything in between is blended.
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const KEYS = [
    // morning: soft and fresh, a little warmth on the horizon
    { top: '#C2D3D4', mid: '#E3E9DD', btm: '#F8ECDA', far: '#AEBF9E', near: '#84997A', sil: '#536649', sun: '#F6E3A4' },
    // late morning: the ceremony
    { top: '#B7CED3', mid: '#DAE6DE', btm: '#F3F0E1', far: '#ABBC9A', near: '#809675', sil: '#516448', sun: '#F5DF98' },
    // midday: photos under the clearest, brightest sky
    { top: '#AECAD3', mid: '#D2E3E0', btm: '#EEF2E6', far: '#A9BA98', near: '#7E9470', sil: '#4F6247', sun: '#F4DC8C' },
    // mid to late afternoon: warm gold
    { top: '#BDB28F', mid: '#E8C987', btm: '#F3CD98', far: '#A39763', near: '#70724A', sil: '#414232', sun: '#EFAE5C' },
    // night
    { top: '#23272D', mid: '#343A43', btm: '#4A4F58', far: '#2C3136', near: '#23272B', sil: '#16191C', sun: '#E58B4E' },
  ].map((k) => { const o = {}; Object.keys(k).forEach((n) => { o[n] = hex(k[n]); }); return o; });

  if (PATH.length !== COUNT + 3 || KEYS.length !== COUNT) return;   // scene and cards must match
  const STOP_W = 100 / COUNT;                 // each stop's share of the sky's width, in %

  let W = 0, H = 0;
  function render(p) {
    const c = clamp(p, 0, LAST);
    const i = Math.min(LAST - 1, Math.floor(c));
    const t = c - i;
    const mix = (n) => KEYS[i][n].map((v, k) => Math.round(v + (KEYS[i + 1][n][k] - v) * t)).join(',');
    const st = sky.style;

    st.background = 'linear-gradient(rgb(' + mix('top') + '),rgb(' + mix('mid') + ') 55%,rgb(' + mix('btm') + '))';
    st.setProperty('--hill-far', 'rgb(' + mix('far') + ')');
    st.setProperty('--hill-near', 'rgb(' + mix('near') + ')');
    st.setProperty('--sil', 'rgb(' + mix('sil') + ')');
    st.setProperty('--sun-rgb', mix('sun'));

    const night = smooth((c - (LAST - 0.85)) / 0.7);
    st.setProperty('--stars-o', night.toFixed(3));
    st.setProperty('--lights-o', smooth((c - (LAST - 0.8)) / 0.6).toFixed(3));
    st.setProperty('--cloud-o', (0.85 - 0.72 * night).toFixed(3));
    st.setProperty('--fire-o', smooth((c - (LAST - 1.5)) / 0.5).toFixed(3));
    st.setProperty('--arch-o', (0.25 + 0.65 * Math.max(0, 1 - Math.abs(c - 1) / 0.8)).toFixed(3));
    st.setProperty('--win', night > 0.02
      ? 'rgba(248,222,150,' + (0.3 + 0.65 * night).toFixed(3) + ')'
      : 'rgba(251,250,246,.3)');
    const dark = c > LAST - 0.55;
    st.setProperty('--sky-ink', dark ? '#F7F8F3' : '#3A3F45');
    st.setProperty('--pill-bg', dark ? 'rgba(58,63,69,.55)' : 'rgba(251,250,246,.72)');

    const s = sunAt(p);
    sun.style.transform = 'translate(' + (s[0] / 100 * W).toFixed(1) + 'px,' + (s[1] / 100 * H).toFixed(1) + 'px)';
    sun.style.opacity = (1 - 0.5 * night).toFixed(3);
    const rise = smooth((c - (LAST - 0.75)) / 0.6);
    moon.style.transform = 'translate(' + ((LAST + 0.5) * STOP_W / 100 * W).toFixed(1) + 'px,' + ((46 - 22 * rise) / 100 * H).toFixed(1) + 'px)';
    moon.style.opacity = rise.toFixed(3);
  }

  // ---- one-off setup: dotted path, stars ----
  let d = '';
  for (let q = -1; q <= LAST + 0.001; q += 0.05) {
    const pt = sunAt(q);
    d += (d ? 'L' : 'M') + pt[0].toFixed(2) + ' ' + pt[1].toFixed(2);
  }
  arc.setAttribute('d', d);

  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let n = 0; n < 28; n++) {
    const star = document.createElement('i');
    const size = 1.5 + rand() * 1.8;
    star.style.cssText = 'left:' + (2 + rand() * 96).toFixed(1) + '%;top:' + (4 + rand() * 52).toFixed(1) +
      '%;width:' + size.toFixed(1) + 'px;height:' + size.toFixed(1) + 'px;animation-delay:-' + (rand() * 3).toFixed(2) + 's';
    starsEl.appendChild(star);
  }

  day.classList.add('day--ready');

  // ---- state + easing toward the target position ----
  const stacked = window.matchMedia('(max-width:640px)');
  let p = 0, target = 0, active = -1;
  let raf = 0, lastFrame = 0, dragging = false;
  let inView = false, lastTouch = 0;

  function frame(now) {
    const dt = Math.min(64, now - lastFrame);
    lastFrame = now;
    p += (target - p) * (1 - Math.exp(-dt / (dragging ? 70 : 240)));
    if (Math.abs(target - p) < 0.0015) { p = target; raf = 0; }
    else raf = requestAnimationFrame(frame);
    render(p);
  }
  function kick() {
    if (REDUCE_MOTION) { p = target; render(p); return; }
    if (!raf) { lastFrame = performance.now(); raf = requestAnimationFrame(frame); }
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    steps.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
    });
    const label = steps[i].querySelector('.day-time');
    if (label) pill.textContent = label.textContent;
    if (i === 1 && !REDUCE_MOTION) {
      setTimeout(() => { if (active === 1) burst(sun, 12, { dist: 30 }); }, 500);
    }
  }
  function goTo(i, byGuest) {
    target = i;
    setActive(i);
    kick();
    if (byGuest) { lastTouch = Date.now(); day.classList.add('touched'); }
  }

  // ---- cards: hover / tap / focus / arrow keys ----
  steps.forEach((step, i) => {
    step.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' && !stacked.matches) goTo(i, true);
    });
    step.addEventListener('click', () => { if (!stacked.matches) goTo(i, true); });
    step.addEventListener('focus', () => { if (!stacked.matches) goTo(i, true); });
    step.addEventListener('keydown', (e) => {
      const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1
                 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : -1;
      if (next < 0 || next > LAST) return;
      e.preventDefault();
      steps[next].focus();
    });
  });

  // ---- the sky: click a spot, or drag the sun across ----
  function scrub(clientX) {
    const r = sky.getBoundingClientRect();
    target = clamp(((clientX - r.left) / r.width * 100 - STOP_W / 2) / STOP_W, 0, LAST);
    setActive(Math.round(target));
    lastTouch = Date.now();
    day.classList.add('touched');
    kick();
  }
  sky.addEventListener('pointerdown', (e) => {
    if (stacked.matches) return;
    dragging = true;
    sky.classList.add('dragging');
    if (sky.setPointerCapture) sky.setPointerCapture(e.pointerId);
    scrub(e.clientX);
  });
  sky.addEventListener('pointermove', (e) => { if (dragging) scrub(e.clientX); });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    sky.classList.remove('dragging');
    goTo(Math.round(target), true);      // settle on the nearest moment
  };
  sky.addEventListener('pointerup', release);
  sky.addEventListener('pointercancel', release);

  // ---- phones: the sky is pinned and the sun follows the scroll ----
  let scrollQueued = false;
  function followScroll() {
    scrollQueued = false;
    if (!stacked.matches) return;
    const r = sky.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < -vh || r.top > vh * 2) return;
    const line = r.bottom + (vh - r.bottom) * 0.42;
    const mids = steps.map((s) => { const b = s.getBoundingClientRect(); return b.top + b.height / 2; });
    let v = LAST;
    if (line <= mids[0]) v = 0;
    else {
      for (let k = 0; k < LAST; k++) {
        if (line < mids[k + 1]) { v = k + (line - mids[k]) / (mids[k + 1] - mids[k]); break; }
      }
    }
    target = v;
    setActive(Math.round(v));
    if (v > 0.4) day.classList.add('touched');
    kick();
  }
  const queueScroll = () => {
    if (scrollQueued || !stacked.matches) return;
    scrollQueued = true;
    requestAnimationFrame(followScroll);
  };
  window.addEventListener('scroll', queueScroll, { passive: true });

  // ---- sizing + mode changes ----
  function measure() {
    W = sky.clientWidth;
    H = sky.clientHeight;
    render(p);
    if (stacked.matches) followScroll();
  }
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(sky);
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  const modeChanged = () => { if (stacked.matches) followScroll(); else goTo(Math.round(target), false); };
  if (stacked.addEventListener) stacked.addEventListener('change', modeChanged);

  measure();
  goTo(0, false);

  // ---- gentle autoplay on larger screens until a guest takes over ----
  if (!REDUCE_MOTION && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; }, { threshold: 0.35 }).observe(day);
    setInterval(() => {
      if (!inView || stacked.matches || dragging || document.hidden) return;
      if (Date.now() - lastTouch < 9000) return;
      goTo((active + 1) % (LAST + 1), false);
    }, 4200);
  }

  // gentle recurring gold sparkle on the "exact times" pill while it's visible
  const tbc = document.getElementById('scheduleTbc');
  if (tbc && !REDUCE_MOTION) {
    tbc.style.overflow = 'visible';
    setInterval(() => {
      const r = tbc.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.92 || r.bottom < 0 || document.hidden) return;
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
    }, 900);
  }
})();


/* ---------- Dress code: the little bride & groom jump for joy ---------- */
(function () {
  const fig = document.getElementById('dressFigure');
  if (!fig || REDUCE_MOTION) return;
  let busy = false;

  function cheer() {
    if (busy) return;
    busy = true;
    fig.classList.add('cheer');
    burst(fig, 14, {
      svg: HEART_SVG, colors: ['#E9A9A0', '#E8CE84', '#9CAF88'],
      x: '51%', y: '36%', dist: 44, spread: 60, size: 10,
    });
    setTimeout(() => { fig.classList.remove('cheer'); busy = false; }, 1100);
  }
  fig.addEventListener('click', cheer);
  fig.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') cheer(); });
})();


/* ---------- RSVP pop-up form ---------- */
(function () {
  const dialog = document.getElementById('rsvpDialog');
  const form = document.getElementById('rsvpForm');
  if (!dialog || !form || !rsvpLink) return;
  // No sheet connected (or a very old browser): the button keeps opening the Google Form.
  if (!RSVP_ENDPOINT || typeof dialog.showModal !== 'function' || !window.fetch) return;

  const formView = document.getElementById('rsvpFormView');
  const doneView = document.getElementById('rsvpDoneView');
  const nameInput = document.getElementById('rsvpName');
  const messageInput = document.getElementById('rsvpMessage');
  const known = document.getElementById('rsvpKnown');
  const error = document.getElementById('rsvpError');
  const send = document.getElementById('rsvpSend');
  const doneTitle = document.getElementById('rsvpDoneTitle');
  const doneText = document.getElementById('rsvpDoneText');
  const note = document.getElementById('rsvp-note');
  const STORE = 'nj-rsvp';

  // Remembers the reply on this device so a guest can see / change it later.
  const saved = () => { try { return JSON.parse(localStorage.getItem(STORE)) || null; } catch (e) { return null; } };
  const remember = (reply) => { try { localStorage.setItem(STORE, JSON.stringify(reply)); } catch (e) { /* private mode */ } };

  // text/plain keeps this a "simple" request, which Apps Script web apps accept cross-site.
  function post(payload) {
    return fetch(RSVP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }

  // Has someone already replied under this name? (the sheet only answers yes or no)
  let checkToken = 0;
  function checkName() {
    const name = nameInput.value.trim();
    const token = ++checkToken;
    if (name.length < 2) { known.hidden = true; return; }
    post({ action: 'check', name: name })
      .then((r) => { if (token === checkToken) known.hidden = !(r && r.found); })
      .catch(() => { /* the check is a nicety; sending still works without it */ });
  }
  nameInput.addEventListener('change', checkName);
  nameInput.addEventListener('input', () => { checkToken++; known.hidden = true; });

  function showNote() {
    const reply = saved();
    if (!note || !reply) return;
    note.textContent = reply.attending === 'yes'
      ? "You've replied from this device: you're coming. Tap the button if anything changes."
      : "You've replied from this device: you can't make it. Tap the button if anything changes.";
  }
  showNote();

  function open(e) {
    e.preventDefault();
    formView.hidden = false;
    doneView.hidden = true;
    error.hidden = true;
    const reply = saved();
    if (!nameInput.value) {
      const invited = new URLSearchParams(window.location.search).get('to');
      nameInput.value = (reply && reply.name) || (invited ? invited.replace(/\+/g, ' ').trim() : '');
    }
    if (reply && !form.querySelector('input[name="attending"]:checked')) {
      const pick = form.querySelector('input[name="attending"][value="' + reply.attending + '"]');
      if (pick) pick.checked = true;
    }
    dialog.showModal();
    if (nameInput.value) checkName();
    else nameInput.focus();
  }
  rsvpLink.addEventListener('click', open);

  const close = () => dialog.close();
  document.getElementById('rsvpClose').addEventListener('click', close);
  document.getElementById('rsvpDoneClose').addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });   // click on the dimmed backdrop

  function fail(html) {
    error.innerHTML = html;
    error.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.hidden = true;
    const name = nameInput.value.replace(/\s+/g, ' ').trim();
    const picked = form.querySelector('input[name="attending"]:checked');
    if (name.length < 2) { fail('Please add your name.'); nameInput.focus(); return; }
    if (!picked) { fail("Please let us know whether you can make it."); return; }

    const finish = (updated) => {
      const yes = picked.value === 'yes';
      remember({ name: name, attending: picked.value });
      showNote();
      doneTitle.textContent = yes ? 'See you there!' : "We'll miss you";
      doneText.textContent = (yes
        ? 'Thank you, ' + name + ". We can't wait to celebrate with you on 27 March 2027."
        : 'Thank you for letting us know, ' + name + ". You'll be in our thoughts on the day.")
        + (updated ? ' Your RSVP has been updated.' : '');
      formView.hidden = true;
      doneView.hidden = false;
      doneTitle.focus();
      if (yes && !REDUCE_MOTION) {
        burst(doneView, 14, { svg: HEART_SVG, colors: ['#E9A9A0', '#E8CE84', '#9CAF88'], y: '22%', dist: 46, spread: 60, size: 10 });
      }
    };

    // Spam bots fill every field, including the hidden one. Don't save those.
    if (form.elements.website.value) { finish(false); return; }

    send.disabled = true;
    send.textContent = 'Sending…';
    post({ action: 'rsvp', name: name, attending: picked.value, message: messageInput.value.trim() })
      .then((r) => {
        if (!r || !r.ok) throw new Error((r && r.error) || 'failed');
        finish(!!r.updated);
      })
      .catch(() => {
        fail('Sorry, that didn\'t go through. Please try again in a moment, or use our '
          + '<a href="' + RSVP_URL + '" target="_blank" rel="noopener">backup RSVP form</a>.');
      })
      .then(() => { send.disabled = false; send.textContent = 'Send RSVP'; });
  });
})();


/* ---------- RSVP: days left to reply + fireflies ---------- */
(function () {
  const out = document.getElementById('rsvpDaysLeft');
  if (out) {
    // reply-by date: end of 1 February 2027, SAST (UTC+2)
    const deadline = new Date('2027-02-01T23:59:59+02:00').getTime();
    const days = Math.floor((deadline - Date.now()) / 86400000);
    if (days > 1) out.textContent = days + ' days left to reply';
    else if (days === 1) out.textContent = '1 day left to reply';
    else if (days === 0) out.textContent = 'Last day to reply';
  }

  const host = document.getElementById('rsvpFireflies');
  if (host) {
    for (let n = 0; n < 22; n++) {
      const f = document.createElement('i');
      const dur = 7 + Math.random() * 8;
      f.style.left = (Math.random() * 100).toFixed(1) + '%';
      f.style.top = (8 + Math.random() * 88).toFixed(1) + '%';
      f.style.setProperty('--s', (2.5 + Math.random() * 3).toFixed(1) + 'px');
      f.style.setProperty('--d', dur.toFixed(1) + 's');
      f.style.setProperty('--dl', (-Math.random() * dur).toFixed(1) + 's');
      f.style.setProperty('--fx', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
      f.style.setProperty('--fy', (-20 - Math.random() * 70).toFixed(0) + 'px');
      host.appendChild(f);
    }
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
