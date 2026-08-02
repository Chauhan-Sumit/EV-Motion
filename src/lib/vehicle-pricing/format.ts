const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Formats a `YYYY-MM-DD` pricing timestamp for display without going through
 * `Date`/`toLocaleDateString` — those apply the viewer's timezone to a
 * UTC-parsed date, which can shift the displayed day and mismatch between
 * server and client render (the same hydration-mismatch class of bug
 * `LocationContext` already works around for city state).
 */
export function formatPricingDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
