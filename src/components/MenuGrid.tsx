import { KeyboardEvent, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Beef, Citrus, Coffee, Croissant, CupSoda, Popcorn, Sandwich, Soup, LucideIcon } from 'lucide-react';
import { BURGER_ADDON, CATEGORIES, CategoryId, itemsByCategory } from '../data/menu';
import { useSectionAnimations } from '../hooks/useSectionAnimations';
import ItemCard from './ItemCard';
import SplitHeading from './SplitHeading';

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  'coffee-tea': Coffee,
  buns: Croissant,
  momos: Soup,
  burgers: Beef,
  milkshakes: CupSoda,
  juices: Citrus,
  sandwiches: Sandwich,
  others: Popcorn,
};

export default function MenuGrid() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<CategoryId>('coffee-tea');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useSectionAnimations(ref);

  const items = itemsByCategory(active);
  const groups = Array.from(new Set(items.map((i) => i.group ?? '')));

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = CATEGORIES.length - 1;
    let next = index;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    const id = CATEGORIES[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section id="menu" ref={ref} aria-labelledby="menu-title" className="section-pad relative bg-charcoal">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-4">The full menu</p>
          <SplitHeading as="h2" text="EVERYTHING WE SERVE." className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-bold text-cream" />
          <span id="menu-title" className="sr-only">Complete menu</span>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div role="tablist" aria-label="Menu categories" className="mx-auto flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
            {CATEGORIES.map((c, i) => {
              const Icon = CATEGORY_ICONS[c.id];
              const selected = active === c.id;
              return (
                <button
                  key={c.id}
                  ref={(el) => (tabRefs.current[c.id] = el)}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls="menu-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                    selected ? 'border-gold bg-gold text-charcoal shadow-[0_8px_24px_-10px_rgba(214,177,94,.7)]' : 'border-gold/30 text-cream/80 hover:border-gold hover:text-gold'
                  }`}
                >
                  <Icon size={15} aria-hidden="true" /> {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-10 min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <p className="mb-5 text-sm text-cream/60" aria-live="polite">
                {items.length} items · prices in ₹
                {active === 'burgers' && <> · <span className="text-gold">{BURGER_ADDON.name} +₹{BURGER_ADDON.price}</span></>}
              </p>
              {groups.map((g) => (
                <div key={g || 'all'} className="mb-8 last:mb-0">
                  {g && <h3 className="mb-4 font-display text-2xl text-gold">{g}</h3>}
                  <motion.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {items.filter((i) => (i.group ?? '') === g).map((item) => (
                      <ItemCard key={item.id} item={item} icon={CATEGORY_ICONS[item.category]} />
                    ))}
                  </motion.ul>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
