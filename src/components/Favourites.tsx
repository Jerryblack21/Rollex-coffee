import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ASSETS } from '../config/assets';
import { FAVOURITE_IDS, findItem, formatPrice, itemsByCategory } from '../data/menu';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSectionAnimations } from '../hooks/useSectionAnimations';
import { JuiceArt, MomoArt, TumblerArt } from './ProductArt';
import SplitHeading from './SplitHeading';

const img = (src: string, alt: string) => (
  <img src={src} alt={alt} width={720} height={720} loading="lazy" decoding="async" className="h-full w-full object-cover" />
);

const VISUALS: Record<(typeof FAVOURITE_IDS)[number], { label?: string; node: ReactNode }> = {
  'coffee-tea-classic-filter-coffee': { node: <TumblerArt className="h-full w-full p-6" /> },
  'buns-madurai-butter-bun': { node: img(ASSETS.images.bun, 'Warm buttered bun with melting butter') },
  'momos-chicken-momo-steamed': { label: 'Chicken Momos', node: <MomoArt className="h-full w-full p-4" /> },
  'burgers-chicken-patty-burger': { node: img(ASSETS.images.burger, 'Burger with sesame bun, lettuce, tomato and cheese') },
  'milkshakes-oreo-milk-shake': { node: img(ASSETS.images.milkshake, 'Chocolate-drizzled cookies-and-cream milkshake') },
  'juices-orange': { node: <JuiceArt className="h-full w-full p-5" /> },
};

function TiltCard({ children, disabled }: { children: ReactNode; disabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      ref={ref}
      style={disabled ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (disabled || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => (mx.set(0), my.set(0))}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default function Favourites() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useSectionAnimations(ref);

  return (
    <section id="favourites" ref={ref} aria-labelledby="fav-title" className="section-pad relative bg-[linear-gradient(180deg,#101010,#1c120d_60%,#101010)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-4">Customer favourites</p>
          <SplitHeading as="h2" text="YOUR FAVOURITE BITES, ALL IN ONE PLACE." className="mx-auto max-w-4xl font-display text-[clamp(2.1rem,4.8vw,4rem)] font-bold leading-[1.05] text-cream" />
          <span id="fav-title" className="sr-only">Customer favourites</span>
        </div>

        <ul data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FAVOURITE_IDS.map((id) => {
            const item = findItem(id);
            const v = VISUALS[id];
            const name = v.label ?? item.name;
            const price = id === 'momos-chicken-momo-steamed' ? `From ₹${Math.min(...itemsByCategory('momos').filter((m) => m.name === 'Chicken Momo').map((m) => m.price))}` : formatPrice(item);
            return (
              <li key={id} className="[perspective:900px]">
                <TiltCard disabled={reduced}>
                  <article className="card-surface group flex h-full flex-col overflow-hidden rounded-3xl transition duration-500 hover:border-gold/70 hover:shadow-[0_28px_60px_-24px_rgba(214,177,94,.5)]">
                    <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#3a2a20,#141010)]">
                      <div className="h-full w-full transition duration-700 ease-out group-hover:scale-[1.07]">{v.node}</div>
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </div>
                    <div className="flex items-end justify-between gap-4 p-5">
                      <h3 className="font-display text-2xl leading-tight text-cream">{name}</h3>
                      <p className="whitespace-nowrap font-display text-2xl font-semibold text-gold">{price}</p>
                    </div>
                  </article>
                </TiltCard>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
