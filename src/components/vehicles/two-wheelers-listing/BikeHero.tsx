"use client";

import Link from "next/link";
import { ArrowRight, IndianRupee, Leaf, PlugZap, Wrench } from "lucide-react";
import { priceText } from "@/lib/two-wheelers-listing/copy";
import { swatchFor } from "@/lib/cars-listing/paint";
import type { PricedBike } from "@/lib/two-wheelers-listing/types";
import { cn } from "@/lib/utils";
import { HeroScene } from "@/components/vehicles/cars-listing/HeroScene";
import { SHADOW_2, WRAP } from "@/components/vehicles/cars-listing/ui";
import { BikeArt } from "./BikeArt";

const BENEFITS = [
  { icon: IndianRupee, title: "Lower running cost", sub: "A fraction of petrol per km" },
  { icon: PlugZap, title: "Charge at home", sub: "Plug in overnight" },
  { icon: Wrench, title: "Low maintenance", sub: "No oil changes or clutch" },
  { icon: Leaf, title: "Cleaner tomorrow", sub: "Zero tailpipe emissions" },
];

/** Same composition as the Electric Cars hero — generated golden-hour scene, art at the right, spotlight pill — with the spotlight model drawn in its own first colour. */
export function BikeHero({ spotlight }: { spotlight: PricedBike | undefined }) {
  return (
    <section aria-labelledby="bikes-h1" className="relative isolate h-[380px] overflow-hidden bg-[#F4E6D6] max-[980px]:h-auto">
      <HeroScene className="absolute inset-0 -z-30 size-full" />
      {spotlight ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[26px] right-[max(0px,calc(50%-600px))] -z-20 w-[clamp(300px,31vw,450px)] max-[980px]:bottom-[52px] max-[980px]:left-1/2 max-[980px]:right-auto max-[980px]:w-[min(420px,76vw)] max-[980px]:-translate-x-1/2 max-[760px]:bottom-[46px] max-[760px]:w-[min(340px,84vw)]"
        >
          <BikeArt type={spotlight.type} color={swatchFor(spotlight.colors[0])} reflect alt="" />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,244,.96)_0%,rgba(255,248,240,.88)_26%,rgba(255,246,236,.35)_46%,rgba(255,246,236,0)_60%)] max-[980px]:bg-[linear-gradient(180deg,rgba(255,250,244,.95)_0%,rgba(255,248,240,.8)_40%,rgba(255,246,236,0)_62%)]"
      />
      <div className={cn(WRAP, "relative flex h-full flex-col justify-center pb-10 max-[980px]:justify-start max-[980px]:pb-[262px] max-[980px]:pt-[34px] max-[760px]:pb-[206px] max-[760px]:pt-[26px]")}>
        <h1 id="bikes-h1" className="text-[clamp(40px,4.6vw,64px)] font-extrabold leading-none tracking-[-.045em] max-[760px]:text-[clamp(34px,9.6vw,44px)]">
          Electric Scooters &amp; Bikes
        </h1>
        <p className="mt-3 max-w-[470px] text-[17px] leading-normal text-ink-secondary max-[760px]:text-[15px]">
          Every electric scooter and motorcycle on sale or coming soon in India — prices, claimed range, top speed and charging times, side by side.
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
          href={`/two-wheelers/${spotlight.slug}`}
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
