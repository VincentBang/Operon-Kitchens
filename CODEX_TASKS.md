# Operon Kitchens Codex Tasks

Last updated: 31 May 2026

Use this file to keep future Codex prompts short. Read `AGENTS.md`, `PROJECT_BRIEF.md`, `DEPLOYMENT_RULES.md`, and this file before implementation tasks.

## Current Priority

Prepare Operon Kitchens for controlled real enquiry testing while avoiding unnecessary Netlify deploys.

## Immediate High-Confidence Tasks

1. Release the `/quote/review` static-export submit-path fix when Vincent approves.
   - Local code now submits quote-review requests to `/.netlify/functions/kitchen-request-review`.
   - The saved-estimate lookup no longer calls `/api/quotes` on the public static page.
   - File storage is still deferred; selected file names are local preview context only.
   - Deployment is required only when Vincent wants this fix live.

2. Keep request-review controlled-launch flow stable.
   - Preserve Supabase as source of truth.
   - Preserve safe success when storage works and email is disabled.
   - Preserve kitchen-scoped file upload storage and safe metadata display.
   - Do not fake success when neither storage nor email works.
   - Preserve attribution fields and legacy fallback.

3. Improve controlled-launch operations only when needed.
   - Small admin readability improvements are acceptable.
   - Do not build full CRM, auth system, payment, supplier API or uploads unless Vincent explicitly approves a new phase.

## Current Controlled-Launch Manual Checks

Use `docs/controlled-launch-checklist.md`.

Key manual checks:

- Submit a labelled `/request-review` lead.
- Confirm Supabase row exists.
- Confirm attribution fields are stored when UTM params are present.
- Confirm `/admin/leads` displays source route, landing page and UTM fields.
- Update status.
- Add internal note.
- Confirm no internal fields leak.
- Check Netlify Function logs.
- Check `/admin/leads` daily while email is disabled.

## Deferred Work

Do not implement these unless explicitly asked:

- Admin file download/review workflow, retention rules and deletion handling.
- Payment/checkout.
- Customer accounts/login expansion.
- Full CRM.
- Production analytics service integration.
- Supplier APIs.
- Full AI document review.
- 3D planner.
- Custom domain and branded email configuration.
- Production Supabase setting changes outside documented migrations.

## Testing Commands

Run before reporting completion:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

For route checks after build, inspect `out/*.html`. Do not deploy just to inspect static output.

## Reporting Format

Final reports should include:

1. Files created.
2. Files modified.
3. Files deleted, if any.
4. Tests run.
5. Lint/build result.
6. Deployment status: required, optional, or not needed.
7. Any Supabase/database changes proposed or created.
8. Shared infrastructure touched.
9. Confirmation no Operon Flooring or Oz Timber files were modified.
10. Anything deferred.
11. Any approval needed from Vincent.
