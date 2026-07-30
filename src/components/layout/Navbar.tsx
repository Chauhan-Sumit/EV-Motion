"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  MapPin,
  Globe,
  User,
  Menu,
  X,
  ChevronDown,
  Check,
} from "lucide-react";

const NAV_LINKS = [
  { label: "NEW CARS", href: "/cars" },
  { label: "SCOOTERS & BIKES", href: "/two-wheelers" },
  { label: "REVIEWS & NEWS", href: "/reviews" },
];

const CITIES = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Pune", "Hyderabad"];
const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "HI", label: "हिंदी" },
  { code: "TA", label: "தமிழ்" },
];

const ICON_SIZE = 20;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [city, setCity] = useState("Delhi");
  const [lang, setLang] = useState("EN");

  const cityRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
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
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring flex h-16 items-center whitespace-nowrap border-b-[3px] px-3.5 text-[13px] font-semibold tracking-[0.3px] transition-colors ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-ink-secondary hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Ad slot placeholder — desktop only, sized to fit within the 64px navbar */}
          <div
            className="ml-2 flex h-9 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-secondary"
            aria-hidden="true"
          >
            <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">Ad Space</span>
          </div>
        </div>

        {/* Right — utility icons */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <div className="flex h-9 w-[230px] items-center overflow-hidden rounded-lg border-[1.5px] border-border-strong bg-white">
            <input
              type="text"
              placeholder="Search EVs..."
              className="h-full flex-1 border-none bg-transparent px-2.5 text-xs text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="button"
              aria-label="Search"
              className="flex h-full w-9 shrink-0 items-center justify-center border-l border-border bg-transparent"
            >
              <Search size={13} strokeWidth={2.5} className="text-ink-muted" />
            </button>
          </div>

          <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />

          <button
            type="button"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
          >
            {isDark ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
          </button>

          {/* Location */}
          <div className="relative" ref={cityRef}>
            <button
              type="button"
              onClick={() => setCityOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={cityOpen}
              className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
            >
              <MapPin size={ICON_SIZE} />
              {city}
            </button>
            {cityOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] w-44 rounded-lg border border-border bg-surface p-1.5 shadow-popover animate-fade-in"
              >
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setCity(c);
                      setCityOpen(false);
                    }}
                    className="focus-ring flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-ink-secondary hover:bg-surface-secondary hover:text-ink"
                  >
                    {c}
                    {c === city ? <Check size={14} className="text-primary" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Language */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={langOpen}
              className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
            >
              <Globe size={ICON_SIZE} />
              {lang}
              <ChevronDown size={14} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
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

          <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />

          <button
            type="button"
            className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-ink-secondary transition-colors hover:bg-surface-secondary hover:text-ink"
          >
            <User size={ICON_SIZE} />
            Login
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
          <div className="flex h-9 items-center overflow-hidden rounded-lg border-[1.5px] border-border-strong bg-white">
            <input
              type="text"
              placeholder="Search EVs..."
              className="h-full flex-1 bg-transparent px-2.5 text-xs text-ink outline-none placeholder:text-ink-muted"
            />
            <span className="flex h-full w-9 shrink-0 items-center justify-center border-l border-border">
              <Search size={13} strokeWidth={2.5} className="text-ink-muted" />
            </span>
          </div>
        </div>
      ) : null}

      {/* Mobile menu */}
      {mobileOpen ? (
        <div className="absolute inset-x-0 top-16 z-40 max-h-[calc(100vh-64px)] overflow-y-auto border-b border-border bg-surface px-4 py-4 shadow-popover lg:hidden">
          <nav aria-label="Primary mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="focus-ring border-b border-border py-3 text-[13px] font-bold tracking-wide text-ink"
              >
                {link.label}
              </Link>
            ))}
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
            <div className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-ink-secondary">
              <MapPin size={ICON_SIZE} />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent outline-none"
                aria-label="Select city"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
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
              className="focus-ring flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-ink-secondary hover:bg-surface-secondary"
            >
              <User size={ICON_SIZE} />
              Login
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
