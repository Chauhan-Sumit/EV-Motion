"use client";

import Link from "next/link";
import { ArrowRight, Gauge, IndianRupee, Leaf, ShieldCheck } from "lucide-react";
import { priceText } from "@/lib/cars-listing/copy";
import { HERO_PAINT } from "@/lib/cars-listing/paint";
import type { PricedCar } from "@/lib/cars-listing/types";
import { cn } from "@/lib/utils";
import { ListingCarArt } from "./ListingCarArt";
import { HeroCharger, HeroScene } from "./HeroScene";
import { SHADOW_2, WRAP } from "./ui";

const BENEFITS = [
  { icon: Gauge, title: "Better performance", sub: "Instant torque, silent drive" },
  { icon: IndianRupee, title: "Lower running cost", sub: "A fraction of petrol per km" },
  { icon: Leaf, title: "Cleaner tomorrow", sub: "Zero tailpipe emissions" },
  { icon: ShieldCheck, title: "Govt. incentives", sub: "Road-tax relief in many states" },
];

export function ListingHero({ spotlight }: { spotlight: PricedCar | undefined }) {
  return (
    <section aria-labelledby="cars-h1" className="relative isolate h-[380px] overflow-hidden bg-[#F4E6D6] max-[980px]:h-auto">
      <HeroScene className="absolute inset-0 -z-30 size-full" />
      {spotlight ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[30px] right-[max(0px,calc(50%-600px))] -z-20 w-[clamp(320px,35vw,505px)] max-[980px]:bottom-[58px] max-[980px]:left-1/2 max-[980px]:right-auto max-[980px]:w-[min(470px,80vw)] max-[980px]:-translate-x-1/2 max-[760px]:bottom-[54px] max-[760px]:w-[min(380px,88vw)]"
        >
          <ListingCarArt dims={spotlight.art} body={spotlight.body} paint={HERO_PAINT} frame={{ lengthMm: 4200, heightMm: 1700 }} reflect alt="" />
        </div>
      ) : null}
      <HeroCharger className="pointer-events-none absolute bottom-[44px] right-[calc(50%-694px)] -z-20 h-[170px] w-10 max-[1240px]:hidden" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,244,.96)_0%,rgba(255,248,240,.88)_26%,rgba(255,246,236,.35)_46%,rgba(255,246,236,0)_60%)] max-[980px]:bg-[linear-gradient(180deg,rgba(255,250,244,.95)_0%,rgba(255,248,240,.8)_40%,rgba(255,246,236,0)_62%)]"
      />
      <div className={cn(WRAP, "relative flex h-full flex-col justify-center pb-10 max-[980px]:justify-start max-[980px]:pb-[292px] max-[980px]:pt-[34px] max-[760px]:pb-[236px] max-[760px]:pt-[26px]")}>
        <h1 id="cars-h1" className="text-[clamp(40px,4.6vw,64px)] font-extrabold leading-none tracking-[-.045em] max-[760px]:text-[clamp(36px,10.5vw,46px)]">
          Electric Cars
        </h1>
        <p className="mt-3 max-w-[470px] text-[17px] leading-normal text-ink-secondary max-[760px]:text-[15px]">
          Every electric car on sale or coming soon in India — prices, claimed range, charging times and safety ratings, side by side.
        </p>
        <ul role="list" className="mt-[26px] flex list-none gap-[26px] p-0 max-[1240px]:gap-[18px] max-[760px]:mt-5 max-[760px]:grid max-[760px]:grid-cols-2 max-[760px]:gap-x-3.5 max-[760px]:gap-y-3">
          {BENEFITS.map(({ icon: Icon, title, sub }) => (
            <li key={title} className="flex max-w-[150px] items-center gap-[11px] max-[760px]:max-w-none">
              <i className="grid size-11 flex-none place-items-center rounded-full bg-white text-primary-hover shadow-[0_6px_16px_-6px_rgba(120,80,30,.35),inset_0_0_0_1px_rgba(21,122,44,.14)] max-[760px]:size-[38px]">
                <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
              </i>
              <div>
                <b className="block text-[13px] font-semibold leading-[1.25] max-[760px]:text-[12.5px]">{title}</b>
                <span className="block text-xs leading-[1.3] text-ink-muted max-[760px]:hidden">{sub}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {spotlight ? (
        <Link
          href={`/cars/${spotlight.slug}`}
          aria-label={`Spotlight: ${spotlight.name}, ${priceText(spotlight.price, "–")}`}
          className={cn(
            "absolute right-[max(24px,calc(50%-640px))] top-[26px] z-[2] flex items-center gap-2.5 whitespace-nowrap rounded-[14px] border border-white/90 bg-white/[.82] py-[7px] pl-3.5 pr-2 text-[13px] text-ink backdrop-blur-[10px] hover:bg-white hover:no-underline max-[980px]:hidden",
            SHADOW_2,
          )}
        >
          <div>
            <small className="block text-[10.5px] font-bold tracking-[.12em] text-primary-hover">SPOTLIGHT</small>
            <b className="font-bold">{spotlight.name}</b> · {priceText(spotlight.price, "–")}
          </div>
          <span aria-hidden="true" className="grid size-[30px] place-items-center rounded-[9px] bg-ink text-white">
            <ArrowRight className="size-[15px]" strokeWidth={2.4} />
          </span>
        </Link>
      ) : null}
    </section>
  );
}
