# Domain, Email And Resend Verification Runbook

Last updated: 17 June 2026

Purpose: prepare future branded email verification without changing Netlify, DNS, Resend or production settings from Codex.

Deployment status: not needed. Manual external setup remains deferred until Vincent approves.

## Source Of Truth

Supabase remains the source of truth for leads.

Email is notification only. A lead is not considered durable because an email was sent; it is durable when it is stored in Supabase.

## Required Future Env Vars

```text
OPERON_KITCHENS_RESEND_API_KEY
OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL
OPERON_KITCHENS_REQUEST_REVIEW_FROM_EMAIL
```

Existing required storage/admin vars:

```text
OPERON_KITCHENS_SUPABASE_URL
OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY
OPERON_KITCHENS_ADMIN_TOKEN
```

## Manual Setup Sequence

1. Buy or connect the Operon Kitchens domain.
2. Configure DNS in Netlify or the chosen DNS host.
3. Verify the sending domain in Resend.
4. Create a sender address that uses the verified domain.
5. Add Resend env vars in Netlify.
6. Redeploy once after env vars are present.
7. Submit one controlled `/request-review` test lead.
8. Confirm Supabase row exists.
9. Confirm `/admin/leads` shows the lead.
10. Confirm notification email arrives.

## Expected Notification Content

Email may include:

- request ID
- name
- email
- phone if supplied
- suburb
- property type
- project stage
- current quote yes/no
- photos/plans yes/no
- budget range if supplied
- preferred next step
- message
- marketing opt-in
- created time
- instruction to check `/admin/leads`

Email must not include:

- service role key
- API keys
- supplier costs
- internal rates
- margin logic
- lead score
- admin priority
- hidden pricing logic

## Failure Handling

If storage succeeds and email fails:

- keep returning safe success for the stored lead
- report notification as skipped or not prepared
- check Resend env vars and verified sender later

If storage fails and email succeeds:

- this should not be treated as the ideal path
- investigate Supabase immediately
- Supabase must remain the source of truth

If both storage and email fail:

- function should return controlled unavailable response
- do not fake success

