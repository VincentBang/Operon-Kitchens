# Admin Token Handling

Last updated: 17 June 2026

Purpose: keep the `OPERON_KITCHENS_ADMIN_TOKEN` safe during controlled testing.

## Rules

- Do not paste the token into ChatGPT, Codex, email threads or public docs.
- Do not store the token in screenshots.
- Do not commit the token.
- Do not add it to `NEXT_PUBLIC_` variables.
- Use it only in the `/admin/leads` token field or server-side environment variables.
- Rotate it if it is accidentally shared.

## Where It Lives

The token should exist only as:

- a Netlify environment variable: `OPERON_KITCHENS_ADMIN_TOKEN`
- a private password manager entry
- temporary browser input on `/admin/leads`

## Browser Use

When using `/admin/leads`:

1. Open the admin page.
2. Paste the token into the password field.
3. Fetch leads.
4. Do not screenshot the token field unless it is hidden.
5. Clear the browser field after use on shared machines.

## What The Token Does

The token gates:

- lead list access
- lead status updates
- internal notes updates
- prepared file signed-download functions
- prepared file soft-delete functions

It is not customer authentication and not a full admin account system.

## Future Upgrade

Replace the token with proper authenticated admin access before broader launch, team access, customer accounts or full CRM work.
