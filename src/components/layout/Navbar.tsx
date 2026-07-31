"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sun,
  MapPin,
  Globe,
  User,
  Menu,
  X,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";
import { VehicleSearchBox } from "@/components/search/VehicleSearchBox";
import { LocationSelector } from "@/components/layout/LocationSelector";
import { useLocation } from "@/context/LocationContext";

const NAV_LINKS: Array<{ label: string; href?: string }> = [
  { label: "NEW CARS", href: "/cars" },
  { label: "SCOOTERS & BIKES", href: "/two-wheelers" },
  { label: "REVIEWS & NEWS" },
];

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "HI", label: "हिंदी" },
  { code: "TA", label: "தமிழ்" },
];

const ICON_SIZE = 20;

export function Navbar() {
  const pathname = usePathname();
  const { city } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  return (
    <header className="sticky top-0 z-50">
      <nav className="flex h-16 items-center justify-between border-b border-border bg-surface px-3.5 shadow-card sm:px-9">
        {/* Logo */}
        <Link href="/" className="focus-ring flex shrink-0 items-center" aria-label="EV Motion — Home">
          <Image
            src="/brand/ev-motion-logo.png"
            alt="EV Motion"
            width={317}
            height={180}
            priority
            className="h-[42px] w-auto object-contain sm:h-12"
          />
        </Link>

        {/* Nav links */}
        <div className="hidden h-16 items-center lg:flex">
          {NAV_LINKS.map((link) => {
            if (!link.href) {
              return (
                <span
                  key={link.label}
                  className="flex h-16 items-center gap-1.5 whitespace-nowrap px-2.5 text-[13px] font-semibold tracking-[0.3px] text-ink-muted xl:px-3.5"
                >
                  {link.label}
                  <span className="rounded-full bg-surface-secondary px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-ink-muted">
                    Soon
                  </span>
                </span>
              );
            }
            const active = pathname === link.href || pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring flex h-16 items-center whitespace-nowrap border-b-[3px] px-2.5 text-[13px] font-semibold tracking-[0.3px] transition-colors xl:px-3.5 ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-ink-secondary hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Ad slot placeholder — deferred until there's real room to spare.
              It's decorative filler with no functional cost when absent,
              unlike every other item in this row, so it's the one thing
              that's fully hidden rather than collapsed at the 1024-1279px
              band. Deferred past xl (not just at xl) because a long,
              real-world city name (e.g. "Thiruvananthapuram") plus this slot
              together overflow right at 1280px — verified via
              scrollWidth/clientWidth, same root-cause pattern as the
              original Navbar overflow bug. */}
          <div
            className="ml-2 hidden h-9 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-secondary min-[1400px]:flex"
            aria-hidden="true"
          >
            <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">Ad Space</span>
          </div>
        </div>

        {/* Right — utility icons */}
        <div className="hidden items-center gap-1 lg:flex xl:gap-1.5">
          <VehicleSearchBox ariaLabel="Search EVs by name or brand" className="w-[170px] xl:w-[230px]" />

          <div className="mx-0.5 h-6 w-px bg-border xl:mx-1" aria-hidden="true" />

          <button
            type="button"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
          >
            {isDark ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
          </button>

          {/* Location — icon-only in the 1024-1279px band (no room for the label),
              full icon+label pill from xl up. Fixed max-width + truncate on the
              label so switching to a longer city name never reflows this row. */}
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={locationOpen}
            aria-label={`Select city (current: ${city.name})`}
            title={city.name}
            className="focus-ring flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink xl:px-3"
          >
            <MapPin size={ICON_SIZE} className="shrink-0" />
            <span className="hidden max-w-[88px] truncate xl:inline">{city.name}</span>
          </button>

          {/* Language — icon-only in the 1024-1279px band, full pill from xl up */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-label={`Select language (current: ${lang})`}
              className="focus-ring flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink xl:px-3"
            >
              <Globe size={ICON_SIZE} />
              <span className="hidden xl:inline">{lang}</span>
              <ChevronDown size={14} className={`hidden transition-transform xl:block ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] w-40 rounded-lg border border-border bg-surface p-1.5 shadow-popover animate-fade-in"
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    className="focus-ring flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-ink-secondary hover:bg-surface-secondary hover:text-ink"
                  >
                    {l.label}
                    {l.code === lang ? <Check size={14} className="text-primary" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mx-0.5 h-6 w-px bg-border xl:mx-1" aria-hidden="true" />

          <button
            type="button"
            disabled
            title="Accounts are coming soon"
            aria-label="Login — accounts coming soon"
            className="flex cursor-not-allowed items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold text-ink-muted opacity-60 xl:px-3"
          >
            <User size={ICON_SIZE} />
            <span className="hidden xl:inline">Login (Soon)</span>
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            aria-label="Search EV Motion"
            onClick={() => setMobileSearchOpen((o) => !o)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary hover:bg-surface-secondary hover:text-ink"
          >
            <Search size={ICON_SIZE} />
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-ink"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile inline search */}
      {mobileSearchOpen ? (
        <div className="border-t border-border bg-surface px-4 py-3 lg:hidden">
          <VehicleSearchBox ariaLabel="Search EVs by name or brand" autoFocus />
        </div>
      ) : null}

      {/* Mobile menu */}
      {mobileOpen ? (
        <div className="absolute inset-x-0 top-16 z-40 max-h-[calc(100vh-64px)] overflow-y-auto border-b border-border bg-surface px-4 py-4 shadow-popover lg:hidden">
          <nav aria-label="Primary mobile" className="flex flex-col">
            {NAV_LINKS.map((link) =>
              link.href ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring border-b border-border py-3 text-[13px] font-bold tracking-wide text-ink"
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  key={link.label}
                  className="flex items-center gap-1.5 border-b border-border py-3 text-[13px] font-bold tracking-wide text-ink-muted"
                >
                  {link.label}
                  <span className="rounded-full bg-surface-secondary px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-ink-muted">
                    Soon
                  </span>
                </span>
              ),
            )}
          </nav>

          <div className="mt-4 flex flex-col gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="focus-ring flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-ink-secondary hover:bg-surface-secondary"
            >
              {isDark ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
              {isDark ? "Light theme" : "Dark theme"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setLocationOpen(true);
              }}
              className="focus-ring flex items-center gap-3 rounded-lg px-2 py-3 text-left text-sm font-medium text-ink-secondary hover:bg-surface-secondary"
            >
              <MapPin size={ICON_SIZE} className="shrink-0" />
              <span className="truncate">{city.name}</span>
            </button>
            <div className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-ink-secondary">
              <Globe size={ICON_SIZE} />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full bg-transparent outline-none"
                aria-label="Select language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled
              title="Accounts are coming soon"
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-ink-muted opacity-60"
            >
              <User size={ICON_SIZE} />
              Login (Soon)
            </button>
          </div>
        </div>
      ) : null}

      <LocationSelector open={locationOpen} onOpenChange={setLocationOpen} />
    </header>
  );
}
