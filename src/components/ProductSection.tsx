import { ReactNode, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { CategoryId, MenuItem } from '../data/menu';
import { useSectionAnimations } from '../hooks/useSectionAnimations';
import ItemCard from './ItemCard';
import SplitHeading from './SplitHeading';

interface Props {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: MenuItem[];
  icon: LucideIcon;
  /** Optional per-item icon override. */
  iconFor?: (item: MenuItem) => LucideIcon;
  media: ReactNode;
  mediaSide?: 'left' | 'right';
  tone?: 'charcoal' | 'espresso';
  /** Group items under sub-headings by `item.group`. */
  grouped?: boolean;
  /** Category filter pills (used for sandwiches + snacks). */
  filters?: { id: CategoryId; label: string }[];
  note?: string;
}

/** Soft-edged media frame: layered parallax glow + scrubbed tilt on the visual. */
export function MediaFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto aspect-[4/4.4] w-full max-w-md ${className}`}>
      <div data-parallax="0.08" aria-hidden="true" className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle,rgba(214,177,94,.42),transparent_68%)] blur-2xl" />
      <div data-parallax="0.12" className="absolute inset-0">
        <div data-tilt className="h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export const fadeEdge = { maskImage: 'radial-gradient(closest-side at 50% 50%, #000 68%, transparent 100%)', WebkitMaskImage: 'radial-gradient(closest-side at 50% 50%, #000 68%, transparent 100%)' } as const;

const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export default function ProductSection({ id, eyebrow, title, intro, items, icon, iconFor: iconForProp, media, mediaSide = 'right', tone = 'charcoal', grouped, filters, note }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<'all' | CategoryId>('all');
  useSectionAnimations(ref);

  const shown = filters && filter !== 'all' ? items.filter((i) => i.category === filter) : items;
  const iconFor = (item: MenuItem): LucideIcon => (iconForProp ? iconForProp(item) : icon);
  const groups = grouped ? Array.from(new Set(shown.map((i) => i.group ?? ''))) : [''];

  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-title`}
      className={`section-pad relative overflow-hidden ${tone === 'espresso' ? 'bg-[linear-gradient(180deg,#101010,#2a1b14_50%,#101010)]' : 'bg-charcoal'}`}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${mediaSide === 'left' ? 'md:[&>*:first-child]:order-2' : ''}`}>
          <div>
            <p className="eyebrow mb-4">{eyebrow}</p>
            <SplitHeading as="h2" text={title} className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.04] text-cream" />
            <span id={`${id}-title`} className="sr-only">{title}</span>
            <p data-reveal className="mt-6 max-w-lg text-lg text-cream/75">{intro}</p>
            {note && (
              <p data-reveal className="mt-5 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {note}
              </p>
            )}
          </div>
          <div>{media}</div>
        </div>

        <div className="mt-16">
          {filters && (
            <div role="group" aria-label={`Filter ${eyebrow}`} className="mb-8 flex flex-wrap gap-2">
              {[{ id: 'all' as const, label: 'All' }, ...filters].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    filter === f.id ? 'border-gold bg-gold text-charcoal' : 'border-gold/30 text-cream/80 hover:border-gold hover:text-gold'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
          {groups.map((g) => (
            <div key={g || 'all'} className="mb-8 last:mb-0">
              {g && <h3 className="mb-4 font-display text-2xl text-gold">{g}</h3>}
              <motion.ul
                key={`${filter}-${g}`}
                variants={list}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              >
                {shown
                  .filter((i) => (grouped ? (i.group ?? '') === g : true))
                  .map((item) => (
                    <ItemCard key={item.id} item={item} icon={iconFor(item)} />
                  ))}
              </motion.ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
