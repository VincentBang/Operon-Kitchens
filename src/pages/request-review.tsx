import Head from 'next/head';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';
import {
  preferredNextStepOptions,
  projectStageOptions,
  propertyTypeOptions,
  yesNoOptions,
} from '@/lib/requestReview';

const propertyTypeLabels = {
  house: 'House',
  townhouse: 'Townhouse',
  apartment: 'Apartment',
  strataApartment: 'Strata apartment',
  notSure: 'Not sure',
};

const projectStageLabels = {
  planning: 'Planning',
  quoteInHand: 'I have a quote',
  readyForMeasure: 'Ready for site measure',
  urgent: 'Urgent',
  notSure: 'Not sure',
};

const yesNoLabels = {
  yes: 'Yes',
  no: 'No',
  notSure: 'Not sure',
};

const nextStepLabels = {
  planningEstimate: 'Planning estimate',
  quoteReview: 'Quote review',
  siteMeasure: 'Site measure',
  scopeDiscussion: 'Scope discussion',
};

export default function RequestReviewPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    propertyType: 'notSure',
    projectStage: 'planning',
    hasCurrentQuote: 'notSure',
    hasPhotosPlans: 'notSure',
    approximateBudgetRange: '',
    preferredNextStep: 'quoteReview',
    message: '',
    website: '',
  });
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [termsAcknowledged, setTermsAcknowledged] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');

  const ready = Boolean(form.name.trim() && form.email.trim() && privacyAcknowledged && termsAcknowledged && form.message.trim().length >= 10);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setStatus('saving');
    setError('');
    setRequestId('');

    try {
      const response = await fetch('/.netlify/functions/kitchen-request-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          privacyAcknowledged,
          termsAcknowledged,
          marketingOptIn,
          sourceRoute: '/request-review',
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = Array.isArray(payload.errors) ? payload.errors.join(' ') : payload.error || 'Could not submit request.';
        throw new Error(message);
      }
      setRequestId(payload.request?.requestId || '');
      setStatus('saved');
    } catch (submitError) {
      setStatus('error');
      setError(submitError instanceof Error ? submitError.message : 'Could not submit request.');
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
          <h1 className="contentTitle">Ask Operon Kitchens to review your kitchen scope.</h1>
        </div>
        <div>
          <p className="muted">
            Use this page to request quote review, site measure discussion or project suitability guidance. Uploads stay in the quote review pathway until secure file storage is enabled.
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
          <p className="muted">
            Submit contact and project details only. Do not include sensitive information unless it is needed for the kitchen scope review.
          </p>
          <div className="formGrid two">
            <label className="field"><span>Name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} required /></label>
            <label className="field"><span>Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /></label>
            <label className="field"><span>Phone optional</span><input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label>
            <label className="field"><span>Suburb</span><input value={form.suburb} onChange={(event) => update('suburb', event.target.value)} /></label>
            <label className="field">
              <span>Property type</span>
              <select value={form.propertyType} onChange={(event) => update('propertyType', event.target.value)}>
                {propertyTypeOptions.map((type) => <option key={type} value={type}>{propertyTypeLabels[type]}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Project stage</span>
              <select value={form.projectStage} onChange={(event) => update('projectStage', event.target.value)}>
                {projectStageOptions.map((stage) => <option key={stage} value={stage}>{projectStageLabels[stage]}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Have a current quote?</span>
              <select value={form.hasCurrentQuote} onChange={(event) => update('hasCurrentQuote', event.target.value)}>
                {yesNoOptions.map((option) => <option key={option} value={option}>{yesNoLabels[option]}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Have photos or plans?</span>
              <select value={form.hasPhotosPlans} onChange={(event) => update('hasPhotosPlans', event.target.value)}>
                {yesNoOptions.map((option) => <option key={option} value={option}>{yesNoLabels[option]}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Approximate budget range optional</span>
              <input value={form.approximateBudgetRange} onChange={(event) => update('approximateBudgetRange', event.target.value)} placeholder="e.g. $30k-$50k or not sure" />
            </label>
            <label className="field">
              <span>Preferred next step</span>
              <select value={form.preferredNextStep} onChange={(event) => update('preferredNextStep', event.target.value)}>
                {preferredNextStepOptions.map((option) => <option key={option} value={option}>{nextStepLabels[option]}</option>)}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Message</span>
            <textarea value={form.message} onChange={(event) => update('message', event.target.value)} rows={5} maxLength={1500} placeholder="Tell us what you want checked, what documents you have, and whether you need quote review or site measure." required />
          </label>
          <label className="field honeypot" aria-hidden="true">
            <span>Website</span>
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} />
          </label>
          <aside className="compliancePanel">
            <h2>Upload pathway</h2>
            <p>Quote, photo and plan uploads are handled in the quote review pathway. This request form only sends text, contact and project details.</p>
            <Link href="/quote/review" className="textLink">Upload existing quote or project files</Link>
          </aside>

          <PrivacyCollectionNotice
            context="review"
            acknowledged={privacyAcknowledged}
            marketingOptIn={marketingOptIn}
            onAcknowledgedChange={setPrivacyAcknowledged}
            onMarketingChange={setMarketingOptIn}
          />
          <label className="privacyNotice mt-2 flex items-start gap-2">
            <input
              type="checkbox"
              checked={termsAcknowledged}
              onChange={(event) => setTermsAcknowledged(event.target.checked)}
            />
            <span>I acknowledge the <Link href="/terms" className="textLink">Terms of Use</Link>, including that this is request intake and planning guidance only.</span>
          </label>

          {status === 'saved' && (
            <div className="successPanel">
              Your request has been received for Operon Kitchens review intake. {requestId && <>Reference: <strong>{requestId}</strong>.</>} Site measure, written scope confirmation and project-specific review are still required before commitment.
            </div>
          )}
          {status === 'error' && <div className="errorPanel">{error}</div>}
          <div className="wizardActions">
            <button className="button primary" type="submit" disabled={!ready || status === 'saving'}>
              {status === 'saving' ? 'Submitting...' : 'Submit request'}
            </button>
            <Link href="/quote/review" className="button ghost">Upload quote/photos/plans</Link>
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
