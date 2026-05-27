import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PropertyDetails from '@/components/steps/PropertyDetails';
import ScopeDetails from '@/components/steps/ScopeDetails';
import CabinetryDetails from '@/components/steps/CabinetryDetails';
import BenchtopDetails from '@/components/steps/BenchtopDetails';
import TradesDetails from '@/components/steps/TradesDetails';
import ReviewSubmit from '@/components/steps/ReviewSubmit';
import { QuoteInput } from '@/lib/pricing';
import { defaultQuoteInput } from '@/lib/quoteDefaults';

interface LoadedContact {
  name: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
}

const QuoteWizard = () => {
  const router = useRouter();
  const routeQuoteId = typeof router.query.id === 'string' ? router.query.id : '';
  const [quoteData, setQuoteData] = useState<QuoteInput>(defaultQuoteInput);
  const [loadedQuoteId, setLoadedQuoteId] = useState('');
  const [loadedContact, setLoadedContact] = useState<LoadedContact | undefined>();
  const [loadError, setLoadError] = useState('');
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!router.isReady || !routeQuoteId) return;

    let cancelled = false;
    async function loadQuote() {
      setLoadError('');
      try {
        const response = await fetch(`/api/quotes?id=${encodeURIComponent(routeQuoteId)}`);
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not load quote.');
        if (cancelled) return;

        setQuoteData(payload.quote.quoteInput);
        setLoadedQuoteId(payload.quote.id);
        if (payload.quote.lead) {
          setLoadedContact({
            name: payload.quote.lead.name,
            email: payload.quote.lead.email,
            phone: payload.quote.lead.phone,
            marketingOptIn: payload.quote.lead.marketingOptIn,
          });
        }
        setStep(5);
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Could not load quote.';
          setLoadError(message.includes('Sign in') ? `${message} Use the sign-in page, then return to this quote link.` : message);
        }
      }
    }

    loadQuote();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, routeQuoteId]);

  const steps = [
    <PropertyDetails key="step1" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} />,
    <ScopeDetails key="step2" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <CabinetryDetails key="step3" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <BenchtopDetails key="step4" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <TradesDetails key="step5" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <ReviewSubmit
      key="step6"
      data={quoteData}
      quoteId={loadedQuoteId}
      initialContact={loadedContact}
      onBack={() => setStep(step - 1)}
      onSaved={(quoteId) => setLoadedQuoteId(quoteId)}
    />,
  ];
  return (
    <div className="wizardShell">
      <div className="wizardHeader">
        <p className="eyebrow">Estimate builder</p>
        <h1>Kitchen quote wizard</h1>
        <p className="muted">Start with the information you have. The estimate gets clearer as measurements, photos and selections are added.</p>
      </div>
      <div className="wizardPanel">
        {loadError && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">{loadError}</div>}
        {loadedQuoteId && !loadError && (
          <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded text-green-800">
            Editing saved quote <strong>{loadedQuoteId}</strong>.
          </div>
        )}
        <div className="mb-6">
          <p className="progressText">Step {step + 1} of {steps.length}</p>
          <div className="progressTrack">
          <div
            className="progressFill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
          </div>
        </div>
        {steps[step]}
      </div>
      <aside className="notePanel">
        Estimates are planning guides only. Final pricing depends on a site measure, approved selections, licensed trade checks and written confirmation.
      </aside>
    </div>
  );
};

export default QuoteWizard;
