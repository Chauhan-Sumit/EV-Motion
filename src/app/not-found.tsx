import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Car, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-tint text-primary">
        <Compass size={28} />
      </span>
      <p className="mt-5 text-sm font-bold uppercase tracking-[0.5px] text-primary">404</p>
      <h1 className="mt-1.5 text-2xl font-extrabold text-ink sm:text-3xl">This page took a wrong turn</h1>
      <p className="mt-2.5 max-w-md text-[13px] text-ink-secondary">
        We couldn&apos;t find the page you were looking for. It may have been moved, or the link may be
        out of date.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/"
          className="focus-ring rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Back to Home
        </Link>
        <Link
          href="/cars"
          className="focus-ring flex items-center gap-1.5 rounded-md border border-border-strong px-5 py-2.5 text-[13px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <Car size={15} />
          Browse Cars
        </Link>
        <Link
          href="/two-wheelers"
          className="focus-ring flex items-center gap-1.5 rounded-md border border-border-strong px-5 py-2.5 text-[13px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <Zap size={15} />
          Browse Scooters &amp; Bikes
        </Link>
      </div>
    </Container>
  );
}
