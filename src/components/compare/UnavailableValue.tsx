/**
 * Premium "not published" state — replaces raw "Not officially specified"
 * text wherever a spec value is genuinely missing. Deliberately muted (grey,
 * small, dashed, centered) rather than red/warning-colored: an unresearched
 * spec is not an error, just a manufacturer that hasn't published a number.
 */
export function UnavailableValue({ label = "Not available" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md border border-dashed border-border-strong bg-surface-secondary/60 px-2 py-0.5 text-[10.5px] font-medium text-ink-muted"
      title="Not officially published by the manufacturer"
    >
      {label}
    </span>
  );
}
