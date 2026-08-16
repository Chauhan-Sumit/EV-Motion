"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { reportError } from "@/lib/analytics/reportError";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    reportError(error, { boundary: "root" });
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertTriangle size={28} />
      </span>
      <p className="mt-5 text-sm font-bold uppercase tracking-[0.5px] text-error">Something went wrong</p>
      <h1 className="mt-1.5 text-2xl font-extrabold text-ink sm:text-3xl">This page hit a snag</h1>
      <p className="mt-2.5 max-w-md text-[13px] text-ink-secondary">
        An unexpected error occurred while loading this page. You can try again, or head back home.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="focus-ring flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <RotateCw size={15} />
          Try Again
        </button>
        <Link
          href="/"
          className="focus-ring rounded-md border border-border-strong px-5 py-2.5 text-[13px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          Back to Home
        </Link>
      </div>
    </Container>
  );
}
