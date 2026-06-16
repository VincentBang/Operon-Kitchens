# Domain And Email Launch Checklist

Last updated: 17 June 2026

Purpose: prepare Operon Kitchens for a more professional launch without deploying now.

## Current Status

- No custom domain yet.
- Resend notification code exists.
- Branded sender/domain setup is deferred.
- Supabase remains the source of truth for leads.
- Email is notification only.
- `/admin/leads` remains the fallback operating console while email is off.

Deployment status: not needed. Domain, DNS, Resend and Netlify environment changes are manual release-checkpoint work.

## Domain Checklist

1. Buy the Operon Kitchens domain.
2. Decide whether the domain sits directly on Netlify or behind another DNS provider.
3. Connect the domain to the Operon Kitchens Netlify site later.
4. Configure DNS records only when ready for an approved release.
5. Confirm HTTPS is active.
6. Confirm canonical/public URLs are correct.
7. Confirm the live site still publishes from `out`.
8. Confirm Netlify Functions still work after the domain change:
   - `/.netlify/functions/kitchen-request-review`
   - `/.netlify/functions/kitchen-admin-leads`
   - `/.netlify/functions/kitchen-admin-lead-update`

Do not change Netlify settings from Codex unless Vincent explicitly takes over in the browser or approves manual changes.

## Resend Checklist

1. Add and verify the domain in Resend.
2. Configure SPF/DKIM/DMARC records as required by Resend.
3. Create a professional sender address.
4. Add Netlify env vars:
   - `OPERON_KITCHENS_RESEND_API_KEY`
   - `OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL`
   - `OPERON_KITCHENS_REQUEST_REVIEW_FROM_EMAIL`
5. Redeploy once only after Vincent approves.
6. Submit one labelled production test lead.
7. Confirm:
   - Supabase row created
   - `/admin/leads` shows lead
   - email arrives
   - browser response does not expose secrets or internal fields

## Netlify Environment Variables

Existing storage/admin variables should remain:

```text
OPERON_KITCHENS_SUPABASE_URL
OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY
OPERON_KITCHENS_ADMIN_TOKEN
OPERON_KITCHENS_UPLOAD_BUCKET
```

Email variables to add only after a verified sender/domain is ready:

```text
OPERON_KITCHENS_RESEND_API_KEY
OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL
OPERON_KITCHENS_REQUEST_REVIEW_FROM_EMAIL
```

After changing environment variables, Netlify needs one approved redeploy before Functions can see the new values.

## Safe Email Content Rules

Notification emails may include:

- request ID
- contact details
- project answers
- uploaded file names/categories if available
- source/UTM fields
- admin follow-up reminder

Notification emails must not include:

- supplier costs
- internal rates
- margin or markup
- lead score
- admin priority
- service role keys
- API keys
- final quote approval wording
- legal/compliance approval wording

## Launch Gate

Domain/email launch is not required for local hardening. Treat it as a future release checkpoint.

Before approving a deploy, run locally:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

After one approved deploy, run only one labelled production lead test and check:

- request-review response succeeds
- `delivery.stored` is true
- `delivery.notificationPrepared` is true when email variables are configured
- Supabase has the new row
- `/admin/leads` shows the lead
- email arrives at the configured recipient
- no secrets, service keys, internal pricing fields, supplier costs, margins, lead scores or admin priority appear in browser responses or logs

## If Email Is Still Deferred

Controlled testing can continue without Resend if:

- Supabase storage is working
- `/admin/leads` is checked daily
- lead status and internal notes are updated after follow-up
- testers are told the form is a request/review intake, not instant final pricing
