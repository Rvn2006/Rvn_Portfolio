/* ============================================================
   ARVIN BEARNEZA — PORTFOLIO v2 JAVASCRIPT
   main.js
   ============================================================ */

/* ------------------------------------------------------------
   0. MOBILE BURGER MENU
   ------------------------------------------------------------ */
const navBurger   = document.getElementById('navBurger');
const mobileMenu  = document.getElementById('mobileMenu');

if (navBurger && mobileMenu) {
  const closeMenu = () => {
    navBurger.classList.remove('open');
    mobileMenu.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    navBurger.classList.add('open');
    mobileMenu.classList.add('open');
    navBurger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  navBurger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ------------------------------------------------------------
   1. CUSTOM CURSOR
   ------------------------------------------------------------ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

/* Skip the custom cursor entirely on touch devices — with no pointer to
   follow it would just sit in the top-left corner, and the rAF loop would
   run forever for nothing. */
if (canHover) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
    if (prefersReducedMotion) {
      cursorRing.style.left = mouseX + 'px';
      cursorRing.style.top  = mouseY + 'px';
    }
  });

  if (!prefersReducedMotion) {
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();
  }
}

/* ------------------------------------------------------------
   1b. CURSOR-REACTIVE AQUAMARINE GLOW
   Lives behind each section's content (negative z-index in CSS) —
   tracks the pointer relative to whichever section is hovered.
   ------------------------------------------------------------ */
if (canHover && !prefersReducedMotion) {
  let glowSection = null;

  document.addEventListener('mousemove', (e) => {
    const sec = e.target.closest('section');
    if (sec !== glowSection) {
      if (glowSection) glowSection.classList.remove('glow-active');
      glowSection = sec;
      if (glowSection) glowSection.classList.add('glow-active');
    }
    if (glowSection) {
      const rect = glowSection.getBoundingClientRect();
      glowSection.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      glowSection.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }
  });
  document.addEventListener('mouseleave', () => {
    if (glowSection) glowSection.classList.remove('glow-active');
    glowSection = null;
  });
}

if (canHover) {
  document.querySelectorAll('a, button, .project-card, .skill-item, .role-pill').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform     = 'translate(-50%,-50%) scale(2.5)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
      cursorRing.style.borderColor = 'var(--accent2)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform     = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.borderColor = 'var(--accent)';
    });
  });
}

/* ------------------------------------------------------------
   1c. 3D TILT — project cards track the pointer in perspective,
   with a glassy highlight (CSS ::before) following along.
   ------------------------------------------------------------ */
if (canHover && !prefersReducedMotion) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 6;
      const ry = (px - 0.5) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.setProperty('--cx', (px * 100) + '%');
      card.style.setProperty('--cy', (py * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ------------------------------------------------------------
   1d. TOUCH FEEDBACK — on touch devices there's no hover, so the
   card effects are triggered by the tap itself. The glare is
   centred on wherever the finger actually landed.
   ------------------------------------------------------------ */
if (!canHover) {
  document.querySelectorAll('.project-card').forEach((card) => {
    const release = () => card.classList.remove('is-touched');

    card.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--cx', ((touch.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--cy', ((touch.clientY - rect.top) / rect.height * 100) + '%');
      }
      card.classList.add('is-touched');
    }, { passive: true });

    card.addEventListener('touchend', release, { passive: true });
    card.addEventListener('touchcancel', release, { passive: true });
    // A scroll that starts on a card shouldn't leave it stuck in the lit state.
    card.addEventListener('touchmove', release, { passive: true });
  });
}

/* ------------------------------------------------------------
   2. SCROLL REVEAL
   ------------------------------------------------------------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 75);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ------------------------------------------------------------
   3. STATS COUNTER ANIMATION
   ------------------------------------------------------------ */
function animateCounter(el, target) {
  if (prefersReducedMotion) {
    el.childNodes[0].textContent = target;
    return;
  }
  let current = 0;
  const step = () => {
    current = Math.min(current + Math.ceil(target / 30), target);
    el.childNodes[0].textContent = current;
    if (current < target) requestAnimationFrame(step);
  };
  step();
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num[data-target]').forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (!isNaN(target)) animateCounter(el, target);
      });
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsBar);
}

