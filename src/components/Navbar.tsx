import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'story', label: 'Our Story' },
  { id: 'visit', label: 'Visit Us' },
] as const;

/** Page sections → the nav item that should light up while they are on screen. */
const SECTION_TO_NAV: Record<string, string> = {
  home: 'home',
  coffee: 'coffee',
  buns: 'menu',
  momos: 'menu',
  burgers: 'menu',
  milkshakes: 'menu',
  juices: 'menu',
  snacks: 'menu',
  menu: 'menu',
  favourites: 'favourites',
  story: 'story',
  visit: 'visit',
};

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`} aria-label="Rollex Coffee">
      <span className="gold-text font-display text-2xl font-bold tracking-[0.12em]">ROLLEX</span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.5em] text-cream/80">Coffee</span>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active-section tracking (IntersectionObserver: no scroll handler cost).
  useEffect(() => {
    const ids = Object.keys(SECTION_TO_NAV);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best = '';
        let bestRatio = 0;
        visible.forEach((r, id) => {
          if (r > bestRatio) {
            best = id;
            bestRatio = r;
          }
        });
        if (best) setActive(SECTION_TO_NAV[best]);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.01, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Drawer: lock scroll, Escape to close, return focus.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  const go = useCallback((id: string) => {
    setOpen(false);
    // wait a frame so the body scroll lock is released before scrolling
    requestAnimationFrame(() => scrollToSection(id));
  }, []);

  const linkClass = (id: string) =>
    `relative py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors ${
      active === id ? 'text-gold' : 'text-cream/80 hover:text-gold'
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-gold/15 py-2.5 shadow-[0_10px_40px_-20px_#000]' : 'bg-gradient-to-b from-black/60 to-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12" aria-label="Primary">
          <a href="#home" onClick={(e) => (e.preventDefault(), go('home'))} aria-label="Rollex Coffee — back to top">
            <Logo />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => (e.preventDefault(), go(l.id))}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={linkClass(l.id)}
                >
                  {l.label}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold"
                    initial={false}
                    animate={{ scaleX: active === l.id ? 1 : 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </a>
              </li>
            ))}
          </ul>

          <a href="#menu" onClick={(e) => (e.preventDefault(), go('menu'))} className="btn-gold hidden !px-5 !py-2.5 lg:inline-flex">
            Explore Menu
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,380px)] flex-col border-l border-gold/20 bg-charcoal p-7 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button ref={closeRef} type="button" aria-label="Close navigation menu" className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold" onClick={() => setOpen(false)}>
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <ul className="mt-12 flex flex-1 flex-col gap-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.li key={l.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                    <a
                      href={`#${l.id}`}
                      onClick={(e) => (e.preventDefault(), go(l.id))}
                      className={`block border-b border-cream/10 py-4 font-display text-3xl ${active === l.id ? 'gold-text' : 'text-cream'}`}
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a href="#menu" onClick={(e) => (e.preventDefault(), go('menu'))} className="btn-gold">
                Explore Menu
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
