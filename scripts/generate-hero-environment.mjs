/**
 * Generates the homepage hero environment plate -> public/images/hero/hero-env.webp
 *
 *   node scripts/generate-hero-environment.mjs /tmp/hero-env.png
 *   npx sharp-cli ... (or re-encode with sharp) to WebP q88
 *
 * Manual, one-off — never runs at request time, same convention as
 * generate-vehicle-illustrations.mts. Plain .mjs rather than .mts because it has
 * no TypeScript in it. Only dependency is `sharp`, already present via Next.
 *
 * Built procedurally rather than with an image model so every value stays on the
 * EV Motion palette and nothing drifts into neon/cyberpunk. Everything is
 * deliberately low-alpha: the plate has to read as a lit space while staying
 * dark enough that the headline and the vehicle keep all the attention.
 *
 * Authored at 4:1 (matching the hero at 1280x320). The hero grows wider on large
 * screens, so object-cover crops top and bottom — all meaningful content
 * therefore lives in the vertical middle band.
 *
 * Layer order (far -> near):
 *   1 base gradient        sky, horizon lift, ground
 *   2 atmospheric glow     soft green pool centred behind the vehicle
 *   3 volumetric haze      wide, very soft diagonal shafts
 *   4 far skyline          faint, high atmospheric perspective
 *   5 near skyline         darker, more defined, a few window lights
 *   6 light columns        distant EV/energy accents, slim verticals
 *   7 ground              perspective grid + reflective sheen
 *   8 floor pool          green light pooled under the vehicle
 *   9 vignette            darkens the right, protecting headline contrast
 */
import sharp from "sharp";

const W = 2560, H = 640;
const HORIZON = Math.round(H * 0.60);
/** Where the vehicle sits, in normalised hero coords — the light centres on it. */
const CAR_X = 0.21, CAR_Y = 0.58;

const buf = new Float32Array(W * H * 3);
const add = (x, y, r, g, b) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = ((y | 0) * W + (x | 0)) * 3;
  buf[i] += r; buf[i + 1] += g; buf[i + 2] += b;
};
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };

let seed = 20260817;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

/* 1 — base gradient ------------------------------------------------------- */
for (let y = 0; y < H; y++) {
  let r, g, b;
  if (y < HORIZON) {
    // sky: deepest at the top, lifting very slightly toward the horizon
    const k = smooth(y / HORIZON);
    r = 8 + 5 * k; g = 18 + 14 * k; b = 15 + 10 * k;
  } else {
    // ground: brightest right at the horizon, falling away toward the viewer
    const k = smooth((y - HORIZON) / (H - HORIZON));
    r = 11 - 6 * k; g = 30 - 20 * k; b = 22 - 14 * k;
  }
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    buf[i] = r; buf[i + 1] = g; buf[i + 2] = b;
  }
}

/* 2 — atmospheric glow behind the vehicle --------------------------------- */
{
  const cx = CAR_X * W, cy = CAR_Y * H, rx = W * 0.42, ry = H * 0.75;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    if (d >= 1) continue;
    const f = Math.pow(1 - d, 2.2);
    add(x, y, 6 * f, 30 * f, 18 * f);
  }
}

/* 3 — volumetric haze: wide soft shafts rising from behind the car --------- */
for (let s = 0; s < 3; s++) {
  const originX = (CAR_X + (s - 1) * 0.06) * W;
  const angle = -1.25 + s * 0.16;           // steep, fanning slightly
  const len = H * 1.5, halfW = W * (0.055 + s * 0.020);
  const strength = 16 - s * 3.4;
  for (let t = 0; t < len; t += 1) {
    const px = originX + Math.cos(angle) * t;
    const py = HORIZON + Math.sin(angle) * t;
    const fade = Math.pow(1 - t / len, 1.7);
    for (let o = -halfW; o <= halfW; o += 1) {
      const f = Math.pow(1 - Math.abs(o) / halfW, 2) * fade * strength * 0.55;
      if (f <= 0) continue;
      add(px + o, py, f * 0.35, f * 1.0, f * 0.6);
    }
  }
}

