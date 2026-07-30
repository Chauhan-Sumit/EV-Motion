"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Block } from "@/components/ui/Block";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";
import type { BrandCardData } from "@/types/ev-motion";

export function BrandCarousel({
  title,
  viewAllHref,
  brands,
}: {
  title: string;
  viewAllHref: string;
  brands: BrandCardData[];
}) {
  const { trackRef, scrollByCards } = useCarouselScroll<HTMLDivElement>();

  return (
    <Block>
      <BlockHeading
        title={title}
        action={
          <div className="flex items-center gap-2.5">
            <Link href={viewAllHref} className="focus-ring text-[11px] font-semibold text-primary">
              View all ›
            </Link>
            <div className="hidden gap-1.5 sm:flex">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollByCards(-1)}
                className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-border-strong text-ink-secondary transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollByCards(1)}
                className="focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-border-strong text-ink-secondary transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        }
      />

      <div
        ref={trackRef}
        className="scroll-row -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1"
      >
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            data-carousel-item
            className="focus-ring flex w-[30%] shrink-0 snap-start flex-col items-center gap-2 rounded-lg border border-border bg-surface p-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover sm:w-[17%]"
          >
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              {brand.logo ? (
                <Image src={brand.logo} alt={brand.name} fill sizes="56px" className="object-contain" />
              ) : (
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold"
                  style={{ backgroundColor: `${brand.color}22`, color: brand.color }}
                >
                  {brand.name.charAt(0)}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold leading-tight text-ink">{brand.name}</p>
          </Link>
        ))}
      </div>
    </Block>
  );
}
