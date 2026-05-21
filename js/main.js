const navToggle = document.querySelector('.nav-toggle');
const header = document.querySelector('.site-header');
const menu = document.querySelector('.mobile-menu');
const tetrisColors = ['#00f0ff', '#ff2bd6', '#37ff73', '#ffe84a', '#ff4b4b', '#7d5cff'];

const searchIndex = [
  {
    title: 'Home',
    category: 'Page',
    url: 'index.html',
    text: 'Marmex digital marketing agency, website builds, campaign systems, conversion planning, creative production, analytics and launch support.'
  },
  {
    title: 'Services',
    category: 'Page',
    url: 'services.html',
    text: 'Full cycle digital services from strategy and media planning to web design, development, automation, reporting and support.'
  },
  {
    title: 'About Marmex',
    category: 'Page',
    url: 'about.html',
    text: 'A Bratislava digital marketing company for teams that need clear positioning, practical execution and launch-ready web systems.'
  },
  {
    title: 'Contact',
    category: 'Page',
    url: 'contact.html',
    text: 'Send a project inquiry through the contact form for marketing, website, design, development or analytics work.'
  },
  {
    title: 'Brand Strategy',
    category: 'Service',
    url: 'brand-strategy.html',
    text: 'Positioning, audience definition, messaging, offer structure, market research, brand voice, creative direction and campaign foundations.'
  },
  {
    title: 'Performance Marketing',
    category: 'Service',
    url: 'performance-marketing.html',
    text: 'Paid acquisition across Meta Ads, TikTok Ads, LinkedIn Ads, Google Ads, funnels, campaign testing, optimization and reporting.'
  },
  {
    title: 'Google Ads / Search Advertising',
    category: 'Service',
    url: 'google-ads.html',
    text: 'Google Search, Performance Max, keyword planning, landing page alignment, conversion tracking, bidding and campaign management.'
  },
  {
    title: 'Paid Social Campaigns',
    category: 'Service',
    url: 'paid-social.html',
    text: 'Meta, Instagram, Facebook, TikTok and LinkedIn paid social campaigns, creative testing, audience strategy and funnel sequencing.'
  },
  {
    title: 'SEO Strategy',
    category: 'Service',
    url: 'seo-strategy.html',
    text: 'Technical SEO, content architecture, search intent planning, organic visibility, structured pages and long-term acquisition.'
  },
  {
    title: 'Web Design',
    category: 'Service',
    url: 'web-design.html',
    text: 'Editorial websites, landing pages, UI systems, conversion focused layouts, visual direction, responsive design and brand experience.'
  },
  {
    title: 'Website Development',
    category: 'Service',
    url: 'website-development.html',
    text: 'Frontend development, backend integration, PHP forms, performance, launch readiness, maintenance and scalable website delivery.'
  },
  {
    title: 'Analytics & Automation',
    category: 'Service',
    url: 'analytics-automation.html',
    text: 'GA4, Google Tag Manager, Looker Studio, CRM handoff, email automation, lead tracking, dashboards and reporting systems.'
  },
  {
    title: 'Privacy Policy',
    category: 'Legal',
    url: 'privacy.html',
    text: 'How Marmex handles personal data, inquiry information, analytics, cookies and business communication.'
  },
  {
    title: 'Terms of Service',
    category: 'Legal',
    url: 'terms.html',
    text: 'Business terms, project scope, content responsibilities, payments, timelines and professional service conditions.'
  },
  {
    title: 'Cookie Policy',
    category: 'Legal',
    url: 'cookie.html',
    text: 'Cookie categories, analytics cookies, preferences, browser controls and website measurement.'
  }
];

const getSearchMatches = (query) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return searchIndex.slice(0, 5);

  return searchIndex
    .map((item) => {
      const haystack = `${item.title} ${item.category} ${item.text}`.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(normalized) ? 3 : 0;
      const categoryMatch = item.category.toLowerCase().includes(normalized) ? 2 : 0;
      const textMatch = haystack.includes(normalized) ? 1 : 0;
      return { ...item, score: titleMatch + categoryMatch + textMatch };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 6);
};

const renderSearchResults = (query, resultsList) => {
  const matches = getSearchMatches(query);

  resultsList.innerHTML = matches.length
    ? matches.map((item) => `
      <a class="site-search__result" href="${item.url}">
        <span>${item.category}</span>
        <strong>${item.title}</strong>
      </a>
    `).join('')
    : '<p class="site-search__empty">No result. Try ads, SEO, website or automation.</p>';
};

