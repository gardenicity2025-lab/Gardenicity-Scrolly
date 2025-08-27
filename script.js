// Drive a simple scroll window for the hero:
// - Title fades on the baseline (first third)
// - Then title lifts slightly (second third)
// - Bottom mask opens to reveal links (final third)

(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const root = document.documentElement;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function update() {
    const heroTop = hero.offsetTop;
    const vh = window.innerHeight;

    // Define a scroll window starting slightly into the hero and
    // ending before you leave it. Adjust these two numbers to taste.
    const start = heroTop + 0.10 * vh;
    const end   = heroTop + 0.85 * vh;
    const y = window.scrollY;

    const p = clamp((y - start) / (end - start), 0, 1); // 0→1 across window

    // Split the window into thirds:
    // 0→0.33: title fades in
    // 0.33→0.66: title lifts
    // 0.66→1.00: links reveal (mask opens)
    const fade   = clamp(p / 0.33, 0, 1);
    const lift   = clamp((p - 0.33) / 0.33, 0, 1);
    const reveal = clamp((p - 0.66) / 0.34, 0, 1);

    root.style.setProperty('--titleFade', fade.toFixed(3));
    root.style.setProperty('--titleLift', lift.toFixed(3));
    root.style.setProperty('--reveal', reveal.toFixed(3));
  }

  // Init + listeners
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
