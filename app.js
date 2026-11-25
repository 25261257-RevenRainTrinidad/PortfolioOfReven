(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* ---- Theme (applied right away so there is no flash) ---- */
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  root.setAttribute('data-theme', saved === 'dark' ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.getElementById('header');
    var settingsBtn = document.getElementById('settingsBtn');
    var panel = document.getElementById('settingsPanel');
    var themeBtns = document.querySelectorAll('[data-theme-set]');

    function setTheme(t) {
      root.setAttribute('data-theme', t);
      try { localStorage.setItem('theme', t); } catch (e) {}
      themeBtns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-theme-set') === t);
      });
    }
    setTheme(root.getAttribute('data-theme'));

    themeBtns.forEach(function (b) {
      b.addEventListener('click', function () { setTheme(b.getAttribute('data-theme-set')); });
    });

    /* ---- Settings panel ---- */
    function closePanel() {
      panel.classList.remove('open');
      settingsBtn.setAttribute('aria-expanded', 'false');
    }
    settingsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.classList.toggle('open');
      settingsBtn.setAttribute('aria-expanded', open);
    });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', closePanel);

    /* ---- Smooth scrolling ---- */
    function scrollToY(y) { window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); }

    document.getElementById('logo').addEventListener('click', function (e) {
      e.preventDefault();
      scrollToY(0);
    });

    document.querySelectorAll('#nav a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(a.getAttribute('data-target'));
        if (!target) return;
        scrollToY(target.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight);
      });
    });

    /* Placeholder social links (href="#") should not jump the page */
    document.querySelectorAll('a.social').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (a.getAttribute('href') === '#') e.preventDefault();
      });
    });

    /* ---- Pop-ups ---- */
    var welcome = document.getElementById('welcomeModal');
    var resume = document.getElementById('resumeModal');

    function openModal(m) {
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var first = m.querySelector('[data-close]');
      if (first) first.focus();
    }
    function closeModal(m) {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
      if (!document.querySelector('.modal.open')) document.body.style.overflow = '';
    }

    document.querySelectorAll('.modal').forEach(function (m) {
      m.addEventListener('click', function (e) {
        if (e.target === m || e.target.hasAttribute('data-close')) closeModal(m);
      });
    });
    document.getElementById('resumeBtn').addEventListener('click', function () { openModal(resume); });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closePanel();
      document.querySelectorAll('.modal.open').forEach(closeModal);
    });

    setTimeout(function () { openModal(welcome); }, 400);

    /* ---- Reveal on scroll ---- */
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  });
})();
