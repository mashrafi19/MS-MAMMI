/* ═══════════════════════════════════════════════════════════
   M:S MAMMI CO — Website Scripts
═══════════════════════════════════════════════════════════ */

/* ── Navbar scroll effect ───────────────────────────────── */
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── Mobile hamburger ───────────────────────────────────── */
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    spans[0].style.background = '#5B8DEF';
    spans[2].style.background = '#5B8DEF';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
    spans[0].style.background = '';
    spans[2].style.background = '';
  }
});

/* Close nav when a link is clicked */
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; s.style.background = ''; });
  });
});

/* ── Product Tabs ────────────────────────────────────────── */
const tabBtns  = document.querySelectorAll('.tab-btn');
const panels   = document.querySelectorAll('.product-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    // Update buttons
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update panels
    panels.forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(`panel-${target}`);
    if (activePanel) {
      activePanel.classList.add('active');
      // Smooth scroll if panel is offscreen
      const rect = activePanel.getBoundingClientRect();
      if (rect.top < 80) {
        activePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
});

/* ── Scroll Reveal ───────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.product-panel.active, .contact-card, .stat-item, .about-text-col, .about-image-col, .contact-form-wrap'
);

function addRevealClass() {
  document.querySelectorAll(
    '.section-header, .contact-section, .stat-item, .about-text-col, .about-image-col, .contact-form-wrap, .map-placeholder'
  ).forEach(el => el.classList.add('reveal'));
}
addRevealClass();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Re-observe after tab switch */
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setTimeout(() => {
      document.querySelectorAll('.product-panel.active .reveal').forEach(el => {
        el.classList.add('visible');
      });
    }, 50);
  });
});

/* ── Contact Form ────────────────────────────────────────── */
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  if (!name) {
    formNote.textContent = 'Please enter your name.';
    formNote.style.color = '#FFA740';
    return;
  }
  // Simulate send
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.textContent = '✓ Enquiry Sent!';
    formNote.textContent = 'Thank you! We will get back to you shortly.';
    formNote.style.color = '#86efac';
    form.reset();
    setTimeout(() => {
      submitBtn.textContent = 'Send Enquiry';
      submitBtn.disabled = false;
      formNote.textContent = '';
    }, 4000);
  }, 1200);
});

/* ── Smooth active nav link highlight ───────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinkEls.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = navbar.classList.contains('scrolled')
        ? 'var(--orange)'
        : 'var(--orange-light)';
    }
  });
}, { passive: true });

/* ── Stat counter animation ──────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number');
let statsDone = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsDone) {
      statsDone = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.textContent);
        if (isNaN(target)) return;
        const suffix = el.textContent.replace(/\d+/, '');
        let count = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + suffix;
          if (count >= target) clearInterval(interval);
        }, 40);
      });
    }
  });
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

/* ── Lightbox ──────────────────────────────────────────── */
function openLightbox(img) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
