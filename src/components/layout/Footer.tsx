import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

// Only routes that actually exist are real links. Everything else is named
// here honestly as "coming soon" (matching the site's existing pattern for
// unfinished sections, e.g. Latest News / Videos on the VDP) instead of
// linking to a page that doesn't exist yet.
const FOOTER_COLUMNS: Array<{
  title: string;
  links: Array<{ label: string; href?: string }>;
}> = [
  {
    title: "Vehicles",
    links: [
      { label: "New Electric Cars", href: "/cars" },
      { label: "Electric Scooters & Bikes", href: "/two-wheelers" },
      { label: "Compare EVs", href: "/compare" },
      { label: "Browse Brands", href: "/brands" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "EV Buyers Guide" },
      { label: "Charging Stations" },
      { label: "Subsidy Calculator" },
      { label: "EV News" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Advertise with Us" },
      { label: "Dealer Login" },
      { label: "Partnerships" },
      { label: "Media Kit" },
      { label: "Contact Sales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid grid-cols-2 gap-6 py-6 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:gap-[26px] sm:py-[26px]">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="focus-ring inline-flex items-center">
            <Image
              src="/brand/ev-motion-logo.png"
              alt="EV Motion"
              width={317}
              height={180}
              className="mb-2.5 h-16 w-auto object-contain sm:h-20"
            />
          </Link>
          <p className="max-w-[200px] text-[12px] leading-relaxed text-ink-muted">
            India&apos;s largest electric vehicle marketplace. Move Electric. Move Future.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="fcol">
            <h4 className="mb-2.5 text-xs font-bold text-ink">{col.title}</h4>
            {col.links.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="focus-ring mb-1.5 block text-[11px] text-ink-secondary transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  key={link.label}
                  className="mb-1.5 flex items-center gap-1.5 text-[11px] text-ink-muted"
                >
                  {link.label}
                  <span className="rounded-full bg-surface-secondary px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-ink-muted">
                    Soon
                  </span>
                </span>
              ),
            )}
          </nav>
        ))}
      </Container>

      <div className="border-t border-border bg-surface-secondary">
        <Container className="flex flex-col items-center gap-1.5 py-2.5 text-[10px] text-ink-muted sm:flex-row sm:justify-between">
          <span>© 2026 EV Motion India Pvt. Ltd. All rights reserved.</span>
          <span className="flex items-center gap-3">
            <span>Privacy Policy (Soon)</span>
            <span>Terms of Use (Soon)</span>
            <span>Cookie Settings (Soon)</span>
          </span>
        </Container>
      </div>
    </footer>
  );
}
