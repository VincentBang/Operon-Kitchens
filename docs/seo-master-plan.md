# Operon Kitchens SEO Master Plan

Last updated: 11 June 2026

## 1. Strategic SEO Thesis

Operon Kitchens should not compete as a generic kitchen renovation brochure site. The SEO moat is Sydney kitchen quote clarity: planning estimates, quote review, quote comparison, PC sums, provisional sums, exclusions, site measure preparation, apartment/strata risk and written scope confirmation before contract pricing.

The customer path supported by SEO is:

Free planning estimate -> prepare or enter quote/photos/plans details -> quote review -> request review or site measure -> confirmed written scope -> project delivery later.

Every SEO page must move the reader toward one of:

- Start kitchen estimate
- Review existing quote
- Request review
- Prepare for site measure
- Understand how the staged process works

## 2. Core Keyword Clusters

- Quote review and comparison: kitchen quote review Sydney, compare kitchen renovation quotes, kitchen quote comparison Sydney.
- Planning estimate and cost clarity: kitchen renovation estimate Sydney, kitchen renovation cost Sydney, kitchen renovation estimate vs quote.
- Quote completeness: what should be included in a kitchen quote, kitchen quote exclusions.
- Allowances and uncertainty: PC sums kitchen quote, provisional sums kitchen renovation.
- Site measure and written scope: kitchen site measure Sydney, kitchen renovation process Sydney.
- Apartment and strata risk: apartment kitchen renovation Sydney, apartment kitchen quote Sydney.
- Suburb intent: kitchen renovation Mosman, kitchen renovation Vaucluse, kitchen renovation Double Bay.
- Service-specific intent: kitchen benchtop replacement Sydney, kitchen cabinet replacement Sydney.

## 3. Top 20 Target Keywords

1. kitchen quote review Sydney
2. kitchen renovation quote Sydney
3. kitchen renovation estimate Sydney
4. kitchen renovation cost Sydney
5. compare kitchen renovation quotes
6. what should be included in a kitchen quote
7. PC sums kitchen quote
8. provisional sums kitchen renovation
9. kitchen quote exclusions
10. kitchen site measure Sydney
11. apartment kitchen renovation Sydney
12. kitchen renovation Mosman
13. kitchen renovation Vaucluse
14. kitchen renovation Double Bay
15. apartment kitchen quote Sydney
16. kitchen benchtop replacement Sydney
17. kitchen cabinet replacement Sydney
18. kitchen renovation process Sydney
19. kitchen quote comparison Sydney
20. kitchen renovation estimate vs quote

## 4. Page-By-Page Keyword Map

| Page | Primary keyword | Secondary keywords | Intent | CTA |
| --- | --- | --- | --- | --- |
| `/` | Sydney kitchen renovation estimates | kitchen quote review Sydney, kitchen quote clarity | Choose a path | Start estimate, review quote |
| `/quote` | kitchen renovation estimate Sydney | kitchen renovation estimate vs quote | Build planning estimate | Complete wizard |
| `/quote/review` | kitchen quote review Sydney | compare kitchen renovation quotes | Review existing quote | Start quote review |
| `/request-review` | kitchen request review Sydney | site measure request, quote review request | Lead intake | Submit request |
| `/site-measure` | kitchen site measure Sydney | written scope confirmation | Prepare next step | Request site measure |
| `/quote-review-service` | kitchen quote review service Sydney | PC sums, exclusions, allowances | Understand service | Start quote review |
| `/faqs` | kitchen renovation FAQ Sydney | PC sums, HBC, site measure | Objection handling | Quote/review CTAs |
| `/areas` | Sydney kitchen renovation service areas | suburb quote risk | Local discovery | Estimate/review/request |
| `/kitchen-renovation-cost-sydney` | kitchen renovation cost Sydney | planning range, cost drivers | Research cost | Start estimate |
| `/kitchen-pc-sums-and-provisional-sums` | PC sums kitchen quote | provisional sums kitchen renovation | Understand allowances | Review quote |
| `/kitchen-renovation-process` | kitchen renovation process Sydney | written scope, site measure | Learn staged process | Estimate/review |
| `/apartment-kitchen-renovation-sydney` | apartment kitchen renovation Sydney | strata kitchen quote risk | Apartment planning | Review quote |
| Future `/kitchen-quote-exclusions` | kitchen quote exclusions | what should be included in a kitchen quote | Quote completeness | Review quote |
| Future suburb pages | kitchen renovation suburb | apartment/access/finish risks | Local intent | Estimate/review |

