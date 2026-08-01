/**
 * Generic winner-scoring engine for the Compare page. Deliberately separate
 * from spec-row *rendering* (see SpecTable.tsx / each section's SPEC_ROWS) —
 * not every displayed spec has a meaningful "better" direction (Colours,
 * free-text Warranty labels), so forcing every row through a scoring shape
 * would mean sprinkling `direction !== "none"` checks through the Winner
 * Ribbon, crown badges, and RatingsSection. Instead, WINNER_METRICS is a
 * scoreable *subset*, keyed by the same `key`s as a subset of each section's
 * SPEC_ROWS.
 */

export type WinnerDirection = "higher-better" | "lower-better" | "boolean-better";

export interface WinnerMetric<T> {
  key: string;
  label: string;
  section: string;
  direction: WinnerDirection;
  /** Returns null when this vehicle has no value for this metric — excluded from scoring, not treated as zero. */
  value: (item: T) => number | null;
  format?: (value: number) => string;
}

export type MetricState = "winner" | "tie" | "insufficient-data";

export interface MetricResult {
  key: string;
  state: MetricState;
  /** Index into the compared items array — set only when state === "winner". */
  winnerIndex: number | null;
  values: (number | null)[];
}

export interface WinnerEngineResult {
  metricResults: MetricResult[];
  /** Per-item tally of metrics won, same order/index as the compared items. */
  categoriesWon: number[];
}

function isBetter(direction: WinnerDirection, candidate: number, current: number): boolean {
  return direction === "lower-better" ? candidate < current : candidate > current;
}

export function computeWinners<T>(items: T[], metrics: WinnerMetric<T>[]): WinnerEngineResult {
  const categoriesWon = items.map(() => 0);

  const metricResults: MetricResult[] = metrics.map((metric) => {
    const values = items.map((item) => metric.value(item));
    const knownIndices = values
      .map((v, i) => (v !== null ? i : -1))
      .filter((i) => i !== -1);

    // A "winner" claim implies beating at least one real competitor — a
    // single known value among N unknowns has nothing to actually beat, so
    // it stays "insufficient-data" too, not an automatic win.
    if (knownIndices.length < 2) {
      return { key: metric.key, state: "insufficient-data", winnerIndex: null, values };
    }

    let bestIndex = knownIndices[0];
    let bestValue = values[bestIndex] as number;
    let tieCount = 1;
    for (const i of knownIndices.slice(1)) {
      const v = values[i] as number;
      if (isBetter(metric.direction, v, bestValue)) {
        bestIndex = i;
        bestValue = v;
        tieCount = 1;
      } else if (v === bestValue) {
        tieCount += 1;
      }
    }

    if (tieCount > 1) {
      return { key: metric.key, state: "tie", winnerIndex: null, values };
    }

    categoriesWon[bestIndex] += 1;
    return { key: metric.key, state: "winner", winnerIndex: bestIndex, values };
  });

  return { metricResults, categoriesWon };
}

/** Convenience: booleans/undefined -> 1/0/null for a WinnerMetric's `value()`. */
export function boolToMetricValue(value: boolean | undefined): number | null {
  return value === undefined ? null : value ? 1 : 0;
}
