import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';
import {
  createDefaultReviewJobDetails,
  evaluateKitchenQuoteReview,
  KitchenQuoteReviewJobDetails,
  ReviewCheckKey,
  ReviewFileCategory,
  ReviewFileSummary,
  reviewChecks,
} from '@/lib/quoteReview';

const reviewValueCards = [
  ['Missing inclusions', 'Demolition, rubbish removal, delivery, final clean, painting and patching can change the real comparison.'],
  ['Allowance clarity', 'PC sums, provisional sums, appliance allowances and benchtop allowances should be clear before you compare totals.'],
  ['Trade scope', 'Plumbing, electrical, gas and relocation assumptions need licensed trade confirmation.'],
  ['Benchtop and splashback clarity', 'Material, cut-outs, joins, waterfalls and splashback inclusions should be visible in the scope.'],
  ['Apartment/strata risk', 'Lift access, parking, strata approval and class 2 screening can affect timing and review requirements.'],
  ['Contract/compliance prompts', 'Deposit guidance, HBC triggers and site measure requirements are flagged for professional confirmation.'],
  ['Quote confidence', 'The review separates what is clear, what is missing and what needs professional confirmation.'],
];

export default function QuoteReview() {
  const [checked, setChecked] = useState<Partial<Record<ReviewCheckKey, boolean>>>({});
  const [files, setFiles] = useState<ReviewFileSummary[]>([]);
  const [jobDetails, setJobDetails] = useState<KitchenQuoteReviewJobDetails>(createDefaultReviewJobDetails());
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [lookup, setLookup] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [storedQuotes, setStoredQuotes] = useState<any[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const result = useMemo(() => evaluateKitchenQuoteReview({ checkedItems: checked, files, jobDetails }), [checked, files, jobDetails]);
  const contactReady = Boolean(contactName.trim() && contactEmail.trim() && contactPhone.trim() && privacyAcknowledged);

  const updateJobDetails = (patch: Partial<KitchenQuoteReviewJobDetails>) => {
    setJobDetails((current) => ({ ...current, ...patch }));
  };

  const addFiles = (fileList: FileList | null, category: ReviewFileCategory) => {
    if (!fileList?.length) return;
    const nextFiles = Array.from(fileList).map((file) => ({
      id: `${category}-${file.name}-${Date.now()}`,
      name: file.name,
      category,
      size: file.size,
    }));
    setFiles((current) => [...current, ...nextFiles]);
  };

  const handleLookup = async () => {
    setLookupError('');
    setStoredQuotes([]);
    setIsLookingUp(true);
    try {
      const trimmed = lookup.trim();
      const query = trimmed.includes('@') ? `email=${encodeURIComponent(trimmed)}` : `id=${encodeURIComponent(trimmed)}`;
      const response = await fetch(`/api/quotes?${query}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not find stored quote.');
      setStoredQuotes(payload.quote ? [payload.quote] : payload.quotes ?? []);
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : 'Could not find stored quote.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const saveReviewLead = async () => {
    setLeadError('');
    setIsSubmittingLead(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          marketingOptIn,
          privacyAcknowledged,
          source: 'quote_review_structured_intake',
          reviewIntake: {
            jobDetails,
            checkedItems: checked,
            files,
            placeholderResult: result,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save review request.');
      setReviewSubmitted(true);
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : 'Could not save review request.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <main className="pageSurface">
      <Head>
        <title>Kitchen quote review | Operon Kitchens</title>
        <meta
          name="description"
          content="Upload an existing kitchen quote, photos or plans for structured review of inclusions, allowances, exclusions, compliance prompts and site measure requirements."
        />
      </Head>
      <section className="wizardShell">
        <div className="wizardHeader">
          <p className="eyebrow">Quote review</p>
          <h1>Review your kitchen quote</h1>
          <p className="muted">Understand what is included, what is provisional and what needs confirmation before relying on a kitchen quote.</p>
        </div>

        <div className="wizardPanel stepStack">
          <section className="quoteResult">
            <h2>What a quote review can uncover</h2>
            <p className="muted">
              Phase 1 captures structured review intake. You can upload files now or continue with the checklist if documents are not ready.
            </p>
            <div className="choiceGrid compact">
              {reviewValueCards.map(([title, body]) => (
                <article className="checkCard tall" key={title}>
                  <span><strong>{title}</strong><small>{body}</small></span>
                </article>
              ))}
            </div>
          </section>

          <section className="quoteResult">
            <h2>Detailed review checks</h2>
            <p className="muted">These are the specific items captured for professional review. This is not legal advice or automated document approval.</p>
            <div className="choiceGrid compact">
              {reviewChecks.map((check) => (
                <article className="checkCard tall" key={check.key}>
                  <span><strong>{check.label}</strong><small>{check.explanation}</small></span>
                </article>
              ))}
            </div>
          </section>

          <section className="quoteResult">
            <h2>Saved Operon estimate</h2>
            <p className="muted">Already started an Operon Kitchens estimate? Enter a quote ID or lead email.</p>
            <div className="formInline">
              <input value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="Quote ID or email" aria-label="Quote ID or email" />
              <button onClick={handleLookup} disabled={!lookup.trim() || isLookingUp} className="button primary">{isLookingUp ? 'Searching...' : 'Find quote'}</button>
            </div>
            {lookupError && <div className="errorPanel">{lookupError}</div>}
            {storedQuotes.length > 0 && (
              <div className="adminList">
                {storedQuotes.map((quote) => (
                  <article key={quote.id} className="adminListItem">
                    <div>
                      <p className="font-semibold">Quote {quote.id}</p>
                      <p className="text-sm text-gray-600">
                        ${quote.totals.estimateLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${quote.totals.estimateHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })} · {quote.totals.confidenceLabel ?? quote.totals.confidenceLevel} confidence
                      </p>
                    </div>
                    <Link href={`/quote/${quote.id}`} className="textLink">View or edit</Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="quoteResult">
            <h2>Upload quote, photos or plans</h2>
            <p className="muted">Upload what you have, or continue without a file and use the checklist below.</p>
            <div className="formGrid two">
              <label className="uploadBox"><span>Existing quote</span><input type="file" accept=".pdf,image/*" onChange={(event) => addFiles(event.target.files, 'existingQuote')} /></label>
              <label className="uploadBox"><span>Photos</span><input type="file" multiple accept="image/*" onChange={(event) => addFiles(event.target.files, 'photo')} /></label>
              <label className="uploadBox"><span>Plans</span><input type="file" multiple accept=".pdf,image/*" onChange={(event) => addFiles(event.target.files, 'plan')} /></label>
              <label className="uploadBox"><span>Other documents</span><input type="file" multiple accept=".pdf,image/*" onChange={(event) => addFiles(event.target.files, 'other')} /></label>
            </div>
            {files.length > 0 && (
              <ul className="lineItemList">
                {files.map((file) => <li key={file.id}><span>{file.name}</span><span>{file.category}</span></li>)}
              </ul>
            )}
          </section>

          <section className="quoteResult">
            <h2>Basic job details</h2>
            <div className="formGrid two">
              <label className="field">
                <span>Property type</span>
                <select value={jobDetails.propertyType} onChange={(event) => updateJobDetails({ propertyType: event.target.value as KitchenQuoteReviewJobDetails['propertyType'] })}>
                  <option value="unsure">Unsure</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="strataApartment">Strata apartment</option>
                </select>
              </label>
              <label className="field">
                <span>Project type</span>
                <select value={jobDetails.projectType} onChange={(event) => updateJobDetails({ projectType: event.target.value as KitchenQuoteReviewJobDetails['projectType'] })}>
                  <option value="unsure">Unsure</option>
                  <option value="fullRenovation">Full renovation</option>
                  <option value="cabinetryRefresh">Cabinetry refresh</option>
                  <option value="benchtopSplashback">Benchtop/splashback</option>
                </select>
              </label>
            </div>
            <div className="choiceGrid compact">
              <ReviewToggle label="Layout changes" checked={jobDetails.hasLayoutChange} onChange={(value) => updateJobDetails({ hasLayoutChange: value })} />
              <ReviewToggle label="Services relocated" checked={jobDetails.servicesRelocated} onChange={(value) => updateJobDetails({ servicesRelocated: value })} />
              <ReviewToggle label="Demolition included" checked={jobDetails.demolitionIncluded} onChange={(value) => updateJobDetails({ demolitionIncluded: value })} />
              <ReviewToggle label="Waste included" checked={jobDetails.wasteIncluded} onChange={(value) => updateJobDetails({ wasteIncluded: value })} />
              <ReviewToggle label="Strata/apartment risk" checked={jobDetails.strataOrApartment} onChange={(value) => updateJobDetails({ strataOrApartment: value })} />
              <ReviewToggle label="Appliances specified" checked={jobDetails.appliancesSpecified} onChange={(value) => updateJobDetails({ appliancesSpecified: value })} />
              <ReviewToggle label="Benchtop clear" checked={jobDetails.benchtopKnown} onChange={(value) => updateJobDetails({ benchtopKnown: value })} />
              <ReviewToggle label="Splashback clear" checked={jobDetails.splashbackKnown} onChange={(value) => updateJobDetails({ splashbackKnown: value })} />
            </div>
          </section>

          <section className="quoteResult">
            <h2>Quote clarity checklist</h2>
            <p className="muted">Tick only what the quote clearly states.</p>
            <div className="choiceGrid">
              {reviewChecks.map((check) => (
                <label key={check.key} className="checkCard">
                  <input type="checkbox" checked={Boolean(checked[check.key])} onChange={(event) => setChecked((current) => ({ ...current, [check.key]: event.target.checked }))} />
                  <span><strong>{check.label}</strong><small>{check.explanation}</small></span>
                </label>
              ))}
            </div>
          </section>

          <section className="quoteResult">
            <h2>Structured review preview</h2>
            <div className="resultTopline">
              <div>
                <span className="eyebrow">Review readiness</span>
                <strong>{result.status === 'reviewReady' ? 'Ready for review' : result.status === 'partial' ? 'Partly clear' : 'Needs more detail'}</strong>
              </div>
              <span className={`confidence ${result.confidenceScore >= 80 ? 'high' : result.confidenceScore >= 45 ? 'medium' : 'low'}`}>{result.confidenceScore}/100</span>
            </div>
            <p className="muted">{result.disclaimer}</p>
            <p><strong>Recommended next step:</strong> {result.recommendedNextStep}</p>
            {result.missingItems.length > 0 && (
              <details className="advancedPanel" open>
                <summary>Missing or unclear items</summary>
                <ul>{result.missingItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            )}
            <details className="advancedPanel" open>
              <summary>Manual review and compliance flags</summary>
              <ul className="warningList">
                {[...result.manualReviewFlags, ...result.complianceFlags].map((flag) => <li key={flag}>{flag}</li>)}
              </ul>
            </details>
          </section>

          <ReviewContactFields
            name={contactName}
            email={contactEmail}
            phone={contactPhone}
            privacyAcknowledged={privacyAcknowledged}
            marketingOptIn={marketingOptIn}
            onName={setContactName}
            onEmail={setContactEmail}
            onPhone={setContactPhone}
            onPrivacy={setPrivacyAcknowledged}
            onMarketing={setMarketingOptIn}
          />

          {leadError && <div className="errorPanel">{leadError}</div>}
          {reviewSubmitted && <div className="successPanel">Your structured quote review intake has been saved. We will follow up with next steps.</div>}
          <div className="wizardActions">
            <Link href="/quote" className="button ghost">Start estimate instead</Link>
            <button onClick={saveReviewLead} className="button primary" disabled={!contactReady || isSubmittingLead}>
              {isSubmittingLead ? 'Saving...' : 'Request quote review'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ReviewToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="checkCard">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

interface ReviewContactFieldsProps {
  name: string;
  email: string;
  phone: string;
  privacyAcknowledged: boolean;
  marketingOptIn: boolean;
  onName: (value: string) => void;
  onEmail: (value: string) => void;
  onPhone: (value: string) => void;
  onPrivacy: (value: boolean) => void;
  onMarketing: (value: boolean) => void;
}

function ReviewContactFields({
  name,
  email,
  phone,
  privacyAcknowledged,
  marketingOptIn,
  onName,
  onEmail,
  onPhone,
  onPrivacy,
  onMarketing,
}: ReviewContactFieldsProps) {
  return (
    <section className="quoteResult">
      <h2>Contact details</h2>
      <div className="formGrid">
        <label className="field"><span>Name</span><input value={name} onChange={(event) => onName(event.target.value)} required aria-invalid={!name.trim()} /></label>
        <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => onEmail(event.target.value)} required aria-invalid={!email.trim()} /></label>
        <label className="field"><span>Phone</span><input type="tel" value={phone} onChange={(event) => onPhone(event.target.value)} required aria-invalid={!phone.trim()} /></label>
      </div>
      <PrivacyCollectionNotice
        context="review"
        acknowledged={privacyAcknowledged}
        marketingOptIn={marketingOptIn}
        onAcknowledgedChange={onPrivacy}
        onMarketingChange={onMarketing}
      />
    </section>
  );
}