const buildPageLoader = () => {
  if (document.querySelector('.page-loader')) return;

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.setAttribute('aria-hidden', 'true');
  loader.innerHTML = `
    <div class="page-loader__box">
      <span class="page-loader__brand">Marmex</span>
      <span class="page-loader__block page-loader__block--one"></span>
      <span class="page-loader__block page-loader__block--two"></span>
      <span class="page-loader__block page-loader__block--three"></span>
      <span class="page-loader__block page-loader__block--four"></span>
    </div>
  `;
  document.body.append(loader);

  const showLoader = () => {
    loader.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-loading-page');
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.target === '_blank') return;

    const url = new URL(href, window.location.href);
    const isSameOrigin = url.origin === window.location.origin;
    const isPage = url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/');
    const isSamePageHash = url.pathname === window.location.pathname && url.hash;

    if (!isSameOrigin || !isPage || isSamePageHash) return;

    event.preventDefault();
    showLoader();
    window.setTimeout(() => {
      window.location.href = url.href;
    }, 420);
  });

  window.addEventListener('pageshow', () => {
    loader.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-loading-page');
  });
};

buildPageLoader();

const buildServicesDropdown = () => {
  const siteNav = header?.querySelector('.site-nav');
  const servicesLink = siteNav?.querySelector(':scope > a[href="services.html"]');
  if (!siteNav || !servicesLink || siteNav.querySelector('.nav-services')) return;

  const serviceItems = searchIndex.filter((item) => item.category === 'Service');
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-services';

  servicesLink.classList.add('nav-services__trigger');
  servicesLink.setAttribute('aria-haspopup', 'true');
  servicesLink.innerHTML = 'Services <span aria-hidden="true"></span>';

  const panel = document.createElement('div');
  panel.className = 'nav-services__panel';
  panel.innerHTML = `
    <a class="nav-services__all" href="services.html">
      <strong>All Services</strong>
      <small>Strategy, websites, campaigns, automation and support in one delivery system.</small>
    </a>
    <div class="nav-services__grid">
      ${serviceItems.map((item) => `
        <a href="${item.url}">
          <span>${item.title}</span>
          <small>${item.text}</small>
        </a>
      `).join('')}
    </div>
  `;

  servicesLink.replaceWith(wrapper);
  wrapper.append(servicesLink, panel);

  let closeTimer;
  const openDropdown = () => {
    window.clearTimeout(closeTimer);
    wrapper.classList.add('is-open');
  };
  const queueClose = () => {
    closeTimer = window.setTimeout(() => wrapper.classList.remove('is-open'), 140);
  };

  wrapper.addEventListener('mouseenter', openDropdown);
  wrapper.addEventListener('mouseleave', queueClose);
  wrapper.addEventListener('focusin', openDropdown);
  wrapper.addEventListener('focusout', queueClose);
};

buildServicesDropdown();

const buildSiteSearch = () => {
  if (!header || document.querySelector('.site-search-form')) return;

  const placeholderIdeas = [
    'Search Google Ads',
    'Search web design',
    'Search SEO strategy',
    'Search automation',
    'Search paid social'
  ];
  let placeholderIndex = 0;

  const searchForm = document.createElement('form');
  searchForm.className = 'site-search-form';
  searchForm.setAttribute('role', 'search');
  searchForm.innerHTML = `
    <label class="site-search-label">
      <span class="site-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="m21 21-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"></path>
        </svg>
      </span>
      <span class="sr-only">Search site</span>
      <input class="site-search-input" type="search" autocomplete="off" placeholder="${placeholderIdeas[0]}" aria-label="Search site" />
    </label>
    <div class="site-search-dropdown" aria-live="polite"></div>
  `;
  const siteNav = header.querySelector('.site-nav');
  const navCta = siteNav?.querySelector('.nav-cta');
  if (siteNav && navCta) {
    siteNav.insertBefore(searchForm, navCta);
  } else if (siteNav) {
    siteNav.append(searchForm);
  } else {
    header.insertBefore(searchForm, navToggle);
  }

  const input = searchForm.querySelector('input');
  const results = searchForm.querySelector('.site-search-dropdown');

  const openDropdown = () => {
    searchForm.classList.add('is-open');
    renderSearchResults(input.value, results);
  };

  const closeDropdown = () => {
    searchForm.classList.remove('is-open');
  };

  const rotatePlaceholder = () => {
    if (document.activeElement === input || input.value) return;
    placeholderIndex = (placeholderIndex + 1) % placeholderIdeas.length;
    input.classList.add('is-changing-placeholder');
    window.setTimeout(() => {
      input.placeholder = placeholderIdeas[placeholderIndex];
      input.classList.remove('is-changing-placeholder');
    }, 140);
  };

  window.setInterval(rotatePlaceholder, 2100);

  input.addEventListener('focus', openDropdown);
  input.addEventListener('input', openDropdown);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDropdown();
      input.blur();
    }
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const firstMatch = getSearchMatches(input.value)[0];
    if (firstMatch) {
      window.location.href = firstMatch.url;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDropdown();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      input.focus();
      openDropdown();
    }
  });

  document.addEventListener('click', (event) => {
    if (!searchForm.contains(event.target)) closeDropdown();
  });
};

