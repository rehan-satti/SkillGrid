/* ============================================
   SKILLGRID — CONTACT PAGE SCRIPT
   Form Validation, FAQ Accordion, Interactions
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initContactForm();
        initFaqAccordion();
        initCharCounter();
        initReadProgress();
    });

    /* ============================================================
       FORM VALIDATION
    ============================================================ */
    function initContactForm() {
        const form       = document.getElementById('contactForm');
        const submitBtn  = document.getElementById('submitBtn');
        const successEl  = document.getElementById('formSuccess');
        const errorGlobal = document.getElementById('formErrorGlobal');
        if (!form) return;

        // Field refs
        const fields = {
            name:    { el: document.getElementById('fullName'),    err: document.getElementById('nameError'),    group: document.getElementById('nameGroup') },
            email:   { el: document.getElementById('emailAddress'),err: document.getElementById('emailError'),   group: document.getElementById('emailGroup') },
            subject: { el: document.getElementById('subject'),     err: document.getElementById('subjectError'), group: document.getElementById('subjectGroup') },
            message: { el: document.getElementById('message'),     err: document.getElementById('messageError'), group: document.getElementById('messageGroup') },
            privacy: { el: document.getElementById('privacyCheck'),err: document.getElementById('privacyError'), group: document.getElementById('privacyGroup') },
        };

        /* --- validators --- */
        function validateName(val) {
            if (!val.trim()) return 'Full name is required.';
            if (val.trim().length < 2) return 'Name must be at least 2 characters.';
            if (val.trim().length > 80) return 'Name must be under 80 characters.';
            return '';
        }

        function validateEmail(val) {
            if (!val.trim()) return 'Email address is required.';
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!re.test(val.trim())) return 'Please enter a valid email address.';
            return '';
        }

        function validateSubject(val) {
            if (!val) return 'Please select a subject.';
            return '';
        }

        function validateMessage(val) {
            if (!val.trim()) return 'Message cannot be empty.';
            if (val.trim().length < 10) return 'Message must be at least 10 characters.';
            return '';
        }

        function validatePrivacy(checked) {
            if (!checked) return 'You must agree to the Privacy Policy.';
            return '';
        }

        const validators = {
            name:    () => validateName(fields.name.el.value),
            email:   () => validateEmail(fields.email.el.value),
            subject: () => validateSubject(fields.subject.el.value),
            message: () => validateMessage(fields.message.el.value),
            privacy: () => validatePrivacy(fields.privacy.el.checked),
        };

        /* --- UI helpers --- */
        function setFieldState(key, error) {
            const { err, group } = fields[key];
            if (error) {
                err.textContent = error;
                group.classList.remove('is-valid');
                group.classList.add('is-invalid');
            } else {
                err.textContent = '';
                group.classList.remove('is-invalid');
                group.classList.add('is-valid');
            }
        }

        function clearFieldState(key) {
            const { err, group } = fields[key];
            err.textContent = '';
            group.classList.remove('is-valid', 'is-invalid');
        }

        /* --- Live validation on blur / change --- */
        Object.keys(fields).forEach(key => {
            const el = fields[key].el;
            const eventType = (key === 'privacy') ? 'change' : 'blur';

            el.addEventListener(eventType, function () {
                const error = validators[key]();
                setFieldState(key, error);
            });

            // Clear error state on input/change (while typing)
            el.addEventListener('input', function () {
                if (fields[key].group.classList.contains('is-invalid')) {
                    const error = validators[key]();
                    setFieldState(key, error);
                }
            });
        });

        /* --- Submit --- */
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            hideMessages();

            // Validate all fields
            let hasError = false;
            Object.keys(validators).forEach(key => {
                const error = validators[key]();
                setFieldState(key, error);
                if (error) hasError = true;
            });

            if (hasError) {
                errorGlobal.classList.add('visible');
                // Scroll to first error
                const firstError = form.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const input = firstError.querySelector('input, select, textarea');
                    if (input) input.focus();
                }
                return;
            }

            // Simulate async submission
            submitBtn.classList.add('loading');

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                successEl.classList.add('visible');
                form.reset();

                // Clear all field states after reset
                Object.keys(fields).forEach(key => clearFieldState(key));

                // Reset char counter
                const cc = document.getElementById('charCount');
                if (cc) { cc.textContent = '0 / 1000'; cc.className = 'char-count'; }

                // Scroll to success message
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Auto-hide success after 8s
                setTimeout(function () {
                    successEl.classList.remove('visible');
                }, 8000);
            }, 1800);
        });

        function hideMessages() {
            successEl.classList.remove('visible');
            errorGlobal.classList.remove('visible');
        }
    }

    /* ============================================================
       CHARACTER COUNTER
    ============================================================ */
    function initCharCounter() {
        const textarea = document.getElementById('message');
        const counter  = document.getElementById('charCount');
        if (!textarea || !counter) return;

        const MAX = 1000;

        textarea.addEventListener('input', function () {
            const len = this.value.length;
            counter.textContent = len + ' / ' + MAX;
            counter.className = 'char-count';
            if (len >= MAX * 0.9) counter.classList.add('warn');
            if (len >= MAX)       counter.classList.add('over');
        });
    }

    /* ============================================================
       FAQ ACCORDION
    ============================================================ */
    function initFaqAccordion() {
        const items = document.querySelectorAll('.contact-faq .faq-item');
        if (!items.length) return;

        items.forEach(function (item) {
            const btn = item.querySelector('.faq-question');
            if (!btn) return;

            btn.addEventListener('click', function () {
                const isOpen = item.classList.contains('active');

                // Close all
                items.forEach(function (i) {
                    i.classList.remove('active');
                    const q = i.querySelector('.faq-question');
                    if (q) q.setAttribute('aria-expanded', 'false');
                });

                // Open clicked (toggle)
                if (!isOpen) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ============================================================
       READ PROGRESS BAR (if present)
    ============================================================ */
    function initReadProgress() {
        const bar = document.getElementById('progressBar');
        if (!bar) return;

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = Math.min(progress, 100) + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
    }

})();
