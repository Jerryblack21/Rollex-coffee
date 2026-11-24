import { CATEGORIES } from '../data/menu';
import { PLACEHOLDERS, SITE } from '../config/site';
import { scrollToSection } from '../lib/scroll';
import { Logo, NAV_LINKS } from './Navbar';
import { GoldDust } from './Particles';
import { socials } from './VisitSection';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_120%,#39251C,#101010_65%)] px-5 pb-10 pt-20 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-48 w-[60%] -translate-x-1/2 rounded-full bg-gold/10 blur-[90px]" />
      <GoldDust count={12} className="opacity-40" />
      <div className="relative mx-auto max-w-7xl">
        <p className="gold-text text-center font-display text-[clamp(1.6rem,4.2vw,3.4rem)] font-bold uppercase leading-tight">
          GOOD COFFEE. GREAT FOOD. GOOD TIMES.
        </p>

        <div className="mt-16 grid gap-10 border-t border-gold/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="items-start" />
            <p className="mt-4 max-w-xs text-sm text-cream/60">Fresh brews. Delicious bites. Unforgettable moments.</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="eyebrow mb-4">Explore</h2>
            <ul className="space-y-2 text-sm text-cream/80">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => (e.preventDefault(), scrollToSection(l.id))} className="transition hover:text-gold">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Menu categories">
            <h2 className="eyebrow mb-4">Menu</h2>
            <ul className="space-y-2 text-sm text-cream/80">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a href="#menu" onClick={(e) => (e.preventDefault(), scrollToSection('menu'))} className="transition hover:text-gold">{c.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="eyebrow mb-4">Contact</h2>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className={SITE.address ? '' : 'italic text-cream/45'}>{SITE.address || PLACEHOLDERS.address}</li>
              <li className={SITE.phone ? '' : 'italic text-cream/45'}>{SITE.phone || PLACEHOLDERS.phone}</li>
              <li className={SITE.hours ? '' : 'italic text-cream/45'}>{SITE.hours || PLACEHOLDERS.hours}</li>
            </ul>
            <div className="mt-5 flex gap-3">
              {socials.map(({ key, label, icon: Icon, href }) =>
                href ? (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold transition hover:bg-gold hover:text-charcoal">
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <span key={key} role="img" aria-label={`${label} — link not added yet`} className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-gold/30 text-gold/50">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        <p className="mt-14 text-center text-xs text-cream/40">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
