# SEO Implementation Tracker

Last updated: 11 June 2026

Status terms:

- Done: page has useful content, safe wording, metadata and conversion path.
- Improve: page exists but needs depth, metadata, links or clearer CTA.
- Planned: page does not exist yet or should not be built until approved.

## Foundation / Conversion Pages

| Page | Target keyword | Secondary keywords | Search intent | Page type | Existing/new | Required action | Conversion CTA | Metadata | Schema | Internal links | Safety wording | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Sydney kitchen renovation estimates | kitchen quote review Sydney, kitchen quote clarity | Choose estimate or review path | Homepage | Existing | Keep quote-clarity H1 and sample output | `/quote`, `/quote/review`, `/request-review` | Done | LocalBusiness/Organization present | Done | Done | Done |
| `/quote` | kitchen renovation estimate Sydney | kitchen renovation estimate vs quote | Complete planning estimate | Wizard | Existing | Keep hero, reward chips and safer step labels | Summary CTAs to `/request-review`, `/quote/review`, `/site-measure` | Done | Not needed | Done | Done | Done |
| `/quote/review` | kitchen quote review Sydney | compare kitchen renovation quotes | Review existing quote | Product intake | Existing | Keep grouped checklist and sample review preview | `/quote-review-service`, submit review | Done | Not needed | Improve | Done | Improve |
| `/request-review` | request kitchen quote review Sydney | kitchen scope review, site measure request | Submit lead | Lead intake | Existing | Keep attribution, notices, file limits and next-step explanation | Submit request | Done | Not needed | Improve | Done | Done |
| `/site-measure` | kitchen site measure Sydney | written scope confirmation | Prepare site-specific review | Service page | Existing | Add/keep links to estimate, review and request review | `/request-review` | Done | Not needed | Done | Done | Done |
| `/quote-review-service` | kitchen quote review service Sydney | PC sums, exclusions, allowance risk | Understand review offer | Service page | Existing | Keep product framing, future paid review caveat | `/quote/review`, `/request-review` | Done | Not needed | Done | Done | Done |
| `/faqs` | kitchen renovation FAQ Sydney | PC sums, HBC, site measure | Objection handling | FAQ | Existing | Keep grouped FAQ and schema parity | `/quote`, `/quote/review`, `/request-review`, `/site-measure` | Done | FAQ schema present | Done | Done | Done |
| `/areas` | Sydney kitchen renovation service areas | suburb quote risk, apartment quote risk | Local discovery | Area hub | Existing | Keep quote-confidence hub, avoid suburb dump | `/quote`, `/quote/review`, `/request-review`, `/site-measure` | Done | Not needed | Done | Done | Done |

## Money / Guide Pages

| Page | Target keyword | Secondary keywords | Search intent | Page type | Existing/new | Required action | Conversion CTA | Metadata | Schema | Internal links | Safety wording | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/kitchen-renovation-cost-sydney` | kitchen renovation cost Sydney | planning estimate, cost drivers | Understand likely range drivers | Guide | Existing | Periodically deepen examples and links | `/quote` | Done | Service/FAQ via template | Done | Done | Improve |
| `/pc-sums-provisional-sums` | PC sums kitchen quote | provisional sums kitchen renovation | Understand allowances | URL decision | New | Do not build now; avoid duplicate content while `/kitchen-pc-sums-and-provisional-sums` and `/pc-sums-vs-provisional-sums` cover intent | `/quote/review` | Deferred | Deferred | Existing links to canonical topic page | Done | Deferred |
| `/kitchen-quote-exclusions` | kitchen quote exclusions | what should be included in a kitchen quote | Identify missing scope | Planned guide | New | Brief prepared in `docs/seo-next-page-briefs.md`; build only after outline approval | `/quote/review` | Planned | Planned | Planned | Planned | Planned |
| `/apartment-kitchen-renovation-sydney` | apartment kitchen renovation Sydney | apartment kitchen quote Sydney | Apartment/strata planning | Service page | Existing | Keep strata/access detail deep | `/quote/review` | Done | Service/FAQ via template | Done | Done | Improve |
| `/kitchen-renovation-process` | kitchen renovation process Sydney | written scope, site measure | Learn staged process | Guide | Existing | Keep process aligned with `/how-it-works` | `/quote`, `/quote/review` | Done | Education template | Done | Done | Done |

## Future Suburb Pages

| Page | Target keyword | Secondary keywords | Search intent | Page type | Existing/new | Required action | Conversion CTA | Metadata | Schema | Internal links | Safety wording | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/kitchen-renovation-mosman` | kitchen renovation Mosman | Mosman kitchen quote review | Local intent | Future suburb landing | New | Build only with unique housing/access/finish variables | `/quote`, `/quote/review` | Planned | Planned | Planned | Planned | Planned |
| `/kitchen-renovation-vaucluse` | kitchen renovation Vaucluse | premium kitchen quote Vaucluse | Local intent | Future suburb landing | New | Build only with premium finish and access specificity | `/quote`, `/quote/review` | Planned | Planned | Planned | Planned | Planned |
| `/kitchen-renovation-double-bay` | kitchen renovation Double Bay | apartment kitchen quote Double Bay | Local intent | Future suburb landing | New | Build only with apartment/premium specifics | `/quote`, `/quote/review` | Planned | Planned | Planned | Planned | Planned |
| `/kitchen-renovation-neutral-bay` | kitchen renovation Neutral Bay | strata kitchen quote Neutral Bay | Local intent | Future suburb landing | New | Build only with strata/access specificity | `/quote`, `/quote/review` | Planned | Planned | Planned | Planned | Planned |
| `/kitchen-renovation-manly` | kitchen renovation Manly | apartment kitchen quote Manly | Local intent | Future suburb landing | New | Build only with local access/apartment context | `/quote`, `/quote/review` | Planned | Planned | Planned | Planned | Planned |

## Next Tracker Actions

- Keep foundation page tests green.
- Keep `/pc-sums-provisional-sums` deferred unless search data proves a redirect/alias is worth the routing complexity.
- Build `/kitchen-quote-exclusions` only after reviewing `docs/seo-next-page-briefs.md`.
- Delay suburb landing pages until controlled testing confirms operational readiness.
