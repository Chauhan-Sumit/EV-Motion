"use client";

import { RouteError } from "@/components/common/RouteError";

export default function CommercialError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      {...props}
      heading="We couldn't load this commercial EV page"
      description="Something went wrong while loading commercial vehicle data. Try again, or head back home."
      backHref="/"
      backLabel="Back to Home"
    />
  );
}
