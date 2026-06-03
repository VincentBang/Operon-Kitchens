# Admin File Delete UI Design

Last updated: 3 June 2026

Purpose: design the future `/admin/leads` delete-file control without adding the visible runtime button yet.

Default rule: no deploy. This document does not approve adding the delete button, pushing to `main` or changing production Supabase.

## Current Local State

Prepared locally:

- signed-download URL normalisation fix
- admin signed download function
- `/admin/leads` download button
- file retention status display
- token-gated soft-delete function
- soft-delete tests

Still deferred:

- visible delete button
- physical Supabase Storage object deletion
- retention automation
- customer file portal
- full CRM or customer auth

## UI Goal

Give Vincent a cautious internal control to mark an uploaded file as deleted when the file is a duplicate, irrelevant, unsafe, uploaded by mistake or requested for deletion by the customer.

The delete action should feel deliberately slower than download. It should prevent accidental deletion and avoid implying a legal/compliance deletion guarantee.

## Placement

Future location:

```text
/admin/leads -> selected lead -> Uploaded files -> file row actions
```

Button label:

```text
Delete file
```

Button style:

- secondary/destructive outline
- visually quieter than `Download`
- disabled for files with `retention_status = 'deleted'`
- not shown on public pages
- not linked from header/footer

## Confirmation Flow

The future button should open an inline confirmation panel or small modal.

Required fields:

- file name shown as read-only context
- warning text
- delete reason select
- confirm checkbox
- final confirm button

Delete reason options:

- `customer_request`
- `duplicate`
- `irrelevant`
- `unsafe`
- `retention_cleanup`
- `other`

Suggested warning:

```text
This marks the uploaded file as deleted in admin metadata. It may affect quote-review context. Use this only for duplicate, irrelevant, unsafe or customer-requested deletion cases.
```

Suggested checkbox:

```text
I understand this file will no longer be downloadable from admin once deleted.
```

## Future Request

Endpoint:

```text
POST /.netlify/functions/kitchen-admin-file-delete
```

Headers:

```text
x-operon-admin-token: <admin token>
Content-Type: application/json
```

Request body:

```json
{
  "fileId": "uuid",
  "deleteReason": "duplicate"
}
```

Do not send:

- bucket
- object path
- email
- lead score
- admin priority
- supplier cost
- margin
- service keys
- raw internal notes

## Future Success State

After success:

- update the selected lead file row locally
- set `retention_status` to `deleted`
- show `Deleted`
- disable `Download`
- disable or hide `Delete file`
- show a short message: `File marked as deleted.`

## Future Error States

Use safe messages:

- `Unauthorised.`
- `A valid file id is required.`
- `A supported delete reason is required.`
- `File is unavailable.`
- `File is already deleted.`
- `File deletion is temporarily unavailable.`

Do not display raw Supabase errors, service keys, bucket internals, object contents, supplier costs, margin, lead score or admin priority.

## Tests Before UI Runtime

Before adding the visible button, tests should cover:

- admin page still requires token
- delete button is not public
- deleted files show `Deleted`
- deleted files cannot be downloaded
- future delete UI requires a delete reason
- future delete UI requires explicit confirmation
- future request only sends `fileId` and `deleteReason`
- response handling never exposes secrets or internal pricing/admin fields

## Deferred

Do not implement in the delete-button UI slice:

- physical Supabase object deletion
- bulk delete
- undo
- retention automation
- customer file management
- email notification for deletion
- CRM workflow
