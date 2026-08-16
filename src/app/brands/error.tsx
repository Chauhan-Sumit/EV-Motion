"use client";

import { RouteError } from "@/components/common/RouteError";

export default function BrandsError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      {...props}
      heading="We couldn't load this brand page"
      description="Something went wrong while loading brand data. Try again, or browse all EV brands."
      backHref="/brands"
      backLabel="All Brands"
    />
  );
}
