import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { trackKitchenEvent } from '@/lib/analytics';

interface LoadedContact {
  name: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
}

const stepLabels = ['Project', 'Property', 'Layout', 'Inclusions', 'Finishes', 'Services', 'Quote details', 'Contact', 'Estimate'];

const estimateOutcomeCards = [
  ['Planning range', 'An indicative Sydney kitchen renovation range before site measure.'],
  ['Confidence signal', 'How complete the supplied project information is before professional review.'],
  ['Review risk', 'Scope, access, strata, service and allowance items that may need manual review.'],
  ['Next step clarity', 'Assumptions, exclusions, review flags and the path toward written scope.'],
];

const estimateJourneySteps = ['Planning estimate', 'Quote review', 'Site measure', 'Written scope'];

const QuoteWizard = () => {
  const router = useRouter();
  const routeQuoteId = typeof router.query.id === 'string' ? router.query.id : '';
  const [quoteData, setQuoteData] = useState<QuoteInput>(defaultQuoteInput);
  const [loadedQuoteId, setLoadedQuoteId] = useState('');
  const [contact, setContact] = useState<WizardContact>({
    name: '',
    email: '',
    phone: '',
    preferredContactMethod: 'either',
    addressOptional: '',
    marketingOptIn: false,
    privacyAcknowledged: false,
  });
  const [loadError, setLoadError] = useState('');
  const [activeRateCard, setActiveRateCard] = useState<RateCard | undefined>();
  const [step, setStep] = useState(0);

  useEffect(() => {
    trackKitchenEvent('wizard_step_view', { step_index: step + 1, step_name: stepLabels[step] });
  }, [step]);

  const goToStep = (nextStep: number) => {
    if (nextStep > step) {
      trackKitchenEvent('wizard_step_complete', { step_index: step + 1, step_name: stepLabels[step] });
    }
    setStep(nextStep);
  };

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
            preferredContactMethod: payload.quote.quoteInput?.preferredContactMethod ?? 'either',
            addressOptional: payload.quote.quoteInput?.addressOptional ?? '',
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
    <ProjectBasicsStep key="step1" data={quoteData} onChange={setQuoteData} onNext={() => goToStep(step + 1)} />,
    <PropertyDetails key="step2" data={quoteData} onChange={setQuoteData} onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />,
    <KitchenLayoutSizeStep key="step3" data={quoteData} onChange={setQuoteData} onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />,
    <ScopeInclusionsStep key="step4" data={quoteData} onChange={setQuoteData} onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />,
    <FinishesAllowancesStep key="step5" data={quoteData} onChange={setQuoteData} onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />,
    <ServicesRiskStep key="step6" data={quoteData} onChange={setQuoteData} onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />,
    <UploadDocumentsStep key="step7" data={quoteData} onChange={setQuoteData} onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />,
    <ContactPrivacyStep key="step8" contact={contact} onChange={setContact} onNext={() => goToStep(step + 1)} onBack={() => goToStep(step - 1)} />,
    <EstimateSummaryStep
      key="step9"
      data={quoteData}
      contact={contact}
      rateCard={activeRateCard}
      quoteId={loadedQuoteId}
      onBack={() => goToStep(step - 1)}
      onSaved={(quoteId) => setLoadedQuoteId(quoteId)}
    />,
  ];
  return (
    <div className="wizardShell">
      <div className="wizardHeader">
        <div className="wizardTopLinks">
          <Link href="/" className="brand">Operon Kitchens</Link>
          <Link href="/quote/review" className="textLink">Review existing quote</Link>
        </div>
        <p className="eyebrow">Estimate builder</p>
        <h1>Start a Sydney kitchen renovation planning estimate</h1>
        <p className="muted">Answer the key project, layout, finish and service questions so Operon Kitchens can estimate a planning range, confidence level, assumptions and review flags before site measure.</p>
        <p className="wizardTrustLine">Planning estimate only. Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing.</p>
        <div className="wizardRewardGrid" aria-label="Estimate completion rewards">
          <span>Takes about 3–5 minutes</span>
          <span>You can refine details later</span>
          <span>Already have a quote? <Link href="/quote/review">Review it instead</Link></span>
        </div>
        <ol className="wizardJourneyStrip" aria-label="Estimate to written scope path">
          {estimateJourneySteps.map((item, index) => (
            <li key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ol>
        <p className="wizardReward">At the end, you’ll see a planning estimate range, confidence score, assumptions, exclusions, review flags and recommended next step.</p>
      </div>
      <div className="wizardOutcomeGrid" aria-label="What the estimate gives you">
        {estimateOutcomeCards.map(([title, body]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{body}</span>
          </article>
        ))}
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
          <details className="stepListDisclosure">
            <summary>View all steps</summary>
            <ol className="stepNav" aria-label="Quote wizard steps">
              {stepLabels.map((label, index) => (
                <li key={label} className={index === step ? 'active' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}>
                  <span>{index + 1}</span><em>{label}</em>
                </li>
              ))}
            </ol>
          </details>
        </div>
        {steps[step]}
      </div>
      <aside className="notePanel">
        Estimates are planning guides and indicative ranges only. Project-specific pricing depends on site measure, confirmed selections, licensed trade checks where needed and written scope confirmation.
      </aside>
    </div>
  );
};

export default QuoteWizard;
