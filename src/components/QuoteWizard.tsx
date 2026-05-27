import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectBasicsStep from '@/components/steps/ProjectBasicsStep';
import PropertyDetails from '@/components/steps/PropertyDetails';
import KitchenLayoutSizeStep from '@/components/steps/KitchenLayoutSizeStep';
import ScopeInclusionsStep from '@/components/steps/ScopeInclusionsStep';
import FinishesAllowancesStep from '@/components/steps/FinishesAllowancesStep';
import ServicesRiskStep from '@/components/steps/ServicesRiskStep';
import UploadDocumentsStep from '@/components/steps/UploadDocumentsStep';
import ContactPrivacyStep, { WizardContact } from '@/components/steps/ContactPrivacyStep';
import EstimateSummaryStep from '@/components/steps/EstimateSummaryStep';
import { designStorageKey } from '@/lib/designPlan';
import { QuoteInput, RateCard } from '@/lib/pricing';
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
  const [contact, setContact] = useState<WizardContact>({
    name: '',
    email: '',
    phone: '',
    marketingOptIn: false,
    privacyAcknowledged: false,
  });
  const [loadError, setLoadError] = useState('');
  const [activeRateCard, setActiveRateCard] = useState<RateCard | undefined>();
  const [step, setStep] = useState(0);
  const stepLabels = ['Basics', 'Access', 'Layout', 'Scope', 'Finishes', 'Services', 'Uploads', 'Contact', 'Summary'];

  useEffect(() => {
    let cancelled = false;
    async function loadRateCard() {
      try {
        const response = await fetch('/api/rate-card');
        const payload = await response.json();
        if (!cancelled && response.ok) setActiveRateCard(payload.rateCard.data);
      } catch {
        if (!cancelled) setActiveRateCard(undefined);
      }
    }
    loadRateCard();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedPlan = window.localStorage.getItem(designStorageKey);
    if (!savedPlan) return;
    try {
      const designPlan = JSON.parse(savedPlan);
      setQuoteData((current) => current.designPlan ? current : { ...current, designPlan });
    } catch {
      window.localStorage.removeItem(designStorageKey);
    }
  }, []);

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
          setContact({
            name: payload.quote.lead.name,
            email: payload.quote.lead.email,
            phone: payload.quote.lead.phone,
            marketingOptIn: payload.quote.lead.marketingOptIn,
            privacyAcknowledged: false,
          });
        }
        setStep(8);
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
    <ProjectBasicsStep key="step1" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} />,
    <PropertyDetails key="step2" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <KitchenLayoutSizeStep key="step3" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <ScopeInclusionsStep key="step4" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <FinishesAllowancesStep key="step5" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <ServicesRiskStep key="step6" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <UploadDocumentsStep key="step7" data={quoteData} onChange={setQuoteData} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <ContactPrivacyStep key="step8" contact={contact} onChange={setContact} onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />,
    <EstimateSummaryStep
      key="step9"
      data={quoteData}
      contact={contact}
      rateCard={activeRateCard}
      quoteId={loadedQuoteId}
      onBack={() => setStep(step - 1)}
      onSaved={(quoteId) => setLoadedQuoteId(quoteId)}
    />,
  ];
  return (
    <div className="wizardShell">
      <div className="wizardHeader">
        <p className="eyebrow">Estimate builder</p>
        <h1>Kitchen quote wizard</h1>
        <p className="muted">Build a planning estimate range with confidence, assumptions, exclusions and review flags before a professional quote.</p>
      </div>
      <div className="wizardPanel">
        {loadError && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700">{loadError}</div>}
        {loadedQuoteId && !loadError && (
          <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded text-green-800">
            Editing saved quote <strong>{loadedQuoteId}</strong>.
          </div>
        )}
        <div className="mb-6">
          <p className="progressText">Step {step + 1} of {steps.length}: {stepLabels[step]}</p>
          <div className="progressTrack" role="progressbar" aria-label="Quote wizard progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step + 1}>
            <div
              className="progressFill"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <ol className="stepNav" aria-label="Quote wizard steps">
            {stepLabels.map((label, index) => (
              <li key={label} className={index === step ? 'active' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}>
                <span>{index + 1}</span><em>{label}</em>
              </li>
            ))}
          </ol>
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
