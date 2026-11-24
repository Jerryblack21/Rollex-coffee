import { useRef } from 'react';
import { ArrowRight, Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { PLACEHOLDERS, SITE } from '../config/site';
import { useSectionAnimations } from '../hooks/useSectionAnimations';
import { scrollToSection } from '../lib/scroll';
import SplitHeading from './SplitHeading';

export const socials = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, href: SITE.social.instagram },
  { key: 'facebook', label: 'Facebook', icon: Facebook, href: SITE.social.facebook },
  { key: 'youtube', label: 'YouTube', icon: Youtube, href: SITE.social.youtube },
] as const;

export const contactHref = SITE.phone ? `tel:${SITE.phone.replace(/\s+/g, '')}` : SITE.email ? `mailto:${SITE.email}` : '';

function Info({ icon: Icon, title, value, placeholder }: { icon: typeof MapPin; title: string; value: string; placeholder: string }) {
  return (
    <div className="card-surface flex gap-4 rounded-2xl p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">{title}</h3>
        <p className={`mt-1 ${value ? 'text-cream' : 'italic text-cream/50'}`}>{value || placeholder}</p>
      </div>
    </div>
  );
}

export default function VisitSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionAnimations(ref);

  return (
    <section id="visit" ref={ref} aria-labelledby="visit-title" className="section-pad relative bg-[linear-gradient(180deg,#101010,#241812)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Visit us</p>
          <SplitHeading as="h2" text="COME FOR THE COFFEE. STAY FOR THE FEELING." className="font-display text-[clamp(2.1rem,4.8vw,4rem)] font-bold leading-[1.05] text-cream" />
          <span id="visit-title" className="sr-only">Visit Rollex Coffee</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div data-stagger className="grid gap-4">
            <Info icon={MapPin} title="Café address" value={SITE.address} placeholder={PLACEHOLDERS.address} />
            <Info icon={Phone} title="Phone" value={SITE.phone} placeholder={PLACEHOLDERS.phone} />
            <Info icon={Clock} title="Opening hours" value={SITE.hours} placeholder={PLACEHOLDERS.hours} />
            <div className="card-surface flex flex-wrap items-center gap-3 rounded-2xl p-5">
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Follow</span>
              {socials.map(({ key, label, icon: Icon, href }) =>
                href ? (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold transition hover:bg-gold hover:text-charcoal">
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ) : (
                  <span key={key} role="img" aria-label={`${label} — link not added yet`} title={`${label} link not added yet (src/config/site.ts)`} className="grid h-11 w-11 place-items-center rounded-full border border-dashed border-gold/30 text-gold/50">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                ),
              )}
            </div>
          </div>

          <div data-reveal className="card-surface relative min-h-[22rem] overflow-hidden rounded-3xl">
            {SITE.mapsEmbedUrl ? (
              <iframe title="Rollex Coffee on Google Maps" src={SITE.mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0 grayscale-[.3] invert-[.92] hue-rotate-180" />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#2d4a56,#141414_70%)] p-8 text-center">
                <div>
                  <MapPin size={40} className="mx-auto text-gold" aria-hidden="true" />
                  <p className="mt-4 font-display text-2xl text-cream">Google Maps location</p>
                  <p className="mt-2 text-sm text-cream/60">Add <code className="text-gold">mapsEmbedUrl</code> in src/config/site.ts to show the map here.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {SITE.mapsUrl ? (
            <a className="btn-gold" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin size={16} aria-hidden="true" /> Get Directions
            </a>
          ) : (
            <button type="button" className="btn-gold" onClick={() => scrollToSection('visit')} title="Add mapsUrl in src/config/site.ts">
              <MapPin size={16} aria-hidden="true" /> Get Directions
            </button>
          )}
          {contactHref ? (
            <a className="btn-ghost" href={contactHref}>
              <Mail size={16} aria-hidden="true" /> Contact Us
            </a>
          ) : (
            <button type="button" className="btn-ghost" onClick={() => scrollToSection('visit')} title="Add phone or email in src/config/site.ts">
              <Mail size={16} aria-hidden="true" /> Contact Us
            </button>
          )}
          <button type="button" className="btn-ghost" onClick={() => scrollToSection('menu')}>
            Explore Menu <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
