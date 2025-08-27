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

// ============ Hero scroll-driven animation ============
(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  let ticking = false;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function updateHeroVars() {
    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // progress p: 0 when hero top is at/below top; → 1 after ~60% of hero has scrolled
    const visible = vh - rect.top;           // how far the top has entered
    const p = clamp(visible / (rect.height * 0.6), 0, 1);

    // links progress: start revealing around mid-progress
    const lp = clamp((p - 0.5) / 0.5, 0, 1);

    hero.style.setProperty('--p', p.toFixed(3));
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
