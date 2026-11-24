import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { ASSETS, VIDEO_CLIP } from '../config/assets';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollVideo } from '../hooks/useScrollVideo';
import { clamp } from '../lib/motion';
import { scrollToSection } from '../lib/scroll';
import { GoldDust, Steam } from './Particles';

/** Chapter captions follow the film. `at` = scroll progress (0‥1) where the chapter begins. */
const CHAPTERS = [
  { at: 0, label: 'Filter coffee' },
  { at: 0.11, label: 'Cold coffee' },
  { at: 0.25, label: 'Fresh buns' },
  { at: 0.38, label: 'Burgers' },
  { at: 0.52, label: 'Milkshakes' },
  { at: 0.65, label: 'Sandwiches & snacks' },
  { at: 0.78, label: 'The café' },
  { at: 0.92, label: 'Good times' },
];

const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

export default function ScrollVideoHero() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const chapterRef = useRef(0);
  // Chosen once: avoids downloading two videos.
  const [src] = useState(() => (isMobile() ? ASSETS.video.mobile : ASSETS.video.desktop));

  const onProgress = useCallback((p: number) => {
    const intro = clamp(1 - p / 0.09);
    if (introRef.current) {
      introRef.current.style.opacity = String(intro);
      introRef.current.style.transform = `translate3d(0,${(1 - intro) * -50}px,0)`;
      introRef.current.style.filter = intro < 1 ? `blur(${(1 - intro) * 8}px)` : 'none';
      introRef.current.style.pointerEvents = intro < 0.3 ? 'none' : 'auto';
    }
    if (shadeRef.current) shadeRef.current.style.opacity = String(intro);
    if (ctaRef.current) {
      ctaRef.current.style.opacity = String(1 - intro);
      ctaRef.current.style.pointerEvents = intro > 0.5 ? 'none' : 'auto';
    }
    if (cueRef.current) cueRef.current.style.opacity = String(clamp(1 - p / 0.04));
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    let idx = 0;
    CHAPTERS.forEach((c, i) => {
      if (p >= c.at) idx = i;
    });
    if (idx !== chapterRef.current) {
      chapterRef.current = idx;
      setChapter(idx);
    }
  }, []);

  const status = useScrollVideo(videoRef, trackRef, { enabled: !reduced, onProgress, clip: VIDEO_CLIP });
  const scrubbing = status === 'loading' || status === 'ready';
  const trackHeight = scrubbing ? 'h-[520svh] max-md:h-[420svh]' : 'h-[100svh]';

  return (
    <section id="home" aria-label="Rollex Coffee introduction">
      <div ref={trackRef} className={`relative ${trackHeight}`}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-charcoal">
          {/* Fallback / loading layer — always present so nothing ever looks broken. */}
          <img
            src={ASSETS.poster}
            alt=""
            width={1280}
            height={720}
            fetchPriority="high"
            className="hero-video absolute inset-0 h-full w-full"
          />
          {!reduced && status !== 'failed' && (
            <video
              ref={videoRef}
              src={src}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
              className={`hero-video absolute inset-0 h-full w-full transition-opacity duration-500 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          <GoldDust count={22} className="z-[1] opacity-70" />
          <Steam className="bottom-[16%] left-[6%] z-[1] hidden opacity-50 md:flex" />

          {/* Readability shade for the headline, fades as the film takes over. */}
          <div ref={shadeRef} aria-hidden="true" className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(10,8,6,.85)_0%,rgba(10,8,6,.45)_45%,transparent_75%)] max-md:bg-[linear-gradient(180deg,rgba(10,8,6,.85)_0%,rgba(10,8,6,.35)_60%,transparent)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Headline overlay */}
          <div ref={introRef} className="absolute inset-0 z-[3] mx-auto flex max-w-7xl flex-col justify-center px-5 pb-28 pt-24 sm:px-8 lg:px-12 max-md:justify-start max-md:pt-32">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="eyebrow mb-5">
              Rollex Coffee
            </motion.p>
            <h1 className="font-display text-[clamp(2.4rem,7.2vw,6.4rem)] font-bold uppercase leading-[0.98] tracking-tight">
              {['MORE THAN COFFEE.', 'IT’S A FEELING.'].map((line, li) => (
                <span key={line} className="block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className={`block ${li === 1 ? 'gold-text animate-shimmer' : 'text-cream'}`}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.35 + li * 0.18, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-6 max-w-md text-base text-cream/85 sm:text-lg">
              Fresh brews. Delicious bites. Unforgettable moments.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.8 }} className="mt-9 flex flex-wrap gap-4">
              <button type="button" className="btn-gold" onClick={() => scrollToSection('menu')}>
                Explore Menu <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button type="button" className="btn-ghost" onClick={() => scrollToSection('visit')}>
                <MapPin size={16} aria-hidden="true" /> Visit Our Café
              </button>
            </motion.div>
          </div>

          {/* Chapter bar */}
          {scrubbing && (
            <div className="absolute inset-x-0 bottom-0 z-[4] pb-6">
              <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
                <div aria-live="polite" className="min-h-[3.25rem]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
                    {String(chapter + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={chapter}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28 }}
                      className="font-display text-2xl text-cream sm:text-3xl"
                    >
                      {CHAPTERS[chapter].label}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div ref={ctaRef} className="flex gap-3" style={{ opacity: 0, pointerEvents: 'none' }}>
                  <button type="button" className="btn-gold !px-5 !py-3" onClick={() => scrollToSection('menu')}>
                    Explore Menu
                  </button>
                  <button type="button" className="btn-ghost !px-5 !py-3" onClick={() => scrollToSection('visit')}>
                    Visit Our Café
                  </button>
                </div>
              </div>
              <div className="mx-auto mt-4 max-w-7xl px-5 sm:px-8 lg:px-12" aria-hidden="true">
                <div className="h-px bg-cream/15">
                  <div ref={barRef} className="h-full origin-left scale-x-0 bg-gold" />
                </div>
              </div>
            </div>
          )}

          <div ref={cueRef} aria-hidden="true" className="absolute bottom-28 left-1/2 z-[4] hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-cream/70 md:flex">
            Scroll
            <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
