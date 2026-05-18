// Custom JS for the Sitio Do-Re-Mi site - vanilla, no jQuery/Bootstrap

(function () {
  'use strict';

  // -------- Header shrink on scroll --------
  var header = document.querySelector('header');
  if (header) {
    var syncHeader = function () {
      if (window.scrollY > 39) {
        header.classList.remove('large');
        header.classList.add('small');
      } else {
        header.classList.remove('small');
        header.classList.add('large');
      }
    };
    window.addEventListener('scroll', syncHeader, { passive: true });
    syncHeader();
  }

  // -------- Vehicle tabs (8 cards) + mobile select --------
  var vNav = document.querySelector('.vehicle-nav');
  var vCards = document.querySelectorAll('.vehicle-data');
  if (vNav && vCards.length) {
    vCards.forEach(function (c) { c.style.display = 'none'; });
    var activeLi = vNav.querySelector('li.active');
    var activeHref = activeLi
      ? activeLi.querySelector('a').getAttribute('href')
      : '#' + vCards[0].id;
    var activeCard = document.querySelector(activeHref);
    if (activeCard) activeCard.style.display = '';

    var activate = function (href) {
      var card = document.querySelector(href);
      if (!card || card === activeCard) return;
      vNav.querySelectorAll('li.active').forEach(function (l) { l.classList.remove('active'); });
      var match = vNav.querySelector('a[href="' + href + '"]');
      if (match && match.parentElement) match.parentElement.classList.add('active');
      if (activeCard) activeCard.style.display = 'none';
      card.style.display = '';
      activeCard = card;
      if (mobileSelect && mobileSelect.value !== href) mobileSelect.value = href;
    };

    vNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        activate(a.getAttribute('href'));
      });
    });

    // Mobile dropdown
    var mobileSelect = null;
    var navContainer = document.getElementById('vehicle-nav-container');
    if (navContainer) {
      var wrap = document.createElement('div');
      wrap.className = 'styled-select-vehicle-data';
      mobileSelect = document.createElement('select');
      mobileSelect.className = 'vehicle-data-select';
      vNav.querySelectorAll('a').forEach(function (a) {
        var opt = document.createElement('option');
        opt.value = a.getAttribute('href');
        opt.textContent = a.textContent;
        if (a.getAttribute('href') === activeHref) opt.selected = true;
        mobileSelect.appendChild(opt);
      });
      wrap.appendChild(mobileSelect);
      navContainer.appendChild(wrap);
      mobileSelect.addEventListener('change', function () { activate(mobileSelect.value); });
    }
  }

  // -------- Scroll to top button --------
  var scrollup = document.querySelector('.scrollup');
  if (scrollup) {
    scrollup.style.display = 'none';
    window.addEventListener('scroll', function () {
      scrollup.style.display = window.scrollY > 100 ? '' : 'none';
    }, { passive: true });
    scrollup.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------- Smooth scroll for .scroll-to anchors --------
  document.querySelectorAll('.scroll-to').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      e.preventDefault();
      var y;
      if (href === '#top') {
        y = 0;
      } else {
        var target = document.querySelector(href);
        if (!target) return;
        var offset = window.scrollY < 39 ? 260 : 110;
        y = target.getBoundingClientRect().top + window.scrollY - offset;
      }
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Close mobile menu if open
      var collapse = document.querySelector('.navbar-collapse.in');
      if (collapse) {
        collapse.classList.remove('in');
        var toggle = document.querySelector('[data-toggle="collapse"]');
        if (toggle) toggle.classList.add('collapsed');
      }
    });
  });

  // -------- Navbar collapse (mobile menu) --------
  document.querySelectorAll('[data-toggle="collapse"]').forEach(function (btn) {
    var sel = btn.getAttribute('data-target');
    var panel = sel ? document.querySelector(sel) : null;
    if (!panel) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      panel.classList.toggle('in');
      btn.classList.toggle('collapsed');
    });
  });

  // -------- Carousels (hero + reviews) --------
  document.querySelectorAll('.carousel[data-ride="carousel"]').forEach(function (carousel) {
    var items = carousel.querySelectorAll('.carousel-inner > .item');
    if (items.length < 2) return;
    var indicators = carousel.querySelectorAll('.carousel-indicators > li');
    var idx = 0;
    items.forEach(function (it, i) { if (it.classList.contains('active')) idx = i; });
    var intervalMs = 5000;
    var timer;

    var setActive = function (n) {
      items[idx].classList.remove('active');
      if (indicators[idx]) indicators[idx].classList.remove('active');
      idx = (n + items.length) % items.length;
      items[idx].classList.add('active');
      if (indicators[idx]) indicators[idx].classList.add('active');
    };
    var next = function () { setActive(idx + 1); };
    var restart = function () {
      clearInterval(timer);
      timer = setInterval(next, intervalMs);
    };

    carousel.querySelectorAll('[data-slide="next"]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); next(); restart(); });
    });
    carousel.querySelectorAll('[data-slide="prev"]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); setActive(idx - 1); restart(); });
    });
    indicators.forEach(function (li, i) {
      li.addEventListener('click', function (e) { e.preventDefault(); setActive(i); restart(); });
    });

    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', restart);

    restart();
  });

})();
