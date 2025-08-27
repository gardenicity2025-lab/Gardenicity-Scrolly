// ============ Scrollytelling steps (unchanged IO approach) ============
(() => {
  const steps = Array.from(document.querySelectorAll('.step'));
  const caption = document.getElementById('graphic-caption');
  const heroImg = document.getElementById('hero-image');

  const mapping = [
    'assets/placeholder.jpg',
    'assets/placeholder2.jpg',
    'assets/placeholder.jpg',
    'assets/placeholder2.jpg'
  ];

  const options = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0.0 };

  const onEnter = (entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const index = steps.indexOf(el);

      if (entry.isIntersecting) {
        steps.forEach(s => s.classList.remove('is-active'));
        el.classList.add('is-active');

        if (caption) caption.textContent = `Now viewing section ${index + 1}`;
        if (heroImg) heroImg.src = mapping[index % mapping.length];
      }
    });
  };

  const observer = new IntersectionObserver(onEnter, options);
  steps.forEach(step => observer.observe(step));
})();

// ============ Hero scroll-driven animation (image steady, title fades in then rises) ============
(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  let ticking = false;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function updateHeroVars() {
    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // progress p: 0 at top of page; → 1 after ~60% of hero has scrolled
    const visible = vh - rect.top;
    const p = clamp(visible / (rect.height * 0.6), 0, 1);

    // Title progress (fade in then move): start around 10%, done by ~40%
    const tp = clamp((p - 0.10) / 0.30, 0, 1);

    // Links progress: start revealing after ~50%
    const lp = clamp((p - 0.50) / 0.40, 0, 1);

    hero.style.setProperty('--p', p.toFixed(3));
    hero.style.setProperty('--tp', tp.toFixed(3));
    hero.style.setProperty('--lp', lp.toFixed(3));
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeroVars();
        ticking = false;
      });
      ticking = true;
    }
  }

  // init + listeners
  updateHeroVars();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