/* 4/5 — skyline, two depth bands ------------------------------------------ */
function skyline({ baseY, maxH, minW, maxW, shade, lights, jitter }) {
  let x = -40;
  while (x < W + 40) {
    const bw = minW + rnd() * (maxW - minW);
    const bh = (rnd() < 0.16 ? 1.0 + rnd() * 0.45 : 0.22 + rnd() * 0.62) * maxH;
    const top = baseY - bh + (rnd() - 0.5) * jitter;
    for (let yy = Math.max(0, top | 0); yy < Math.min(H, baseY); yy++) {
      for (let xx = x | 0; xx < Math.min(W, (x + bw) | 0); xx++) {
        const i = (yy * W + xx) * 3;
        // buildings occlude: pull toward a dark silhouette rather than adding
        buf[i] += (shade[0] - buf[i]) * 0.85;
        buf[i + 1] += (shade[1] - buf[i + 1]) * 0.85;
        buf[i + 2] += (shade[2] - buf[i + 2]) * 0.85;
      }
    }
    // sparse window lights
    if (lights) {
      const n = Math.floor(rnd() * 4);
      for (let k = 0; k < n; k++) {
        const lx = x + 6 + rnd() * (bw - 12);
        const ly = top + 10 + rnd() * Math.max(1, bh - 20);
        const a = 0.25 + rnd() * 0.5;
        add(lx, ly, 4 * a, 12 * a, 8 * a);
        add(lx + 1, ly, 2 * a, 7 * a, 5 * a);
      }
    }
    x += bw + 4 + rnd() * 26;
  }
}
// far band: faint, hazy — atmospheric perspective
skyline({ baseY: HORIZON, maxH: H * 0.20, minW: 26, maxW: 70, shade: [7, 20, 16], lights: false, jitter: 6 });
// near band: darker, more defined
skyline({ baseY: HORIZON, maxH: H * 0.31, minW: 40, maxW: 120, shade: [4, 11, 9], lights: true, jitter: 10 });

/* 6 — distant EV/energy light columns ------------------------------------- */
for (let i = 0; i < 7; i++) {
  const cx = (0.08 + rnd() * 0.86) * W;
  const h = H * (0.06 + rnd() * 0.10);
  const a = 0.30 + rnd() * 0.40;
  for (let y = HORIZON - h; y < HORIZON; y++) {
    const f = smooth((y - (HORIZON - h)) / h) * a;
    for (let w = -2; w <= 2; w++) {
      const wf = 1 - Math.abs(w) / 3;
      add(cx + w, y, 3 * f * wf, 14 * f * wf, 8 * f * wf);
    }
  }
}

/* 7 — ground: perspective grid + sheen ------------------------------------ */
{
  const vpx = CAR_X * W, depth = H - HORIZON;
  // converging lines
  for (let i = -14; i <= 14; i++) {
    const spread = i * W * 0.105;
    for (let y = HORIZON; y < H; y++) {
      const t = (y - HORIZON) / depth;
      const x = vpx + spread * Math.pow(t, 1.35);
      const lateral = Math.pow(1 - Math.min(1, Math.abs(x / W - CAR_X) / 0.55), 1.5);
      const f = Math.sin(Math.PI * Math.min(1, t / 0.85)) * (0.25 + 0.75 * lateral);
      for (let w = -1; w <= 1; w++) add(x + w, y, 1.8 * f, 7.5 * f, 4.6 * f);
    }
  }
  // horizontal bands, spaced by perspective
  for (let k = 1; k < 7; k++) {
    const t = Math.pow(k / 7, 2.1);
    const y = HORIZON + t * depth;
    const f = Math.sin(Math.PI * Math.min(1, t / 0.9)) * 0.85;
    for (let x = 0; x < W; x++) {
      const lateral = Math.pow(1 - Math.min(1, Math.abs(x / W - CAR_X) / 0.6), 1.5);
      const g = f * (0.2 + 0.8 * lateral);
      add(x, y, 1.1 * g, 4.6 * g, 2.9 * g); add(x, y + 1, 0.7 * g, 3.0 * g, 1.9 * g);
    }
  }
}


/* 7b — horizon glow: the lit band where the city meets the ground */
{
  const spread = H * 0.085;
  for (let y = 0; y < H; y++) {
    const d = Math.abs(y - HORIZON) / spread;
    if (d >= 1) continue;
    const f = Math.pow(1 - d, 2.4);
    for (let x = 0; x < W; x++) {
      const lateral = Math.pow(1 - Math.min(1, Math.abs(x / W - CAR_X) / 0.62), 1.6);
      const k = f * (0.35 + 0.65 * lateral);
      add(x, y, 3.5 * k, 15 * k, 9 * k);
    }
  }
}

/* 8 — floor light pool under the vehicle ---------------------------------- */
{
  const cx = CAR_X * W, cy = HORIZON + (H - HORIZON) * 0.42;
  const rx = W * 0.16, ry = (H - HORIZON) * 0.62;
  for (let y = HORIZON; y < H; y++) for (let x = 0; x < W; x++) {
    const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    if (d >= 1) continue;
    const f = Math.pow(1 - d, 2.0);
    add(x, y, 3 * f, 16 * f, 9 * f);
  }
}

/* 9 — vignette: darken the right so the headline keeps its contrast -------- */
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const tx = x / W;
  const right = smooth((tx - 0.44) / 0.5) * 0.5;      // fades in past the middle
  const edge = smooth((Math.abs(y / H - 0.5) - 0.30) / 0.22) * 0.35;
  const k = 1 - Math.min(0.72, right + edge);
  const i = (y * W + x) * 3;
  buf[i] *= k; buf[i + 1] *= k; buf[i + 2] *= k;
}

const out = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H * 3; i++) out[i] = Math.max(0, Math.min(255, Math.round(buf[i])));

const dst = process.argv[2];
await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .png({ compressionLevel: 9 })
  .toFile(dst);
console.log("wrote", dst, `${W}x${H}`);
