import { useId } from "react";
import { cn } from "@/lib/utils";
import type { BodyShape } from "@/lib/vehicle-detail/types";

/**
 * Generic body-type illustration — deliberately not a likeness of any real
 * model, and deliberately not a photograph.
 *
 * The vehicle catalogue has no licensed photography yet, so the prototype
 * needs *something* for the colour picker to act on. A drawing that re-paints
 * from a prop is honest about being a drawing, and it lets the colour and
 * variant interactions be reviewed today. Labelled slots elsewhere on the page
 * mark where real photography goes.
 *
 * Geometry lives here rather than in `mock-data.ts` because it is drawing
 * instruction, not vehicle data: three silhouettes shared by every car on the
 * page, picked by body type.
 */

interface ShapeSpec {
  /**
   * Filled parts of the silhouette. Cars are one enclosing outline; two-
   * wheelers are several separate pieces, because a motorcycle reads through
   * the gaps between fork, tank and tail. Drawn as one closed shape they look
   * like a car, which is exactly what the first attempt produced.
   */
  body: string[];
  /** Window panes. Empty for two-wheelers, which have none. */
  glass: string[];
  /** Highlight stroke along the roof or, on a two-wheeler, the upper body line. */
  roofline: string;
  wheels: number[];
  wheelY: number;
  tyre: number;
  rim: number;
  shadowRx: number;
}

