# Operon Kitchens Project Brief

Last updated: 2 June 2026

## What Operon Kitchens Is

Operon Kitchens is a Sydney kitchen renovation quote clarity, quote review and staged-ordering platform under the broader Operon Group.

It helps homeowners:

- check likely kitchen renovation budget range
- understand confidence and project review risk
- prepare quote/photos/plans
- review inclusions, exclusions, PC sums and provisional sums
- identify scope, access, strata, trade and compliance review prompts
- move toward professional review, site measure, written scope and project delivery

Operon Kitchens is not a generic renovation website and is not an AI gimmick. Technology is a backend advantage, not the public headline.

## Brand Separation

Operon Kitchens remains separate from Operon Flooring and Oz Timber Floor.

Operon Flooring may be used as a quality benchmark for structure, navigation and trust patterns, but files, production logic, Supabase resources and deployment settings must not be shared or edited from this repo.

## Customer Journey

The safe staged path is:

1. Free planning estimate
2. Upload or prepare quote/photos/plans
3. Quote review before commitment
4. Site measure
5. Written scope confirmation
6. Project delivery later

Do not imply that customers can order a full custom kitchen online before site measure and written scope confirmation.

## Future Operon OS Direction

Operon Kitchens can later become a kitchen vertical proof layer for Operon OS, a trade-focused operating system. Future shared infrastructure should be kitchen-namespaced first, additive, non-destructive and safe to generalise later.

## Current MVP Status

Current controlled-launch state:

- static export deploys from `out`
- request-review form posts to Netlify Function `kitchen-request-review`
- Supabase table `public.kitchen_request_reviews` stores durable leads
- admin-lite `/admin/leads` is token gated
- attribution/UTM tracking is implemented
- Resend notification code exists, but branded domain/email setup is deferred
- file upload storage is scaffolded and under controlled verification
- no payment
- no customer login
- no full CRM
- no supplier API
- no broad public launch

## Customer-Safe Data

Public estimate and review outputs may show:

- planning range
- confidence score and label
- confidence reasons
- review risk score and label
- risk reasons
- included scope
- assumptions
- exclusions
- manual review flags
- compliance prompts
- recommended next step

Public surfaces must not expose supplier costs, internal rates, margins, lead scores, admin priority, internal notes, service keys or hidden pricing logic.

## Current Operating Mode

Current phase: controlled testing and local hardening while Netlify deploys are paused.

Default work should be local-first: improve docs, tests, specs, playbooks and safe UI/code locally. Do not deploy or push unless Vincent explicitly approves.