/* ------------------------------------------------------------
   4. ACTIVE NAV LINK ON SCROLL
   ------------------------------------------------------------ */
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id || '';
      navLinks.forEach((link) => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll('section[id]').forEach((s) => navObserver.observe(s));

/* ------------------------------------------------------------
   5. SMOOTH SCROLL
   ------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ------------------------------------------------------------
   6. LED WALL CARD — RANDOM BLINK ANIMATION
   ------------------------------------------------------------ */
const ledDots = document.querySelectorAll('.led-dot:not(.active)');

if (ledDots.length) {
  setInterval(() => {
    ledDots.forEach((dot) => {
      dot.style.opacity = Math.random() > 0.6 ? '0.25' : '0.06';
    });
  }, 400);
}

/* ------------------------------------------------------------
   7. VIDEO CARDS — PAUSE ON LOW-POWER MODE HINT
   ------------------------------------------------------------ */
const videos = document.querySelectorAll('.proj-video');
const videoObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.play().catch(() => {});
    } else {
      entry.target.pause();
    }
  });
}, { threshold: 0.2 });

videos.forEach((v) => videoObs.observe(v));

/* ------------------------------------------------------------
   7b. VIDEO SEQUENCES — cycle intro/outro clips end-to-end
   ------------------------------------------------------------ */
document.querySelectorAll('.proj-video[data-sequence]').forEach((video) => {
  const sources = video.dataset.sequence.split(',');
  let i = 0;
  video.addEventListener('ended', () => {
    i = (i + 1) % sources.length;
    video.src = sources[i];
    video.play().catch(() => {});
  });
});

/* ------------------------------------------------------------
   7c. SCREENSHOT CAROUSELS — crossfade through each system card's
   captured front-end screens. Only runs while the card is on screen.
   ------------------------------------------------------------ */
document.querySelectorAll('.shot-stage').forEach((stage) => {
  const shots = stage.querySelectorAll('.shot');
  if (shots.length < 2) return;

  let idx = 0;
  let timer = null;

  const advance = () => {
    shots[idx].classList.remove('active');
    idx = (idx + 1) % shots.length;
    shots[idx].classList.add('active');
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !timer) {
        timer = setInterval(advance, 3600);
      } else if (!entry.isIntersecting && timer) {
        clearInterval(timer);
        timer = null;
      }
    });
  }, { threshold: 0.25 });

  obs.observe(stage);
});

/* ------------------------------------------------------------
   8. PROJECT DETAIL MODAL
   The cards only carry a headline + two-line summary so every box in a
   row stays the same height; the full case — long copy, stack, role,
   team, links — lives here and is opened by clicking the card.
   ------------------------------------------------------------ */
