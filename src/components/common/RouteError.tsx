"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * Shared body for every route-segment `error.tsx`.
 *
 * Scoped boundaries exist so a failure inside one section doesn't blank the
 * whole app: the root `error.tsx` replaces everything below the layout, while
 * a segment boundary keeps the rest of the shell intact and lets the reader
 * retry just that section. Each segment passes copy naming what failed, so
 * the message isn't the same generic line everywhere.
 */
export function RouteError({
  error,
  reset,
  heading,
  description,
  backHref = "/",
  backLabel = "Back to Home",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  heading: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  useEffect(() => {
    // Replace with the real error reporter once one exists (Batch 6).
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertTriangle size={24} />
      </span>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.5px] text-error">Something went wrong</p>
      <h1 className="mt-1.5 text-xl font-extrabold text-ink sm:text-2xl">{heading}</h1>
      <p className="mt-2 max-w-md text-[13px] text-ink-secondary">{description}</p>
      {error.digest ? <p className="mt-2 text-[10.5px] text-ink-muted">Reference: {error.digest}</p> : null}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="focus-ring flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <RotateCw size={15} />
          Try Again
        </button>
        <Link
          href={backHref}
          className="focus-ring rounded-md border border-border-strong px-5 py-2.5 text-[13px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          {backLabel}
        </Link>
      </div>
    </Container>
  );
}
