/* Shared interactions: navbar scroll state, active link highlight,
   mobile drawer, contact form validation + toasts. */

(function () {
  // ---- Navbar scroll state ----
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Active nav link based on current page ----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const target = a.getAttribute('data-nav');
    if (target === path) a.classList.add('active');
  });

  // ---- Mobile drawer ----
  const menuBtn = document.querySelector('.menu-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const menuIconOpen = document.querySelector('.menu-icon-open');
  const menuIconClose = document.querySelector('.menu-icon-close');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.style.display = isOpen ? 'none' : 'block';
        menuIconClose.style.display = isOpen ? 'block' : 'none';
      }
    });
    drawer.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        if (menuIconOpen && menuIconClose) {
          menuIconOpen.style.display = 'block';
          menuIconClose.style.display = 'none';
        }
      })
    );
  }

  // ---- Footer year ----
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Toasts ----
  function ensureToastStack() {
    let s = document.querySelector('.toast-stack');
    if (!s) {
      s = document.createElement('div');
      s.className = 'toast-stack';
      document.body.appendChild(s);
    }
    return s;
  }
  function showToast({ title, description, variant }) {
    const s = ensureToastStack();
    const t = document.createElement('div');
    t.className = 'toast' + (variant === 'destructive' ? ' error' : '');
    t.innerHTML =
      '<div class="t-title"></div>' +
      (description ? '<div class="t-desc"></div>' : '');
    t.querySelector('.t-title').textContent = title || '';
    if (description) t.querySelector('.t-desc').textContent = description;
    s.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      setTimeout(() => t.remove(), 450);
    }, 3500);
  }

  // ---- Contact form ----
  const form = document.querySelector('#contact-form');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();
      if (!name || !email || !message) {
        showToast({
          title: 'Missing fields',
          description: 'Please fill in all fields.',
          variant: 'destructive',
        });
        return;
      }
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      setTimeout(() => {
        showToast({
          title: 'Message sent!',
          description: "We'll get back to you shortly.",
        });
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
      }, 800);
    });
  }
})();
