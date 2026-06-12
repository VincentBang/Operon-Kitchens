import Head from 'next/head';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';
import {
  preferredNextStepOptions,
  projectStageOptions,
  propertyTypeOptions,
  RequestReviewFileCategoryOption,
  requestReviewFileLimits,
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

const requestReviewNextSteps = [
  'Review the request details and any attached quote, plan or photo metadata.',
  'Identify unclear scope, allowance, access or trade review items.',
  'Recommend quote review, site measure or written scope confirmation as the next step.',
];

type PreparedRequestFile = {
  localId: string;
  name: string;
  category: RequestReviewFileCategoryOption;
  mimeType: string;
  size: number;
  contentBase64: string;
};

const requestFileCategories: { value: RequestReviewFileCategoryOption; label: string; accept: string }[] = [
  { value: 'existingQuote', label: 'Existing quote', accept: '.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif' },
  { value: 'photo', label: 'Photos', accept: 'image/jpeg,image/png,image/webp,image/heic,image/heif' },
  { value: 'plan', label: 'Plans or drawings', accept: '.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif' },
  { value: 'applianceList', label: 'Appliance list', accept: '.pdf,image/jpeg,image/png,image/webp' },
  { value: 'other', label: 'Other document', accept: '.pdf,image/jpeg,image/png,image/webp' },
];

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      resolve(result.includes(',') ? result.split(',').pop() || '' : result);
    };
    reader.onerror = () => reject(new Error('File could not be read.'));
    reader.readAsDataURL(file);
  });
}

