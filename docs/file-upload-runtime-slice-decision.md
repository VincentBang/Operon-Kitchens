# File Upload Runtime Slice Decision

Last updated: 3 June 2026

Purpose: choose the next file-upload product slice after the local signed-download work.

Default rule: no deploy. This decision document does not approve deployment by itself.

## Current Local State

Implemented locally:

- signed download Netlify Function
- admin download button
- file metadata display polish
- retention metadata SQL documentation
- deletion design guardrail tests

Not implemented:

- delete function
- delete button
- retention automation
- customer file portal
- public file URLs

## Option A: Release Signed Downloads

Use this if Vincent wants admin downloads live for controlled testing.

Requires:

- one approved push/deploy
- private bucket confirmed
- file metadata present
- live verification using [signed download checklist](./signed-download-live-verification-checklist.md)

Pros:

- Vincent can access uploaded quote/photos/plans without Supabase console.
- Completes the most useful operational file workflow.

Cons:

- Costs one Netlify deploy.
- Requires controlled live verification.

## Option B: Continue Local-Only Delete Function Work

Use this if Netlify credits remain tight.

Scope:

- write delete function tests
- implement token-gated soft-delete function
- no delete UI yet
- no deploy

Pros:

- Builds confidence before next deploy.
- Keeps runtime work behind tests.

Cons:

- Cannot be used live until later deploy.
- Needs retention SQL applied before live deletion controls.

## Option C: Pause File Ops And Return To Service Packaging

Use this if file downloads are enough for now.

Scope:

- quote-review report template refinement
- paid-review service packaging docs
- site-measure offer wording

Pros:

- No production risk.
- Moves commercial offer forward.

Cons:

- Does not improve file operations further.

## Recommendation

Recommended next local-only step:

```text
Option B: implement token-gated soft-delete function tests and function, but no delete UI.
```

Recommended next deploy step, when Vincent approves:

```text
Option A: deploy signed downloads only and run one controlled live file-download test.
```

