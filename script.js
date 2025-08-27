// Column-slide scrolly:
// - The hero image is sticky and fades in on load (CSS).
// - We compute a smooth 0→1 progress across the hero wrapper.
// - Early portion: fade the title.
// - Over the whole window: slide the ENTIRE text column up by an exact amount
//   such that links (same column) scroll into the clipping viewport.

(() => {
  const wrap  = document.getElementById('hero-wrap');
  const media = document.getElementById('hero-media');
  const col   = document.getElementById('hero-col');
  const title = document.getElementById('hero-title');
  const links = document.getElementById('hero-links');
  if (!wrap || !media || !col || !title || !links) return;

  const root = document.documentElement;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Compute how far the column must slide so that links are fully visible.
  function computeShiftPx() {
    // distance from top of the column to the bottom edge of the clipping viewport
    const mediaRect = media.getBoundingClientRect();
    const colRect   = col.getBoundingClientRect();
    const linksRect = links.getBoundingClientRect();

    // Offsets relative to the column
    const linksTopInCol = linksRect.top - colRect.top;
    const linksBottomInCol = linksTopInCol + linksRect.height;

    // We want the bottom of links to be inside the media viewport bottom.
    // How many pixels must we move the column up so that linksBottom aligns
    // with media height? (Clamp to >= 0)
    const needed = Math.max(0, linksBottomInCol - media.clientHeight);
    return needed;
  }

  let targetShiftPx = 0;

  function measure() {
    // Measure after layout; add a small buffer (e.g., 12px breathing room)
    targetShiftPx = computeShiftPx() + 12;
  }

  function update() {
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // progress 0→1 while wrapper scrolls through viewport
    const total = rect.height - vh;
    const progressed = clamp((vh - rect.bottom) / total, 0, 1);

    // Title fade during first 25% of sequence
    const fade = clamp(progressed / 0.25, 0, 1);

    // Column shift: interpolate 0 → targetShiftPx across the WHOLE sequence
    const colShift = targetShiftPx * progressed;

    root.style.setProperty('--fade', fade.toFixed(3));
    root.style.setProperty('--colShiftPx', `${colShift.toFixed(1)}px`);
  }

  // Initial measure after images/fonts load; then update on scroll/resize
  function init() {
    measure();
    update();
  }

  // Try to re-measure after load in case fonts change metrics
  window.addEventListener('load', () => { measure(); update(); });

  init();
  window.addEventListener('resize', () => { measure(); update(); });
  window.addEventListener('scroll', update, { passive: true });
})();

