// Map scroll inside the hero wrapper to progress 0→1.
// p = 0: column is translated DOWN by 96px (title baseline sits on viewport bottom).
// p = 1: column at final margin (translateY(0)).

(() => {
  const wrap = document.getElementById('hero-wrap');
  if (!wrap) return;

  const root = document.documentElement;
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

  function update(){
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    const total = rect.height - vh;                    // scrollable distance
    const p = clamp((vh - rect.bottom) / total, 0, 1); // 0→1 as you scroll hero

    root.style.setProperty('--p', p.toFixed(3));

    // If you re-enable the soft title fade in CSS, also add:
    // const fade = clamp(p / 0.20, 0, 1);
    // root.style.setProperty('--fade', fade.toFixed(3));
  }

  update();
  window.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
})();
