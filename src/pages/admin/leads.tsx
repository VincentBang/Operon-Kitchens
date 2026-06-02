import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { adminLeadStatuses, AdminLeadStatus, KitchenAdminLead } from '@/lib/kitchenAdminLeads';

const statusLabels: Record<AdminLeadStatus, string> = {
  new: 'New',
  review_needed: 'Review needed',
  contacted: 'Contacted',
  site_measure_offered: 'Site measure offered',
  site_measure_booked: 'Site measure booked',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
  spam: 'Spam',
};

const propertyTypeLabels: Record<string, string> = {
  house: 'House',
  townhouse: 'Townhouse',
  apartment: 'Apartment',
  strataApartment: 'Strata apartment',
  notSure: 'Not sure',
};

const projectStageLabels: Record<string, string> = {
  planning: 'Planning',
  quoteInHand: 'I have a quote',
  readyForMeasure: 'Ready for site measure',
  urgent: 'Urgent',
  notSure: 'Not sure',
};

const preferredNextStepLabels: Record<string, string> = {
  planningEstimate: 'Planning estimate',
  quoteReview: 'Quote review',
  siteMeasure: 'Site measure',
  scopeDiscussion: 'Scope discussion',
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-AU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function yesNoLabel(value: boolean | null) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'Not sure';
}

function compactAttribution(lead: KitchenAdminLead) {
  return [
    lead.utm_source && `Source: ${lead.utm_source}`,
    lead.utm_medium && `Medium: ${lead.utm_medium}`,
    lead.utm_campaign && `Campaign: ${lead.utm_campaign}`,
  ].filter(Boolean).join(' | ');
}

function statusNudge(status: AdminLeadStatus | string) {
  const nudges: Record<AdminLeadStatus, string> = {
    new: 'Check contact details and decide whether quote review or site measure is the best next step.',
    review_needed: 'Review scope, allowance and access details before customer follow-up.',
    contacted: 'Add call notes and confirm the next customer action.',
    site_measure_offered: 'Record whether the customer wants to proceed with site measure.',
    site_measure_booked: 'Keep appointment details in internal notes until a fuller CRM exists.',
    quoted: 'Track whether written scope confirmation has been issued separately.',
    won: 'Keep delivery notes outside this admin-lite page until the full CRM exists.',
    lost: 'Record the main reason if the customer does not proceed.',
    spam: 'No customer follow-up needed.',
  };
  return isAdminLeadStatusLabel(status) ? nudges[status] : 'Use internal notes for the next safe follow-up step.';
}

function isAdminLeadStatusLabel(value: AdminLeadStatus | string): value is AdminLeadStatus {
  return adminLeadStatuses.includes(value as AdminLeadStatus);
}

function compactProjectSummary(lead: KitchenAdminLead) {
  return [
    lead.suburb || 'Suburb not supplied',
    propertyTypeLabels[lead.property_type] || lead.property_type || 'Property not supplied',
    projectStageLabels[lead.project_stage] || lead.project_stage || 'Stage not supplied',
  ].join(' | ');
}

