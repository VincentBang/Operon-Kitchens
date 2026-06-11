# SEO Next Page Briefs

Last updated: 11 June 2026

Purpose: define the next SEO execution slice before building new public pages. This prevents thin content, duplicate URL sprawl and unsafe quote/compliance claims.

Deployment status: not deployed. These briefs are local planning only.

## Priority 1: Kitchen Quote Exclusions

Recommended URL:

`/kitchen-quote-exclusions`

Target keyword:

`kitchen quote exclusions`

Secondary keywords:

- what should be included in a kitchen quote
- kitchen renovation quote exclusions
- compare kitchen renovation quotes
- kitchen quote review Sydney

Search intent:

Homeowners have a kitchen quote and want to know what might be missing before comparing totals or accepting the quote.

Page goal:

Explain common kitchen quote exclusions and convert the reader toward quote review or request review.

Recommended H1:

`Kitchen quote exclusions: what to check before comparing totals`

Required sections:

1. Why exclusions matter before comparing kitchen quote totals
2. Common exclusions in kitchen renovation quotes
3. Demolition, rubbish removal and site protection
4. Plumbing, electrical, gas and licensed trade assumptions
5. Benchtop, splashback, cut-outs, joins and edge details
6. Appliances, PC sums and provisional sums
7. Apartment, strata, access and work-hour exclusions
8. Painting, patching, flooring and make-good boundaries
9. Contract, deposit and HBC review prompts
10. Questions to ask before accepting a kitchen quote
11. Next step: review the quote or request professional review

Customer-safe CTAs:

- Review existing quote -> `/quote/review`
- Request review -> `/request-review`
- Start planning estimate -> `/quote`

Internal links to include:

- `/quote/review`
- `/request-review`
- `/quote-review-service`
- `/kitchen-pc-sums-and-provisional-sums`
- `/questions-before-accepting-kitchen-quote`
- `/site-measure`
- `/faqs`

Safety wording:

- Use “general guidance only” and “may require confirmation.”
- State that site measure and written scope confirmation are required before contract pricing.
- State that licensed trade, strata, supplier and contract prompts may require project-specific review.
- Do not claim legal advice, compliance approval, guaranteed savings or final pricing.

Schema:

Do not add new schema initially unless the page includes visible FAQ content and matches the existing FAQ schema pattern.

Content risk:

Keep the page practical and distinct from PC sums/provisional sums. It should focus on omitted or unclear scope boundaries, not allowance definitions.

Implementation status:

Ready for future build after Vincent approves the next SEO content slice. Do not deploy until a release checkpoint is approved.

## Priority 2: PC Sums And Provisional Sums URL Decision

Current related URLs:

- `/kitchen-pc-sums-and-provisional-sums`
- `/pc-sums-vs-provisional-sums`

Potential exact-match URL:

`/pc-sums-provisional-sums`

Recommendation:

Do not create a third public page with similar content yet. The existing pages already cover the topic and reduce duplicate-content risk.

Preferred next action:

Strengthen internal links and metadata around the existing `/kitchen-pc-sums-and-provisional-sums` page instead of adding a new exact-match URL.

Optional future action:

If search data later shows strong demand for the exact URL, create a redirect or lightweight alias only after deciding the canonical target. The canonical target should likely remain `/kitchen-pc-sums-and-provisional-sums` because it is more descriptive and already linked from homepage, FAQ, footer and glossary.

Do not:

- Create duplicate PC sums articles with nearly identical headings.
- Split PC sums and provisional sums across too many thin pages.
- Add redirects without testing static export and Netlify routing rules.

## Priority 3: Existing Money Page Deepening

Before building new suburb landing pages, deepen existing pages:

- `/kitchen-renovation-cost-sydney`
- `/kitchen-quote-sydney`
- `/kitchen-quote-review`
- `/apartment-kitchen-renovation-sydney`
- `/kitchen-renovation-process`

For each page, check:

- Unique H1 and title
- Useful intro tied to quote clarity
- Who it is for
- Cost/scope drivers
- Quote risks
- What improves confidence
- Exclusions to check
- Related guides
- Related areas
- Final CTA to estimate/review/request/site measure

## Priority 4: Future Suburb Pages

Do not build future suburb URLs until the content can be unique. Use the `/areas` hub and `/areas/[slug]` pages first.

Potential future pages:

- `/kitchen-renovation-mosman`
- `/kitchen-renovation-vaucluse`
- `/kitchen-renovation-double-bay`
- `/kitchen-renovation-neutral-bay`
- `/kitchen-renovation-manly`

Each future suburb page must include local variables:

- housing type
- apartment/strata relevance
- older-home risk
- premium finish expectations
- access/parking constraints
- nearby areas
- quote risks
- CTAs to estimate, quote review and request review

Do not create doorway pages.

## Next Implementation Slice

Recommended next local-only code slice:

1. Deepen `/kitchen-renovation-cost-sydney` and `/kitchen-quote-review` using existing service/education data patterns.
2. Add contextual internal links to `/kitchen-pc-sums-and-provisional-sums` and `/quote-review-service` where natural.
3. Keep `/kitchen-quote-exclusions` as a planned brief until approved.
4. Run local tests, lint, build and `git diff --check`.
