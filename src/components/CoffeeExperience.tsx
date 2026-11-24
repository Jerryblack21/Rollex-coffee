import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { ASSETS } from '../config/assets';
import { itemsByCategory } from '../data/menu';
import { useSectionAnimations } from '../hooks/useSectionAnimations';
import { Coffee } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import ItemCard from './ItemCard';
import { GoldDust, Steam } from './Particles';
import SplitHeading from './SplitHeading';

const BeanField = lazy(() => import('./BeanField'));

const webglAvailable = (): boolean => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

export default function CoffeeExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tumblerRef = useRef<SVGGElement>(null);
  const streamRef = useRef<SVGPathElement>(null);
  const poolRef = useRef<SVGEllipseElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [mountGl, setMountGl] = useState(false);
  const [glActive, setGlActive] = useState(false);

  useSectionAnimations(rootRef);

  // Mount WebGL only when the stage is near the viewport; pause rendering when it leaves.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion() || !webglAvailable()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setMountGl(true);
        setGlActive(e.isIntersecting);
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(track);
    return () => io.disconnect();
  }, []);

  // Scroll-scrubbed pour: tumbler lifts and tilts, the stream draws, steam rises.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const stream = streamRef.current;
    if (!track || !stream) return;
    const reduced = prefersReducedMotion();
    const len = stream.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(stream, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
      if (reduced) {
        gsap.set(tumblerRef.current, { y: -110, rotation: 14, svgOrigin: '200 320' });
        gsap.set(steamRef.current, { opacity: 1 });
        return;
      }
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: track,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => (progress.current = self.progress),
          },
        })
        .fromTo(tumblerRef.current, { y: 0, rotation: 0, svgOrigin: '200 320' }, { y: -110, rotation: 14, svgOrigin: '200 320', duration: 0.4 }, 0)
        .to(stream, { strokeDashoffset: 0, duration: 0.3 }, 0.38)
        .fromTo(poolRef.current, { attr: { rx: 20 }, opacity: 0 }, { attr: { rx: 120 }, opacity: 1, duration: 0.3 }, 0.55)
        .fromTo(steamRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35 }, 0.6)
        .fromTo(glowRef.current, { scale: 0.6, opacity: 0.2 }, { scale: 1.15, opacity: 0.9, duration: 1 }, 0);
    }, track);
    return () => ctx.revert();
  }, []);

  const items = itemsByCategory('coffee-tea');

  return (
    <section id="coffee" ref={rootRef} aria-labelledby="coffee-title" className="relative bg-charcoal">
      <div ref={trackRef} className="relative h-[240svh]">
        <div className="sticky top-0 grid h-[100svh] items-center overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,#39251C_0%,#101010_70%)]" />
          {mountGl && (
            <ErrorBoundary>
              <Suspense fallback={null}>
                <div className="absolute inset-0 opacity-80">
                  <BeanField progress={progress} active={glActive} />
                </div>
              </Suspense>
            </ErrorBoundary>
          )}
          <GoldDust count={18} className="opacity-60" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-4 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
            <div className="max-md:text-center">
              <p className="eyebrow mb-4">The coffee experience</p>
              <SplitHeading
                as="h2"
                text="BREWED WITH PASSION. SERVED WITH LOVE."
                className="font-display text-[clamp(2rem,5.4vw,4.6rem)] font-bold leading-[1.03] text-cream [&_.word-inner]:last:text-gold"
              />
              <p data-reveal className="mt-6 max-w-md text-cream/80 max-md:mx-auto">
                Traditional South Indian filter coffee, poured the way it has always been — in a stainless-steel tumbler and davara, with steam rising and warm golden light.
              </p>
              <h3 id="coffee-title" className="sr-only">Coffee and tea</h3>
            </div>

            <div className="relative mx-auto aspect-[400/440] w-[min(78vw,50svh,480px)] md:w-[min(46vw,64svh,540px)]">
              <div ref={glowRef} aria-hidden="true" className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(214,177,94,.55),transparent_65%)] blur-2xl" />
              <div ref={steamRef} className="absolute left-0 right-0 top-[2%] h-[30%]" style={{ opacity: 0 }}>
                <Steam className="inset-x-0 bottom-0 justify-center" wisps={6} />
              </div>
              <svg viewBox="-20 0 440 440" className="relative h-full w-full overflow-visible" role="img" aria-label="Filter coffee being poured between a stainless-steel tumbler and davara">
                <defs>
                  <linearGradient id="steel" x1="0" x2="1">
                    <stop offset="0" stopColor="#575757" />
                    <stop offset=".22" stopColor="#f0f0f0" />
                    <stop offset=".5" stopColor="#9a9a9a" />
                    <stop offset=".78" stopColor="#e0e0e0" />
                    <stop offset="1" stopColor="#474747" />
                  </linearGradient>
                  <linearGradient id="stream" x1="0" x2="1">
                    <stop offset="0" stopColor="#3b2314" />
                    <stop offset=".5" stopColor="#8a5a33" />
                    <stop offset="1" stopColor="#3b2314" />
                  </linearGradient>
                </defs>
                <ellipse cx="200" cy="410" rx="170" ry="14" fill="#000" opacity=".55" />
                {/* davara */}
                <path d="M52 300 Q62 392 200 400 Q338 392 348 300Z" fill="url(#steel)" />
                <ellipse cx="200" cy="300" rx="150" ry="26" fill="#d4d4d4" />
                <ellipse cx="200" cy="303" rx="132" ry="20" fill="#2e1d13" />
                <ellipse ref={poolRef} cx="200" cy="304" rx="20" ry="12" fill="#6b4226" opacity="0" />
                <path d="M62 330 Q200 350 338 330" stroke="#D6B15E" strokeOpacity=".55" strokeWidth="2" fill="none" />
                {/* stream */}
                <path ref={streamRef} d="M326 82 C346 150 292 232 232 298" stroke="url(#stream)" strokeWidth="7" strokeLinecap="round" fill="none" />
                {/* tumbler */}
                <g ref={tumblerRef}>
                  <path d="M110 160 L290 160 L276 322 Q200 342 124 322Z" fill="url(#steel)" />
                  <path d="M126 180 L132 310" stroke="#fff" strokeOpacity=".5" strokeWidth="5" strokeLinecap="round" />
                  <ellipse cx="200" cy="160" rx="90" ry="16" fill="#ececec" />
                  <ellipse cx="200" cy="162" rx="80" ry="11" fill="#4a2c1d" />
                  <ellipse cx="200" cy="160" rx="60" ry="6" fill="#e0bd91" opacity=".75" />
                </g>
              </svg>
            </div>
          </div>

          <ul className="relative z-10 mx-auto mt-4 flex max-w-7xl flex-wrap justify-center gap-2 px-5 pb-6 text-[11px] uppercase tracking-[0.2em] text-cream/70 md:absolute md:inset-x-0 md:bottom-6 md:mt-0">
            {['Steel tumbler & davara', 'Fresh beans', 'Rising steam', 'Warm golden light'].map((t) => (
              <li key={t} className="rounded-full border border-gold/25 bg-black/30 px-4 py-1.5 backdrop-blur">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Menu */}
      <div className="section-pad !pt-16 relative">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-3">Coffee & Tea</p>
              <SplitHeading text="Every cup, clearly priced." className="font-display text-4xl font-bold text-cream sm:text-5xl" />
            </div>
            <div data-reveal className="flex items-center gap-4 rounded-2xl border border-gold/20 bg-white/[.03] p-3 pr-6">
              <img src={ASSETS.images.coffeeGlass} alt="Iced cold coffee swirling in a double-wall glass" width={96} height={96} loading="lazy" decoding="async" className="h-24 w-24 rounded-xl object-cover" />
              <p className="text-sm text-cream/75">Cold Coffee<br /><span className="font-display text-xl text-gold">₹50</span></p>
            </div>
          </div>
          <ul data-stagger className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} icon={Coffee} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
