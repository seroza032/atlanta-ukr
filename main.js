let translations = {};
let currentLang = 'uk';

async function loadTranslations() {
  const [uk, en] = await Promise.all([
    fetch('locales/uk.json').then(r => r.json()),
    fetch('locales/en.json').then(r => r.json()),
  ]);
  translations = { uk, en };
  applyLang(localStorage.getItem('lang') || 'uk');
}

function applyLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-lang-opt]').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.langOpt === lang);
  });
}

/* Language switcher */
document.getElementById('langSwitch').addEventListener('click', e => {
  const opt = e.target.closest('[data-lang-opt]');
  applyLang(opt ? opt.dataset.langOpt : (currentLang === 'uk' ? 'en' : 'uk'));
});

/* Mobile menu */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* Nav active link */
const navLinks = document.querySelectorAll('.nav-links a');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove('active'));
    const match = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
    if (match) match.classList.add('active');
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id], footer[id]').forEach(s => io.observe(s));

/* Service section read-more toggles */
document.querySelectorAll('.btn-readmore').forEach(btn => {
  const section = btn.dataset.section;
  const expand = document.getElementById(section + 'Expand');
  btn.addEventListener('click', () => {
    const isOpen = expand.classList.toggle('open');
    const key = isOpen ? section + '.readless' : section + '.readmore';
    btn.setAttribute('data-i18n', key);
    btn.innerHTML = translations[currentLang][key];
  });
});

loadTranslations();

/* Nav shadow on scroll */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10 ? '0 4px 32px rgba(0,0,0,.35)' : 'none';
}, { passive: true });
