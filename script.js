// Sticky overlay driver (no libraries).
// We compute a smooth progress 0→1 across the four steps,
// then map it to: title fade (early), title lift (later), links fade (latest).

(() => {
  const scrolly = document.getElementById('scrolly');
  const steps = Array.from(document.querySelectorAll('.step'));
  if (!scrolly || steps.length === 0) return;

  const root = document.documentElement;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Set up an IntersectionObserver to know which step is active,
  // and also compute a fine-grained progress based on the step's
  // position within the viewport.
  const options = { root: null, rootMargin: '0px 0px -20% 0px', threshold: 0.0 };

  function computeProgress() {
    // We’ll blend progress from all steps to a single 0..1 timeline.
    // Each step contributes a quarter of the timeline (since we have 4 steps).
    // Within a step, we compute local progress from its bounding box.
    let total = 0;

    steps.forEach((step, i) => {
      const rect = step.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // When the step spans the viewport, local goes from 0→1.
      const start = vh * 0.2;   // start contributing when the top reaches ~20% viewport
      const end   = vh * 0.8;   // finish when top passes ~80%
      const local = clamp(1 - (rect.top - start) / (end - start), 0, 1);

      // Each step is worth an equal slice of the total 0..1 timeline
      const slice = 1 / steps.length;
      total += clamp(local, 0, 1) * slice;
    });

    total = clamp(total, 0, 1);
    root.style.setProperty('--p', total.toFixed(3));

    // Map the main progress to the individual effects:
    //  - Title fade: first 30% of the timeline
    //  - Title lift: 30% → 70%
    //  - Links fade: 55% → 90%
    const fade  = clamp(total / 0.30, 0, 1);
    const lift  = clamp((total - 0.30) / 0.40, 0, 1);
    const links = clamp((total - 0.55) / 0.35, 0, 1);

    root.style.setProperty('--fade', fade.toFixed(3));
    root.style.setProperty('--lift', lift.toFixed(3));
    root.style.setProperty('--linksFade', links.toFixed(3));
  }

  // IO just triggers recalculation; we also listen to scroll/resize for smoothness.
  const io = new IntersectionObserver(() => computeProgress(), options);
  steps.forEach(s => io.observe(s));

  computeProgress();
  window.addEventListener('scroll', computeProgress, { passive: true });
  window.addEventListener('resize', computeProgress);
})();
