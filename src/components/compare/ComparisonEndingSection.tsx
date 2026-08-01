"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Clock, Scale, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getRelatedVehicles } from "@/lib/data";
import { parseCompareSlug, buildCompareSlug } from "@/lib/compare/slug";
import { loadRecentComparisonSlugs } from "@/lib/compare/recentComparisons";
import type { Vehicle } from "@/types/vehicle";

/**
 * Browsing-encouragement block after the FAQs — four low-effort, genuinely
 * data-backed nudges rather than a generic "you might also like" filler:
 * Similar Vehicles (existing getRelatedVehicles, same-OEM-first +
 * price-proximity backfill), Recently Compared (this browser's own
 * localStorage history, resolved back to real vehicles via
 * parseCompareSlug), Continue Comparing (start fresh), Explore Brand (one
 * link per distinct OEM among the vehicles just compared).
 */
export function ComparisonEndingSection({ vehicles }: { vehicles: Vehicle[] }) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect --
       One-time hydration from localStorage after mount: the server has no
       localStorage, so this can't be a lazy `useState` initializer without
       an SSR/client hydration mismatch. */
    setRecentSlugs(loadRecentComparisonSlugs(buildCompareSlug(vehicles)));
  }, [vehicles]);

  const similar = getRelatedVehicles(vehicles[0], 8);
  const brands = Array.from(new Map(vehicles.map((v) => [v.oem, v])).values());
  const recentPairs = recentSlugs
    .map((slug) => ({ slug, resolved: parseCompareSlug(slug) }))
    .filter((r): r is { slug: string; resolved: Vehicle[] } => Boolean(r.resolved))
    .slice(0, 4);

  return (
    <section className="border-t border-border bg-surface-secondary py-8">
      <Container>
        <BlockHeading title="Keep Exploring" />

        {similar.length > 0 ? (
          <div className="mb-6">
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
              <Sparkles size={12} /> Similar Vehicles
            </p>
            <div className="scroll-row -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
              {similar.slice(0, 6).map((v) => (
                <div key={v.slug} className="w-40 shrink-0 snap-start sm:w-48">
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          {recentPairs.length > 0 ? (
            <div className="rounded-xl border border-border bg-surface p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                <Clock size={12} /> Recently Compared
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {recentPairs.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/compare/${r.slug}`} className="focus-ring block truncate text-[12px] font-semibold text-ink hover:text-primary">
                      {r.resolved.map((v) => v.modelName).join(" vs ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-border bg-surface p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
              <Scale size={12} /> Continue Comparing
            </p>
            <p className="mt-2 text-[12px] text-ink-secondary">Start a fresh comparison with different vehicles.</p>
            <Link href="/compare" className="focus-ring mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-primary hover:underline">
              New comparison <ArrowRight size={13} />
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
              <Building2 size={12} /> Explore Brands
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {brands.map((v) => (
                <li key={v.oem}>
                  <Link href={`/brands/${v.oem}`} className="focus-ring flex items-center gap-1 text-[12px] font-semibold text-ink hover:text-primary">
                    All {v.oemName} EVs <ArrowRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
