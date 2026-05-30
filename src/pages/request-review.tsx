import Head from 'next/head';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';

const enquiryTypes = [
  'General kitchen enquiry',
  'Request quote review',
  'Request site measure',
  'Check project suitability',
];

export default function RequestReviewPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    enquiryType: enquiryTypes[0],
    message: '',
  });
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  const ready = Boolean(form.name.trim() && form.email.trim() && form.phone.trim() && privacyAcknowledged);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setStatus('saving');
    setError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          marketingOptIn,
          source: `request_review:${form.enquiryType}:${form.suburb}:${form.message}`.slice(0, 240),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save request.');
      setStatus('saved');
    } catch (submitError) {
      setStatus('error');
      setError(submitError instanceof Error ? submitError.message : 'Could not save request.');
    }
  };

  return (
    <main>
      <Head>
        <title>Contact Operon Kitchens | Request review or site measure</title>
        <meta
          name="description"
          content="Contact Operon Kitchens for a kitchen quote review, site measure request, project suitability check or general Sydney kitchen renovation enquiry."
        />
      </Head>
      <section className="contentHero">
        <div>
          <p className="eyebrow">Request review</p>
          <h1 className="contentTitle">Request kitchen quote review or site measure.</h1>
        </div>
        <div>
          <p className="muted">
            Use this page for general enquiries, quote review, site measure interest or project suitability questions. You can also start with the estimate wizard if the scope is early.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button ghost">Start estimate instead</Link>
            <Link href="/quote/review" className="button ghost">Upload existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <form className="quoteResult" onSubmit={submit}>
          <h2>Request details</h2>
          <div className="formGrid two">
            <label className="field"><span>Name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} required /></label>
            <label className="field"><span>Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /></label>
            <label className="field"><span>Phone</span><input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} required /></label>
            <label className="field"><span>Suburb</span><input value={form.suburb} onChange={(event) => update('suburb', event.target.value)} /></label>
            <label className="field">
              <span>Enquiry type</span>
              <select value={form.enquiryType} onChange={(event) => update('enquiryType', event.target.value)}>
                {enquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Message</span>
            <textarea value={form.message} onChange={(event) => update('message', event.target.value)} rows={5} placeholder="Tell us what you want checked, what documents you have, and whether you need quote review or site measure." />
          </label>

          <PrivacyCollectionNotice
            context="review"
            acknowledged={privacyAcknowledged}
            marketingOptIn={marketingOptIn}
            onAcknowledgedChange={setPrivacyAcknowledged}
            onMarketingChange={setMarketingOptIn}
          />

          {status === 'saved' && <div className="successPanel">Your request has been saved. The next step is professional follow-up, quote review or site measure discussion depending on your project details.</div>}
          {status === 'error' && <div className="errorPanel">{error}</div>}
          <div className="wizardActions">
            <button className="button primary" type="submit" disabled={!ready || status === 'saving'}>
              {status === 'saving' ? 'Saving...' : 'Send enquiry'}
            </button>
          </div>
        </form>

        <section className="contentCta">
          <h2>Prefer a structured path?</h2>
          <p>Use the estimate wizard for a planning range, or upload a quote if you already have one.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
