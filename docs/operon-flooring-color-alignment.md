# Operon Flooring Colour Alignment

Last updated: 4 June 2026

Purpose: document the local Operon Kitchens visual alignment pass using the public Operon Flooring website as a sister-brand reference only.

Deployment status: not deployed.

## Reference Direction

The public Operon Flooring site was used as a visual benchmark for brand tone, not as source code or copied content.

Observed direction:

- deep navy as the foundation colour
- muted gold as the premium accent
- white page chrome with soft neutral support backgrounds
- charcoal body text rather than harsh black
- restrained borders and calm cards
- quote-first CTA hierarchy
- generous section rhythm
- clean header and footer structure
- trust/proof sections that feel calm and architectural

## Kitchens Token Mapping

Operon Kitchens now maps its existing CSS variables toward the same family:

- `--accent: #142f38`
  - Primary Operon Flooring ink colour used for quote CTAs, progress, high-emphasis UI and chatbot actions.
- `--accent-dark: #142f38`
  - Exact Operon Flooring footer colour for the rounded footer container, final CTA surfaces and dark panels.
- `--gold: #b9872e`
  - Muted gold branch accent for eyebrows, emphasis rules and premium highlights.
- `--gold-soft: #f3ead9`
  - Soft gold background for selected states, step markers and gentle highlights.
- `--paper: #ffffff`
  - Crisp white page and header background, matching the cleaner Operon Flooring-style site chrome.
- `--soft: #f7f4ef`
  - Operon Flooring-style warm neutral support background.
- `--navy-soft: #eef2f5`
  - Quiet navy-tinted surface for wizard/page backgrounds.
- `--line: #dbe6e2`
  - Operon Flooring-style soft green-grey border on white surfaces.
- `--ink: #142f38`
  - Operon Flooring footer/ink colour for headings and dark surfaces.
- `--muted: #5f6b73`
  - Operon Flooring muted text colour.

## Components Updated

The alignment is implemented through shared CSS rather than page-specific rewrites:

- white header and navigation
- primary and secondary CTA buttons
- mobile sticky CTA
- hero overlay and proof strip
- info cards and linked cards
- quote path blocks
- wizard progress and selected option states
- request-review and upload panels
- quote/review panels
- FAQ cards
- final CTA and rounded footer container with white spacing around it
- chatbot launcher and panel
- light admin surfaces where shared classes apply

## Pages Covered

The shared class updates affect these public surfaces:

- homepage
- `/quote`
- `/quote/review`
- `/quote-review-service`
- `/how-it-works`
- `/site-measure`
- `/design-specification-package`
- `/request-review`
- `/faqs`
- `/areas`
- `/privacy`
- `/terms`

## Safety Notes

This pass did not change:

- request-review backend behaviour
- attribution capture
- Supabase storage
- admin token protection
- privacy/terms acknowledgements
- honeypot field
- customer-safe quote projection
- file upload backend logic
- payment or checkout

No supplier costs, internal rates, margins, lead scores, admin priority, service keys or hidden pricing logic were introduced.

## Visual Review Notes

Local human review is still recommended before release:

- confirm the navy CTA hierarchy feels premium rather than heavy
- check white mobile header/logo spacing at 360px and 390px
- check request-review form focus/selected states
- check quote wizard progress and selected option cards
- check dark footer contrast with the revised logo panel

Deployment remains optional and should be batched into a later approved release checkpoint.
