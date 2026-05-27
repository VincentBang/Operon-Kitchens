import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { getUserFromRequest } from '@/lib/auth';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getUserFromRequest(context.req);
  if (user) {
    return {
      redirect: {
        destination: typeof context.query.next === 'string' ? context.query.next : '/account',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = typeof router.query.next === 'string' ? router.query.next : '/account';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone, passcode }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not sign in.');
      router.push(payload.user.role === 'admin' && nextPath === '/account' ? '/admin' : nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="pageSurface">
      <section className="wizardShell">
        <div className="wizardHeader">
          <p className="eyebrow">Operon account</p>
          <h1>Sign in</h1>
          <p className="muted">Customers can view saved quotes. Admins can access leads and rate cards.</p>
        </div>
        <form onSubmit={handleSubmit} className="wizardPanel space-y-4">
          <label className="flex flex-col">
            <span>Email</span>
            <input className="p-2 border rounded" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="flex flex-col">
            <span>Name</span>
            <input className="p-2 border rounded" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="flex flex-col">
            <span>Phone</span>
            <input className="p-2 border rounded" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label className="flex flex-col">
            <span>Admin passcode</span>
            <input className="p-2 border rounded" type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} />
          </label>
          <p className="privacyNotice">
            This development sign-in creates a secure browser session. Use <strong>admin@operonkitchens.local</strong> with the admin passcode to access the admin dashboard.
          </p>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}
          <div className="flexActions">
            <button className="bg-blue-600 text-white py-2 px-4 rounded" disabled={!email || isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            <Link href="/" className="textLink">Return home</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
