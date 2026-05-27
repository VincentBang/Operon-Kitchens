import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getUserFromRequest, AuthUser } from '@/lib/auth';
import { getQuotesByEmail } from '@/lib/quoteRecords';

interface AccountProps {
  user: AuthUser;
  quotes: any[];
}

export const getServerSideProps: GetServerSideProps<AccountProps> = async (context) => {
  const user = getUserFromRequest(context.req);
  if (!user) {
    return {
      redirect: {
        destination: `/auth/signin?next=${encodeURIComponent('/account')}`,
        permanent: false,
      },
    };
  }

  const quotes = await getQuotesByEmail(user.email);
  return { props: { user, quotes } };
};

export default function AccountPage({ user, quotes }: AccountProps) {
  const router = useRouter();

  async function signOut() {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
  }

  return (
    <main className="pageSurface">
      <section className="wizardShell">
        <div className="wizardHeader">
          <p className="eyebrow">Customer account</p>
          <h1>Saved quotes</h1>
          <p className="muted">Signed in as {user.email}</p>
        </div>
        <div className="wizardPanel space-y-4">
          {quotes.length === 0 ? (
            <p>No saved quotes yet.</p>
          ) : (
            quotes.map((quote) => (
              <article key={quote.id} className="adminListItem">
                <div>
                  <div>
                    <p className="font-semibold">Quote {quote.id}</p>
                    <p className="text-sm text-gray-600">
                      ${quote.totals.estimateLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${quote.totals.estimateHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {quote.totals.confidenceLabel ?? quote.totals.confidenceLevel} confidence
                    </p>
                  </div>
                  <Link href={`/quote/${quote.id}`} className="textLink">View or edit</Link>
                </div>
              </article>
            ))
          )}
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start another quote</Link>
            <button onClick={signOut} className="button ghost">Sign out</button>
          </div>
        </div>
      </section>
    </main>
  );
}
