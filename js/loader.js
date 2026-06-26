/* ============================================
   SKILLGRID — LOADER
   Page load animation
   ============================================ */

(function () {
    'use strict';

    const loader = document.getElementById('loader');
    if (!loader) return;

    // Minimum loader display time for smooth UX
    const MIN_DURATION = 1800;
    const startTime = Date.now();

    function hideLoader() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DURATION - elapsed);

        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove from DOM after transition for performance
            setTimeout(() => {
                loader.remove();
                document.body.classList.add('loaded');
            }, 600);
        }, remaining);
    }

    // Wait for everything to be ready
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // Safety net — never let loader hang
    setTimeout(hideLoader, 5000);
})();