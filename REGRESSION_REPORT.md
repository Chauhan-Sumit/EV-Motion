# Regression Report — EV Motion

**Date:** 2026-07-31
**Scope:** Full regression pass over every previously-fixed Critical (C1-C4) and High (H1-H6) issue, plus a build/lint/typecheck gate, before starting the Medium-priority phase. **No code was modified during this pass** — this is a verification-only report.

**Bottom line: one real, previously-undiscovered defect was found — a horizontal overflow band in the Navbar between ~1024px and ~1270px viewport width, present on every page.** Everything else — all 10 previously-fixed Critical/High issues, search, filters, brand pages, compare, navigation, CTAs, and console/hydration health — is confirmed still working with zero regressions. Details and severity assessment below.

> **✅ RESOLVED — 2026-07-31.** Fixed via a genuine three-tier responsive redesign of the Navbar's utility row (adaptive search-box width, icon-only collapse of the city/language/Login controls with preserved accessible names, deferred "Ad Space" slot). Verified clean at 1024/1100/1152/1200/1280px plus mobile and large-desktop regression checks. Full root-cause analysis and verification: [NAVBAR_RESPONSIVE_FIX_REPORT.md](NAVBAR_RESPONSIVE_FIX_REPORT.md).

---

## Build / Lint / TypeScript gate

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ Clean, zero errors |
| `npx eslint .` (whole project) | ⚠️ 1 error — see below |
| `npm run build` | ✅ Clean, 56/56 pages, run twice to confirm |

**The one ESLint error** is in `src/components/ui/carousel.tsx:98` (`react-hooks/set-state-in-effect`). This is **not a regression** — confirmed via `git diff` and `git log` that this file has never been touched by any commit in this session; it was present in the original scaffold and was already flagged as dead/unused code in `QA_REPORT.md` (L2 — 8 unused shadcn primitives, `carousel.tsx` among them, zero imports anywhere in the app). Previous lint passes in this session only checked the directories I had touched, which excluded `src/components/ui/`, so this is the first time it's been run against the whole project — it was always there, just not previously in scope. No action needed unless/until L2 is addressed.

---

## Passed tests (re-verified live, no regressions)

