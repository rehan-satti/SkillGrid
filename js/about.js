/* ============================================
   SKILLGRID — ABOUT PAGE SCRIPT
   (No inline JS)
   ============================================ */

(function () {
  'use strict';

  function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    const onScroll = function () {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = Math.min(pct, 100) + '%';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const toggle = function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    };

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initHeroReveals() {
    const hero = document.querySelector('.hero-about');
    if (!hero) return;

    const reveals = hero.querySelectorAll('.reveal');
    reveals.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('active');
      }, 300 + i * 150);
    });
  }

  function initTimeline() {
    const items = document.querySelectorAll('.tl-item');
    if (!items.length) return;

    items.forEach(function (item) {
      const isLeft = item.classList.contains('tl-left');
      item.style.opacity = '0';
      item.style.transform = 'translateX(' + (isLeft ? '-40px' : '40px') + ')';
    });

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        });
      },
      { threshold: 0.2 }
    );

    items.forEach(function (item, i) {
      item.style.transition =
        'opacity .65s ease, transform .65s cubic-bezier(.4,0,.2,1) ' + (i * 0.12) + 's';
      io.observe(item);
    });
  }

  function initCounters() {
    const sec = document.querySelector('.stats-section');
    if (!sec) return;

    function animCounter(el) {
      const target = +el.dataset.target;
      const steps = 80;
      let f = 0;

      function tick() {
        f++;
        const next =
          f === steps
            ? target
            : Math.floor((1 - Math.pow(1 - f / steps, 3)) * target);
        el.textContent = String(next);
        if (f < steps) requestAnimationFrame(tick);
      }

      tick();
    }

    const io = new IntersectionObserver(
      function (entries) {
        const e = entries[0];
        if (!e || !e.isIntersecting) return;
        sec.querySelectorAll('.stat-num').forEach(animCounter);
        io.disconnect();
      },
      { threshold: 0.3 }
    );

    io.observe(sec);
  }

  function initTeamTilt() {
    const canHover = function () {
      return !window.matchMedia('(hover:none)').matches;
    };

    document.querySelectorAll('.team-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        if (!canHover()) return;
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        card.style.transform =
          'translateY(-12px) rotateX(' + (-dy * 5).toFixed(1) + 'deg) rotateY(' + (dx * 5).toFixed(1) + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  function initCultureLightbox() {
    const items = document.querySelectorAll('.culture-item');
    if (!items.length) return;

    function closeLightbox(lb) {
      if (!lb) return;
      lb.style.opacity = '0';
      lb.style.transition = 'opacity .25s';
      setTimeout(function () {
        lb.remove();
      }, 260);
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        const old = document.getElementById('lightbox');
        if (old) old.remove();

        const lb = document.createElement('div');
        lb.id = 'lightbox';

        const img = document.createElement('img');
        const imgEl = item.querySelector('img');
        img.src = imgEl ? imgEl.src : '';
        img.alt = imgEl ? imgEl.alt : '';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lb-close';
        closeBtn.innerHTML = '<i class="fas fa-xmark"></i>';

        closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          closeLightbox(lb);
        });

        lb.addEventListener('click', function () {
          closeLightbox(lb);
        });

        document.addEventListener(
          'keydown',
          function (e) {
            if (e.key === 'Escape') closeLightbox(lb);
          },
          { once: true }
        );

        lb.append(img, closeBtn);
        document.body.append(lb);
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function initLazyImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      if (img.complete) img.classList.add('loaded');
      else img.addEventListener('load', function () {
        img.classList.add('loaded');
      });
    });
  }

  function initNavbarAndLoader() {
    // loader.js + main.js handle most.
    // keep about-specific hero reveal and counters.
    initHeroReveals();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProgressBar();
    initBackToTop();
    initTimeline();
    initCounters();
    initTeamTilt();
    initCultureLightbox();
    initLazyImages();
    initNavbarAndLoader();
  });
})();