export default function LeadsAdminPage() {
  const [token, setToken] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [leads, setLeads] = useState<KitchenAdminLead[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [message, setMessage] = useState('');
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [draftStatus, setDraftStatus] = useState<Record<string, AdminLeadStatus>>({});

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? leads[0],
    [leads, selectedId],
  );

  async function fetchLeads(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.set('status', statusFilter);
      const response = await fetch(`/.netlify/functions/kitchen-admin-leads?${params.toString()}`, {
        headers: { 'x-operon-admin-token': token },
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        setMessage(body.error || 'Lead list could not be loaded.');
        setLeads([]);
        setSelectedId(null);
        setHasFetched(true);
        return;
      }
      setLeads(body.leads);
      setSelectedId(body.leads[0]?.id ?? null);
      setDraftNotes(Object.fromEntries(body.leads.map((lead: KitchenAdminLead) => [lead.id, lead.internal_notes ?? ''])));
      setDraftStatus(Object.fromEntries(body.leads.map((lead: KitchenAdminLead) => [lead.id, lead.status])));
      setMessage(`${body.leads.length} lead${body.leads.length === 1 ? '' : 's'} loaded.`);
      setHasFetched(true);
    } catch {
      setMessage('Lead list could not be loaded.');
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }

  async function updateLead(lead: KitchenAdminLead) {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/.netlify/functions/kitchen-admin-lead-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-operon-admin-token': token,
        },
        body: JSON.stringify({
          id: lead.id,
          status: draftStatus[lead.id] ?? lead.status,
          internal_notes: draftNotes[lead.id] ?? '',
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        setMessage(body.error || 'Lead update could not be saved.');
        return;
      }
      setLeads((current) => current.map((item) => (item.id === lead.id ? body.lead : item)));
      setMessage('Lead updated.');
    } catch {
      setMessage('Lead update could not be saved.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Kitchen Lead Operations | Operon Kitchens</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="Internal Operon Kitchens lead operations for request-review enquiries."
        />
      </Head>
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Internal only</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Kitchen request-review leads</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Admin-lite lead operations for Operon Kitchens enquiries. This page requires the admin token and does
                not expose supplier costs, pricing assumptions, lead scores or public customer data without token access.
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
                Supabase is the source of truth. While branded email is deferred, check this page daily during controlled testing.
              </p>
            </div>
            <Link className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10" href="/admin">
              Back to admin
            </Link>
          </div>

          <form onSubmit={fetchLeads} className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_220px_auto]">
            <label className="text-sm text-slate-200">
              Admin token
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-300"
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="x-operon-admin-token"
                autoComplete="off"
              />
            </label>
            <label className="text-sm text-slate-200">
              Status filter
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-300"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">All statuses</option>
                {adminLeadStatuses.map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={loading || !token}
              className="self-end rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch leads'}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200" aria-live="polite">{message}</p>
          )}

          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Daily check</p>
              <p className="mt-1">Fetch new and review-needed leads while email notification is deferred.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Update status</p>
              <p className="mt-1">Move each lead to the next real follow-up stage after contact or review.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Notes style</p>
              <p className="mt-1">Keep notes factual: what was checked, what is missing and the next action.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)]">
            <div className="space-y-3">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setSelectedId(lead.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedLead?.id === lead.id ? 'border-emerald-300 bg-emerald-300/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-white">{lead.name}</p>
                      <p className="text-sm text-slate-300">{lead.email}{lead.phone ? ` | ${lead.phone}` : ''}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(lead.created_at)} | {compactProjectSummary(lead)}</p>
                      {compactAttribution(lead) && (
                        <p className="mt-1 text-xs text-emerald-200">{compactAttribution(lead)}</p>
                      )}
                    </div>
                    <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      {statusLabels[(lead.status as AdminLeadStatus)] || lead.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-300">{lead.message}</p>
                  {lead.files.length > 0 && (
                    <p className="mt-2 text-xs text-slate-400">{lead.files.length} uploaded file{lead.files.length === 1 ? '' : 's'}</p>
                  )}
                </button>
              ))}
              {!leads.length && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                  {hasFetched
                    ? 'No leads matched this filter. Try all statuses or check again after the next controlled test submission.'
                    : 'Enter the admin token and fetch leads. No lead data is loaded without a valid token.'}
                </div>
              )}
            </div>

            {selectedLead && (
              <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedLead.name}</h2>
                    <p className="mt-1 text-sm text-slate-300">{selectedLead.email}</p>
                    {selectedLead.phone && <p className="mt-1 text-sm text-slate-300">{selectedLead.phone}</p>}
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {statusLabels[(selectedLead.status as AdminLeadStatus)] || selectedLead.status}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Property</dt>
                    <dd className="mt-1 font-medium">{propertyTypeLabels[selectedLead.property_type] || selectedLead.property_type}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Stage</dt>
                    <dd className="mt-1 font-medium">{projectStageLabels[selectedLead.project_stage] || selectedLead.project_stage}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Current quote</dt>
                    <dd className="mt-1 font-medium">{yesNoLabel(selectedLead.has_current_quote)}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Photos/plans</dt>
                    <dd className="mt-1 font-medium">{yesNoLabel(selectedLead.has_photos_or_plans)}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Budget range</dt>
                    <dd className="mt-1 font-medium">{selectedLead.budget_range || 'Not supplied'}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Preferred step</dt>
                    <dd className="mt-1 font-medium">{preferredNextStepLabels[selectedLead.preferred_next_step] || selectedLead.preferred_next_step}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Marketing</dt>
                    <dd className="mt-1 font-medium">{selectedLead.marketing_opt_in ? 'Opted in' : 'No opt-in'}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">User agent</dt>
                    <dd className="mt-1 truncate font-medium" title={selectedLead.user_agent || ''}>{selectedLead.user_agent || 'Not supplied'}</dd>
                  </div>
                </dl>

                <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Suggested handling</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{statusNudge(draftStatus[selectedLead.id] ?? selectedLead.status)}</p>
                </div>

                <div className="mt-5 rounded-xl bg-slate-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Message</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{selectedLead.message}</p>
                </div>

                <div className="mt-5 rounded-xl bg-slate-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Uploaded files</p>
                  {selectedLead.files.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {selectedLead.files.map((file) => (
                        <li key={file.id} className="rounded-lg bg-white/5 p-3">
                          <span className="block font-medium">{file.file_name}</span>
                          <span className="block text-xs text-slate-400">{file.category} | {Math.round(file.file_size / 1024)} KB | {file.file_type}</span>
                          <span className="block truncate text-xs text-slate-500" title={file.object_path}>{file.object_path}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-300">No uploaded files attached to this lead.</p>
                  )}
                  <p className="mt-3 text-xs text-slate-400">
                    Metadata only. Signed downloads, deletion and retention workflows are deferred until approved.
                  </p>
                </div>

                <div className="mt-5 rounded-xl bg-slate-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lead source</p>
                  <dl className="mt-3 grid gap-2 text-sm text-slate-200">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Source route</dt>
                      <dd className="text-right">{selectedLead.source_route || 'not supplied'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Landing page</dt>
                      <dd className="max-w-[65%] truncate text-right" title={selectedLead.landing_page || ''}>{selectedLead.landing_page || 'not supplied'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">Referrer</dt>
                      <dd className="max-w-[65%] truncate text-right" title={selectedLead.referrer || ''}>{selectedLead.referrer || 'not supplied'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">UTM</dt>
                      <dd className="max-w-[65%] truncate text-right">
                        {[selectedLead.utm_source, selectedLead.utm_medium, selectedLead.utm_campaign].filter(Boolean).join(' / ') || 'not supplied'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">UTM content</dt>
                      <dd className="max-w-[65%] truncate text-right" title={selectedLead.utm_content || ''}>{selectedLead.utm_content || 'not supplied'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-400">UTM term</dt>
                      <dd className="max-w-[65%] truncate text-right" title={selectedLead.utm_term || ''}>{selectedLead.utm_term || 'not supplied'}</dd>
                    </div>
                  </dl>
                </div>

                <label className="mt-5 block text-sm text-slate-200">
                  Status
                  <select
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-300"
                    value={draftStatus[selectedLead.id] ?? selectedLead.status}
                    onChange={(event) => setDraftStatus((current) => ({
                      ...current,
                      [selectedLead.id]: event.target.value as AdminLeadStatus,
                    }))}
                  >
                    {adminLeadStatuses.map((status) => (
                      <option key={status} value={status}>{statusLabels[status]}</option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-sm text-slate-200">
                  Internal notes
                  <textarea
                    className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-300"
                    value={draftNotes[selectedLead.id] ?? ''}
                    onChange={(event) => setDraftNotes((current) => ({
                      ...current,
                      [selectedLead.id]: event.target.value,
                    }))}
                    placeholder="Add follow-up notes for internal use only."
                  />
                </label>

                <button
                  type="button"
                  disabled={loading || !token}
                  onClick={() => updateLead(selectedLead)}
                  className="mt-4 w-full rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save lead update
                </button>
              </aside>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
