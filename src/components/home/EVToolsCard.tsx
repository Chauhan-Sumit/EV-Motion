import Link from "next/link";
import { Calculator, Gauge, PlugZap, Scale } from "lucide-react";

// Every link below points at a real, working feature already in the app —
// no dead "coming soon" tool tiles.
const TOOLS = [
  { icon: Calculator, name: "EMI Calculator", desc: "Estimate your monthly EMI", href: "/compare" },
  { icon: Gauge, name: "Running Cost Calculator", desc: "See cost per km", href: "/compare" },
  { icon: PlugZap, name: "EV Subsidy Calculator", desc: "Check FAME-II & state subsidy", href: "#subsidy-calculator" },
  { icon: Scale, name: "Compare EVs", desc: "Compare up to 3 vehicles", href: "/compare" },
];

export function EVToolsCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">EV Tools</h3>
      </div>
      <ul className="p-3.5">
        {TOOLS.map((tool) => (
          <li key={tool.name}>
            <Link href={tool.href} className="focus-ring group flex items-center gap-2.5 rounded-md py-1.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
                <tool.icon size={15} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-semibold text-ink group-hover:text-primary">
                  {tool.name}
                </span>
                <span className="block truncate text-[10px] text-ink-muted">{tool.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
