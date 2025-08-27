// ============ Step observer (kept) ============
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

// ============ Hero scroll effects are DISABLED for baseline ============
// (We’ll re-enable once layout/size look right.)
