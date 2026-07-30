import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const FOOTER_COLUMNS = [
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
      { label: "EV Buyers Guide", href: "/guides" },
      { label: "Charging Stations", href: "/charging" },
      { label: "Subsidy Calculator", href: "/tools/subsidy-calculator" },
      { label: "EV News", href: "/news" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Advertise with Us", href: "/advertise", emphasis: true },
      { label: "Dealer Login", href: "/dealers/login" },
      { label: "Partnerships", href: "/partnerships" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Contact Sales", href: "/contact" },
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
            {col.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring mb-1.5 block text-[11px] transition-colors hover:text-primary ${
                  "emphasis" in link && link.emphasis ? "font-semibold text-primary" : "text-ink-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </Container>

      <div className="border-t border-border bg-surface-secondary">
        <Container className="flex flex-col items-center gap-1.5 py-2.5 text-[10px] text-ink-muted sm:flex-row sm:justify-between">
          <span>© 2026 EV Motion India Pvt. Ltd. All rights reserved.</span>
          <span className="flex items-center gap-3">
            <Link href="/legal/privacy" className="focus-ring hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="focus-ring hover:text-primary">
              Terms of Use
            </Link>
            <Link href="/legal/cookies" className="focus-ring hover:text-primary">
              Cookie Settings
            </Link>
          </span>
        </Container>
      </div>
    </footer>
  );
}
