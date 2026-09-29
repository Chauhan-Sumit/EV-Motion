# `prototypes/` — the HTML prototype archive

> **Prototypes are built in React/Next.js now, not as HTML files.** The live
> vehicle-page prototype is a real App Router route:
> **`/prototype/vehicle-detail`**, source under `src/app/prototype/`,
> `src/components/prototype/` and `src/lib/prototype/`. Read
> `src/app/prototype/vehicle-detail/page.tsx` first — its header explains how
> the route stays isolated.
>
> This folder holds the earlier **HTML** prototype, kept only as the record of
> what was approved. Do not add new HTML prototypes here.

Nothing in this directory is imported by the application. The only link
between it and `src/` is a route handler under `src/app/prototype/` that reads
a file from here and serves it back unchanged.

| Prototype | Status | Source | Preview at |
| --- | --- | --- | --- |
| Vehicle page redesign (HTML) | **Superseded** — design approved, rebuilt in React | `prototypes/vehicle-page/nexon-ev-redesign.html` | `/prototype/vehicle-page` |
| Vehicle detail page (React) | **Current** | `src/components/prototype/vehicle-detail/` | `/prototype/vehicle-detail` |

The HTML version is retained so the React build can be diffed against the
design that was actually signed off. Once that is no longer useful, delete
this folder and `src/app/prototype/vehicle-page/` together — nothing else
references either.

## Viewing

```
npm run dev
```

then open a preview URL from the table above. The HTML route reads its file
from disk on every request, so edits appear on a refresh with no rebuild.

## Guard rails (both prototypes)

- `noindex, nofollow` — the HTML route sends it as a header, the React route
  declares it in `metadata.robots`.
- Neither is listed in `sitemap.ts`, which enumerates routes explicitly.
- The HTML route returns `404` when `VERCEL_ENV === "production"`, so it
  cannot surface on the live site even if the branch is deployed by accident.
  Local `next build && next start` is unaffected.
