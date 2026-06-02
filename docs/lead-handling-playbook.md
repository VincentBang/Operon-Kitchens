# Lead Handling Playbook

Last updated: 2 June 2026

Purpose: give Vincent a simple operating rhythm for handling Operon Kitchens request-review leads during controlled testing, before full CRM, payment, file download workflows or customer accounts exist.

## Current Status

- Supabase is the source of truth for leads.
- `/admin/leads` is the internal lead review surface.
- Email may remain disabled until domain/Resend setup is complete.
- File metadata may be visible when upload storage is working, but signed downloads and deletion are deferred.
- This is admin-lite, not a full CRM.

## Lead Status Meanings

Use the existing status values consistently:

| Status | Meaning | Typical action |
| --- | --- | --- |
| `new` | Lead arrived and has not been reviewed yet. | Review details and decide next action. |
| `review_needed` | Lead needs manual review before contacting or quoting. | Check message, scope, photos/quote availability and risk prompts. |
| `contacted` | Customer has been contacted. | Add note with date, method and key discussion point. |
| `site_measure_offered` | Site measure or scope review was offered. | Note proposed timing and what needs to be prepared. |
| `site_measure_booked` | Site measure has been booked. | Note date/time and any access requirements. |
| `quoted` | A written quote/scope pathway has been issued or is in progress. | Note what was issued and what remains subject to confirmation. |
| `won` | Customer agreed to proceed through the approved next stage. | Note agreed next stage only; avoid vague “job won” if contract is not complete. |
| `lost` | Customer did not proceed. | Note reason if known. |
| `spam` | Not a genuine lead. | Keep minimal notes and avoid follow-up. |

## Follow-Up Timing

Controlled testing rhythm:

- Check `/admin/leads` daily while email is disabled.
- Review new leads within one business day where practical.
- Prioritise quote-in-hand and ready-for-measure leads.
- If a lead mentions urgency, respond with careful expectation-setting rather than final-price promises.
- If a lead is incomplete, ask for the smallest useful next detail: photos, current quote, measurements, appliance list or strata/access notes.

Suggested follow-up order:

1. Confirm receipt.
2. Confirm the request type: estimate, quote review, site measure or scope discussion.
3. Identify missing information.
4. Clarify that outputs are planning/review guidance, not final quote approval.
5. Recommend the safest next step.

## Internal Notes Style

Use concise, factual notes. Internal notes may contain operational context, but should not include secrets or unnecessary sensitive commentary.

Good note examples:

- `2026-06-02: Lead has quote in hand. Needs clarification on appliances, splashback and electrical relocation. Recommend quote review before site measure.`
- `2026-06-02: Apartment project. Ask about strata approval, lift access and work-hour restrictions before booking measure.`
- `2026-06-02: Customer still planning. Send checklist for photos, measurements and appliance list.`

Avoid notes such as:

- private opinions about the customer
- supplier costs
- internal rates
- margin or markup
- lead score
- admin priority
- passwords, tokens or API keys
- unsupported promises

## When To Request Site Measure

Request or recommend site measure when:

- customer is ready to move beyond planning estimate
- layout and broad scope are known
- access, strata or apartment constraints need confirmation
- plumbing/electrical/gas relocation is possible
- older-property/asbestos concerns exist
- benchtop/splashback details need site confirmation
- quote comparison cannot be resolved from documents alone
- customer wants written scope or project-specific pricing

Use wording such as:

`The next safe step is a site measure and written scope confirmation before project-specific pricing.`

Do not say:

- `final quote is guaranteed`
- `this is approved`
- `this is compliant`
- `you can order instantly`

## What To Ask Customers

For estimate leads:

- What suburb is the property in?
- Is it a house, townhouse or apartment?
- Are you planning, comparing quotes or ready for measure?
- Do you have photos or a floor plan?
- Are services staying in the same location?
- Are appliances selected or still an allowance?

For quote-review leads:

- Can you share the quote total and pages/line items?
- Is demolition included?
- Are appliances included, excluded or PC sums?
- Is electrical/plumbing/gas relocation included?
- Is splashback included?
- Is rubbish removal included?
- Are deposit/HBC items clear?
- Is final site measure noted?

For apartment/strata leads:

- Is strata/body corporate approval required?
- Is lift booking required?
- Is parking/loading access available?
- Are work hours restricted?
- Is the building class or DBP/class 2 risk known?

## What Not To Promise

Never promise:

- final fixed quote from online information
- guaranteed savings
- guaranteed project acceptance
- legal advice
- compliance approval
- HBC approval
- strata approval
- certified material compliance
- licensed trade clearance without trade review
- full custom kitchen ordering before site measure and written scope

Use:

- planning estimate
- indicative range
- requires review
- may require confirmation
- subject to site measure
- written scope confirmation required
- general guidance only
- not legal advice
- not a final quote

## Recommended Next-Step Mapping

| Situation | Recommended next step |
| --- | --- |
| Early planning, no quote | Start or complete planning estimate. |
| Quote in hand, unclear line items | Quote review before comparing totals. |
| Good photos/plans, scope mostly known | Professional review or site measure. |
| Apartment/strata uncertainty | Review access, strata approval and regulated-work risk before quote reliance. |
| Service relocation likely | Licensed plumbing/electrical/gas review before written scope. |
| Older property or demolition | Asbestos/hazardous material review before commitment. |
| Customer ready to proceed | Site measure, selections confirmation and written scope. |

## Daily Admin Routine

1. Open `/admin/leads`.
2. Fetch leads with the admin token.
3. Review all `new` leads.
4. Update statuses.
5. Add concise internal notes.
6. Check source/UTM fields for test campaigns.
7. Confirm no internal fields are visible in public/customer-facing responses.
8. Record recurring confusion points for local UX fixes.

## Escalation Triggers

Escalate to professional review/site measure when:

- customer is comparing a real contractor quote
- project is over likely HBC threshold
- apartment/strata work is involved
- structural, waterproofing or service relocation is uncertain
- quote contains large PC/provisional sums
- quote exclusions are unclear
- customer is close to commitment

## Deferred Until Explicit Approval

Do not build or imply:

- full CRM
- payment
- customer login
- automated lead scoring display
- admin file download/deletion
- retention automation
- supplier API
- final quote generation
- legal/compliance certification

Keep controlled testing focused on clarity, safe follow-up and operational learning.