buildSiteSearch();

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
  document.documentElement.style.setProperty('--scroll-rotate', `${window.scrollY * 0.08}deg`);
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
        block.style.opacity = '0.34';
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

const buildCookieConsent = () => {
  const storageKey = 'marmex_cookie_consent';
  const existingChoice = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch {
      return null;
    }
  })();

  const saveChoice = (choice) => {
    const payload = {
      essential: true,
      analytics: Boolean(choice.analytics),
      marketing: Boolean(choice.marketing),
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Consent still applies for this page view even if storage is unavailable.
    }

    window.dispatchEvent(new CustomEvent('marmexCookieConsent', { detail: payload }));
    document.body.classList.remove('cookie-panel-open');
    document.querySelector('.cookie-banner')?.remove();
    document.querySelector('.cookie-preferences')?.remove();
  };

  const openPreferences = () => {
    if (document.querySelector('.cookie-preferences')) return;

    const panel = document.createElement('section');
    panel.className = 'cookie-preferences';
    panel.setAttribute('aria-label', 'Cookie preferences');
    panel.innerHTML = `
      <div class="cookie-preferences__card">
        <div>
          <p class="eyebrow">Cookie settings</p>
          <h2>Choose what Marmex can use.</h2>
          <p>Essential cookies keep the site working. Analytics and marketing cookies help us measure traffic and campaign performance when enabled.</p>
        </div>
        <label><input type="checkbox" checked disabled> Essential cookies <span>Always active</span></label>
        <label><input type="checkbox" name="analytics"> Analytics cookies <span>Website usage and performance measurement</span></label>
        <label><input type="checkbox" name="marketing"> Marketing cookies <span>Advertising measurement and remarketing support</span></label>
        <div class="cookie-actions">
          <button class="button button--secondary" type="button" data-cookie-close>Back</button>
          <button class="button button--secondary" type="button" data-cookie-reject>Reject non-essential</button>
          <button class="button button--primary" type="button" data-cookie-save>Save choices</button>
        </div>
      </div>
    `;

    document.body.append(panel);
    document.body.classList.add('cookie-panel-open');
    panel.querySelector('[name="analytics"]').checked = Boolean(existingChoice?.analytics);
    panel.querySelector('[name="marketing"]').checked = Boolean(existingChoice?.marketing);
    panel.querySelector('[data-cookie-close]').addEventListener('click', () => {
      panel.remove();
      document.body.classList.remove('cookie-panel-open');
    });
    panel.querySelector('[data-cookie-reject]').addEventListener('click', () => saveChoice({ analytics: false, marketing: false }));
    panel.querySelector('[data-cookie-save]').addEventListener('click', () => saveChoice({
      analytics: panel.querySelector('[name="analytics"]').checked,
      marketing: panel.querySelector('[name="marketing"]').checked
    }));
  };

  document.querySelectorAll('.footer-columns nav').forEach((nav) => {
    if (!nav.textContent.includes('Legal') || nav.querySelector('[data-cookie-settings]')) return;
    const settings = document.createElement('button');
    settings.className = 'footer-cookie-button';
    settings.type = 'button';
    settings.dataset.cookieSettings = 'true';
    settings.textContent = 'Cookie settings';
    settings.addEventListener('click', openPreferences);
    nav.append(settings);
  });

  if (existingChoice) {
    window.dispatchEvent(new CustomEvent('marmexCookieConsent', { detail: existingChoice }));
    return;
  }

  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.innerHTML = `
    <div class="cookie-banner__copy">
      <p class="eyebrow">Cookie notice</p>
      <h2>We use cookies to keep the site sharp.</h2>
      <p>Essential cookies make the website work. With your consent, analytics and marketing cookies may help us understand traffic and campaign performance. You can change this later in the footer.</p>
      <a href="cookie.html">Read Cookie Policy</a>
    </div>
    <div class="cookie-actions">
      <button class="button button--secondary" type="button" data-cookie-manage>Manage choices</button>
      <button class="button button--secondary" type="button" data-cookie-reject>Reject non-essential</button>
      <button class="button button--primary" type="button" data-cookie-accept>Accept all</button>
    </div>
  `;

  document.body.append(banner);
  banner.querySelector('[data-cookie-manage]').addEventListener('click', openPreferences);
  banner.querySelector('[data-cookie-reject]').addEventListener('click', () => saveChoice({ analytics: false, marketing: false }));
  banner.querySelector('[data-cookie-accept]').addEventListener('click', () => saveChoice({ analytics: true, marketing: true }));
};

buildCookieConsent();

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
  const y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
  document.documentElement.style.setProperty('--mx', x);
  document.documentElement.style.setProperty('--my', y);
}, { passive: true });
