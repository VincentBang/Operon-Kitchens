import Link from 'next/link';
import { useEffect, useState } from 'react';
import { summarizeDesignPlan } from '@/lib/designPlan';
import { calculatePricing, PricingResult, QuoteInput, RateCard } from '@/lib/pricing';
import { createKitchenRecommendations } from '@/lib/recommendations';
import { WizardContact } from '@/components/steps/ContactPrivacyStep';
import { scoreKitchenLead } from '@/lib/leadScoring';
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
  const quoteResult: PricingResult = calculatePricing(data, rateCard);
  const recommendations = createKitchenRecommendations(data, quoteResult);
  const leadScore = scoreKitchenLead(data, quoteResult);
  const [submitted, setSubmitted] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState(quoteId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    trackKitchenEvent('estimate_summary_view', {
      confidence_label: quoteResult.confidenceLabel,
      manual_review_count: quoteResult.manualReviewFlags.length,
    });
    trackKitchenEvent('lead_score_generated', {
      lead_quality: quoteResult.leadQuality,
      confidence_label: quoteResult.confidenceLabel,
      review_risk_label: quoteResult.reviewRiskLabel,
    });
  }, [quoteResult.confidenceLabel, quoteResult.leadQuality, quoteResult.manualReviewFlags.length, quoteResult.reviewRiskLabel]);

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
            <strong>${quoteResult.estimateLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${quoteResult.estimateHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
          <span className={`confidence ${quoteResult.confidenceLabel}`}>{quoteResult.confidenceLabel} confidence · {quoteResult.confidenceScore}/100</span>
        </div>
        <p className="muted">This is a planning estimate report, subject to site measure, confirmed selections and written scope confirmation.</p>
        <div className="summaryMetricGrid">
          <article>
            <span>Information completeness</span>
            <strong>{quoteResult.confidenceScore}/100</strong>
            <p>{quoteResult.confidenceLabel} confidence</p>
          </article>
          <article>
            <span>Review risk</span>
            <strong>{quoteResult.reviewRiskLabel} · {quoteResult.reviewRiskScore}/100</strong>
            <p>Complexity and manual review need</p>
          </article>
          <article>
            <span>Lead priority</span>
            <strong>{leadScore.label}</strong>
            <p>{leadScore.recommendedFollowUp}</p>
          </article>
        </div>
        <div className="guideSummary">
          <article>
            <h3>What improved confidence</h3>
            <ul>{(quoteResult.confidenceReasonsPositive.length ? quoteResult.confidenceReasonsPositive : ['Add measurements, photos and selection direction to improve confidence.']).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h3>What reduced confidence</h3>
            <ul>{(quoteResult.confidenceReasonsNegative.length ? quoteResult.confidenceReasonsNegative : ['No major completeness gaps were identified from the supplied information.']).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <h3>Review risk reasons</h3>
            <ul>{quoteResult.riskReasons.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        <h3>Included scope</h3>
        <ul className="lineItemList">
          {quoteResult.includedScope.map((item) => <li key={item}><span>{item}</span><span>Included</span></li>)}
        </ul>
        <div className="compliancePanel">
          <h3>Recommended next step</h3>
          <p>{quoteResult.recommendedNextStep}</p>
        </div>
        <div className="compliancePanel">
          <h3>Deposit and HBC guidance</h3>
          <p>Recommended maximum deposit: <strong>${quoteResult.recommendedDeposit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> ({quoteResult.recommendedDepositPercent}%).</p>
          {quoteResult.depositWarning && <p className="warningText">{quoteResult.depositWarning}</p>}
          {quoteResult.hbcWarning && <p className="warningText">{quoteResult.hbcWarning}</p>}
        </div>
        {data.designPlan && <div className="compliancePanel"><h3>Design plan</h3><p>{summarizeDesignPlan(data.designPlan)}</p></div>}
        {data.supportingFiles.length > 0 && (
          <div className="compliancePanel">
            <h3>Files for review</h3>
            <ul>{data.supportingFiles.map((file) => <li key={file.id}>{file.name} ({file.category})</li>)}</ul>
          </div>
        )}
        {recommendations.length > 0 && (
          <details className="advancedPanel" open>
            <summary>Recommended actions</summary>
            <ul>{recommendations.slice(0, 4).map((item) => <li key={item.id}>{item.title}: {item.action}</li>)}</ul>
          </details>
        )}
        <details className="advancedPanel" open>
          <summary>Assumptions</summary>
          <ul>{quoteResult.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <details className="advancedPanel">
          <summary>Exclusions</summary>
          <ul>{quoteResult.exclusions.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <details className="advancedPanel" open>
          <summary>Manual review flags</summary>
          <ul className="warningList">
            {(quoteResult.manualReviewFlags.length ? quoteResult.manualReviewFlags : ['No major manual review flags beyond normal site measure.']).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </details>
        <details className="advancedPanel" open>
          <summary>Compliance prompts</summary>
          <ul className="warningList">
            {quoteResult.complianceFlags.map((item) => <li key={item}>{item}</li>)}
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
