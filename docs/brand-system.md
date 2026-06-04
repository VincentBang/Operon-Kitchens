# Operon Kitchens Brand Asset System

Last updated: 4 June 2026

Purpose: prepare the Operon Kitchens logo assets for local review while keeping the brand architecture aligned with the wider Operon system.

## Status

Local review assets only.

Deployment not needed until Vincent approves a release checkpoint. Do not push, deploy, create deploy previews or update Netlify settings from this document.

## Brand Architecture

Use this structure:

`[Operon circular emblem] + OPERON wordmark + vertical divider + KITCHENS descriptor`

Rules:

- `OPERON` is the master brand.
- `KITCHENS` is the branch descriptor.
- The same structure should later support `OPERON FLOORING` and `OPERON SYSTEM`.
- Do not create a disconnected kitchen-only logo.
- Do not add literal kitchen icons, cabinet icons, benchtop icons or appliance icons.
- Keep the identity premium, architectural and system-led.

## Local Assets

Assets live in `public/brand/`:

- `operon-kitchens-logo-horizontal.svg`
  - Full horizontal brand lockup for footer, documents, larger brand panels and review contexts.
  - Emblem plus bold OPERON wordmark plus a muted-gold divider and inline KITCHENS descriptor.
  - Emblem geometry uses heavier block-like central brackets, longer cross-lines and a stronger gold centre ring to align more closely with the selected reference mark.

- `operon-kitchens-logo-header.svg`
  - Dedicated compact navigation logo.
  - Uses the same inline divider structure, tuned tighter so the descriptor remains readable in desktop and mobile headers.

- `operon-kitchens-logo-stacked.svg`
  - Stacked variant for compact brand blocks, documents or square-ish placements.

- `operon-emblem.svg`
  - Emblem-only master icon.
  - Useful for future app icons, loading states or small brand marks.
  - Kept as clean SVG geometry; final designer exports may add exact optical refinements from the reference raster.

- `operon-kitchens-favicon.svg`
  - Favicon/app icon candidate.
  - Referenced locally from `PublicLayout`.

## Colours

Current local asset colours:

- Deep navy: `#08233F`
- Muted gold: `#B8842C`
- White logo surface: `#FFFFFF`

The gold has been made slightly darker and heavier than the initial concept for better header readability.

## Typography Direction

The SVGs currently use live text with system font fallback:

- `OPERON`: very bold master wordmark in deep navy.
- `KITCHENS`: inline muted-gold branch descriptor separated by a slim gold divider.

Designer/vector refinement still required:

- convert final wordmark text to outlines
- fine-tune emblem stroke joins at small sizes
- confirm the final emblem against the selected raster reference once a designer/vector export is available
- confirm final letter spacing for `OPERON FLOORING` and `OPERON SYSTEM`
- export final PNG fallbacks if needed for social/profile surfaces

## Usage

Header:

- Use `operon-kitchens-logo-header.svg`.
- Keep width restrained so the navigation remains readable while the branch descriptor remains legible.
- Do not replace it with plain text unless the SVG fails to load.

Footer:

- Use `operon-kitchens-logo-horizontal.svg` on a light panel when placed over the dark footer.

Favicon/app icon:

- Use `operon-kitchens-favicon.svg` as a local candidate.
- Final favicon can be replaced after designer review.

## Do Not

- Do not use literal kitchen icons.
- Do not use a disconnected branch logo.
- Do not stretch or distort the emblem.
- Do not recolour `OPERON` away from the master deep navy without a brand-system decision.
- Do not make `KITCHENS` brighter than the muted gold system accent.
- Do not expose internal pricing, supplier, lead score or admin information in any brand asset metadata.

## Local Review Checklist

Before release:

- Check header readability on desktop and mobile.
- Confirm the header uses the compact navigation SVG rather than the full lockup.
- Check footer contrast.
- Check favicon rendering in local build output.
- Check the logo does not crowd the mobile menu.
- Confirm the new inline `OPERON | KITCHENS` lockup remains readable before release.
- Confirm the same structure can scale to Flooring and System branch descriptors.
