import Image from "next/image";
import { HeroVehicleParallax } from "./HeroVehicleParallax";

export function Hero() {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div
        data-hero-root
        className="relative h-[300px] w-full overflow-hidden bg-surface-dark sm:h-[320px]"
      >
        {/*
          Below lg the original approved background stays exactly as it was — it
          has a flat vehicle illustration baked into its lower right, which is
          fine at 300/320px where the crop only grazes it.

          At lg the hero is tall enough that the baked vehicle would be fully
          visible and collide with the real 3D model, so a car-free variant is
          used instead (same artwork, right side rebuilt from a mirrored copy of
          the clean left side).

          Both go through next/image: it re-encodes these flat-colour PNGs to
          ~8 KB each. Serving the lg variant as a raw CSS background instead cost
          78 KB, which is the whole reason it is an <Image> and not a bg-[url()].
        */}
        <Image
          src="/images/hero/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover lg:hidden"
        />
        {/*
          The lg background is the generated environment plate: atmospheric
          gradient, two-band city silhouette with atmospheric perspective,
          volumetric haze, horizon glow, a faintly lit perspective floor and a
          green light pool where the vehicle stands. Authored dark on purpose,
          and vignetted on the right so the headline keeps its contrast.

          Wrapped so it can take the slowest parallax layer, and pre-scaled 1.06
          so shifting it never exposes an edge. The transform reads CSS variables
          written by HeroVehicleParallax; with no JS, or under reduced motion,
          the variables are simply absent and the fallback of 0 leaves it static.
        */}
        {/*
          The plate is a CSS background on a `hidden lg:block` element, and that
          is load-bearing: a display:none element never fetches its background
          image, so mobile costs exactly zero bytes here while desktop fetches on
          the first frame it is shown.

          Two other approaches were tried and rejected. A `priority` <Image>
          emits a preload link that fires even when the container is
          display:none, so mobile pulled 12 KB it can never show. A <picture>
          with a media-gated <source> is the textbook answer, but React hydration
          re-creates the <img> and locks in its `src` before the sibling <source>
          is consulted — verified live: the media query matched at 1280px and the
          element still resolved to the fallback.

          Serving it verbatim also avoids next/image picking a w=640 variant of a
          2560px plate, which softened the skyline and floor for no byte saving.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[url('/images/hero/hero-env.webp')] bg-cover bg-center lg:block"
          style={{
            transform:
              "scale(1.06) translate3d(calc(var(--hero-px, 0) * -6px), calc(var(--hero-py, 0) * -4px), 0)",
            willChange: "transform",
          }}
        />

        {/* 2.5D vehicle layers. Renders only at lg; below that the hero is
            exactly its original static composition. */}
        <HeroVehicleParallax />

        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/50 via-transparent to-surface-dark/10" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col items-center justify-center px-4 text-center sm:px-9 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:text-left">
          {/*
            Single column, centred below lg (unchanged). At lg it moves to the
            right-hand column so the 3D vehicle owns the left, per the reference.
          */}
          <div className="lg:col-start-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-[7px] backdrop-blur-sm">
              <span
                className="hero-dot h-[7px] w-[7px] shrink-0 animate-pulse-dot rounded-full bg-primary-bright"
                aria-hidden="true"
              />
              <span className="text-[12px] font-bold uppercase tracking-wide text-primary-bright">
                India&apos;s #1 Electric Vehicle Marketplace
              </span>
            </div>

            <h1
              id="hero-heading"
              className="max-w-2xl text-[28px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[34px]"
            >
              Drive the Future,{" "}
              <span className="text-primary-bright">Go Electric Today</span>
            </h1>

            <p className="mt-2.5 max-w-xl text-[13px] text-white/75 sm:text-sm">
              Compare EV cars, bikes and scooters from every major OEM in one place
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
