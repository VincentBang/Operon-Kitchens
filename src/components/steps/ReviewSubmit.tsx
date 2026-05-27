import React, { useState } from 'react';
import { QuoteInput, calculatePricing, PricingResult } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
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

const ReviewSubmit: React.FC<Props> = ({ data, quoteId, initialContact, onBack, onSaved }) => {
  const quoteResult: PricingResult = calculatePricing(data);
  const [name, setName] = useState(initialContact?.name ?? '');
  const [email, setEmail] = useState(initialContact?.email ?? '');
  const [phone, setPhone] = useState(initialContact?.phone ?? '');
  const [marketingOptIn, setMarketingOptIn] = useState(Boolean(initialContact?.marketingOptIn));
  const [submitted, setSubmitted] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState(quoteId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
          contact: { name, email, phone, marketingOptIn },
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review your estimate</h2>
      <div className="quoteResult">
        <div className="resultTopline">
          <div>
            <span className="eyebrow">Starting estimate</span>
            <strong>${quoteResult.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
          <span className={`confidence ${quoteResult.confidenceLevel}`}>{quoteResult.confidenceLevel} confidence</span>
        </div>
        <h3 className="font-semibold mb-2">Line items</h3>
        <ul className="space-y-1">
          {quoteResult.lineItems.map((item) => (
            <li key={item.name} className="flex justify-between">
              <span>{item.name}</span>
              <span>${item.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between font-semibold">
          <span>Margin</span>
          <span>${quoteResult.margin.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Contingency</span>
          <span>${quoteResult.contingency.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="mt-2 flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>${quoteResult.subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>GST (10%)</span>
          <span>${quoteResult.gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total inc GST</span>
          <span>${quoteResult.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="mt-2">
          <p>Confidence level: <strong className="capitalize">{quoteResult.confidenceLevel}</strong> ({quoteResult.confidenceScore}/100)</p>
          {quoteResult.flags.length > 0 && (
            <ul className="list-disc list-inside text-red-700">
              {quoteResult.flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
          {quoteResult.assumptions.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold">Assumptions</h4>
              <ul className="list-disc list-inside text-gray-700">
                {quoteResult.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {quoteResult.exclusions.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold">Exclusions</h4>
              <ul className="list-disc list-inside text-gray-700">
                {quoteResult.exclusions.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {submitted ? (
        <div className="p-4 bg-green-100 border rounded">
          <p>Thank you {name}, your estimate has been saved. We will contact you shortly.</p>
          <p className="mt-2">Quote ID: <strong>{savedQuoteId}</strong></p>
          <p className="mt-2">
            Return/edit link: <a className="textLink" href={`/quote/${savedQuoteId}`}>{`/quote/${savedQuoteId}`}</a>
          </p>
          <p className="mt-2 text-sm text-gray-700">Sign in with {email} to view this quote later from your customer account.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold">Your details</h3>
          <label className="flex flex-col">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded"
            />
          </label>
          <label className="flex flex-col">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded"
            />
          </label>
          <label className="flex flex-col">
            <span>Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-2 border rounded"
            />
          </label>
          <div className="privacyNotice">
            We collect these details to review your estimate, arrange follow-up and prepare a written scope. Marketing is optional and separate from the quote request.
            <label className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(event) => setMarketingOptIn(event.target.checked)}
              />
              <span>Send me planning tips and product updates.</span>
            </label>
          </div>
          {submitError && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{submitError}</div>}
          <div className="flex justify-between">
            <button
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded"
              onClick={onBack}
            >
              Back
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
              disabled={!name || !email || !phone || isSubmitting}
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
