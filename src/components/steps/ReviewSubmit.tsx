import React, { useState } from 'react';
import Link from 'next/link';
import { QuoteInput, RateCard } from '@/lib/pricing';
import PrivacyCollectionNotice from '@/components/PrivacyCollectionNotice';
import { summarizeDesignPlan } from '@/lib/designPlan';
import { createCustomerQuoteSummary } from '@/lib/quotePresentation';

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
  const quoteSummary = createCustomerQuoteSummary(data, rateCard);
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
              ${quoteSummary.estimateLow.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${quoteSummary.estimateHigh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </strong>
          </div>
          <span className={`confidence ${quoteSummary.confidenceLabel}`}>{quoteSummary.confidenceLabel} confidence</span>
        </div>
        <p className="muted">This is a planning estimate, subject to site measure, confirmed selections and written scope confirmation.</p>
        <h3>Included scope</h3>
        <ul className="lineItemList">
          {quoteSummary.includedScope.map((item) => (
            <li key={item}>
              <span>{item}</span>
              <span>Included</span>
            </li>
          ))}
        </ul>
        <p className="muted">Recommended next step: {quoteSummary.recommendedNextStep}</p>
        <div className="compliancePanel">
          <h3>NSW deposit and HBC guidance</h3>
          <p>Use 10% maximum deposit guidance. HBC, licensed trades, material restrictions and written contract thresholds may require review before contract decisions.</p>
        </div>
        <div className="reviewAccordions">
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
          <p>Confidence level: <strong className="capitalize">{quoteSummary.confidenceLabel}</strong> ({quoteSummary.confidenceScore}/100)</p>
          {quoteSummary.manualReviewFlags.length > 0 && (
            <ul className="warningList">
              {quoteSummary.manualReviewFlags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
          {quoteSummary.compliancePrompts.length > 0 && (
            <details className="advancedPanel" open>
              <summary>Compliance review flags</summary>
              <ul className="warningList">
                {quoteSummary.compliancePrompts.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            </details>
          )}
          {quoteSummary.assumptions.length > 0 && (
            <details className="advancedPanel" open>
              <summary>Assumptions</summary>
              <ul>
                {quoteSummary.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </details>
          )}
          {quoteSummary.exclusions.length > 0 && (
            <details className="advancedPanel">
              <summary>Exclusions</summary>
              <ul>
                {quoteSummary.exclusions.map((e) => (
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
          <p>Use the return link above if you need to revisit the estimate later.</p>
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
