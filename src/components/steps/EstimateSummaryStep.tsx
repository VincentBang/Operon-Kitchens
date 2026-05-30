import Link from 'next/link';
import { useEffect, useState } from 'react';
import { summarizeDesignPlan } from '@/lib/designPlan';
import { QuoteInput, RateCard } from '@/lib/pricing';
import { createCustomerQuoteSummary } from '@/lib/quotePresentation';
import { WizardContact } from '@/components/steps/ContactPrivacyStep';
import { trackKitchenEvent } from '@/lib/analytics';

interface Props {
  data: QuoteInput;
  contact: WizardContact;
  rateCard?: RateCard;
  quoteId?: string;
  onBack: () => void;
  onSaved?: (quoteId: string) => void;
}

export default function EstimateSummaryStep({ data, contact, rateCard, quoteId, onBack, onSaved }: Props) {
  const quoteSummary = createCustomerQuoteSummary(data, rateCard);
  const [submitted, setSubmitted] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState(quoteId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    trackKitchenEvent('estimate_summary_view', {
      confidence_label: quoteSummary.confidenceLabel,
      manual_review_count: quoteSummary.manualReviewFlags.length,
      review_risk_label: quoteSummary.reviewRiskLabel,
    });
  }, [quoteSummary.confidenceLabel, quoteSummary.manualReviewFlags.length, quoteSummary.reviewRiskLabel]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/quotes', {
        method: savedQuoteId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: savedQuoteId || undefined,
          quoteInput: {
            ...data,
            preferredContactMethod: contact.preferredContactMethod ?? data.preferredContactMethod,
            addressOptional: contact.addressOptional ?? data.addressOptional,
          },
          contact,
          status: 'SUBMITTED',
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save quote.');
      setSavedQuoteId(payload.quote.id);
      onSaved?.(payload.quote.id);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save quote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Estimate summary</h2>
        <p>Review the planning range, confidence, assumptions, exclusions and review flags before requesting professional follow-up.</p>
      </div>
      <div className="quoteResult">
        <div className="resultTopline">
          <div>
            <span className="eyebrow">Planning budget range</span>
            <strong>${quoteSummary.estimateLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${quoteSummary.estimateHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
          <span className={`confidence ${quoteSummary.confidenceLabel}`}>{quoteSummary.confidenceLabel} confidence · {quoteSummary.confidenceScore}/100</span>
        </div>
        <p className="muted">This is a planning estimate report, subject to site measure, confirmed selections and written scope confirmation.</p>
        <div className="summaryMetricGrid">
          <article>
            <span>Information completeness</span>
            <strong>{quoteSummary.confidenceScore}/100</strong>
            <p>{quoteSummary.confidenceLabel} confidence</p>
          </article>
          <article>
            <span>Review risk</span>
            <strong>{quoteSummary.reviewRiskLabel} · {quoteSummary.reviewRiskScore}/100</strong>
            <p>Complexity and manual review need</p>
          </article>
          <article>
            <span>Next action</span>
            <strong>Professional review</strong>
            <p>Use this report to prepare site measure and written scope confirmation.</p>
          </article>
        </div>
        <div className="guideSummary">
          <article>
            <h3>What improved confidence</h3>
            <ul>{(quoteSummary.confidenceReasonsPositive.length ? quoteSummary.confidenceReasonsPositive : ['Add measurements, photos and selection direction to improve confidence.']).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h3>What reduced confidence</h3>
            <ul>{(quoteSummary.confidenceReasonsNegative.length ? quoteSummary.confidenceReasonsNegative : ['No major completeness gaps were identified from the supplied information.']).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h3>Review risk reasons</h3>
            <ul>{quoteSummary.riskReasons.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        <h3>Included scope</h3>
        <ul className="lineItemList">
          {quoteSummary.includedScope.map((item) => <li key={item}><span>{item}</span><span>Included</span></li>)}
        </ul>
        <div className="compliancePanel">
          <h3>Recommended next step</h3>
          <p>{quoteSummary.recommendedNextStep}</p>
          <div className="flexActions">
            <Link href="/request-review" className="button primary">Request professional review</Link>
            <Link href="/site-measure" className="button ghost">Understand site measure</Link>
          </div>
        </div>
        <div className="compliancePanel">
          <h3>Deposit and HBC guidance</h3>
          <p>Recommended maximum deposit guidance is 10% for NSW home building contracts. HBC and contract thresholds must be reviewed against the final written scope before money is taken or work starts.</p>
        </div>
        {data.designPlan && <div className="compliancePanel"><h3>Design plan</h3><p>{summarizeDesignPlan(data.designPlan)}</p></div>}
        {data.supportingFiles.length > 0 && (
          <div className="compliancePanel">
            <h3>Files for review</h3>
            <ul>{data.supportingFiles.map((file) => <li key={file.id}>{file.name} ({file.category})</li>)}</ul>
          </div>
        )}
        <details className="advancedPanel" open>
          <summary>Assumptions</summary>
          <ul>{quoteSummary.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <details className="advancedPanel">
          <summary>Exclusions</summary>
          <ul>{quoteSummary.exclusions.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <details className="advancedPanel" open>
          <summary>Manual review flags</summary>
          <ul className="warningList">
            {(quoteSummary.manualReviewFlags.length ? quoteSummary.manualReviewFlags : ['No major manual review flags beyond normal site measure.']).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </details>
        <details className="advancedPanel" open>
          <summary>Compliance prompts</summary>
          <ul className="warningList">
            {quoteSummary.compliancePrompts.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </details>
      </div>
      {submitted ? (
        <div className="successPanel">
          <p>Thank you {contact.name}, your estimate has been saved for professional review.</p>
          <p>Quote ID: <strong>{savedQuoteId}</strong></p>
          <p>Return/edit link: <Link className="textLink" href={`/quote/${savedQuoteId}`}>{`/quote/${savedQuoteId}`}</Link></p>
        </div>
      ) : (
        <>
          {submitError && <div className="errorPanel">{submitError}</div>}
          <div className="wizardActions">
            <button className="button ghost" onClick={onBack}>Back</button>
            <button className="button primary" onClick={handleSubmit} disabled={isSubmitting || !contact.privacyAcknowledged}>
              {isSubmitting ? 'Saving...' : savedQuoteId ? 'Update estimate' : 'Request professional review'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