## 5. 90-Day Roadmap

Days 1-30:

- Lock foundation pages: homepage, quote, quote review, request review, site measure, quote-review service, FAQ and areas.
- Add safety-tested titles, descriptions, H1s and internal links.
- Keep admin/file/payment features out of public SEO promises.
- Run controlled testing with UTMs and admin lead checks.

Days 31-60:

- Deepen money pages: cost Sydney, PC sums/provisional sums, quote exclusions, apartment kitchen, kitchen renovation process.
- Add one page only when it can be materially useful and conversion-linked.
- Update sitemap only after pages exist and are ready.

Days 61-90:

- Add suburb pages only where unique local risk content exists.
- Prioritise Mosman, Vaucluse, Double Bay, Neutral Bay and Manly.
- Review lead quality and conversion behaviour before broad content rollout.

## 6. Content Gap Strategy

Current gaps to fill after the foundation pass:

- Dedicated kitchen quote exclusions page.
- Stronger kitchen renovation estimate vs quote education.
- Deeper PC sums/provisional sums examples.
- Suburb pages with real local variables, not doorway content.
- Quote-review report examples that do not claim legal or compliance certainty.

Do not create thin pages just to target suburbs or keyword variants.

See `docs/seo-next-page-briefs.md` before building new SEO pages. Current recommendation: brief `/kitchen-quote-exclusions` for a future approved content slice, and avoid creating a duplicate `/pc-sums-provisional-sums` page while `/kitchen-pc-sums-and-provisional-sums` and `/pc-sums-vs-provisional-sums` already cover the topic.

## 7. Technical SEO Checklist

- Each key page has a unique title and meta description.
- Each key page has one clear H1.
- Canonicals use `NEXT_PUBLIC_SITE_URL` through `PublicLayout`.
- `public/sitemap.xml` excludes `/admin/leads` and includes only ready public pages.
- `public/robots.txt` blocks admin surfaces.
- FAQ schema is used only where visible FAQ content exists.
- LocalBusiness schema is used only with accurate brand, URL and area served.
- Static export must keep `/faqs`, `/quote`, `/quote/review`, `/request-review`, `/site-measure`, `/areas` and guide pages available.
- Build verification must keep stale hero/chatbot/footer copy out of the exported output.

## 8. Internal Linking Rules

- Homepage links to estimate, quote review, request review, site measure, how it works, areas and FAQ.
- Quote pages link back to quote review, request review and site measure.
- Quote review pages link to quote-review service and planning estimate.
- FAQ links to estimate, quote review, request review, site measure, how it works, process, cost, PC sums and areas.
- Area pages link to quote, quote review, request review, site measure and related guides.
- Never link `/admin/leads` from public navigation, footer, sitemap or SEO content.

## 9. Conversion Measurement Plan

Track readiness without adding production analytics until approved:

- `estimate_start_click`
- `quote_review_start_click`
- `wizard_step_view`
- `wizard_step_complete`
- `file_upload_added`
- `estimate_summary_view`
- `quote_review_submit`
- `area_cta_click`
- `chatbot_open`
- `chatbot_cta_click`
- `lead_score_generated` internally only

Use UTM fields on `/request-review` for controlled testing. Supabase remains the source of truth for leads.

## 10. Risk Controls

Public SEO copy must not imply:

- final fixed quote
- final price before site measure
- online purchase of a full custom kitchen
- legal approval
- compliance approval
- guaranteed savings
- approved quote
- certified quote
- fully compliant outcome
- instant ordering

Public surfaces must never expose supplier costs, internal rates, margin logic, lead score, admin priority, internal notes, service keys or hidden pricing logic.

Use safe language:

- planning estimate
- indicative range
- general guidance only
- not legal advice
- requires review
- may require confirmation
- subject to site measure
- written scope confirmation required

## 11. Implementation Sequence

1. Foundation/conversion pages.
2. Quote and review product pages.
3. FAQ and objection handling.
4. Money guide pages.
5. Area hub quality improvements.
6. Select suburb pages with unique local risk content.
7. Report-template and paid review packaging once operational workflow is proven.

## 12. Deployment Rule

No deploy until Vincent approves a release checkpoint. Prefer local tests, lint, build, static export checks and documentation. Any push to `main` may trigger Netlify and must be treated as a deployment action.
