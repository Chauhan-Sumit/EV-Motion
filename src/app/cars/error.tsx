"use client";

import { RouteError } from "@/components/common/RouteError";

export default function CarsError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      {...props}
      heading="We couldn't load this car page"
      description="Something went wrong while loading electric car data. Try again, or browse the full car listing."
      backHref="/cars"
      backLabel="All Electric Cars"
    />
  );
}
