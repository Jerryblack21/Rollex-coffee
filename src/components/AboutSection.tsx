import { useRef } from 'react';
import { ASSETS } from '../config/assets';
import { useSectionAnimations } from '../hooks/useSectionAnimations';
import SplitHeading from './SplitHeading';

const CUES = ['Blue counter', 'Orange walls', 'Glass food display', 'Coffee station'];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionAnimations(ref);
  return (
    <section id="story" ref={ref} aria-labelledby="story-title" className="section-pad relative overflow-hidden bg-charcoal">
      <div aria-hidden="true" className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-counter/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow mb-4">Our story</p>
          <SplitHeading as="h2" text="YOUR LOCAL SPOT FOR GREAT TASTE." className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.04] text-cream" />
          <span id="story-title" className="sr-only">About Rollex Coffee</span>
          <p data-reveal className="mt-6 max-w-lg text-lg text-cream/80">
            From comforting coffee to satisfying snacks, discover a place for your everyday cravings.
          </p>
          <ul data-stagger className="mt-8 flex flex-wrap gap-2">
            {CUES.map((c, i) => (
              <li key={c} className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${i === 0 ? 'border-counter/70 text-cream' : 'border-gold/30 text-cream/80'}`}>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div data-parallax="0.05" className="overflow-hidden rounded-[2rem] border border-gold/25 shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]">
            <img src={ASSETS.images.cafe} alt="Café interior with a blue counter, orange walls, glass food display and coffee station" width={1000} height={600} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div aria-hidden="true" className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-[2rem] border border-gold/20" />
        </div>
      </div>
    </section>
  );
}
