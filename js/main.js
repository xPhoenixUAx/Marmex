const navToggle = document.querySelector('.nav-toggle');
const header = document.querySelector('.site-header');
const menu = document.querySelector('.mobile-menu');
const tetrisColors = ['#00f0ff', '#ff2bd6', '#37ff73', '#ffe84a', '#ff4b4b', '#7d5cff'];

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    if (menu) {
      menu.setAttribute('aria-hidden', String(!isOpen));
    }
  });
}

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-hidden', 'true');
  });
});

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 16);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const contactForm = document.querySelector('.contact-form');
const status = new URLSearchParams(window.location.search).get('status');

if (contactForm && status) {
  const message = document.createElement('p');
  message.className = `form-status form-status--${status}`;
  message.textContent = status === 'sent'
    ? 'Thank you. Your inquiry has been sent, and we will reply to the email provided.'
    : 'The inquiry could not be sent. Please check the fields or write to support@marmexdigital.com.';
  contactForm.prepend(message);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const buildTetrisStage = () => {
  const stage = document.createElement('div');
  stage.className = 'tetris-stage';
  stage.setAttribute('aria-hidden', 'true');
  document.body.prepend(stage);

  const columns = Math.ceil(window.innerWidth / 26);
  const rows = 11;
  const total = Math.min(columns * rows, 260);

  for (let i = 0; i < total; i += 1) {
    const block = document.createElement('span');
    block.className = 'tetris-block';
    block.style.left = `${(i % columns) * 26}px`;
    block.style.bottom = `${Math.floor(i / columns) * 26}px`;
    block.style.background = tetrisColors[i % tetrisColors.length];
    block.style.opacity = '0';
    stage.append(block);
  }

  const update = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = window.scrollY / maxScroll;
    const active = Math.floor(progress * total);

    stage.querySelectorAll('.tetris-block').forEach((block, index) => {
      if (index <= active) {
        const offset = Math.sin((index + window.scrollY) * 0.012) * 10;
        block.style.opacity = '0.72';
        block.style.transform = `translate3d(${offset}px, 0, 0) rotate(${(index % 4) * 90}deg)`;
      } else {
        block.style.opacity = '0';
        block.style.transform = 'translate3d(0, -90px, 0)';
      }
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
};

buildTetrisStage();

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
  const y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
  document.documentElement.style.setProperty('--mx', x);
  document.documentElement.style.setProperty('--my', y);
}, { passive: true });
