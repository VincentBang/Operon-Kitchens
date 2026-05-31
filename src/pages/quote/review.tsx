import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';
import { trackKitchenEvent } from '@/lib/analytics';
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
  ['Contract and risk prompts', 'Deposit guidance, HBC review triggers and site measure requirements are flagged for professional confirmation.'],
  ['Quote confidence', 'The review separates what is clear, what is missing and what needs professional confirmation.'],
];

const sampleReviewResult = [
  ['Scope clarity', 'Cabinetry and benchtop included, but delivery and final clean need confirmation.'],
  ['Allowance risk', 'Appliance PC allowance and provisional electrical items need clearer wording.'],
  ['Missing items', 'Rubbish removal, wall patching and splashback cut-outs should be checked.'],
  ['Recommended next step', 'Request revised written scope before comparing totals.'],
];

function readinessLabel(status: 'notReady' | 'partial' | 'reviewReady') {
  if (status === 'reviewReady') return 'Strong review ready';
  if (status === 'partial') return 'Basic review ready';
  return 'Needs more detail';
}

export default function QuoteReview() {
  const [checked, setChecked] = useState<Partial<Record<ReviewCheckKey, boolean>>>({});
  const [files, setFiles] = useState<ReviewFileSummary[]>([]);
  const [jobDetails, setJobDetails] = useState<KitchenQuoteReviewJobDetails>(createDefaultReviewJobDetails());
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [lookup, setLookup] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [termsAcknowledged, setTermsAcknowledged] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const result = useMemo(() => evaluateKitchenQuoteReview({ checkedItems: checked, files, jobDetails }), [checked, files, jobDetails]);
  const contactReady = Boolean(contactName.trim() && contactEmail.trim() && privacyAcknowledged && termsAcknowledged);

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
    trackKitchenEvent('file_upload_added', { file_category: category, route: '/quote/review' });
  };

  const handleLookup = () => {
    setLookupError('');
    setLookupError('Saved estimate lookup is not active on the public static launch. Include your quote ID or email in the request notes and continue with the review intake below.');
  };

  const saveReviewLead = async () => {
    setLeadError('');
    setIsSubmittingLead(true);
    try {
      const response = await fetch('/.netlify/functions/kitchen-request-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          suburb: '',
          propertyType: mapReviewPropertyType(jobDetails.propertyType),
          projectStage: 'quoteInHand',
          hasCurrentQuote: files.some((file) => file.category === 'existingQuote') ? 'yes' : 'notSure',
          hasPhotosPlans: files.some((file) => file.category === 'photo' || file.category === 'plan') ? 'yes' : 'notSure',
          approximateBudgetRange: '',
          preferredNextStep: 'quoteReview',
          message: buildReviewRequestMessage(result, jobDetails, checked, files, lookup),
          marketingOptIn,
          privacyAcknowledged,
          termsAcknowledged,
          sourceRoute: '/quote/review',
          ...getReviewAttributionFields(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const message = Array.isArray(payload.errors) ? payload.errors.join(' ') : payload.error || 'Could not save review request.';
        throw new Error(message);
      }
      trackKitchenEvent('quote_review_submit', {
        readiness_label: readinessLabel(result.status),
        file_count: files.length,
      });
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
          <p className="muted">Understand what is included, what is provisional and what may require confirmation before relying on a kitchen quote.</p>
          <p className="heroLead reviewLead">Already received a kitchen quote? Don’t compare totals until the scope is clear.</p>
          <div className="flexActions">
            <Link href="/quote-review-service" className="button primary">How quote review works</Link>
            <Link href="/site-measure" className="button ghost">Prepare for site measure</Link>
          </div>
        </div>

        <div className="wizardPanel stepStack">
          <section className="quoteResult">
            <h2>What a quote review can uncover</h2>
            <p className="muted">
              Upload your quote or answer the checklist. Operon Kitchens identifies unclear inclusions, allowances, exclusions and review items before you rely on the total. This is general guidance only, not legal advice, approval or certification.
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
            <h2>Questions worth answering first</h2>
            <div className="choiceGrid compact">
              {(result.customerQuestions.length ? result.customerQuestions : [
                'Is demolition included?',
                'Are appliances included or PC sums?',
                'Is electrical relocation included?',
                'Is splashback included?',
                'Is rubbish removal included?',
                'Are deposit/HBC items clear?',
              ]).slice(0, 8).map((question) => (
                <article className="checkCard tall" key={question}>
                  <span><strong>{question}</strong><small>Clear written answers make quote totals easier to compare.</small></span>
                </article>
              ))}
            </div>
          </section>

          <section className="quoteResult">
            <h2>Sample review result</h2>
            <p className="muted">A review should turn a quote into clear decisions, not just another total.</p>
            <div className="reportPreviewGrid compact">
              {sampleReviewResult.map(([title, body]) => (
                <article className="infoCard" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <Link href="/quote-review-service" className="textLink">See the review service pathway</Link>
          </section>

          <section className="quoteResult">
            <h2>Saved Operon estimate</h2>
            <p className="muted">Already started an Operon Kitchens estimate? Add your quote ID or lead email here, then continue with the review intake below. Public lookup is deferred until the next backend phase.</p>
            <div className="formInline">
              <input value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="Quote ID or email" aria-label="Quote ID or email" />
              <button onClick={handleLookup} disabled={!lookup.trim() || isLookingUp} className="button primary" type="button">{isLookingUp ? 'Checking...' : 'Add to review notes'}</button>
            </div>
            {lookupError && <div className="errorPanel">{lookupError}</div>}
          </section>

          <section className="quoteResult">
            <h2>Quote, photo or plan context</h2>
            <p className="muted">
              Add file names locally to improve the review preview, or continue without a file and use the checklist below. Secure file storage is not enabled yet; the request sends text, checklist and project details only. Only prepare documents you are authorised to share.
            </p>
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
                <strong>{readinessLabel(result.status)}</strong>
              </div>
              <span className={`confidence ${result.confidenceScore >= 80 ? 'high' : result.confidenceScore >= 45 ? 'medium' : 'low'}`}>Completeness score {result.confidenceScore}/100</span>
            </div>
            <p className="muted">{result.disclaimer}</p>
            <div className="summaryMetricGrid">
              <article>
                <span>Scope clarity</span>
                <strong>{result.reviewScores.scopeClarity}/100</strong>
                <p>How clearly the quote describes included work.</p>
              </article>
              <article>
                <span>Allowance risk</span>
                <strong>{result.reviewScores.allowanceRisk}/100</strong>
                <p>Higher means more allowance wording needs review.</p>
              </article>
              <article>
                <span>Missing information</span>
                <strong>{result.reviewScores.missingInformation}/100</strong>
                <p>Checklist items still unclear or missing.</p>
              </article>
              <article>
                <span>Review readiness</span>
                <strong>{result.reviewScores.reviewReadiness}/100</strong>
                <p>Document and checklist completeness.</p>
              </article>
            </div>
            <p><strong>Recommended next step:</strong> {result.recommendedNextStep}</p>
            {result.missingItems.length > 0 && (
              <details className="advancedPanel" open>
                <summary>Missing or unclear items</summary>
                <ul>{result.unclearItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            )}
            <details className="advancedPanel" open>
              <summary>Manual review and compliance flags</summary>
              <ul className="warningList">
                {[...result.manualReviewFlags, ...result.compliancePrompts].map((flag) => <li key={flag}>{flag}</li>)}
              </ul>
            </details>
          </section>

          <ReviewContactFields
            name={contactName}
            email={contactEmail}
            phone={contactPhone}
            privacyAcknowledged={privacyAcknowledged}
            termsAcknowledged={termsAcknowledged}
            marketingOptIn={marketingOptIn}
            onName={setContactName}
            onEmail={setContactEmail}
            onPhone={setContactPhone}
            onPrivacy={setPrivacyAcknowledged}
            onTerms={setTermsAcknowledged}
            onMarketing={setMarketingOptIn}
          />

          {leadError && <div className="errorPanel">{leadError}</div>}
          {reviewSubmitted && <div className="successPanel">Your quote review request has been saved. We will follow up with next steps.</div>}
          <div className="wizardActions">
            <Link href="/quote" className="button ghost">Start estimate instead</Link>
            <Link href="/request-review" className="button ghost">Ask about site measure</Link>
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

function mapReviewPropertyType(propertyType: KitchenQuoteReviewJobDetails['propertyType']) {
  if (propertyType === 'house') return 'house';
  if (propertyType === 'townhouse') return 'townhouse';
  if (propertyType === 'strataApartment') return 'strataApartment';
  return 'notSure';
}

function getReviewAttributionFields() {
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

function buildReviewRequestMessage(
  result: ReturnType<typeof evaluateKitchenQuoteReview>,
  jobDetails: KitchenQuoteReviewJobDetails,
  checked: Partial<Record<ReviewCheckKey, boolean>>,
  files: ReviewFileSummary[],
  savedEstimateReference: string,
) {
  const checkedLabels = reviewChecks
    .filter((check) => checked[check.key])
    .map((check) => check.label)
    .slice(0, 8);
  const fileSummary = files.length
    ? files.map((file) => `${file.category}: ${file.name}`).slice(0, 8).join('; ')
    : 'No files selected in the browser preview.';

  return [
    'Quote review request submitted from /quote/review.',
    `Review readiness: ${readinessLabel(result.status)} (${result.confidenceScore}/100 completeness).`,
    `Property type: ${jobDetails.propertyType}. Project type: ${jobDetails.projectType}.`,
    `Saved estimate reference: ${savedEstimateReference.trim() || 'not supplied'}.`,
    `Selected local file context: ${fileSummary}`,
    `Clearly stated checklist items: ${checkedLabels.length ? checkedLabels.join(', ') : 'none selected yet'}.`,
    `Missing or unclear items: ${result.unclearItems.slice(0, 8).join(', ') || 'none flagged'}.`,
    `Customer questions: ${result.customerQuestions.slice(0, 5).join(' | ') || 'none generated'}.`,
    `Recommended next step: ${result.recommendedNextStep}`,
    'Files are not uploaded through this submit action yet. Site measure and written scope confirmation are still required before commitment.',
  ].join('\n');
}

interface ReviewContactFieldsProps {
  name: string;
  email: string;
  phone: string;
  privacyAcknowledged: boolean;
  termsAcknowledged: boolean;
  marketingOptIn: boolean;
  onName: (value: string) => void;
  onEmail: (value: string) => void;
  onPhone: (value: string) => void;
  onPrivacy: (value: boolean) => void;
  onTerms: (value: boolean) => void;
  onMarketing: (value: boolean) => void;
}

function ReviewContactFields({
  name,
  email,
  phone,
  privacyAcknowledged,
  termsAcknowledged,
  marketingOptIn,
  onName,
  onEmail,
  onPhone,
  onPrivacy,
  onTerms,
  onMarketing,
}: ReviewContactFieldsProps) {
  return (
    <section className="quoteResult">
      <h2>Contact details</h2>
      <div className="formGrid">
        <label className="field"><span>Name</span><input value={name} onChange={(event) => onName(event.target.value)} required aria-invalid={!name.trim()} /></label>
        <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => onEmail(event.target.value)} required aria-invalid={!email.trim()} /></label>
        <label className="field"><span>Phone optional</span><input type="tel" value={phone} onChange={(event) => onPhone(event.target.value)} /></label>
      </div>
      <PrivacyCollectionNotice
        context="review"
        acknowledged={privacyAcknowledged}
        marketingOptIn={marketingOptIn}
        onAcknowledgedChange={onPrivacy}
        onMarketingChange={onMarketing}
      />
      <label className="privacyNotice mt-2 flex items-start gap-2">
        <input
          type="checkbox"
          checked={termsAcknowledged}
          onChange={(event) => onTerms(event.target.checked)}
        />
        <span>I acknowledge the <Link href="/terms" className="textLink">Terms of Use</Link>, including that this review request is planning guidance only and not a final quote.</span>
      </label>
    </section>
  );
}
