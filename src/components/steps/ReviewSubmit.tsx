import React, { useState } from 'react';
import Link from 'next/link';
import { QuoteInput, calculatePricing, PricingResult, RateCard } from '@/lib/pricing';
import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';
import { summarizeDesignPlan } from '@/lib/designPlan';
import { createKitchenRecommendations } from '@/lib/recommendations';

interface Props {
  data: QuoteInput;
  rateCard?: RateCard;
  quoteId?: string;
  initialContact?: {
    name: string;
    email: string;
    phone: string;
    marketingOptIn: boolean;
  };
  onBack: () => void;
  onSaved?: (quoteId: string) => void;
}

const ReviewSubmit: React.FC<Props> = ({ data, rateCard, quoteId, initialContact, onBack, onSaved }) => {
  const quoteResult: PricingResult = calculatePricing(data, rateCard);
  const recommendations = createKitchenRecommendations(data, quoteResult);
  const [name, setName] = useState(initialContact?.name ?? '');
  const [email, setEmail] = useState(initialContact?.email ?? '');
  const [phone, setPhone] = useState(initialContact?.phone ?? '');
  const [marketingOptIn, setMarketingOptIn] = useState(Boolean(initialContact?.marketingOptIn));
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState(quoteId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const contactMissing = {
    name: !name.trim(),
    email: !email.trim(),
    phone: !phone.trim(),
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/quotes', {
        method: savedQuoteId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: savedQuoteId || undefined,
          quoteInput: data,
          contact: { name, email, phone, marketingOptIn, privacyAcknowledged },
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
        <h2>Review your estimate</h2>
        <p>Check the estimate range logic, confidence items and collection notice before submitting for follow-up.</p>
      </div>
      <div className="quoteResult">
        <div className="resultTopline">
          <div>
            <span className="eyebrow">Planning estimate range</span>
            <strong>
              ${quoteResult.estimateLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${quoteResult.estimateHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </strong>
          </div>
          <span className={`confidence ${quoteResult.confidenceLabel}`}>{quoteResult.confidenceLabel} confidence</span>
        </div>
        <p className="muted">This is a planning estimate, subject to site measure, confirmed selections and written scope confirmation.</p>
        <h3>Included scope</h3>
        <ul className="lineItemList">
          {quoteResult.includedScope.map((item) => (
            <li key={item}>
              <span>{item}</span>
              <span>Included</span>
            </li>
          ))}
        </ul>
        <p className="muted">Recommended next step: {quoteResult.recommendedNextStep}</p>
        <div className="compliancePanel">
          <h3>NSW deposit and HBC guidance</h3>
          <div className="totalRow">
            <span>Recommended maximum deposit ({quoteResult.recommendedDepositPercent}%)</span>
            <strong>${quoteResult.recommendedDeposit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
          {quoteResult.depositWarning && <p className="warningText">{quoteResult.depositWarning}</p>}
          {quoteResult.hbcRequired ? (
            <p className={quoteResult.hbcWarning ? 'warningText' : 'successText'}>
              {quoteResult.hbcWarning || 'HBC insurance is flagged as required for this estimate and has been marked as included and confirmed.'}
            </p>
          ) : (
            <p className="muted">HBC insurance is not automatically triggered by this estimate because it is under $20,000 including GST.</p>
          )}
        </div>
        <div className="compliancePanel">
          <h3>Material compliance</h3>
          {quoteResult.materialCompliance.summary.map((item) => (
            <p key={item}>{item}</p>
          ))}
          {(quoteResult.materialCompliance.benchtop.status === 'banned' || quoteResult.materialCompliance.splashback.status === 'banned') && (
            <p className="warningText">
              Engineered stone containing more than 1% crystalline silica is restricted for new work. Suggested alternatives include porcelain, stainless steel, timber, laminate and supplier-confirmed low-silica composites.
            </p>
          )}
          {quoteResult.materialCompliance.transitionProvisionApplies && (
            <p className="warningText">Transition provision has been claimed and requires manual documentation review before any quote can proceed.</p>
          )}
        </div>
        <div className="reviewAccordions">
          {recommendations.length > 0 && (
            <div className="compliancePanel">
              <h3>Recommended next steps</h3>
              <ul className="lineItemList">
                {recommendations.slice(0, 4).map((recommendation) => (
                  <li key={recommendation.id}>
                    <span>
                      <strong>{recommendation.title}</strong>
                      <br />
                      <small>{recommendation.action}</small>
                    </span>
                    <span className={`confidence ${recommendation.priority}`}>{recommendation.priority}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="compliancePanel">
            <h3>Design plan</h3>
            {data.designPlan ? (
              <>
                <p>{summarizeDesignPlan(data.designPlan)}</p>
                {data.designPlan.previewImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="designAttachmentPreview" src={data.designPlan.previewImage} alt="Saved kitchen design plan preview" />
                )}
              </>
            ) : (
              <p className="muted">No design plan is attached yet. <Link href="/design" className="textLink">Open the design planner</Link> to sketch the room and save it to this estimate.</p>
            )}
          </div>
          <p>Confidence level: <strong className="capitalize">{quoteResult.confidenceLabel}</strong> ({quoteResult.confidenceScore}/100)</p>
          {quoteResult.manualReviewFlags.length > 0 && (
            <ul className="warningList">
              {quoteResult.manualReviewFlags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
          {quoteResult.complianceFlags.length > 0 && (
            <details className="advancedPanel" open>
              <summary>Compliance review flags</summary>
              <ul className="warningList">
                {quoteResult.complianceFlags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            </details>
          )}
          {quoteResult.assumptions.length > 0 && (
            <details className="advancedPanel" open>
              <summary>Assumptions</summary>
              <ul>
                {quoteResult.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </details>
          )}
          {quoteResult.exclusions.length > 0 && (
            <details className="advancedPanel">
              <summary>Exclusions</summary>
              <ul>
                {quoteResult.exclusions.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
      {submitted ? (
        <div className="successPanel">
          <p>Thank you {name}, your estimate has been saved. We will contact you shortly.</p>
          <p>Quote ID: <strong>{savedQuoteId}</strong></p>
          <p>
            Return/edit link: <a className="textLink" href={`/quote/${savedQuoteId}`}>{`/quote/${savedQuoteId}`}</a>
          </p>
          <p>Sign in with {email} to view this quote later from your customer account.</p>
        </div>
      ) : (
        <div className="quoteResult">
          <h3>Your details</h3>
          <div className="formGrid">
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-invalid={contactMissing.name}
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={contactMissing.email}
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              aria-invalid={contactMissing.phone}
            />
          </label>
          </div>
          <PrivacyCollectionNotice
            acknowledged={privacyAcknowledged}
            marketingOptIn={marketingOptIn}
            onAcknowledgedChange={setPrivacyAcknowledged}
            onMarketingChange={setMarketingOptIn}
          />
          {submitError && <div className="errorPanel">{submitError}</div>}
          <div className="wizardActions">
            <button
              className="button ghost"
              onClick={onBack}
            >
              Back
            </button>
            <button
              className="button primary"
              onClick={handleSubmit}
              disabled={!name || !email || !phone || !privacyAcknowledged || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : savedQuoteId ? 'Update estimate' : 'Submit estimate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmit;
