"use client";

import { RouteError } from "@/components/common/RouteError";

export default function TwoWheelersError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      {...props}
      heading="We couldn't load this scooter or bike page"
      description="Something went wrong while loading two-wheeler data. Try again, or browse the full listing."
      backHref="/two-wheelers"
      backLabel="All Scooters & Bikes"
    />
  );
}
