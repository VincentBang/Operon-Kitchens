-- Operon Kitchens Phase 5 advanced review payload storage approval packet.
-- Deployment status: not needed.
--
-- Purpose:
-- Create the future server-only storage table for customer-safe advanced
-- review payloads after Vincent explicitly approves a production Supabase task.
--
-- Important:
-- Do not run this SQL until the Phase 5 SQL migration gate is approved.
-- Do not paste Markdown headings into the Supabase SQL editor.
-- Do not create NEXT_PUBLIC service-role variables.
-- Do not add browser-side Supabase writes.
-- Do not expose this table through public policies.
-- Do not store supplier costs, internal rates, margins, lead scores,
-- admin priority, service keys, raw customer document text or hidden pricing
-- logic in customer_safe_payload.
--
-- Preconditions to check manually before running:
-- 1. public.kitchen_request_reviews exists.
-- 2. gen_random_uuid() is available in the Supabase project.
-- 3. OPERON_KITCHENS_SUPABASE_URL and
--    OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY remain server-side only.
-- 4. The disabled Netlify wrapper has not been replaced unless separately
--    approved.

begin;

create table if not exists public.kitchen_advanced_review_payloads (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.kitchen_request_reviews(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text not null check (source in ('requestReview', 'designBrief', 'scopeBuilder', 'quoteReview')),
  payload_schema_version text not null default 'advanced-review-console-v1',
  customer_safe_payload jsonb not null,
  internal_review_status text not null default 'not_started' check (internal_review_status in (
    'not_started',
    'needs_customer_clarification',
    'ready_for_manual_review',
    'site_measure_recommended',
    'written_scope_draft_needed',
    'closed'
  )),
  operator_notes text,
  last_reviewed_at timestamptz,
  last_reviewed_by text,
  storage_request_id text,
  constraint kitchen_advanced_review_payloads_payload_object
    check (jsonb_typeof(customer_safe_payload) = 'object')
);

create index if not exists kitchen_advanced_review_payloads_lead_id_idx
  on public.kitchen_advanced_review_payloads (lead_id);

create index if not exists kitchen_advanced_review_payloads_created_at_idx
  on public.kitchen_advanced_review_payloads (created_at desc);

create index if not exists kitchen_advanced_review_payloads_status_idx
  on public.kitchen_advanced_review_payloads (internal_review_status);

alter table public.kitchen_advanced_review_payloads enable row level security;

revoke all on table public.kitchen_advanced_review_payloads from anon;
revoke all on table public.kitchen_advanced_review_payloads from authenticated;
grant select, insert, update, delete on table public.kitchen_advanced_review_payloads to service_role;

create or replace function public.set_kitchen_advanced_review_payloads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_kitchen_advanced_review_payloads_updated_at() from public;
grant execute on function public.set_kitchen_advanced_review_payloads_updated_at() to service_role;

drop trigger if exists set_kitchen_advanced_review_payloads_updated_at
  on public.kitchen_advanced_review_payloads;

create trigger set_kitchen_advanced_review_payloads_updated_at
before update on public.kitchen_advanced_review_payloads
for each row
execute function public.set_kitchen_advanced_review_payloads_updated_at();

commit;

-- Manual verification queries after approved execution.
-- These are read-only and should not expose customer payload contents.

select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
  and table_name = 'kitchen_advanced_review_payloads';

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'kitchen_advanced_review_payloads'
order by ordinal_position;

select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename = 'kitchen_advanced_review_payloads';

select indexname
from pg_indexes
where schemaname = 'public'
  and tablename = 'kitchen_advanced_review_payloads'
order by indexname;

select trigger_name
from information_schema.triggers
where event_object_schema = 'public'
  and event_object_table = 'kitchen_advanced_review_payloads'
order by trigger_name;
