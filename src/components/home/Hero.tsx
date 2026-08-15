import Image from "next/image";

export function Hero() {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div className="relative h-[300px] w-full overflow-hidden bg-surface-dark sm:h-[320px]">
        <Image
          src="/images/hero/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/50 via-transparent to-surface-dark/10" />

        <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col items-center justify-center px-4 text-center sm:px-9">
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

          <p className="mt-2.5 text-[13px] text-white/75 sm:text-sm">
            Compare EV cars, bikes and scooters from every major OEM in one place
          </p>
        </div>
      </div>
    </section>
  );
}