const PROJECTS = {
  lakbaygo: {
    eyebrow: 'Branding & Visual Identity',
    title: 'LakbayGO',
    accent: '#a06cff',
    tags: ['Branding', 'Visual Identity', 'UI/UX'],
    media: [{ type: 'image', src: 'assets/lakbay-logo-section.png', alt: 'LakbayGO logo system' }],
    body: [
      'Complete brand identity for a ride-hailing platform — a logo system covering both the customer and driver apps, colour palette, typography, vehicle wraps, merchandise, and a full app icon suite.',
      'The mark is built around an infinity loop, symbolising continuity and endless possibilities: every ride connects back to another.'
    ],
    specs: [
      ['Scope', 'Logo system · Palette · Typography · Vehicle livery · Merch · App icons'],
      ['Concept', 'Infinity loop — continuity and endless possibilities'],
      ['My role', 'Brand designer — full identity from concept to brand book']
    ],
    links: [{ label: 'View Brand Book', href: 'assets/lakbaygo-branding.pdf' }]
  },

  dakkutek: {
    eyebrow: 'Branding & Visual Identity',
    title: 'Dakkutek ITS',
    accent: '#c1a35f',
    tags: ['Branding', 'SaaS', 'Visual Identity'],
    media: [{ type: 'image', src: 'assets/dakkutek-brand.png', alt: 'Dakkutek ITS brand board' }],
    body: [
      'Brand identity for a company offering cloud, cybersecurity, and managed IT services.',
      'The system pairs two typefaces — Deltha for the display voice and Ragick for supporting text — over a gold, red, and white palette chosen to read as precision and trust rather than the cold blue most IT brands default to.'
    ],
    specs: [
      ['Scope', 'Logo system · Typography · Palette · Brand board'],
      ['Typefaces', 'Deltha + Ragick'],
      ['Sector', 'IT solutions · SaaS platform']
    ]
  },

  'aether-brand': {
    eyebrow: 'Branding & Visual Identity',
    title: 'AETHER',
    accent: '#1bba6f',
    tags: ['Branding', 'AI System', 'Hackathon'],
    media: [{ type: 'image', src: 'assets/aether-brand.png', alt: 'AETHER branding' }],
    body: [
      'Brand identity for an AI-driven satellite decision-support system built to protect mangrove forests across Western Visayas.',
      'The geometric mark folds three ideas into one shape — intelligence, nature, and data — so the identity carries the science without looking like a lab report. Developed for a national hackathon.'
    ],
    specs: [
      ['Scope', 'Logo mark · Palette · Typography · Pitch identity'],
      ['Context', 'National hackathon · WVSU'],
      ['Sector', 'Environmental technology']
    ]
  },

  linkexe: {
    eyebrow: 'Motion Graphics & Animation',
    title: 'Link.exe Outro',
    accent: '#f04aff',
    tags: ['Motion Graphics', 'Animation'],
    media: [{ type: 'video', src: 'assets/outro-animation.mp4' }],
    body: [
      'Animated outro for Link.exe, the IT organization of West Visayas State University.',
      'Designed to close events with a cinematic, brand-consistent signature — the same beat every time, so the audience learns to recognise it.'
    ],
    specs: [
      ['Client', 'WVSU · Link.exe'],
      ['Deliverable', 'Event outro animation'],
      ['My role', 'Motion design & animation']
    ]
  },

  reality: {
    eyebrow: 'Motion Graphics & Animation',
    title: 'REALITY XIII: Metropolis',
    accent: '#f04aff',
    tags: ['Logo Animation', 'Event Branding'],
    media: [{ type: 'video', src: 'assets/reality-xiii-teaser.mp4' }],
    body: [
      'Logo teaser animation for REALITY XIII: Metropolis — a major event at WVSU facilitated by Link.exe.',
      'A cinematic reveal built around the futuristic, city-themed identity of the event, cut short on purpose so it works as a teaser rather than an opener.'
    ],
    specs: [
      ['Client', 'WVSU · Link.exe'],
      ['Deliverable', 'Logo teaser animation'],
      ['My role', 'Motion design & animation']
    ]
  },

  pagiririmaw: {
    eyebrow: 'Motion Graphics & Animation',
    title: 'WVSU Pag-iririmaw',
    accent: '#4af0c4',
    tags: ['LED Wall', 'Motion'],
    media: [{ type: 'video', src: 'assets/wvsu-pag-iririmaw.mp4' }],
    body: [
      'LED wall visual content designed for the WVSU Pag-iririmaw event.',
      'Large-scale motion graphics produced for live display on stadium-sized LED panels — every element scaled and contrasted for viewing from across a field, not from a desk.'
    ],
    specs: [
      ['Client', 'West Visayas State University'],
      ['Deliverable', 'Stadium LED wall visuals'],
      ['Constraint', 'Legible at long viewing distance on large-pitch panels']
    ]
  },

  ncaf: {
    eyebrow: 'Motion Graphics & Animation',
    title: 'NCAF',
    accent: '#f04aff',
    tags: ['Motion Graphics', 'Cultural Festival'],
    media: [
      { type: 'video', src: 'assets/ncaf_intro.mp4', label: 'Intro' },
      { type: 'video', src: 'assets/ncaf_outro.mp4', label: 'Outro' }
    ],
    body: [
      'Motion graphics intro and outro for the National Culture and Arts Festival — Iloilo\'s annual celebration of Ilonggo heritage, culture, and the arts.',
      'The pair bookends the programme, carrying the festival\'s identity into both the opening and the close.'
    ],
    specs: [
      ['Client', 'Iloilo City · National Culture and Arts Festival'],
      ['Deliverable', 'Intro + outro animation package'],
      ['My role', 'Motion design & animation']
    ]
  },

  elocate: {
    eyebrow: 'UI/UX & Product Design',
    title: 'E-Locate',
    accent: '#f97316',
    tags: ['UI/UX Design', 'Tourism Platform', 'Social Enterprise'],
    media: [
      { type: 'image', src: 'assets/elocate-stall-manager-nobg.png', alt: 'Stall profile manager', bare: true },
      { type: 'image', src: 'assets/elocate-analytics-nobg.png', alt: 'Weekly impact analytics', bare: true },
      { type: 'image', src: 'assets/elocate-docs-nobg.png', alt: 'Authentic & safe — compliance documents', bare: true },
      { type: 'image', src: 'assets/elocate-qr-nobg.png', alt: 'Stall QR code', bare: true }
    ],
    body: [
      'A digital tourism and social enterprise platform for Iloilo. This is the vendor side of it — the app stall owners actually hold.',
      'It lets them manage their profile, menu, and operating hours, upload the compliance documents that mark them as verified, generate a QR code for their stall, and read weekly analytics on how many tourists found them.'
    ],
    specs: [
      ['Product', 'Vendor app — profile, menu, hours, documents, QR, analytics'],
      ['My role', 'UI/UX design — flows, screens, and prototype'],
      ['Tools', 'Figma']
    ],
    links: [{
      label: 'View Prototype',
      href: 'https://www.figma.com/proto/xXjw20v2jChFkCmhkmDLKR/PANUBLES-Web-Prototype?node-id=443-1924&starting-point-node-id=437%3A937&t=p6oABbOejUME2LFg-1'
    }]
  },

  'aether-platform': {
    eyebrow: 'UI/UX & Product Design',
    title: 'AETHER Platform',
    accent: '#1bba6f',
    tags: ['Dashboard UI', 'Geospatial', 'Data Viz'],
    media: [
      { type: 'image', src: 'assets/aether-ui-dashboard.jpg', alt: 'AETHER — dashboard with the GIS mangrove risk map' },
      { type: 'image', src: 'assets/aether-ui-zones.png', alt: 'AETHER — zone summary table with risk classification' },
      { type: 'image', src: 'assets/aether-ui-explain.png', alt: 'AETHER — model explainability charts' },
      { type: 'image', src: 'assets/aether-ui-methodology.png', alt: 'AETHER — data & methodology screen' }
    ],
    body: [
      'A geospatial decision-support dashboard that predicts mangrove degradation risk across 462 monitored zones in Iloilo Province.',
      'The interface pairs an interactive GIS risk map with explainable per-zone scoring, so a conservation officer can see not just which zones are at risk but why — and gets rule-based recommendations for what to do about it.'
    ],
    specs: [
      ['Interface', 'Next.js · React · Leaflet · Chart.js · Tailwind'],
      ['My role', 'Risk-classification logic across the map, detail panel, zone table & colour tokens'],
      ['Team', 'Team KADJA · AI Hackathon 2026']
    ]
  },

  lcibms: {
    eyebrow: 'UI/UX & Product Design',
    title: 'L&L Cafe — LCIBMS',
    accent: '#c9a274',
    tags: ['App UI', 'POS & Admin', 'Design System'],
    media: [
      { type: 'image', src: 'assets/lcibms-ui-landing.jpg', alt: 'L&L Cafe — landing page' },
      { type: 'image', src: 'assets/lcibms-ui-about.jpg', alt: 'L&L Cafe — about page' },
      { type: 'image', src: 'assets/lcibms-ui-login.jpg', alt: 'L&L Cafe — login screen' }
    ],
    body: [
      'An integrated business management system for a local cafe, covering customer ordering, cashier checkout, menu and category management, reviews, and an admin CMS.',
      'Four very different audiences — customer, cashier, manager, admin — unified under one coffee-and-cream design language so the whole thing still reads as a single product.'
    ],
    specs: [
      ['Interface', 'Flutter · Node/Express · Strapi CMS · MySQL'],
      ['My role', 'Frontend UI/UX — checkout & cashier flows, menu management, review/admin screens, navigation'],
      ['Team', 'Capstone team project']
    ]
  },

  selfportrait: {
    eyebrow: 'Illustration',
    title: 'Self Portrait',
    accent: '#f04aff',
    tags: ['Digital Illustration', 'Portrait'],
    media: [{ type: 'image', src: 'assets/arvin-illustration.jpg', alt: 'Arvin Bearneza — self portrait illustration' }],
    body: [
      'A digital self-portrait painted in a loose, expressive style — flat planes of light and shadow rather than blended rendering.',
      'Part of a personal illustration series. Drawing first is what keeps the design work raw and human.'
    ],
    specs: [
      ['Medium', 'Digital painting'],
      ['Tools', 'Procreate · Adobe Photoshop'],
      ['Series', 'Personal work']
    ]
  }
};

