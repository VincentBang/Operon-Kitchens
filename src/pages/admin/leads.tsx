import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { listLeadsAndQuotes } from '@/lib/adminData';

interface Props {
  user: AuthUser;
  initialData: ReturnType<typeof listLeadsAndQuotes>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') return { redirect: { destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false } };
  return { props: { user, initialData: listLeadsAndQuotes() } };
};

export default function LeadsAdmin({ user, initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [message, setMessage] = useState('');

  async function search(event?: FormEvent) {
    event?.preventDefault();
    const response = await fetch(`/api/admin/leads?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`);
    const payload = await response.json();
    if (response.ok) setData(payload.data);
  }

  async function updateStatus(id: string, nextStatus: string) {
    const response = await fetch('/api/admin/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', id, status: nextStatus }),
    });
    const payload = await response.json();
    setMessage(response.ok ? 'Quote status updated.' : payload.error || 'Could not update status.');
    await search();
  }

  return (
    <AdminShell user={user} title="Leads and quotes">
      <section className="wizardPanel space-y-8">
        <form onSubmit={search} className="adminFilters">
          <label><span>Search</span><input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Name, email, phone or quote ID" /></label>
          <label><span>Quote status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All</option><option value="SUBMITTED">Submitted</option><option value="REVIEWING">Reviewing</option><option value="WON">Won</option><option value="LOST">Lost</option></select></label>
          <button className="button primary">Filter</button>
        </form>
        {message && <p className="privacyNotice">{message}</p>}

        <section>
          <h2>Leads</h2>
          <div className="tableScroller">
            <table className="adminTable">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Quotes</th><th>Latest value</th><th>Source</th></tr></thead>
              <tbody>
                {data.leads.map((lead) => (
                  <tr key={lead.id}><td>{lead.name}</td><td>{lead.email}</td><td>{lead.phone}</td><td>{lead.quoteCount}</td><td>${Number(lead.latestQuoteTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td><td>{lead.source}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Quotes</h2>
          <div className="adminList">
            {data.quotes.map((quote) => (
              <article className="adminListItem" key={quote.id}>
                <div>
                  <strong>{quote.leadName || 'Unknown'} · {quote.leadEmail || 'No email'}</strong>
                  <p>${Number(quote.total).toLocaleString(undefined, { maximumFractionDigits: 0 })} · {quote.confidenceLevel} confidence · {quote.status}</p>
                </div>
                <div className="adminActions">
                  <select value={quote.status} onChange={(event) => updateStatus(quote.id, event.target.value)}>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="REVIEWING">Reviewing</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                  <Link href={`/quote/${quote.id}`} className="textLink">Open</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
