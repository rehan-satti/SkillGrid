/* ============================================
   SKILLGRID — MAIN SCRIPT
   Navigation, Animations, Interactions
   ============================================ */

(function () {
    'use strict';

    // ============ DOM READY ============
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavbar();
        initMobileMenu();
        initScrollReveal();
        initSmoothScroll();
        initCounterAnimation();
        initTrustBarCounters();
        initFilterTabs();
        initBackToTop();
        initImageFade();
        initCardTilt();
        initFavoriteToggle();
        initActiveNavLink();
        initReadProgress();
    }

    // ============ NAVBAR ============
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;

        function handleScroll() {
            const currentScroll = window.pageYOffset;

            // Add 'scrolled' class when past hero
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide on scroll down, show on scroll up (mobile)
            if (window.innerWidth <= 768) {
                if (currentScroll > lastScroll && currentScroll > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            lastScroll = currentScroll;
        }

        window.addEventListener('scroll', throttle(handleScroll, 10), { passive: true });
    }

    // ============ MOBILE MENU ============
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');

        if (!hamburger || !navMenu) return;

        function toggleMenu() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            hamburger.setAttribute(
                'aria-expanded',
                hamburger.classList.contains('active').toString()
            );
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        hamburger.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (
                navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                closeMenu();
            }
        });
    }

    // ============ SCROLL REVEAL ============
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        if (!reveals.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.05,
                rootMargin: '0px 0px -30px 0px'
            }
        );

        reveals.forEach(el => observer.observe(el));

        // Safety net: reveal everything after 2s even if observer didn't fire
        setTimeout(() => {
            reveals.forEach(el => el.classList.add('active'));
        }, 2000);
    }

    // ============ SMOOTH SCROLL ============
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============ COUNTER ANIMATION ============
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-num[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ============ FILTER TABS ============
    function initFilterTabs() {
        const tabs = document.querySelectorAll('.filter-tab');
        const cards = document.querySelectorAll('.service-card');
        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;

                // Filter cards with animation
                cards.forEach((card, index) => {
                    const matches = filter === 'all' || card.dataset.category === filter;

                    if (matches) {
                        card.style.display = '';
                        // Re-trigger reveal animation
                        card.classList.remove('active');
                        setTimeout(() => {
                            card.style.animation = 'none';
                            card.offsetHeight; // reflow
                            card.style.animation = '';
                            card.classList.add('active');
                        }, 50 + index * 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ============ BACK TO TOP ============
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        function toggleVisibility() {
            if (window.pageYOffset > 600) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', throttle(toggleVisibility, 100), { passive: true });
    }

    // ============ IMAGE FADE-IN ============
    function initImageFade() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        if (!images.length) return;

        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => img.classList.add('loaded'));
                img.addEventListener('error', () => img.classList.add('loaded'));
            }
        });
    }

    // ============ CARD TILT (subtle) ============
    function initCardTilt() {
        const cards = document.querySelectorAll('.service-card');
        if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // ============ SEARCH BOX ============
    function initSearchBox() {
        // Hero search on index.html
        const heroSearch = document.getElementById('heroSearch');
        const heroSearchBtn = document.getElementById('heroSearchBtn');
        
        if (heroSearch && heroSearchBtn) {
            heroSearchBtn.addEventListener('click', () => {
                const query = heroSearch.value.trim();
                if (query) {
                    window.location.href = 'pages/services.html?search=' + encodeURIComponent(query);
                } else {
                    window.location.href = 'pages/services.html';
                }
            });

            heroSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = heroSearch.value.trim();
                    if (query) {
                        window.location.href = 'pages/services.html?search=' + encodeURIComponent(query);
                    } else {
                        window.location.href = 'pages/services.html';
                    }
                }
            });
        }

        // Search tags → redirect to services
        const tags = document.querySelectorAll('.search-tags a, .pop-tag');
        tags.forEach(tag => {
            tag.addEventListener('click', function (e) {
                e.preventDefault();
                const text = this.textContent.trim();
                if (text) {
                    // Determine relative path based on current page
                    const isRoot = !window.location.pathname.includes('/pages/');
                    const base = isRoot ? 'pages/services.html' : 'services.html';
                    window.location.href = base + '?search=' + encodeURIComponent(text);
                }
            });
        });
    }

    // ============ FAVORITE TOGGLE ============
    function initFavoriteToggle() {
        const favoriteButtons = document.querySelectorAll('.quick-view');

        favoriteButtons.forEach(btn => {
            const icon = btn.querySelector('i');
            if (!icon) return;

            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    btn.style.background = '#e74c3c';
                    btn.style.color = 'white';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    btn.style.background = '';
                    btn.style.color = '';
                }
            });
        });
    }

    // ============ TRUST BAR COUNTERS ============
    function initTrustBarCounters() {
        const counters = document.querySelectorAll('.trust-num[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateTrustCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => observer.observe(counter));
    }

    function animateTrustCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }

        requestAnimationFrame(update);
    }

    // ============ UTILITIES ============
    function throttle(fn, wait) {
        let last = 0;
        return function (...args) {
            const now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn.apply(this, args);
            }
        };
    }

    function debounce(fn, wait) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // ============ ACTIVE NAV LINK ============
    function initActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            // Remove existing active from non-current links
            const hrefPath = href.split('?')[0].split('#')[0];
            if (
                hrefPath &&
                (currentPath.endsWith(hrefPath) || currentPath.endsWith(hrefPath.replace('../', '')))
            ) {
                link.classList.add('active');
            }
        });
    }

    // ============ READ PROGRESS BAR ============
    function initReadProgress() {
        const bar = document.getElementById('progressBar');
        if (!bar) return;

        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = Math.min(progress, 100) + '%';
        }

        window.addEventListener('scroll', throttle(updateProgress, 16), { passive: true });
    }
})();