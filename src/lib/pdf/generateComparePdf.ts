import { addBodyText, addFooter, addHeader, addSectionTable, addSectionTitle, createBrandedDocument, ensureSpace } from "./pdfKit";

export interface ComparePdfRowGroup {
  label: string;
  values: string[];
}

export interface ComparePdfSection {
  title: string;
  rows: ComparePdfRowGroup[];
}

export interface ComparePdfInput {
  vehicleNames: string[];
  cityLabel: string;
  dateLabel: string;
  winnerSummary: string;
  sections: ComparePdfSection[];
}

/**
 * Assembles the Compare-specific PDF report from already-computed plain
 * data — takes resolved vehicle names, a winner summary string, and
 * pre-rendered section rows as parameters rather than reaching into React
 * context or re-deriving anything. Keeps this a pure function, callable
 * from a plain button handler with no hook dependencies.
 */
export function generateComparePdf(input: ComparePdfInput): void {
  const doc = createBrandedDocument();

  let y = addHeader(doc, {
    title: input.vehicleNames.join(" vs "),
    subtitle: `Comparison Report — ${input.cityLabel}`,
    date: input.dateLabel,
  });

  y = addSectionTitle(doc, "Winner Summary", y);
  y = addBodyText(doc, input.winnerSummary, y);

  for (const section of input.sections) {
    if (section.rows.length === 0) continue;
    y = ensureSpace(doc, y, 30);
    y = addSectionTitle(doc, section.title, y);
    y = addSectionTable(doc, {
      columns: ["Specification", ...input.vehicleNames],
      rows: section.rows.map((r) => [r.label, ...r.values]),
      startY: y,
    });
  }

  addFooter(doc);
  doc.save(`ev-motion-compare-${Date.now()}.pdf`);
}
