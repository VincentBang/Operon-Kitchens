# Request Review And Admin Handoff Audit

Last updated: 17 June 2026

Purpose: record the local review of `/request-review` and `/admin/leads` against the controlled-testing handoff.

Deployment status: not needed. This is a local audit only.

## `/request-review`

Checked against the handoff:

- customer path is clear: request review, site-measure discussion or project suitability guidance
- required fields are visible: name, email, message, privacy acknowledgement and terms acknowledgement
- optional fields are marked or safe to skip
- file attachments are described as optional and require authorisation to share
- upload limits are visible before submission
- success state keeps site measure and written scope confirmation as required before commitment
- UTM, landing page and referrer capture remain browser-side and simple
- no supplier costs, internal rates, margin logic, lead score, admin priority, internal notes or service keys are shown

Small friction noted:

- If selected files fail to attach after lead storage, the page warns the customer to mention it during follow-up. This is acceptable for controlled testing.
- Keep an eye on mobile attachment density during trusted tester sessions, especially if testers add multiple files.

No local copy fix was required in this pass.

## `/admin/leads`

Checked against the handoff:

- token is required before lead data loads
- page remains `noindex,nofollow`
- page is not intended for public navigation
- daily check, status update and notes style cards are visible near the top
- lead cards show enough context to triage without opening Supabase
- selected lead shows message, lead source, UTM details, file metadata and follow-up controls
- download links require token-gated function calls
- deleted files are not downloadable
- delete controls remain deferred
- internal notes are clearly labelled for internal use

Small friction noted:

- The lead detail panel is dense on mobile. It is acceptable for controlled testing because it is internal-only, but the visible delete-button slice should revisit spacing before release.
- The page intentionally does not store the admin token between visits. This is safer, but Vincent should expect to paste it each session.

No local UI fix was required in this pass.

## Test Coverage Confirmed

Existing tests cover:

- request-review privacy and terms acknowledgement
- attribution and UTM payload fields
- public response safety
- admin page noindex
- admin functions requiring token
- admin operations not exposing service keys or internal pricing/admin fields
- signed-download and soft-delete guardrails
- public copy guardrails

## Remaining Controlled-Testing Friction

- Email is still deferred until domain/Resend setup.
- File signed-download and soft-delete functions are local release candidates, not live unless Vincent approves a deployment.
- Delete button and retention automation remain deferred.

## Local Visual Spot Check

Checked locally on port `3001` on 17 June 2026 using a 390px mobile viewport and a 1280px desktop viewport.

Results:

- `/request-review` rendered with the expected H1.
- `/request-review` showed privacy acknowledgement, terms acknowledgement and optional attachment guidance.
- `/request-review` had no horizontal overflow at 390px.
- `/admin/leads` rendered with the expected H1.
- `/admin/leads` included `noindex,nofollow`.
- `/admin/leads` showed admin token, daily check and no-lead-data-without-token messaging.
- `/admin/leads` had no horizontal overflow at 390px.
