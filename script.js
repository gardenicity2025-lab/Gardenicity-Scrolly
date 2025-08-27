// On load: hero image fades (CSS).
// On scroll over a defined window:
//   - Title fades in (baseline), then rises slightly.
//   - Links stay fixed; we reveal them by reducing a bottom clip-mask and
//     also fade them for polish.

(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const root = document.documentElement;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function update() {
    const heroTop = hero.offsetTop;
    const vh = window.innerHeight;

    // Animate between ~10% and ~85% of the viewport across the hero
    const start = heroTop + 0.10 * vh;
    const end   = heroTop + 0.85 * vh;
    const y = window.scrollY;
    const p = clamp((y - start) / (end - start), 0, 1);

    // Title: fade in during the first 35% of the window, then lift for the rest
    const tFade = clamp(p / 0.35, 0, 1);
    const tLift = clamp((p - 0.35) / 0.65, 0, 1);

    // Links: reveal by shrinking the bottom mask from ~170px → 0,
    // and also cross-fade for polish starting around 55%.
    const maskStart = 170; // px; matches CSS initial --linksMask
    const maskNow = clamp(maskStart * (1 - p), 0, maskStart);
    const linksFade = clamp((p - 0.55) / 0.35, 0, 1);

    root.style.setProperty('--tFade', tFade.toFixed(3));
    root.style.setProperty('--tLift', tLift.toFixed(3));
    root.style.setProperty('--linksMask', `${maskNow.toFixed(1)}px`);
    root.style.setProperty('--linksFade', linksFade.toFixed(3));
  }

  update(); // run once
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
