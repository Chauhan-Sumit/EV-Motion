"use client";

import { RouteError } from "@/components/common/RouteError";

export default function CompareError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      {...props}
      heading="We couldn't build this comparison"
      description="Something went wrong while comparing these vehicles. Try again, or start a new comparison."
      backHref="/compare"
      backLabel="New Comparison"
    />
  );
}