function getAttributionFields() {
  if (typeof window === 'undefined') {
    return {
      referrer: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      landingPage: '',
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    referrer: document.referrer || '',
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    utmTerm: params.get('utm_term') || '',
    landingPage: window.location.href,
  };
}

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
  const [files, setFiles] = useState<PreparedRequestFile[]>([]);
  const [fileStatus, setFileStatus] = useState<'idle' | 'reading' | 'error'>('idle');
  const [fileError, setFileError] = useState('');
  const [fileUploadWarning, setFileUploadWarning] = useState('');

  const ready = Boolean(form.name.trim() && form.email.trim() && privacyAcknowledged && termsAcknowledged && form.message.trim().length >= 10 && fileStatus !== 'reading');
  const selectedFileBytes = files.reduce((sum, file) => sum + file.size, 0);
  const selectedFileSummary = files.length
    ? `${files.length} file${files.length === 1 ? '' : 's'} selected, ${Math.round(selectedFileBytes / 1024)} KB total`
    : 'No files selected yet';

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addFiles = async (fileList: FileList | null, category: RequestReviewFileCategoryOption) => {
    if (!fileList?.length) return;
    setFileStatus('reading');
    setFileError('');
    try {
      const incoming = Array.from(fileList);
      if (files.length + incoming.length > requestReviewFileLimits.maxFiles) {
        throw new Error(`Upload up to ${requestReviewFileLimits.maxFiles} files for this request.`);
      }
      const currentTotal = files.reduce((sum, file) => sum + file.size, 0);
      const incomingTotal = incoming.reduce((sum, file) => sum + file.size, 0);
      if (incoming.some((file) => file.size > requestReviewFileLimits.maxFileBytes)) {
        throw new Error('Each uploaded file must be 4MB or smaller.');
      }
      if (currentTotal + incomingTotal > requestReviewFileLimits.maxTotalBytes) {
        throw new Error('Total uploaded file size must be 10MB or smaller.');
      }
      const prepared = await Promise.all(incoming.map(async (file) => ({
        localId: `${category}-${file.name}-${file.size}-${Date.now()}`,
        name: file.name,
        category,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        contentBase64: await fileToBase64(file),
      })));
      setFiles((current) => [...current, ...prepared]);
      setFileStatus('idle');
    } catch (uploadError) {
      setFileStatus('error');
      setFileError(uploadError instanceof Error ? uploadError.message : 'File could not be prepared for upload.');
    }
  };

  const removeFile = (localId: string) => {
    setFiles((current) => current.filter((file) => file.localId !== localId));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setStatus('saving');
    setError('');
    setRequestId('');
    setFileUploadWarning('');

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
          files: files.map(({ localId, ...file }) => file),
          ...getAttributionFields(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = Array.isArray(payload.errors) ? payload.errors.join(' ') : payload.error || 'Could not submit request.';
        throw new Error(message);
      }
      setRequestId(payload.request?.requestId || '');
      if (files.length > 0 && payload.delivery?.filesStored !== true) {
        setFileUploadWarning('Your request details were received, but the selected files were not attached. Please mention this when Operon Kitchens follows up.');
      }
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
            Use this page to request quote review, site measure discussion or project suitability guidance. Attach small quote, photo, plan or appliance-list files if they help explain the scope.
          </p>
          <div className="flexActions">
            <Link href="/quote" className="button ghost">Start estimate instead</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </div>
      </section>

      <section className="contentPage articleBody">
        <form id="request-review-form" className="quoteResult" onSubmit={submit}>
          <h2>Request details</h2>
          <p className="muted">
            Required: name, email, message, privacy acknowledgement and terms acknowledgement. Files are optional and should only be uploaded when you are authorised to share them.
          </p>
          <aside className="successPanel">
            <strong>What happens after you submit</strong>
            <ul className="lineItemList">
              {requestReviewNextSteps.map((step) => <li key={step}>{step}</li>)}
            </ul>
            <p className="muted">This is request intake only. Site measure and written scope confirmation are still required before commitment.</p>
          </aside>
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
            <h2>Optional attachments</h2>
            <p>Only upload quotes, plans, photos or appliance documents you are authorised to share. Files are stored for request review and do not replace site measure or written scope confirmation.</p>
            <div className="formGrid two">
              {requestFileCategories.map((category) => (
                <label key={category.value} className="uploadBox">
                  <span>{category.label}</span>
                  <input type="file" multiple accept={category.accept} onChange={(event) => addFiles(event.target.files, category.value)} />
                </label>
              ))}
            </div>
            <p className="muted">Limits: up to {requestReviewFileLimits.maxFiles} files, 4MB each, 10MB total. PDF and common image formats only. {selectedFileSummary}.</p>
            {fileStatus === 'reading' && <div className="successPanel">Preparing file for secure upload...</div>}
            {fileError && <div className="errorPanel">{fileError}</div>}
            {files.length > 0 && (
              <ul className="lineItemList">
                {files.map((file) => (
                  <li key={file.localId}>
                    <span>{file.name}</span>
                    <button type="button" className="textLink" onClick={() => removeFile(file.localId)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
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
              {fileUploadWarning && <p>{fileUploadWarning}</p>}
              <ul className="lineItemList">
                <li>Keep your quote, photos, plans and appliance list available for follow-up.</li>
                <li>Use the reference above if you send extra context later.</li>
              </ul>
            </div>
          )}
          {status === 'error' && <div className="errorPanel">{error}</div>}
          {!ready && status !== 'saved' && (
            <p className="muted">
              Complete the required contact details, add a message of at least 10 characters, and acknowledge the privacy and terms notices to submit.
            </p>
          )}
          <div className="wizardActions">
            <button className="button primary" type="submit" disabled={!ready || status === 'saving'}>
              {status === 'saving' ? 'Submitting...' : fileStatus === 'reading' ? 'Preparing files...' : 'Submit request'}
            </button>
            <Link href="/quote/review" className="button ghost">Add quote details</Link>
          </div>
        </form>

        <section className="contentCta">
          <h2>Prefer a structured path?</h2>
          <p>Use the estimate wizard for a planning range, or review an existing quote if you already have one.</p>
          <div className="flexActions">
            <Link href="/quote" className="button primary">Start kitchen estimate</Link>
            <Link href="/quote/review" className="button ghost">Review existing quote</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
