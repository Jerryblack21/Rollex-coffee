import { prefersReducedMotion } from './motion';

/** Smooth-scrolls to a section and keeps the URL hash in sync. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  if (id === 'home') window.scrollTo({ top: 0, behavior });
  else el.scrollIntoView({ behavior, block: 'start' });
  try {
    history.replaceState(null, '', `#${id}`);
  } catch {
    /* sandboxed iframes may block history changes */
  }
}
