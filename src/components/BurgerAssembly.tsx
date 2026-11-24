import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { Beef } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { BURGER_ADDON, itemsByCategory } from '../data/menu';
import { useSectionAnimations } from '../hooks/useSectionAnimations';
import ItemCard from './ItemCard';
import { GoldDust } from './Particles';
import SplitHeading from './SplitHeading';

/* ---------- Layer artwork (separate transparent SVGs → real layered assembly) ---------- */
const Layer = ({ vb, children }: { vb: string; children: ReactNode }) => (
  <svg viewBox={vb} className="h-full w-full overflow-visible" aria-hidden="true">
    {children}
  </svg>
);

const TopBun = () => (
  <Layer vb="0 0 300 90">
    <defs>
      <linearGradient id="bg-tb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0b865" />
        <stop offset=".6" stopColor="#c9822f" />
        <stop offset="1" stopColor="#9a5a1c" />
      </linearGradient>
    </defs>
    <path d="M8 82 C8 20 70 5 150 5 C230 5 292 20 292 82 C292 90 286 90 280 90 L20 90 C12 90 8 88 8 82Z" fill="url(#bg-tb)" />
    <ellipse cx="110" cy="26" rx="60" ry="10" fill="#fff" opacity=".22" />
    {[[70, 44, -20], [110, 30, 10], [150, 24, 0], [190, 30, -10], [230, 44, 20], [95, 56, 30], [150, 48, -5], [205, 56, -30], [125, 68, 12], [180, 70, -14]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx="7" ry="3.4" fill="#fff3d6" transform={`rotate(${r} ${x} ${y})`} />
    ))}
  </Layer>
);
const Lettuce = () => (
  <Layer vb="0 0 300 50">
    <defs>
      <linearGradient id="bg-lt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9bd04a" />
        <stop offset="1" stopColor="#4f8f2b" />
      </linearGradient>
    </defs>
    <path d="M0 22 Q10 10 20 20 T40 18 T60 21 T80 17 T100 21 T120 16 T140 21 T160 17 T180 21 T200 16 T220 21 T240 17 T260 21 T280 16 T300 20 L300 32 Q288 46 276 34 T252 36 T228 34 T204 38 T180 34 T156 38 T132 34 T108 38 T84 34 T60 38 T36 34 T12 38 T0 32Z" fill="url(#bg-lt)" />
    <path d="M20 26 Q60 20 100 28 M150 28 Q200 20 250 28" stroke="#d6f29b" strokeOpacity=".55" strokeWidth="2" fill="none" />
  </Layer>
);
const Tomato = () => (
  <Layer vb="0 0 300 40">
    {[80, 220].map((cx) => (
      <g key={cx}>
        <ellipse cx={cx} cy="20" rx="72" ry="16" fill="#c9301f" />
        <ellipse cx={cx} cy="19" rx="60" ry="11" fill="#e8523a" />
        <ellipse cx={cx - 14} cy="15" rx="24" ry="3.5" fill="#fff" opacity=".28" />
      </g>
    ))}
  </Layer>
);
const Cheese = () => (
  <Layer vb="0 0 300 60">
    <defs>
      <linearGradient id="bg-ch" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffcf45" />
        <stop offset="1" stopColor="#e69a12" />
      </linearGradient>
    </defs>
    <path d="M12 6 L288 6 L294 24 L272 20 L248 56 L222 22 L74 22 L52 48 L30 22 L8 26Z" fill="url(#bg-ch)" />
  </Layer>
);
const Patty = () => (
  <Layer vb="0 0 300 56">
    <defs>
      <linearGradient id="bg-pt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6a3b22" />
        <stop offset="1" stopColor="#2b160c" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="292" height="48" rx="24" fill="url(#bg-pt)" />
    {Array.from({ length: 22 }, (_, i) => (
      <ellipse key={i} cx={20 + ((i * 53) % 260)} cy={14 + ((i * 17) % 28)} rx="4" ry="2" fill={i % 2 ? '#1d0e07' : '#8a5231'} opacity=".7" />
    ))}
  </Layer>
);
const BottomBun = () => (
  <Layer vb="0 0 300 56">
    <defs>
      <linearGradient id="bg-bb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#efc27a" />
        <stop offset="1" stopColor="#c58737" />
      </linearGradient>
    </defs>
    <path d="M10 4 L290 4 C294 30 276 52 240 54 L60 54 C24 52 6 30 10 4Z" fill="url(#bg-bb)" />
  </Layer>
);

/** y / height in the 300×310 stage coordinate space; z = stacking order. */
const STACK = [
  { key: 'bottom', art: <BottomBun />, y: 230, h: 56, z: 1, from: { y: 160, r: 0 } },
  { key: 'patty', art: <Patty />, y: 188, h: 56, z: 2, from: { y: -420, r: -10 } },
  { key: 'cheese', art: <Cheese />, y: 160, h: 60, z: 3, from: { y: -460, r: 8 } },
  { key: 'extra', art: <Cheese />, y: 172, h: 60, z: 4, from: { y: -480, r: -6 }, extra: true },
  { key: 'tomato', art: <Tomato />, y: 126, h: 40, z: 5, from: { y: -520, r: 12 } },
  { key: 'lettuce', art: <Lettuce />, y: 96, h: 50, z: 6, from: { y: -560, r: -8 } },
  { key: 'top', art: <TopBun />, y: 14, h: 90, z: 7, from: { y: -640, r: 6 } },
] as const;

