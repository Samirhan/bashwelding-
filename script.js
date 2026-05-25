/* =============================================
   БАШВЕЛДИНГ — JavaScript v2
   ============================================= */

// ========================
// ФОНОВОЕ ИЗОБРАЖЕНИЕ HERO
// Попробуем image5, если нет — image4
// ========================
(function setHeroImage() {
  const layer = document.getElementById('heroImgLayer');
  if (!layer) return;

  const img5 = new Image();
  img5.onload = () => { layer.style.backgroundImage = "url('images/image5.png')"; };
  img5.onerror = () => { layer.style.backgroundImage = "url('images/image4.png')"; };
  img5.src = 'images/image5.png';
})();

// ========================
// НАВИГАЦИЯ — СКРОЛЛ
// ========================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// ========================
// БУРГЕР МЕНЮ
// ========================
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ========================
// СЧЁТЧИКИ
// ========================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  if (isNaN(target)) return;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString('ru-RU');
  }, 16);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hstat-num[data-target]').forEach(el => counterObs.observe(el));

// ========================
// SCROLL REVEAL
// ========================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ========================
// ПЛАВНАЯ ПРОКРУТКА
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ========================
// АКТИВНЫЙ ПУНКТ МЕНЮ
// ========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObs.observe(s));

// ========================
// ПАРАЛЛАКС HERO
// ========================
const heroImgLayer = document.getElementById('heroImgLayer');
window.addEventListener('scroll', () => {
  if (!heroImgLayer) return;
  if (window.scrollY < window.innerHeight * 1.2) {
    heroImgLayer.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }
}, { passive: true });

// ========================
// ФОРМА — MAILTO
// Форма открывает почтовый клиент с заполненными данными
// ========================
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const phone   = form.querySelector('#phone').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const org     = form.querySelector('#org').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name)  { shakeField(form.querySelector('#name'));  return; }
    if (!phone) { shakeField(form.querySelector('#phone')); return; }

    // Открываем mailto
    const subject = encodeURIComponent('Заявка с сайта БАШВЕЛДИНГ');
    const body = encodeURIComponent(
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      (email ? `E-mail: ${email}\n` : '') +
      (org    ? `Организация: ${org}\n` : '') +
      (message ? `\nОписание задачи:\n${message}` : '')
    );

    // Показываем успех
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = 'Открываем почту...';

    window.location.href = `mailto:byran.185@mail.ru?subject=${subject}&body=${body}`;

    setTimeout(() => {
      form.querySelectorAll('input, textarea').forEach(el => el.value = '');
      submitBtn.style.display = 'none';
      formSuccess.style.display = 'block';

      setTimeout(() => {
        submitBtn.style.display = 'flex';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = 'Отправить заявку <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 10h14M10 3l7 7-7 7"/></svg>';
        formSuccess.style.display = 'none';
      }, 5000);
    }, 800);
  });
}

function shakeField(field) {
  field.style.borderColor = '#EF4444';
  field.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(0)' }
  ], { duration: 380, easing: 'ease' });
  setTimeout(() => { field.style.borderColor = ''; }, 2000);
}

// ========================
// ИНИЦИАЛИЗАЦИЯ
// ========================
document.addEventListener('DOMContentLoaded', () => {
  console.log('БАШВЕЛДИНГ — готово');
});
