/** Vector illustrations for items without a photograph. Replace with photos any time (see README). */

export function MomoArt({ className = '' }: { className?: string }) {
  const pleats = (x: number, y: number) =>
    [0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${x + 24 + i * 12} ${y + 12} q${3 - i} 14 ${i * 2 - 4} 24`} stroke="#d9c79c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    ));
  const Momo = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 52 Q4 -6 54 -2 Q104 -6 108 52 Q54 74 0 52Z" fill="url(#dough)" stroke="#e8d6a8" strokeWidth="1.5" />
      <g transform="translate(-24 -12)">{pleats(0, 0)}</g>
      <path d="M12 46 Q54 62 96 46" stroke="#c7b17c" strokeWidth="1.4" fill="none" opacity=".5" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Plate of momos">
      <defs>
        <radialGradient id="dough" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="1" stopColor="#e6cf9c" />
        </radialGradient>
        <linearGradient id="plate" x1="0" x2="1">
          <stop offset="0" stopColor="#2a211c" />
          <stop offset=".5" stopColor="#5a4636" />
          <stop offset="1" stopColor="#2a211c" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="232" rx="170" ry="44" fill="url(#plate)" stroke="#D6B15E" strokeOpacity=".5" />
      <ellipse cx="200" cy="224" rx="140" ry="32" fill="#1b1512" />
      <Momo x={86} y={150} />
      <Momo x={206} y={152} />
      <Momo x={146} y={104} s={1.05} />
      <circle cx="338" cy="214" r="14" fill="#b3261e" opacity=".9" />
    </svg>
  );
}

export function JuiceArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 420" className={className} role="img" aria-label="Glass of fresh orange juice">
      <defs>
        <linearGradient id="oj" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#f0720f" />
        </linearGradient>
        <linearGradient id="glassEdge" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".25" stopColor="#fff" stopOpacity=".06" />
          <stop offset=".8" stopColor="#fff" stopOpacity=".1" />
          <stop offset="1" stopColor="#fff" stopOpacity=".4" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="390" rx="110" ry="14" fill="#000" opacity=".5" />
      <path d="M96 90 L304 90 L276 380 Q200 396 124 380Z" fill="url(#oj)" />
      <path d="M96 90 L304 90 L276 380 Q200 396 124 380Z" fill="url(#glassEdge)" stroke="#fff" strokeOpacity=".35" />
      <ellipse cx="200" cy="90" rx="104" ry="16" fill="#ffc46b" stroke="#fff" strokeOpacity=".4" />
      <rect x="226" y="10" width="14" height="150" rx="7" fill="#F4E7C5" transform="rotate(14 233 85)" />
      {[[150, 190], [230, 240], [180, 300], [250, 170]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="44" height="44" rx="9" fill="#fff" opacity=".22" transform={`rotate(${i * 17} ${x + 22} ${y + 22})`} />
      ))}
      <g transform="translate(262 80)">
        <circle r="46" fill="#f08a00" />
        <circle r="38" fill="#ffd27a" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0 0 L0 -36" stroke="#f08a00" strokeWidth="3" transform={`rotate(${i * 45})`} />
        ))}
      </g>
    </svg>
  );
}

/** Stainless tumbler + davara (static). The scroll-animated version lives in CoffeeExperience. */
export function TumblerArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 420" className={className} role="img" aria-label="South Indian filter coffee in a steel tumbler and davara">
      <defs>
        <linearGradient id="steelA" x1="0" x2="1">
          <stop offset="0" stopColor="#5c5c5c" />
          <stop offset=".25" stopColor="#e9e9e9" />
          <stop offset=".5" stopColor="#9b9b9b" />
          <stop offset=".75" stopColor="#dcdcdc" />
          <stop offset="1" stopColor="#4a4a4a" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="396" rx="160" ry="14" fill="#000" opacity=".5" />
      <path d="M52 300 Q62 384 200 392 Q338 384 348 300Z" fill="url(#steelA)" />
      <ellipse cx="200" cy="300" rx="150" ry="26" fill="#cfcfcf" />
      <ellipse cx="200" cy="302" rx="132" ry="20" fill="#3a2a20" />
      <path d="M110 160 L290 160 L276 322 Q200 342 124 322Z" fill="url(#steelA)" />
      <ellipse cx="200" cy="160" rx="90" ry="16" fill="#e7e7e7" />
      <ellipse cx="200" cy="162" rx="80" ry="11" fill="#4a2c1d" />
      <ellipse cx="200" cy="160" rx="62" ry="6" fill="#d9b38a" opacity=".8" />
    </svg>
  );
}
