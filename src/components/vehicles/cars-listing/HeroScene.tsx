/**
 * The hero's generated environment — a golden-hour skyline, haze, trees and a
 * modern villa porch — ported from the approved design's `sceneSVG()`. The
 * pseudo-random layout uses the design's fixed seed, so it is the same on
 * every render and on server and client alike. Decorative only.
 */

type Rect = { x: number; y: number; w: number; h: number };
type Circle = { cx: number; cy: number; r: number };

function buildScene() {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const far: Rect[] = [];
  const antennas: Rect[] = [];
  const near: Rect[] = [];
  const trees: { cx: number; cy: number; rx: number; ry: number }[] = [];
  const leaves: Circle[] = [];
  const canopy: Circle[] = [];

  for (let x = 236; x < 1120; ) {
    const w = 14 + rnd() * 30;
    let h = 34 + rnd() * 96;
    if (rnd() > 0.82) h += 70;
    far.push({ x, y: 270 - h, w, h });
    if (h > 150) antennas.push({ x: x + w / 2 - 1, y: 270 - h - 16, w: 2, h: 16 });
    x += w + 1 + rnd() * 8;
  }
  for (let x = 300; x < 1090; ) {
    const w = 22 + rnd() * 34;
    const h = 22 + rnd() * 60;
    near.push({ x, y: 272 - h, w, h });
    x += w + 10 + rnd() * 34;
  }
  for (let x = 220; x < 1080; ) {
    const w = 12 + rnd() * 16;
    trees.push({ cx: x, cy: 266 - rnd() * 4, rx: w, ry: 7 + rnd() * 9 });
    x += w * 1.1 + rnd() * 10;
  }
  for (let i = 0; i < 26; i++) leaves.push({ cx: 1392 + rnd() * 60, cy: 150 + rnd() * 120, r: 9 + rnd() * 14 });
  for (let i = 0; i < 18; i++) canopy.push({ cx: 1040 + rnd() * 70, cy: 120 + rnd() * 90, r: 12 + rnd() * 18 });
  return { far, antennas, near, trees, leaves, canopy };
}

const SCENE = buildScene();
const r0 = (n: number) => Math.round(n);
const LIGHTS = [1104, 1196, 1288, 1380].map((x, i) => ({ x, y: 46 + i * 3.2 }));

