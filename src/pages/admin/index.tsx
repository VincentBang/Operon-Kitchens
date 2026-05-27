import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { getAdminDashboardData } from '@/lib/quoteRecords';

interface AdminProps {
  user: AuthUser;
  leads: any[];
  quotes: any[];
  rateCards: any[];
}

export const getServerSideProps: GetServerSideProps<AdminProps> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user || user.role !== 'admin') {
    return {
      redirect: {
        destination: `/auth/signin?next=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  const data = await getAdminDashboardData();
  return { props: { user, ...data } };
};

export default function AdminPage({ user, leads, quotes, rateCards }: AdminProps) {
  return (
    <main className="pageSurface">
      <section className="wizardShell">
        <div className="wizardHeader">
          <p className="eyebrow">Admin dashboard</p>
          <h1>Leads and rate cards</h1>
          <p className="muted">Signed in as {user.email}</p>
        </div>
        <div className="wizardPanel space-y-8">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold mb-2">Submitted leads</h2>
        {leads.length === 0 ? (
          <p>No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Quotes</th>
                  <th>Latest value</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t">
                    <td className="py-2">{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.quoteCount}</td>
                    <td>${Number(lead.latestQuoteTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold mb-2">Recent quotes</h2>
        {quotes.length === 0 ? (
          <p>No submitted quotes yet.</p>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <article key={quote.id} className="border rounded p-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold">{quote.leadName || 'Unknown'} · {quote.leadEmail || 'No email'}</p>
                    <p className="text-sm text-gray-600">
                      ${quote.totals.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {quote.totals.confidenceLevel} confidence · {quote.status}
                    </p>
                  </div>
                  <Link href={`/quote/${quote.id}`} className="textLink">Open quote</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold mb-2">Rate card management</h2>
        {rateCards.map((card) => (
          <article key={card.id} className="border rounded p-4 bg-white">
            <p className="font-semibold">{card.name}</p>
            <p className="text-sm text-gray-600">Version {card.version} · {card.isActive ? 'Active' : 'Inactive'}</p>
          </article>
        ))}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Settings</h2>
        <p>Configure GST, margin, contingency and risk buffers. Set minimum job size and update FAQ content.</p>
      </section>
        </div>
      </section>
    </main>
  );
}