const SHAPES: Record<BodyShape, ShapeSpec> = {
  suv: {
    body: ["M 24,126 L 24,103 C 24,91 31,83 45,79 L 84,70 L 106,40 C 112,32 120,28 132,28 L 272,28 C 284,28 292,32 296,40 L 316,74 L 378,82 C 392,85 398,94 398,106 L 398,126 L 358,126 A 37,37 0 0 0 281,126 L 144,126 A 37,37 0 0 0 67,126 Z"],
    glass: [
      "M 116,44 C 120,37 126,34 134,34 L 198,34 L 198,72 L 96,72 Z",
      "M 206,34 L 268,34 C 277,34 283,37 287,44 L 306,72 L 206,72 Z",
    ],
    roofline: "M 106,40 C 112,32 120,28 132,28 L 272,28 C 284,28 292,32 296,40",
    wheels: [104, 318],
    wheelY: 138,
    tyre: 34,
    rim: 19,
    shadowRx: 158,
  },
  hatch: {
    body: ["M 34,132 L 34,112 C 34,101 40,94 53,90 L 88,82 L 114,54 C 120,46 128,42 140,42 L 250,42 C 262,42 270,46 275,54 L 300,86 L 358,94 C 372,97 378,105 378,114 L 378,132 L 344,132 A 34,34 0 0 0 274,132 L 148,132 A 34,34 0 0 0 78,132 Z"],
    glass: [
      "M 124,57 C 128,50 134,48 141,48 L 196,48 L 196,82 L 104,82 Z",
      "M 204,48 L 247,48 C 255,48 260,51 264,57 L 285,82 L 204,82 Z",
    ],
    roofline: "M 114,54 C 120,46 128,42 140,42 L 250,42 C 262,42 270,46 275,54",
    wheels: [112, 308],
    wheelY: 140,
    tyre: 31,
    rim: 17,
    shadowRx: 146,
  },
  coupe: {
    body: ["M 24,126 L 24,103 C 24,91 31,83 45,79 L 84,70 L 106,42 C 112,34 120,30 132,30 L 226,30 C 240,30 250,34 258,42 L 330,88 L 380,94 C 393,97 398,104 398,112 L 398,126 L 358,126 A 37,37 0 0 0 281,126 L 144,126 A 37,37 0 0 0 67,126 Z"],
    glass: [
      "M 116,46 C 120,39 126,36 134,36 L 196,36 L 196,74 L 96,74 Z",
      "M 204,36 L 224,36 C 235,36 243,39 249,46 L 288,74 L 204,74 Z",
    ],
    roofline: "M 106,42 C 112,34 120,30 132,30 L 226,30 C 240,30 250,34 258,42 L 330,88",
    wheels: [104, 318],
    wheelY: 138,
    tyre: 34,
    rim: 19,
    shadowRx: 158,
  },

  // Two-wheelers and commercial silhouettes, added when the design graduated
  // from a car-only prototype to the template every category uses. Drawn to the
  // same 420 × 182 box and the same conventions as the cars above — facing
  // right, wheels on the 126-142 band, so a row of mixed categories lines up.
  scooter: {
    body: [
      // handlebar
      "M 128,50 L 178,44 C 183,43 186,46 186,51 C 186,56 183,59 178,60 L 130,62 C 125,62 122,59 122,55 C 122,52 124,51 128,50 Z",
      // leg shield / front apron, down to the front axle
      "M 118,120 C 114,120 112,117 113,113 L 126,66 C 128,58 134,54 142,54 L 152,54 C 158,54 161,58 160,64 L 152,104 C 150,113 144,119 135,120 Z",
      // floorboard
      "M 140,116 L 246,116 C 251,116 254,119 254,124 L 254,128 C 254,133 251,136 246,136 L 140,136 C 135,136 132,133 132,128 L 132,124 C 132,119 135,116 140,116 Z",
      // seat, rear body and tail, arching over the back wheel
      "M 248,136 C 242,136 239,132 241,126 L 252,98 C 257,86 267,80 280,80 L 320,80 C 339,80 351,92 354,110 L 357,128 C 358,133 355,136 350,136 Z",
    ],
    glass: [],
    roofline: "M 126,66 C 128,58 134,54 142,54 L 152,54",
    wheels: [122, 300],
    wheelY: 142,
    tyre: 26,
    rim: 13,
    shadowRx: 132,
  },
  motorcycle: {
    body: [
      // handlebar
      "M 126,42 L 176,36 C 181,35 184,38 184,43 C 184,48 181,51 176,52 L 128,54 C 123,54 120,51 120,47 C 120,44 122,43 126,42 Z",
      // front fork, raked back from the axle up to the yoke
      "M 100,132 C 95,132 92,128 94,123 L 122,58 C 125,51 130,48 137,48 L 146,48 C 152,48 155,52 153,58 L 128,124 C 126,129 122,132 117,132 Z",
      // tank — peaks forward and high, the line that separates a motorcycle
      // from the scooter above
      "M 162,104 C 156,104 153,99 157,93 L 174,72 C 184,60 196,54 211,54 L 232,54 C 241,54 246,59 246,68 L 246,96 C 246,102 242,104 236,104 Z",
      // seat, dipping behind the tank
      "M 240,86 L 296,82 C 304,81 308,85 308,92 L 308,98 C 308,104 304,107 297,107 L 242,107 C 236,107 233,104 233,98 L 233,92 C 233,88 236,86 240,86 Z",
      // tail, kicked up above the seat line
      "M 300,84 L 340,68 C 350,64 358,69 358,80 L 358,90 C 358,99 352,104 343,104 L 306,104 C 299,104 296,100 297,93 Z",
      // motor mass, held above the axle line so it does not droop into the road
      "M 178,104 L 254,104 C 260,104 263,108 261,114 L 256,124 C 253,130 247,133 240,133 L 198,133 C 190,133 184,130 181,124 L 176,114 C 174,108 175,104 178,104 Z",
    ],
    glass: [],
    roofline: "M 176,80 C 186,66 199,58 216,58 L 246,58",
    wheels: [108, 314],
    wheelY: 136,
    tyre: 34,
    rim: 17,
    shadowRx: 148,
  },
  van: {
    body: ["M 24,130 L 24,50 C 24,42 30,36 40,36 L 300,36 C 318,36 330,44 336,58 L 356,104 C 368,108 374,116 374,126 L 374,130 L 352,130 A 32,32 0 0 0 288,130 L 140,130 A 32,32 0 0 0 76,130 Z"],
    glass: ["M 306,50 L 322,50 C 330,50 335,54 338,62 L 348,88 L 306,88 Z"],
    roofline: "M 24,50 C 24,42 30,36 40,36 L 300,36 C 318,36 330,44 336,58",
    wheels: [108, 320],
    wheelY: 138,
    tyre: 32,
    rim: 16,
    shadowRx: 168,
  },
  "three-wheeler": {
    body: ["M 60,132 L 66,86 C 70,68 84,56 104,54 L 150,50 C 160,40 172,36 186,36 L 268,36 C 288,36 300,48 302,68 L 308,132 L 288,132 A 28,28 0 0 0 232,132 L 128,132 A 28,28 0 0 0 72,132 Z"],
    glass: [
      "M 156,56 L 200,54 L 200,84 L 140,84 Z",
      "M 208,54 L 262,54 C 274,54 282,62 284,76 L 286,84 L 208,84 Z",
    ],
    roofline: "M 150,50 C 160,40 172,36 186,36 L 268,36 C 288,36 300,48 302,68",
    wheels: [100, 260],
    wheelY: 140,
    tyre: 28,
    rim: 14,
    shadowRx: 130,
  },
};

