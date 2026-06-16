# Operations Risk Register

Last updated: 17 June 2026

Purpose: track controlled-testing risks before broader Operon Kitchens launch.

Deployment status: not needed. This is a local operations document.

## Risks

### Netlify Credit Risk

Risk: repeated deploys consume limited credits.

Mitigation:

- local tests/build first
- one approved release bundle at a time
- no clear-cache deploy unless production artifact issue is confirmed

### Supabase Storage Configuration Risk

Risk: bucket/table/env mismatch blocks file storage or downloads.

Mitigation:

- use manual SQL checklist
- keep bucket private
- verify one controlled file only after approved release
- do not expose raw Supabase errors

### Admin Token Handling Risk

Risk: token is shared or stored unsafely.

Mitigation:

- do not paste token into chat
- use token only in `/admin/leads` or secure environment variables
- rotate token if exposed

### Internal Field Exposure Risk

Risk: browser responses reveal internal pricing or admin fields.

Mitigation:

- customer-safe projection
- public copy tests
- admin function response tests
- no raw pricing/admin objects in public components

### File Retention Risk

Risk: customers expect immediate deletion or permanent retention when neither is formally defined.

Mitigation:

- use retention worksheet
- soft delete metadata only until policy is approved
- avoid fixed retention periods until confirmed

### Paid Service Expectation Risk

Risk: paid quote review is perceived as legal approval, compliance certification or guaranteed savings.

Mitigation:

- manual trials first
- customer-safe report template
- clear inclusions/exclusions
- no payment until terms, delivery and refund principles are approved

### SEO Expansion Risk

Risk: too many pages before operations are stable.

Mitigation:

- deepen existing pages first
- defer doorway-prone suburb pages
- keep quote-review conversion as the SEO goal

## Weekly Review

Each week, mark:

- new risks
- resolved risks
- release blockers
- docs needing update
- next local-only mitigation