### Search (C1)
- ✅ Navbar search (desktop): "Nexon" → single correct suggestion, "Tata Motors Nexon EV — Electric Car"
- ✅ "SUV" → category match "SUV Electric Cars ›" (routes to the real `/cars?type=suv` filter)
- ✅ "Scooter" → category match "Electric Scooters ›"
- ✅ "MG" → all 3 MG vehicles, brand-match "View all 3 MG Motor vehicles"
- ✅ "BMW" → honest "No matches for 'BMW'", no fallback redirect
- ✅ Keyboard navigation: ArrowDown highlights first result, Enter navigates — tested with "Tiago" → landed on `/cars/tata-tiago-ev`
- ✅ Hero `SearchCard` search box: "Ne" (partial) → top result "Tata Motors Nexon EV", full result set otherwise unaffected
- ✅ No double-rendered vehicle names in search-dropdown thumbnails (confirms H2's fix also benefits the search UI)

### Vehicle Detail Pages (C2, C3, H1)
- ✅ Gallery: Next/Previous photo navigation works (verified slot advances correctly)
- ✅ "Get Best Price" dialog opens with correct vehicle-specific copy (Nexon EV)
- ✅ Reviews section: honest "No ratings yet" / "No reviews yet" empty state, no fabricated numbers, on both a popular vehicle (Nexon EV) and a differently-named one (Tiago EV) — independent per-vehicle state confirmed
- ✅ Zero horizontal overflow at 320/360/390/414/768px on `/cars/tata-nexon-ev`, `/two-wheelers/ola-s1-pro`, **and** `/two-wheelers/ampere-nexus` (an un-photographed vehicle, to stress-test the placeholder + gallery combination together)
- ✅ No console errors on any VDP tested

### Listing pages, filters, brands, compare (H3, H4)
- ✅ `/cars` Select dropdowns show "All Body Types" / "Price: Low to High" (not raw `all`/`price-asc`)
- ✅ Brand-checkbox filter (Mahindra) correctly narrows 18→3 cars and updates the URL to `?oems=mahindra`
- ✅ `/brands` renders 11 real OEM logo images + 1 correct "A" fallback (Ampere)
- ✅ `/brands/mg` brand-detail page shows the correct 3 MG vehicles
- ✅ `/compare?ids=tata-nexon-ev,mg-zs-ev` renders correct differentiated spec data, no console errors

### Navigation, CTAs, routing (C4, H5, H6)
- ✅ Header links: only 3 real `<a>` tags (`/`, `/cars`, `/two-wheelers`) — "Reviews & News" correctly non-interactive
- ✅ Footer links: only 5 real `<a>` tags (`/`, `/cars`, `/two-wheelers`, `/compare`, `/brands`), all fetch 200 OK; the other 9 items are honest "Soon" labels, not dead links
- ✅ `/some-totally-fake-route` → branded 404 page (not Next's bare default), zero console errors
- ✅ `CategoryRow`: 3 real filtered-listing links + 3 correctly-disabled "Soon" tiles
- ✅ `SubsidyCalculatorCard`: "Check Subsidy" still computes and displays a real result string from the selected state/vehicle type
- ✅ `ListingCard`: clicking the *image area* (not just the CTA text) navigates correctly to the vehicle's VDP
- ✅ "Download Brochure" and "Login" (desktop + mobile) confirmed genuinely `disabled`, not just styled to look inactive

### Responsive layouts
- ✅ 320, 360, 390, 414px — clean on VDP, homepage
- ✅ 768px — clean on VDP, homepage, `/cars`, `/brands`, `/compare`
- ⚠️ **1024–~1270px — FAILS. See "New regression" below.**
- ✅ 1440, 1920px — clean

### Console / hydration
- ✅ Zero console errors on every route tested, in a freshly-opened tab (a stale tab in this session accumulated unrelated historical Turbopack compile-error noise from mid-session cache corruption — confirmed non-reproducible in a fresh tab, not a real issue, see High-priority fix report for that incident)
- ✅ Zero React hydration-mismatch warnings observed on any page load (checked immediately after each fresh navigation, before any interaction)

---

## New regression / newly-discovered defect

### 🟠 Horizontal overflow on every page between ~1024px and ~1270px viewport width

**What:** At exactly the breakpoint where the Navbar switches from the mobile hamburger layout to the desktop utility row (`lg:flex`, Tailwind's `lg` = 1024px), the row — search box + dark-mode toggle + city dropdown + language dropdown + separator + "Login (Soon)" button — is wider than the space available in the Navbar at that width, and doesn't shrink or wrap. This produces real horizontal page scroll.

**Confirmed via direct measurement** (`document.documentElement.scrollWidth` vs. `clientWidth`):

| Viewport width | Result |
|---|---|
| 1024px | **1258px content vs 1009px available — 249px overflow** |
| 1100px | 1258px vs 1085px — overflow |
| 1150px | 1258px vs 1135px — overflow |
| 1250px | 1258px vs 1235px — overflow (23px) |
| 1260px | 1258px vs 1245px — overflow (13px) |
| 1280px | 1265px vs 1265px — **clean** |

Confirmed present identically on the homepage, `/cars`, and `/cars/tata-nexon-ev` (same 1258px content width every time) — this is the global `Navbar`, so it affects **every page in the app**, not one route.

**Why this wasn't caught earlier:** every previous verification pass in this project (Phase 1 audit, Critical fixes, High-priority fixes) tested mobile widths (320-414px) and then jumped straight to 1280px+ for "desktop." The 1024–1270px band — the narrow end of the `lg` breakpoint — was never actually tested until this regression pass, which is the first time 1024px specifically was checked end-to-end. It is very unlikely to be a regression introduced by the High-priority work: the Navbar's utility row (fixed-width 230px search box + several icon buttons) was already tight at this width. It's fair to say the **H5 fix likely made it slightly worse** — the Login button's label grew from "Login" to "Login (Soon)" (added ~50-60px) — but rough arithmetic on the measured 234px shortfall at 1024px suggests the row would still have overflowed even with the shorter original label. My assessment: **this is a pre-existing defect that more thorough testing surfaced, mildly exacerbated by H5**, not something the High-priority pass caused outright — but I want to flag that assessment as my best inference, not a certainty, since confirming it precisely would require reverting the label text, which I was told not to do this turn.

**Severity assessment:** This affects real hardware — 1024–1270px covers small laptop screens, iPad landscape (1024px), and browser windows that aren't maximized on a laptop display. It's not an edge case. I'd rate it 🟠 High, on par with H1 (the VDP overflow issue this session already fixed), since it's the same class of bug (unconstrained-width flex row) just in a different global component.

**Files likely responsible:** `src/components/layout/Navbar.tsx` — the `<div className="hidden items-center gap-1.5 lg:flex">` utility row (desktop search box, theme toggle, city/language dropdowns, Login button).

**Recommended fix (not implemented — no code was touched this pass):** Either (a) let the row's items shrink/wrap — e.g. reduce the search box's fixed `w-[230px]` to something responsive like `w-[160px] xl:w-[230px]`, and/or hide the least-essential items (language switcher, or the now-disabled Login button) below `xl` (1280px) instead of `lg` (1024px); or (b) push the breakpoint at which the desktop utility row appears from `lg` to `xl` so it only renders once there's actually room for it, falling back to the mobile search icon + hamburger menu in between. Option (a) is more in keeping with a responsive-by-default design; option (b) is a smaller, more surgical patch.

---

## Performance observations

- **Bundle size:** total JS chunks ≈ 1.8MB uncompressed across `.next/static/chunks`; largest single chunk 224KB. Nothing alarming for a Next.js app of this size, but not independently benchmarked against a target budget — flagging as an observation, not a finding.
- **Build time:** consistently 3.5–6.5s to compile + 4-6s TypeScript check + <1.5s to generate all 56 static pages, across the 3 builds run this session. Fast, no degradation from the Critical/High work.
- **Static vs. dynamic routes:** 56 total pages — homepage, `/brands`, `/_not-found`, all 36 VDPs, and 11 of 12 brand-detail pages are fully static (SSG); `/cars`, `/two-wheelers`, `/compare`, and `/brands/[oem]` render dynamically where they read `searchParams`. This split is unchanged by the Critical/High work — the new `LeadCaptureDialog`/`VehicleSearchBox` client components don't affect which routes are static, since they're client-side interactive islands within otherwise-static pages.
- **New client-side work:** the C1 search box now does a linear scan over all 36 vehicles on every keystroke (debounced 180ms). At this catalog size that's trivial; noting only because it wouldn't scale as-is to a catalog of thousands without an index — not a concern at current scope.
- No Lighthouse/Core Web Vitals run was performed (out of scope for this pass; flag if you want that added to a future phase).

---

## Recommended fixes (for your decision — nothing implemented this turn)

1. **Fix the 1024–1270px Navbar overflow before or alongside the Medium-priority phase.** This is the one item standing between "clean regression pass" and "fully clean." Given its visibility (every page, real hardware widths) I'd suggest treating it as a quick, scoped fix rather than bundling it in with the Medium backlog — but that's your call.
2. Everything else in `QA_REPORT.md` rated 🟡 Medium (M1-M6) or 🟢 Low (L2-L5) remains open and untouched, exactly as left after the High-priority phase.

---

## Conclusion

Of the 24 checklist areas you asked me to verify, 23 pass cleanly with no regressions. One new issue was found — not by anything breaking, but by testing a viewport range (1024-1270px) that hadn't been checked in any prior phase. I did not modify any code this turn, per your instruction. Recommend confirming how you'd like the Navbar overflow handled — as an immediate small fix, or folded into the upcoming Medium-priority pass — before I proceed with M1-M6.
