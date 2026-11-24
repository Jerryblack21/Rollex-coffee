import { CSSProperties, useMemo } from 'react';

// Deterministic pseudo-random so SSR/StrictMode renders stay stable.
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/** Floating golden dust — pure CSS transforms, no JS per frame. */
export function GoldDust({ count = 28, className = '' }: { count?: number; className?: string }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: rand(i + 1) * 100,
        size: 2 + rand(i + 50) * 4,
        dur: 12 + rand(i + 99) * 14,
        delay: -rand(i + 7) * 20,
        dx: (rand(i + 33) - 0.5) * 120,
      })),
    [count],
  );
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute bottom-[-10px] animate-drift rounded-full bg-gold"
          style={
            {
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              boxShadow: '0 0 10px 2px rgba(214,177,94,.55)',
              '--dur': `${d.dur}s`,
              '--dx': `${d.dx}px`,
              animationDelay: `${d.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Soft rising steam wisps. */
export function Steam({ className = '', wisps = 5 }: { className?: string; wisps?: number }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute flex justify-center gap-3 ${className}`}>
      {Array.from({ length: wisps }, (_, i) => (
        <span
          key={i}
          className="block animate-steam rounded-full bg-cream/40 blur-xl"
          style={
            {
              width: 26 + rand(i + 3) * 22,
              height: 70 + rand(i + 9) * 50,
              '--dur': `${4 + rand(i + 5) * 3}s`,
              '--sx': `${(rand(i + 11) - 0.5) * 40}px`,
              animationDelay: `${-rand(i + 2) * 5}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
