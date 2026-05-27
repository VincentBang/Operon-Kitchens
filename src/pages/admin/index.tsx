import { GetServerSideProps } from 'next';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { AuthUser, getUserFromRequest } from '@/lib/auth';
import { getAdminSummary } from '@/lib/adminData';

interface AdminProps {
  user: AuthUser;
  leads: any[];
  quotes: any[];
  rateCards: any[];
  contentCounts: Record<string, number>;
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

  return { props: { user, ...getAdminSummary() } };
};

export default function AdminPage({ user, leads, quotes, rateCards, contentCounts }: AdminProps) {
  return (
    <AdminShell user={user} title="Operon Kitchens admin">
      <div className="adminGrid">
        <Link href="/admin/leads" className="adminStat">
          <span>Leads</span>
          <strong>{leads.length}</strong>
          <em>View pipeline and recent quote requests</em>
        </Link>
        <Link href="/admin/rate-cards" className="adminStat">
          <span>Rate cards</span>
          <strong>{rateCards.length}</strong>
          <em>Update kitchen estimating assumptions</em>
        </Link>
        <Link href="/admin/products" className="adminStat">
          <span>Products</span>
          <strong>{contentCounts.products}</strong>
          <em>Edit customer-facing category pages</em>
        </Link>
        <Link href="/admin/guides" className="adminStat">
          <span>Guides</span>
          <strong>{contentCounts.guides}</strong>
          <em>Maintain quote education content</em>
        </Link>
        <Link href="/admin/faqs" className="adminStat">
          <span>FAQs</span>
          <strong>{contentCounts.faqs}</strong>
          <em>Answer common quote and compliance questions</em>
        </Link>
      </div>

      <section className="wizardPanel space-y-8">
        <section>
          <div className="adminSectionHeader">
            <h2>Recent quotes</h2>
            <Link href="/admin/leads" className="textLink">Open leads</Link>
          </div>
          {quotes.length === 0 ? (
            <p className="muted">No submitted quotes yet.</p>
          ) : (
            <div className="adminList">
              {quotes.map((quote) => (
                <article key={quote.id} className="adminListItem">
                  <div>
                    <strong>{quote.leadName || 'Unknown'} · {quote.leadEmail || 'No email'}</strong>
                    <p>${Number(quote.total).toLocaleString(undefined, { maximumFractionDigits: 0 })} · {quote.confidenceLevel} confidence · {quote.status}</p>
                  </div>
                  <Link href={`/quote/${quote.id}`} className="textLink">Open</Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="adminSectionHeader">
            <h2>Active rate card</h2>
            <Link href="/admin/rate-cards" className="textLink">Manage rates</Link>
          </div>
          <div className="adminList">
            {rateCards.slice(0, 3).map((card) => (
              <article key={card.id} className="adminListItem">
                <div>
                  <strong>{card.name}</strong>
                  <p>Version {card.version} · {card.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
