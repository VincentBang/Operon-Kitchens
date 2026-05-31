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

export default function LeadsAdminPage() {
  const [token, setToken] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [leads, setLeads] = useState<KitchenAdminLead[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        return;
      }
      setLeads(body.leads);
      setSelectedId(body.leads[0]?.id ?? null);
      setDraftNotes(Object.fromEntries(body.leads.map((lead: KitchenAdminLead) => [lead.id, lead.internal_notes ?? ''])));
      setDraftStatus(Object.fromEntries(body.leads.map((lead: KitchenAdminLead) => [lead.id, lead.status])));
      setMessage(`${body.leads.length} lead${body.leads.length === 1 ? '' : 's'} loaded.`);
    } catch {
      setMessage('Lead list could not be loaded.');
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
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">{message}</p>
          )}

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
                      <p className="mt-1 text-xs text-slate-400">{formatDate(lead.created_at)} | {lead.suburb || 'Suburb not supplied'}</p>
                    </div>
                    <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      {statusLabels[(lead.status as AdminLeadStatus)] || lead.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-300">{lead.message}</p>
                </button>
              ))}
              {!leads.length && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                  Enter the admin token and fetch leads. No lead data is loaded without a valid token.
                </div>
              )}
            </div>

            {selectedLead && (
              <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedLead.name}</h2>
                    <p className="mt-1 text-sm text-slate-300">{selectedLead.email}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {statusLabels[(selectedLead.status as AdminLeadStatus)] || selectedLead.status}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Property</dt>
                    <dd className="mt-1 font-medium">{selectedLead.property_type}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Stage</dt>
                    <dd className="mt-1 font-medium">{selectedLead.project_stage}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Current quote</dt>
                    <dd className="mt-1 font-medium">{yesNoLabel(selectedLead.has_current_quote)}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-900/70 p-3">
                    <dt className="text-slate-400">Photos/plans</dt>
                    <dd className="mt-1 font-medium">{yesNoLabel(selectedLead.has_photos_or_plans)}</dd>
                  </div>
                </dl>

                <div className="mt-5 rounded-xl bg-slate-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Message</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{selectedLead.message}</p>
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