/**
 * Illustration internals rather than design tokens — tyre black and glass
 * blue-grey are properties of the drawing, not of the EV Motion palette, and
 * they read correctly against both the light and dark surfaces.
 */
const TYRE = "#1A1F21";
const RIM = "#C3CCC7";
const GLASS_TOP = "#93AAB4";
const GLASS_BOTTOM = "#5C7480";
const EDGE = "rgba(255,255,255,.85)";
const SHADOW = "rgba(11,18,16,.28)";

const SPOKE_COUNT = 6;

export function CarIllustration({
  shape,
  bodyColor,
  alt,
  detail = true,
  className,
}: {
  shape: BodyShape;
  /** Any CSS colour. This is what the colour picker drives. */
  bodyColor: string;
  /** Empty string marks the drawing decorative, for thumbnails beside a label. */
  alt: string;
  /** `false` drops the wheel spokes — for small thumbnails where they turn to mud. */
  detail?: boolean;
  className?: string;
}) {
  // useId, not Math.random: gradient ids must match between the server render
  // and the client hydration, or React discards the markup and warns.
  const uid = useId().replace(/:/g, "");
  const spec = SHAPES[shape];
  const bodyParts = spec.body;

  const bodyGradient = `body-${uid}`;
  const glassGradient = `glass-${uid}`;
  const shadowGradient = `shadow-${uid}`;

  return (
    <svg
      viewBox="0 0 420 182"
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <linearGradient id={bodyGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".30" />
          <stop offset=".42" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".78" stopColor="#000" stopOpacity=".10" />
          <stop offset="1" stopColor="#000" stopOpacity=".26" />
        </linearGradient>
        <linearGradient id={glassGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GLASS_TOP} />
          <stop offset="1" stopColor={GLASS_BOTTOM} />
        </linearGradient>
        <radialGradient id={shadowGradient} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor={SHADOW} />
          <stop offset="1" stopColor={SHADOW} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="211" cy="174" rx={spec.shadowRx} ry="10" fill={`url(#${shadowGradient})`} />
      {bodyParts.map((d, i) => (
        <path key={`f${i}`} d={d} fill={bodyColor} style={{ transition: "fill 220ms ease" }} />
      ))}
      {bodyParts.map((d, i) => (
        <path key={`g${i}`} d={d} fill={`url(#${bodyGradient})`} />
      ))}
      {spec.glass.map((d, i) => (
        <path key={i} d={d} fill={`url(#${glassGradient})`} />
      ))}
      <path
        d={spec.roofline}
        fill="none"
        stroke={EDGE}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {spec.wheels.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={spec.wheelY} r={spec.tyre} fill={TYRE} />
          <circle cx={cx} cy={spec.wheelY} r={spec.rim} fill={RIM} />
          {detail &&
            Array.from({ length: SPOKE_COUNT }, (_, i) => {
              const angle = ((i * 360) / SPOKE_COUNT) * (Math.PI / 180);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={spec.wheelY}
                  x2={Number((cx + Math.cos(angle) * spec.rim * 0.86).toFixed(1))}
                  y2={Number((spec.wheelY + Math.sin(angle) * spec.rim * 0.86).toFixed(1))}
                  stroke={TYRE}
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  opacity=".85"
                />
              );
            })}
          <circle cx={cx} cy={spec.wheelY} r={spec.rim * 0.3} fill={TYRE} />
        </g>
      ))}
    </svg>
  );
}
