# Domain And Email Launch Checklist

Last updated: 2 June 2026

Purpose: prepare Operon Kitchens for a more professional launch without deploying now.

## Current Status

- No custom domain yet.
- Resend notification code exists.
- Branded sender/domain setup is deferred.
- Supabase remains the source of truth for leads.
- Email is notification only.

## Domain Checklist

1. Buy the Operon Kitchens domain.
2. Decide whether the domain sits directly on Netlify or behind another DNS provider.
3. Connect the domain to the Operon Kitchens Netlify site later.
4. Configure DNS records only when ready for an approved release.
5. Confirm HTTPS is active.
6. Confirm canonical/public URLs are correct.

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
