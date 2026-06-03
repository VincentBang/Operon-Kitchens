import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function readDoc(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('file upload retention and deletion design', () => {
  it('documents retention metadata SQL for kitchen request-review files', () => {
    const sqlDoc = readDoc('docs/supabase-kitchen-request-reviews.md');

    expect(sqlDoc).toContain('alter table public.kitchen_request_review_files');
    expect(sqlDoc).toContain('retention_status text not null default');
    expect(sqlDoc).toContain("'active'");
    expect(sqlDoc).toContain("'review_complete'");
    expect(sqlDoc).toContain("'customer_requested_deletion'");
    expect(sqlDoc).toContain("'deleted'");
    expect(sqlDoc).toContain("'retained_for_business_record'");
    expect(sqlDoc).toContain('review_completed_at timestamptz');
    expect(sqlDoc).toContain('delete_requested_at timestamptz');
    expect(sqlDoc).toContain('deleted_at timestamptz');
    expect(sqlDoc).toContain('deleted_by text');
    expect(sqlDoc).toContain('delete_reason text');
    expect(sqlDoc).toContain('kitchen_request_review_files_retention_status_idx');
    expect(sqlDoc).toContain('kitchen_request_review_files_deleted_at_idx');
  });

  it('documents the local soft-delete endpoint without adding delete UI yet', () => {
    const plan = readDoc('docs/file-upload-mvp-completion-plan.md');

    expect(plan).toContain('POST /.netlify/functions/kitchen-admin-file-delete');
    expect(plan).toContain('"deleteReason": "customer_request | duplicate | irrelevant | unsafe | retention_cleanup | other"');
    expect(plan).toContain('Deletion must never accept arbitrary bucket names or object paths from the browser.');
    expect(plan).toContain('Do not add a delete button until Vincent approves the UI slice.');
    expect(plan).toContain('delete function + tests only');
    expect(plan).toContain('Validate `deleteReason`.');
    expect(plan).toContain('Reject unsupported browser fields');
    expect(plan).toContain("`retention_status = 'deleted'`");
    expect(plan).toContain('Do not return raw Supabase errors, service role keys, object contents, internal notes or pricing fields.');
    expect(existsSync(join(process.cwd(), 'netlify/functions/kitchen-admin-file-delete.ts'))).toBe(true);
  });

  it('documents allowed deletion reasons and unsafe client fields before runtime implementation', () => {
    const plan = readDoc('docs/file-upload-mvp-completion-plan.md');

    for (const reason of ['customer_request', 'duplicate', 'irrelevant', 'unsafe', 'retention_cleanup', 'other']) {
      expect(plan).toContain(reason);
    }
    for (const unsafeField of ['bucket', 'object_path', 'leadScore', 'adminPriority', 'supplierCost', 'margin', 'serviceRoleKey']) {
      expect(plan).toContain(unsafeField);
    }
    expect(plan).toContain('rejects browser-supplied `bucket` and `object_path`');
    expect(plan).toContain('does not delete arbitrary object paths supplied by the browser');
  });

  it('keeps delete controls absent from admin leads until the next runtime slice is approved', () => {
    const adminPage = readDoc('src/pages/admin/leads.tsx');

    expect(adminPage).toContain('Delete controls remain deferred until the next approved runtime slice.');
    expect(adminPage).not.toContain('kitchen-admin-file-delete');
    expect(adminPage).not.toContain('Delete file');
    expect(adminPage).not.toContain('deleteReason');
  });

  it('documents the future delete-button UI without enabling it in admin leads', () => {
    const design = readDoc('docs/admin-file-delete-ui-design.md');
    const adminPage = readDoc('src/pages/admin/leads.tsx');

    expect(design).toContain('visible delete button');
    expect(design).toContain('Delete file');
    expect(design).toContain('delete reason select');
    expect(design).toContain('confirm checkbox');
    expect(design).toContain('I understand this file will no longer be downloadable from admin once deleted.');
    expect(design).toContain('POST /.netlify/functions/kitchen-admin-file-delete');
    expect(design).toContain('"fileId": "uuid"');
    expect(design).toContain('"deleteReason": "duplicate"');
    expect(design).toContain('Do not send:');
    expect(design).toContain('bucket');
    expect(design).toContain('object path');
    expect(design).toContain('lead score');
    expect(design).toContain('supplier cost');
    expect(design).toContain('margin');
    expect(design).toContain('service keys');
    expect(design).toContain('physical Supabase object deletion');
    expect(adminPage).not.toContain('Delete file');
    expect(adminPage).not.toContain('kitchen-admin-file-delete');
  });
});