const STEPS = ['Bottom bun', 'Patty', 'Cheese', 'Extra cheese', 'Tomato', 'Lettuce', 'Top bun — served'];

export default function BurgerAssembly() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLParagraphElement>(null);
  const [extraCheese, setExtraCheese] = useState(false);
  const extraRef = useRef(extraCheese);
  extraRef.current = extraCheese;
  useSectionAnimations(rootRef);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    if (prefersReducedMotion()) {
      if (stepRef.current) stepRef.current.textContent = 'Fully assembled';
      return;
    }
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-layer]', stage);
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const idx = Math.min(STEPS.length - 1, Math.floor(self.progress / 0.72 * STEPS.length));
            let label = STEPS[idx];
            if (!extraRef.current && idx === 3) label = STEPS[2];
            if (stepRef.current) stepRef.current.textContent = label;
          },
        },
      });
      layers.forEach((el, i) => {
        const def = STACK[i];
        tl.fromTo(
          el,
          { yPercent: def.from.y / 3, rotation: def.from.r, opacity: 0, scale: 0.92 },
          { yPercent: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.14 },
          i * 0.1,
        );
      });
      tl.fromTo(stage, { rotateX: 14 }, { rotateX: 0, duration: 0.8 }, 0).to({}, { duration: 0.3 });
    }, track);
    return () => ctx.revert();
  }, []);

  const burgers = itemsByCategory('burgers');

  return (
    <section id="burgers" ref={rootRef} aria-labelledby="burgers-title" className="relative bg-[linear-gradient(180deg,#101010,#241812_50%,#101010)]">
      <div ref={trackRef} className="relative h-[300svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <GoldDust count={14} className="opacity-50" />
          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-4 px-5 pt-16 sm:px-8 md:grid-cols-2 md:gap-14 lg:px-12">
            <div className="max-md:text-center">
              <p className="eyebrow mb-3">Burgers</p>
              <SplitHeading as="h2" text="BIG FLAVOUR. BIGGER CRAVINGS." className="font-display text-[clamp(2rem,5vw,4.2rem)] font-bold leading-[1.04] text-cream" />
              <span id="burgers-title" className="sr-only">Burgers</span>
              <p className="mt-4 hidden max-w-md text-cream/75 md:block">Watch it come together — bun, patty, cheese, tomato and lettuce — and scroll back up to take it apart.</p>
              <button
                type="button"
                aria-pressed={extraCheese}
                onClick={() => setExtraCheese((v) => !v)}
                className={`mt-5 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  extraCheese ? 'border-gold bg-gold text-charcoal' : 'border-gold/50 text-gold hover:bg-gold/10'
                }`}
              >
                {BURGER_ADDON.name} · +₹{BURGER_ADDON.price}
              </button>
              <p ref={stepRef} aria-hidden="true" className="mt-5 font-display text-xl text-gold">Bottom bun</p>
            </div>

            <div className="mx-auto" style={{ perspective: 900 }}>
              <div ref={stageRef} className="relative aspect-[300/310] w-[min(70vw,44svh,440px)] md:w-[min(40vw,62svh,480px)]" style={{ transformStyle: 'preserve-3d' }} role="img" aria-label="Burger assembling layer by layer: bun, patty, cheese, tomato, lettuce, top bun">
                <div aria-hidden="true" className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(214,177,94,.3),transparent_65%)] blur-2xl" />
                <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[-3%] h-[6%] rounded-full bg-black/70 blur-md" />
                {STACK.map((l) => (
                  <div
                    key={l.key}
                    data-layer
                    className={`absolute left-0 w-full will-change-transform ${'extra' in l && !extraCheese ? 'invisible' : ''}`}
                    style={{ top: `${(l.y / 310) * 100}%`, height: `${(l.h / 310) * 100}%`, zIndex: l.z, filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.45))' }}
                  >
                    {l.art}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-pad !pt-10">
        <div className="mx-auto max-w-7xl">
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {burgers.map((b) => (
              <ItemCard key={b.id} item={b} icon={Beef} priceOverride={extraCheese ? `₹${b.price + BURGER_ADDON.price}` : undefined} />
            ))}
          </motion.ul>
          <p className="mt-5 text-sm text-cream/70">
            <span className="font-semibold text-gold">{BURGER_ADDON.name}: +₹{BURGER_ADDON.price}.</span>{' '}
            {extraCheese ? 'Prices above include the extra cheese.' : 'Toggle “Add Cheese” above to see prices with cheese.'}
          </p>
        </div>
      </div>
    </section>
  );
}
