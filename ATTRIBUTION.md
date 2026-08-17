# Third-party asset attribution

Assets shipped in this repository that carry attribution obligations, and the
provenance of the generated ones that don't.

## Homepage hero vehicle — `public/images/hero/hero-ev-car.webp`

| | |
|---|---|
| Source | Owner-supplied AI-generated render, kept at `3D_models/ChatGPT Image Aug 17, 2026, 11_27_12 PM.png` |
| Attribution required | **No.** Generated for this project; not a third-party work. |
| Processing | Cropped to its alpha bounding box and re-encoded to WebP. The source already shipped a clean alpha channel, so no keying or background removal was applied. |

Deliberately **not** a real-world production vehicle. A real branded press render
(AITO-badged) was considered for this slot and explicitly rejected — it is
third-party product photography of an identifiable commercial model. Nothing in
the hero identifies a manufacturer, and the image is tied to no vehicle record.

See `HANDOFF.md` → *Homepage Hero* for how this sits against the project's
AI-imagery rule (short version: that rule governs vehicle-card placeholders and
`photoUrl`, not decorative brand art).

## Homepage hero environment — `public/images/hero/hero-env.webp`

Generated procedurally by `scripts/generate-hero-environment.mjs`. No third-party
rights involved. Regenerate with the script rather than editing the WebP.

## 3D models

### `public/models/hero-ev.glb` — currently **unused**

| | |
|---|---|
| Source asset | Kenney **Car Kit (3.1)** — `suv-luxury.glb` |
| Author | Kenney — https://kenney.nl |
| Licence | **CC0 1.0 (public domain dedication)** |
| Attribution required | **No.** CC0 waives all rights. |
| Processing | Removed a dangling external texture reference (`Textures/colormap.png`, which the pack does not ship); meshopt-compressed and quantized. Geometry unmodified. 171.8 KB → 14.0 KB. |

Retained only so the Three.js hero route can be revisited; nothing imports it
today. Its unmodified source is no longer in the repo — re-download from Kenney
if needed. Safe to delete along with the unused `three` / `@react-three/fiber` /
`@react-three/drei` dependencies.

> **Resolved:** an earlier hero iteration used a Sketchfab model ("Electric Car"
> by magicmouse) under **CC BY 4.0**, which *would* have required visible
> attribution. That asset is no longer used anywhere in this repository.