export function HeroScene({ className }: { className?: string }) {
  const { far, antennas, near, trees, leaves, canopy } = SCENE;
  return (
    <svg className={className} viewBox="0 0 1440 380" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="cl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C7D9E6" />
          <stop offset=".42" stopColor="#ECDFD0" />
          <stop offset=".68" stopColor="#F6D0A4" />
          <stop offset="1" stopColor="#F0BD8A" />
        </linearGradient>
        <radialGradient id="cl-sun" cx="660" cy="262" r="380" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF0D2" />
          <stop offset=".3" stopColor="#FFD9A4" stopOpacity=".7" />
          <stop offset="1" stopColor="#FFD39A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cl-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8E6D2" stopOpacity="0" />
          <stop offset="1" stopColor="#F8E2C8" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="cl-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8CBBB" />
          <stop offset=".18" stopColor="#E9DFD3" />
          <stop offset="1" stopColor="#D2C5B6" />
        </linearGradient>
        <linearGradient id="cl-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFDDA3" />
          <stop offset=".5" stopColor="#EBA764" />
          <stop offset="1" stopColor="#8A5832" />
        </linearGradient>
        <linearGradient id="cl-slab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E342B" />
          <stop offset="1" stopColor="#28211B" />
        </linearGradient>
        <linearGradient id="cl-wood" x1="0" x2="1">
          <stop offset="0" stopColor="#7A5636" />
          <stop offset="1" stopColor="#4B3322" />
        </linearGradient>
        <linearGradient id="cl-refl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9A866" stopOpacity=".5" />
          <stop offset="1" stopColor="#E9A866" stopOpacity="0" />
        </linearGradient>
        <filter id="cl-b8" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="cl-b2">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      <rect width="1440" height="380" fill="url(#cl-sky)" />
      <rect width="1440" height="380" fill="url(#cl-sun)" />
      <g fill="#AEB6C2" opacity=".5">
        {far.map((b, i) => (
          <rect key={i} x={r0(b.x)} y={r0(b.y)} width={r0(b.w)} height={r0(b.h)} />
        ))}
        {antennas.map((b, i) => (
          <rect key={`a${i}`} x={r0(b.x)} y={r0(b.y)} width={b.w} height={b.h} />
        ))}
      </g>
      <g fill="#8E99A8" opacity=".42">
        {near.map((b, i) => (
          <rect key={i} x={r0(b.x)} y={r0(b.y)} width={r0(b.w)} height={r0(b.h)} rx="1" />
        ))}
      </g>
      <rect y="170" width="1440" height="104" fill="url(#cl-haze)" />
      <g fill="#5C7356" opacity=".55" filter="url(#cl-b2)">
        {trees.map((t, i) => (
          <ellipse key={i} cx={r0(t.cx)} cy={r0(t.cy)} rx={r0(t.rx)} ry={r0(t.ry)} />
        ))}
      </g>
      <g fill="#3E5739" opacity=".9">
        {canopy.map((c, i) => (
          <circle key={i} cx={r0(c.cx)} cy={r0(c.cy)} r={r0(c.r)} />
        ))}
        <rect x="1072" y="190" width="5" height="80" fill="#4A3A2A" />
      </g>
      <rect y="268" width="1440" height="112" fill="url(#cl-floor)" />
      <path d="M0 268.5H1440" stroke="#fff" strokeOpacity=".55" />
      {/* modern villa porch */}
      <rect x="1158" y="58" width="282" height="212" fill="url(#cl-glass)" />
      <ellipse cx="1300" cy="150" rx="70" ry="56" fill="#FFF3DB" opacity=".45" filter="url(#cl-b8)" />
      <rect x="1158" y="124" width="282" height="4" fill="#2E251E" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={1158 + i * 56} y="58" width="5" height="212" fill="#2E251E" />
      ))}
      <rect x="1112" y="44" width="46" height="226" fill="url(#cl-wood)" />
      {[1120, 1128, 1136, 1144, 1152].map((x) => (
        <rect key={x} x={x} y="46" width="1" height="224" fill="#000" opacity=".18" />
      ))}
      <polygon points="1010,0 1440,0 1440,62 1050,44" fill="url(#cl-slab)" />
      <polyline points="1050,44 1440,62" stroke="#7B6654" strokeWidth="2" fill="none" />
      {LIGHTS.map((l) => (
        <g key={l.x}>
          <ellipse cx={l.x} cy={l.y + 14} rx="40" ry="16" fill="#FFE2B3" opacity=".22" filter="url(#cl-b8)" />
          <ellipse cx={l.x} cy={l.y} rx="9" ry="2.6" fill="#FFF4DC" />
        </g>
      ))}
      <rect x="1112" y="270" width="328" height="70" fill="url(#cl-refl)" />
      <g fill="#2F4A30">
        {leaves.map((c, i) => (
          <circle key={i} cx={r0(c.cx)} cy={r0(c.cy)} r={r0(c.r)} />
        ))}
      </g>
      <rect x="1396" y="246" width="44" height="30" rx="3" fill="#3B3027" />
    </svg>
  );
}

/** The wall-box charger standing beside the hero car. */
export function HeroCharger({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 170" aria-hidden="true">
      <defs>
        <linearGradient id="cl-chg" x1="0" x2="1">
          <stop offset="0" stopColor="#2A3038" />
          <stop offset=".55" stopColor="#14181D" />
          <stop offset="1" stopColor="#0A0C0F" />
        </linearGradient>
        <filter id="cl-chgb" x="-200%" y="-20%" width="500%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      <rect x="4" y="160" width="32" height="8" rx="3" fill="#1A1E23" />
      <rect x="6" y="4" width="28" height="158" rx="9" fill="url(#cl-chg)" />
      <rect x="11" y="14" width="18" height="16" rx="3" fill="#0B0E12" stroke="#38414C" />
      <rect x="14" y="21" width="8" height="2.4" rx="1" fill="#4ADE80" />
      <rect x="18.5" y="42" width="3" height="96" rx="1.5" fill="#4ADE80" filter="url(#cl-chgb)" />
      <rect x="19" y="42" width="2" height="96" rx="1" fill="#BBF7D0" />
      <path d="M6 60c-10 6-6 44 2 60" stroke="#15191E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
