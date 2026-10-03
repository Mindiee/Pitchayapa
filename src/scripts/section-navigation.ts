/** Keep anchor state in sync with actual section positions, including tall
 * sections, direct hashes, scroll restoration, and the end of a short page. */
export function setupSectionNavigation() {
  const nav = document.querySelector<HTMLElement>('.section-nav');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  let queued = false;
  let current = '';

  const update = () => {
    queued = false;
    const boundary = nav.getBoundingClientRect().bottom + 24;
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= boundary) activeIndex = index;
    });
    // The last section can be shorter than the viewport, so its top may never
    // reach the sticky nav. Reaching the document end still enters that section.
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      activeIndex = links.length - 1;
    }
    const activeLink = links[activeIndex];
    if (!activeLink || activeLink.hash === current) return;
    current = activeLink.hash;
    links.forEach(link => {
      if (link === activeLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    // Reveal the current item inside the horizontal mobile nav without moving
    // the document or interrupting the user's vertical scroll.
    const navBox = nav.getBoundingClientRect();
    const linkBox = activeLink.getBoundingClientRect();
    if (linkBox.left < navBox.left || linkBox.right > navBox.right) {
      nav.scrollLeft += linkBox.left - navBox.left - (navBox.width - linkBox.width) / 2;
    }
  };
  const schedule = () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', schedule);
  window.addEventListener('load', schedule, { once: true });
  document.fonts.ready.then(schedule);
  update();
}
