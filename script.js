// Scroll-driven animation for the HERO only.
// Title: fade on baseline, then rise slightly.
// Links: fade in after the title has moved.

(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  let ticking = false;

  function updateVars() {
    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // Overall progress p: 0 when top hits viewport, 1 after ~60% hero has scrolled
    const visible = vh - rect.top;
    const p = clamp(visible / (rect.height * 0.6), 0, 1);

    // Title progress: start around 10%, finish by ~40% (fade + slight rise)
    const tp = clamp((p - 0.10) / 0.30, 0, 1);

    // Links progress: start after ~45%, finish by ~85% (fade only)
    const lp = clamp((p - 0.45) / 0.40, 0, 1);

    document.documentElement.style.setProperty('--p', p.toFixed(3));
    document.documentElement.style.setProperty('--tp', tp.toFixed(3));
    document.documentElement.style.setProperty('--lp', lp.toFixed(3));
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateVars();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Init + listeners
  updateVars();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
