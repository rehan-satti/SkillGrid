/* ============================================
   SKILLGRID — SERVICES PAGE
   Search, Filter, and Interactions
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initSearch();
        initFilter();
        initFavoriteToggle();
        initScrollReveal();
        initBackToTop();
        initImageFade();
        initCardTilt();
        initMobileMenu();
    }

    // ============ SEARCH FUNCTIONALITY ============
    function initSearch() {
        const searchInput = document.getElementById('serviceSearch');
        const searchBtn   = document.getElementById('searchBtn');
        const noResults   = document.getElementById('noResults');
        const resultsCount = document.getElementById('resultsCount');

        if (!searchInput) return;

        function performSearch() {
            const query       = searchInput.value.toLowerCase().trim();
            const activeTab   = document.querySelector('.filter-tab.active');
            const activeFilter = activeTab ? activeTab.dataset.filter : 'all';
            filterCards(query, activeFilter, noResults, resultsCount);
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 200);
        });

        // Handle URL search parameter on page load
        const urlParams  = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            searchInput.value = searchQuery;
            performSearch();
        }
    }

    // ============ FILTER TABS ============
    function initFilter() {
        const tabs         = document.querySelectorAll('.filter-tab');
        const noResults    = document.getElementById('noResults');
        const resultsCount = document.getElementById('resultsCount');
        const searchInput  = document.getElementById('serviceSearch');

        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;
                const query  = searchInput ? searchInput.value.toLowerCase().trim() : '';
                filterCards(query, filter, noResults, resultsCount);
            });
        });
    }

    // ============ SHARED FILTER LOGIC ============
    function filterCards(query, filter, noResults, resultsCount) {
        const cards = document.querySelectorAll('.service-card-full');
        let visibleCount = 0;

        cards.forEach(card => {
            const title      = (card.dataset.title || '').toLowerCase();
            const freelancer = (card.dataset.freelancer || '').toLowerCase();
            const category   = (card.dataset.category || '').toLowerCase();
            const cardTitle  = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
            const cardDesc   = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();

            const categoryMatch = filter === 'all' || category === filter;
            const searchMatch   = query === '' ||
                                  title.includes(query) ||
                                  freelancer.includes(query) ||
                                  category.includes(query) ||
                                  cardTitle.includes(query) ||
                                  cardDesc.includes(query);

            if (categoryMatch && searchMatch) {
                card.style.display = '';
                card.style.opacity = '';
                card.style.transform = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} service${visibleCount !== 1 ? 's' : ''}`;
        }

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
        }
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

        // Safety net
        setTimeout(() => {
            reveals.forEach(el => el.classList.add('active'));
        }, 2000);
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

    // ============ CARD TILT ============
    function initCardTilt() {
        const cards = document.querySelectorAll('.service-card-full');
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

    // ============ MOBILE MENU ============
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu   = document.getElementById('navMenu');
        const navLinks  = document.querySelectorAll('.nav-menu .nav-link');

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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

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
})();