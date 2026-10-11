class WuaPhotoCarousel extends HTMLElement {
  private dispose?: () => void;

  connectedCallback() {
    if (this.dispose) return;
    const slides = Array.from(this.querySelectorAll<HTMLElement>('.wua-photo-slide'));
    const toggle = this.querySelector<HTMLButtonElement>('.wua-photo-toggle')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const events = new AbortController();
    const options = { signal: events.signal };
    let index = 2;
    let playing = !motion.matches;
    let visible = false;
    let hovered = false;
    let gesture: { id: number; x: number; y: number } | null = null;
    let wheelTotal = 0;
    let lastWheel = -Infinity;

    const render = () => {
      slides.forEach((slide, position) => {
        // Wrap offsets so the previous and next photographs remain adjacent.
        const offset = ((position - index + slides.length + 2) % slides.length) - 2;
        slide.style.setProperty('--offset', String(offset));
        slide.style.setProperty('--scale', offset === 0 ? '1' : '.878');
        slide.style.opacity = Math.abs(offset) > 1 ? '0' : '1';
        if (offset === 0) {
          slide.setAttribute('aria-current', 'true');
          slide.removeAttribute('aria-hidden');
        } else {
          slide.removeAttribute('aria-current');
          slide.setAttribute('aria-hidden', 'true');
        }
      });
      this.dataset.playing = String(playing);
      toggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    };
    const move = (delta: number, manual = false) => {
      if (manual) playing = false;
      index = (index + delta + slides.length) % slides.length;
      render();
    };
    const pause = () => { playing = false; render(); };
    toggle.addEventListener('click', () => { playing = !playing; render(); }, options);
    this.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovered = true; }, options);
    this.addEventListener('pointerleave', () => { hovered = false; }, options);
    this.addEventListener('focusin', event => { if (event.target !== toggle) pause(); }, options);
    this.addEventListener('keydown', event => {
      if (event.target === toggle) return;
      const keys: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, Home: -index, End: slides.length - 1 - index };
      if (event.key in keys) { event.preventDefault(); move(keys[event.key], true); }
      else if (event.key === ' ') { event.preventDefault(); playing = !playing; render(); }
    }, options);
    this.addEventListener('pointerdown', event => {
      if ((event.target as Element).closest('button') || !event.isPrimary || event.button !== 0) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
      pause();
      this.setPointerCapture(event.pointerId);
    }, options);
    this.addEventListener('pointerup', event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dy = gesture.y - event.clientY;
      const dx = gesture.x - event.clientX;
      if (Math.abs(dy) >= 30 && Math.abs(dy) > Math.abs(dx)) move(dy > 0 ? 1 : -1, true);
      gesture = null;
    }, options);
    this.addEventListener('pointercancel', () => { gesture = null; }, options);
    this.addEventListener('wheel', event => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      pause();
      if (performance.now() - lastWheel < 700) return;
      wheelTotal += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.clientHeight : 1);
      if (Math.abs(wheelTotal) >= 40) {
        move(wheelTotal > 0 ? 1 : -1, true);
        wheelTotal = 0;
        lastWheel = performance.now();
      }
    }, { ...options, passive: false });
    motion.addEventListener('change', () => { if (motion.matches) pause(); }, options);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(this);
    const timer = window.setInterval(() => {
      if (playing && visible && !hovered && !document.hidden) move(1);
    }, 4500);
    render();
    this.dispose = () => { events.abort(); observer.disconnect(); clearInterval(timer); this.dispose = undefined; };
  }

  disconnectedCallback() { this.dispose?.(); }
}

if (!customElements.get('wua-photo-carousel')) customElements.define('wua-photo-carousel', WuaPhotoCarousel);
