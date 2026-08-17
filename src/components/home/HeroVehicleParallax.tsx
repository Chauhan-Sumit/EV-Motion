"use client";

/**
 * Homepage hero vehicle — 2.5D parallax, CSS/DOM only. No Three.js, no WebGL.
 *
 * HOW THE DEPTH WORKS
 * A single rAF loop writes two damped, normalised values (-1..1) as CSS custom
 * properties on the hero root: `--hero-px` / `--hero-py`. Every layer consumes
 * the same pair with a different multiplier, which is what produces parallax:
 *
 *   background  ~6px   (slow, and pre-scaled 1.06 so its edges never expose)
 *   shadow     ~14px   (mid — stays roughly under the car but lags slightly)
 *   vehicle    ~28px   (fast, plus a small rotateX/rotateY tilt)
 *
 * Driving layers through CSS variables rather than per-layer React state means
 * the hero background can live in Hero.tsx (server-rendered, no hydration flash)
 * while still participating in the parallax.
 *
 * Movement is deliberately noticeable — the brief called out that too-subtle
 * reads as broken — but it is damped and slow enough never to compete with the
 * headline. Idle adds a slow sine so the hero is alive before any input.
 *
 * `prefers-reduced-motion` short-circuits the loop entirely and the variables
 * stay at 0, leaving a completely static, correctly-composed hero.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CAR_SRC = "/images/hero/hero-ev-car.webp";

/** Damping per second — higher follows the cursor more eagerly. */
const DAMP = 5.5;
/** Idle drift, in normalised units. Small, but enough to read as alive. */
const IDLE_X = 0.22;
const IDLE_Y = 0.1;
const IDLE_PERIOD = 13; // seconds

export function HeroVehicleParallax() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // The layers are hidden below lg by CSS, but the effect would still mount and
  // spin a requestAnimationFrame loop forever on mobile, writing CSS variables
  // nothing reads. Gate the loop on the same breakpoint.
  const isWide = useMediaQuery("(min-width: 1024px)");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !isWide) return;
    const hero = rootRef.current?.closest("[data-hero-root]") as HTMLElement | null;
    if (!hero) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let pointerActive = false;
    let raf = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      pointerActive = true;
    };
    const onLeave = () => {
      pointerActive = false;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Idle drift takes over whenever the pointer is not engaged.
      let tx = target.x;
      let ty = target.y;
      if (!pointerActive) {
        const t = (now / 1000 / IDLE_PERIOD) * Math.PI * 2;
        tx = Math.sin(t) * IDLE_X;
        ty = Math.sin(t * 0.7) * IDLE_Y;
      }

      // Framerate-independent damping.
      const k = 1 - Math.pow(0.0001, dt * (DAMP / 5));
      current.x += (tx - current.x) * k;
      current.y += (ty - current.y) * k;

      hero.style.setProperty("--hero-px", current.x.toFixed(4));
      hero.style.setProperty("--hero-py", current.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.style.removeProperty("--hero-px");
      hero.style.removeProperty("--hero-py");
    };
  }, [reducedMotion, isWide]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient light pooled around the vehicle. Sits between the background
          plate and the car and moves at an intermediate rate, so the car reads
          as standing *inside* the space rather than pasted on top of it. */}
      <div
        className="absolute bottom-[6%] left-[-6%] h-[86%] w-[52%] max-w-[620px]"
        style={{
          background:
            "radial-gradient(45% 50% at 42% 62%, rgba(37,212,74,0.13) 0%, rgba(31,168,60,0.06) 45%, rgba(31,168,60,0) 78%)",
          transform:
            "translate3d(calc(var(--hero-px, 0) * 20px), calc(var(--hero-py, 0) * 8px), 0)",
          willChange: "transform",
        }}
      />

      {/* Soft contact shadow. Its own layer so it can lag behind the vehicle,
          which is most of what sells the separation. Sits at the vehicle's
          wheel line. */}
      <div
        className="absolute bottom-[17%] left-[2%] h-[22px] w-[30%] max-w-[360px] rounded-[50%]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0) 100%)",
          transform:
            "translate3d(calc(var(--hero-px, 0) * 14px), calc(var(--hero-py, 0) * 5px), 0)",
          willChange: "transform",
        }}
      />

      {/* Vehicle. Sized off the hero's height so it can never force the hero
          taller, and capped at 44% width so it stays clear of the copy.

          65%, down from 74% — a ~12% reduction — and lifted from a 13% to a 20%
          bottom offset, which puts ~12px of clear space between the wheels and
          the top edge of the Find Your Right EV panel (that panel overlaps the
          hero's bottom 52px, i.e. 16%). The wheel line now sits just below the
          plate's horizon, so the car stands on the lit floor. */}
      <div
        className="absolute bottom-[20%] left-[1.5%] h-[65%] w-auto max-w-[44%]"
        style={{
          transform:
            "translate3d(calc(var(--hero-px, 0) * 28px), calc(var(--hero-py, 0) * 12px), 0)" +
            " rotateY(calc(var(--hero-px, 0) * -3.2deg)) rotateX(calc(var(--hero-py, 0) * 1.6deg))",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/*
          `unoptimized` is REQUIRED here, not an oversight. next/image
          content-negotiates the output format, and it answered a request without
          an explicit `Accept: image/webp` by re-encoding to **JPEG** — a format
          with no alpha channel, which would flatten the cut-out vehicle into a
          solid rectangle. Serving the WebP verbatim guarantees transparency on
          every client. The file is already sized for its slot (900px, 80 KB).

          Also deliberately NOT `priority`: a priority image is preloaded even
          when its container is display:none, so mobile paid for a vehicle it
          never shows. Lazy means desktop fetches it as soon as it is in view —
          immediately, since the hero is above the fold — and mobile never does.
        */}
        <Image
          src={CAR_SRC}
          alt=""
          width={900}
          height={493}
          unoptimized
          className="h-full w-auto object-contain object-left-bottom"
        />
      </div>
    </div>
  );
}