const pmRoot     = document.getElementById('projectModal');
const pmPanel    = pmRoot && pmRoot.querySelector('.pm-panel');
const pmMedia    = document.getElementById('pmMedia');
const pmStage    = document.getElementById('pmStage');
const pmThumbs   = document.getElementById('pmThumbs');
const pmEyebrow  = document.getElementById('pmEyebrow');
const pmTitle    = document.getElementById('pmTitle');
const pmTags     = document.getElementById('pmTags');
const pmBody     = document.getElementById('pmBody');
const pmSpecs    = document.getElementById('pmSpecs');
const pmLinks    = document.getElementById('pmLinks');

if (pmRoot) {
  let lastFocused = null;
  let currentMedia = [];

  /* Flags the media column once we know whether the stage actually scrolls,
     so the "scroll to view" hint only appears on the tall brand boards. */
  const markScrollable = () => {
    pmMedia.classList.toggle('is-scrollable', pmStage.scrollHeight > pmStage.clientHeight + 4);
  };

  /* Renders one media item into the stage. Videos get native controls and
     autoplay muted; images fill the stage width and scroll if they're tall. */
  const showMedia = (i) => {
    const item = currentMedia[i];
    if (!item) return;

    pmStage.innerHTML = '';
    pmMedia.classList.remove('is-scrollable');

    const inner = document.createElement('div');
    inner.className = 'pm-stage-inner';

    if (item.type === 'video') {
      const v = document.createElement('video');
      v.src = item.src;
      v.controls = true;
      v.autoplay = true;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      inner.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.alt = item.alt || '';
      if (item.bare) img.classList.add('bare');
      /* Fill the stage, but never past the file's own resolution — the
         portrait illustration is only 516px wide and upscaling it blurs. */
      img.addEventListener('load', () => {
        img.style.width = 'min(100%, ' + img.naturalWidth + 'px)';
        markScrollable();
      });
      img.src = item.src;
      inner.appendChild(img);
    }

    pmStage.appendChild(inner);
    pmStage.scrollTop = 0;
    requestAnimationFrame(markScrollable);

    pmThumbs.querySelectorAll('.pm-thumb').forEach((t, n) => {
      t.classList.toggle('active', n === i);
    });
  };

  const buildThumbs = () => {
    pmThumbs.innerHTML = '';
    if (currentMedia.length < 2) return;

    currentMedia.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pm-thumb' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', item.label || item.alt || `View ${i + 1}`);

      if (item.type === 'video') {
        const v = document.createElement('video');
        // #t=0.5 — seek half a second in so the thumbnail paints an actual
        // frame instead of the black one most of these clips open on.
        v.src = item.src + '#t=0.5';
        v.muted = true;
        v.playsInline = true;
        v.preload = 'metadata';
        btn.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = '';
        btn.appendChild(img);
      }

      btn.addEventListener('click', () => showMedia(i));
      pmThumbs.appendChild(btn);
    });
  };

  const openModal = (key, trigger) => {
    const data = PROJECTS[key];
    if (!data) return;

    lastFocused  = trigger || document.activeElement;
    currentMedia = data.media || [];

    pmRoot.style.setProperty('--pm-accent', data.accent || 'var(--accent)');
    pmEyebrow.textContent = data.eyebrow || '';
    pmTitle.textContent   = data.title || '';

    pmTags.innerHTML = '';
    (data.tags || []).forEach((t) => {
      const el = document.createElement('span');
      el.className = 'pm-tag';
      el.textContent = t;
      pmTags.appendChild(el);
    });

    pmBody.innerHTML = '';
    (data.body || []).forEach((p) => {
      const el = document.createElement('p');
      el.textContent = p;
      pmBody.appendChild(el);
    });

    pmSpecs.innerHTML = '';
    (data.specs || []).forEach(([label, value]) => {
      const li = document.createElement('li');
      const s  = document.createElement('span');
      s.textContent = label;
      li.appendChild(s);
      li.appendChild(document.createTextNode(value));
      pmSpecs.appendChild(li);
    });

    pmLinks.innerHTML = '';
    (data.links || []).forEach((l) => {
      const a = document.createElement('a');
      a.className = 'pm-link';
      a.href = l.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = l.label + ' ↗';
      pmLinks.appendChild(a);
    });

    buildThumbs();
    showMedia(0);

    pmRoot.hidden = false;
    document.body.classList.add('pm-open');
    // Next frame, so the opening transition actually has a start state.
    requestAnimationFrame(() => pmRoot.classList.add('open'));
    pmInfoReset();
    pmRoot.querySelector('.pm-close').focus();
  };

  const pmInfoReset = () => {
    const info = pmRoot.querySelector('.pm-info');
    if (info) info.scrollTop = 0;
  };

  const closeModal = () => {
    pmRoot.classList.remove('open');
    document.body.classList.remove('pm-open');

    const finish = () => {
      pmRoot.hidden = true;
      pmStage.innerHTML = '';   // stops any playing video
      pmThumbs.innerHTML = '';
      if (lastFocused) lastFocused.focus();
    };

    if (prefersReducedMotion) finish();
    else setTimeout(finish, 400);
  };

  pmRoot.querySelectorAll('[data-pm-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (pmRoot.hidden) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    /* Keep Tab inside the panel while it's open. */
    if (e.key === 'Tab') {
      const focusables = pmPanel.querySelectorAll('button, a[href], video[controls]');
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* Card triggers — the whole card opens its case, except for controls
     inside it that already do something (carousel dots, links, buttons). */
  document.querySelectorAll('.project-card[data-project]').forEach((card) => {
    const key = card.dataset.project;

    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .edot')) return;
      openModal(key, card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target !== card) return;
      e.preventDefault();
      openModal(key, card);
    });
  });
}

/* ------------------------------------------------------------
   9. E-LOCATE PHONE CAROUSEL
   ------------------------------------------------------------ */
const elocateSlides = document.querySelectorAll('.elocate-slide');
const elocateDots   = document.querySelectorAll('.edot');

if (elocateSlides.length) {
  let elocateCur = 0;
  let elocateTimer = null;

  const elocateGoTo = (n) => {
    elocateSlides[elocateCur].classList.remove('active');
    elocateDots[elocateCur].classList.remove('active');
    elocateCur = ((n % elocateSlides.length) + elocateSlides.length) % elocateSlides.length;
    elocateSlides[elocateCur].classList.add('active');
    elocateDots[elocateCur].classList.add('active');
  };

  const elocateStart = () => {
    elocateTimer = setInterval(() => elocateGoTo(elocateCur + 1), 3200);
  };

  elocateDots.forEach((d, i) => d.addEventListener('click', () => {
    elocateGoTo(i);
    clearInterval(elocateTimer);
    elocateStart();
  }));

  elocateStart();
}
