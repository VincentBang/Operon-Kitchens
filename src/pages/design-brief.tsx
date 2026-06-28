import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  defaultDesignBriefInput,
  designBriefLegalMessage,
  designBriefSafetyMessage,
  DesignBriefInput,
  DesignBriefYesNoUnsure,
  evaluateDesignBrief,
  isDesignBriefEnabled,
  validateDesignBriefRequiredFields,
} from '@/lib/designBrief';
import { trackKitchenEvent } from '@/lib/analytics';

const stepLabels = ['Context', 'Goals', 'Information', 'Access', 'Review'];

const propertyTypeOptions: { value: DesignBriefInput['propertyType']; label: string; helper: string }[] = [
  { value: 'house', label: 'House', helper: 'Standalone or semi-detached home.' },
  { value: 'townhouse', label: 'Townhouse', helper: 'Shared access or strata may still matter.' },
  { value: 'apartment', label: 'Apartment', helper: 'Access, lift and building rules may need review.' },
  { value: 'strataApartment', label: 'Strata apartment', helper: 'Owners corporation and access review likely.' },
  { value: 'notSure', label: 'Not sure', helper: 'Use this only if property details are unclear.' },
];

const stageOptions: { value: DesignBriefInput['renovationStage']; label: string }[] = [
  { value: 'earlyPlanning', label: 'Early planning' },
  { value: 'preparingForQuotes', label: 'Preparing for quotes' },
  { value: 'quoteInHand', label: 'Quote in hand' },
  { value: 'comparingQuotes', label: 'Comparing quotes' },
  { value: 'readyForMeasure', label: 'Ready for site measure' },
  { value: 'notSure', label: 'Not sure' },
];

const quoteOptions: { value: DesignBriefInput['existingQuoteStatus']; label: string }[] = [
  { value: 'none', label: 'No quote yet' },
  { value: 'oneQuote', label: 'I have one quote' },
  { value: 'multipleQuotes', label: 'Comparing multiple quotes' },
  { value: 'notSure', label: 'Not sure' },
];

const yesNoOptions: { value: DesignBriefYesNoUnsure; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'notSure', label: 'Not sure' },
];

const outcomeOptions = ['More storage', 'Better layout', 'Easier cleaning', 'Apartment-ready scope', 'Premium finishes', 'Quote clarity'];
const storageOptions = ['Pantry storage', 'Deep drawers', 'Appliance garage', 'Overheads', 'Island storage', 'Small-kitchen efficiency'];
const applianceOptions = ['Keep existing appliances', 'New cooktop', 'New oven', 'Dishwasher', 'Integrated fridge', 'Rangehood change'];

const groupLabels = {
  propertyAndAccess: 'Property and access',
  measurementsAndPlans: 'Measurements and plans',
  appliancesAndServices: 'Appliances and services',
  scopeAndFinishes: 'Scope and finishes',
  quoteAndSiteMeasureReadiness: 'Quote and site-measure readiness',
};

function toggleListValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function isValidStep(step: number, input: DesignBriefInput) {
  const errors = validateDesignBriefRequiredFields(input);
  if (step === 0) return !errors.suburbOrPostcode && !errors.propertyType && !errors.renovationStage && !errors.existingQuoteStatus;
  if (step === 1) return !errors.currentKitchenProblems;
  return true;
}

function YesNoSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: DesignBriefYesNoUnsure;
  onChange: (value: DesignBriefYesNoUnsure) => void;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as DesignBriefYesNoUnsure)}>
        {yesNoOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function DisabledDesignBrief() {
  return (
    <main className="pageSurface">
      <Head>
        <title>Kitchen design brief assistant | Operon Kitchens</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Operon Kitchens structured design brief assistant is being prepared for local review." />
      </Head>
      <section className="wizardShell">
        <div className="wizardHeader">
          <p className="eyebrow">Local preview disabled</p>
          <h1>Kitchen design brief assistant is not live yet.</h1>
          <p className="muted">
            This advanced planning tool is intentionally hidden until the structured design brief workflow, copy, tests and human review are complete.
          </p>
          <p className="wizardTrustLine">{designBriefSafetyMessage} {designBriefLegalMessage}</p>
          <div className="flexActions">
            <Link className="button primary" href="/quote">Start kitchen estimate</Link>
            <Link className="button ghost" href="/quote/review">Review existing quote</Link>
            <Link className="button ghost" href="/request-review">Request review</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DesignBriefPage() {
  const enabled = isDesignBriefEnabled();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState<DesignBriefInput>(defaultDesignBriefInput);
  const errors = validateDesignBriefRequiredFields(input);
  const result = useMemo(() => evaluateDesignBrief(input), [input]);

  useEffect(() => {
    if (!enabled) return;
    trackKitchenEvent('design_brief_started', { route: '/design-brief' });
  }, [enabled]);

  useEffect(() => {
    if (!enabled || step !== 4) return;
    trackKitchenEvent('design_brief_review_viewed', {
      property_category: input.propertyType,
      quote_status_category: input.existingQuoteStatus,
      completion_state: result.readiness.state,
    });
  }, [enabled, input.existingQuoteStatus, input.propertyType, result.readiness.state, step]);

  if (!enabled) return <DisabledDesignBrief />;

  const update = <K extends keyof DesignBriefInput>(field: K, value: DesignBriefInput[K]) => {
    setInput((current) => ({ ...current, [field]: value }));
  };

  const updateInfo = (field: keyof DesignBriefInput['informationAvailable'], value: DesignBriefYesNoUnsure) => {
    setInput((current) => ({ ...current, informationAvailable: { ...current.informationAvailable, [field]: value } }));
  };

  const updateAccess = (field: keyof DesignBriefInput['propertyAndAccess'], value: DesignBriefYesNoUnsure) => {
    setInput((current) => ({ ...current, propertyAndAccess: { ...current.propertyAndAccess, [field]: value } }));
  };

  const nextStep = () => {
    if (!isValidStep(step, input)) return;
    trackKitchenEvent('design_brief_section_completed', { step_identifier: stepLabels[step], completion_state: result.readiness.state });
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidStep(0, input) || !isValidStep(1, input)) {
      setStep(!isValidStep(0, input) ? 0 : 1);
      return;
    }
    trackKitchenEvent('design_brief_completed', {
      pathway: result.pathway.primary.type,
      property_category: input.propertyType,
      quote_status_category: input.existingQuoteStatus,
      completion_state: result.readiness.state,
    });
    setSubmitted(true);
  };

  return (
    <main className="pageSurface">
      <Head>
        <title>Kitchen design brief assistant | Operon Kitchens</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Prepare a structured Sydney kitchen design brief with project context, missing information and a safe next-step pathway before site measure." />
      </Head>
      <section className="wizardShell designBriefShell">
        <div className="wizardHeader">
          <p className="eyebrow">Structured design brief</p>
          <h1>Prepare a kitchen design brief before quote review or site measure.</h1>
          <p className="muted">
            Answer the early project, goal, information and access questions so Operon Kitchens can organise your brief, show missing items and suggest the safest next planning pathway.
          </p>
          <p className="wizardTrustLine">{designBriefSafetyMessage} {designBriefLegalMessage}</p>
          <div className="wizardRewardGrid" aria-label="Design brief guidance">
            <span>Deterministic summary only</span>
            <span>No AI-generated layout</span>
            <span>No project-specific pricing</span>
          </div>
        </div>

        <div className="wizardPanel">
          <p className="progressText">Step {step + 1} of {stepLabels.length}: {stepLabels[step]}</p>
          <div className="progressTrack" role="progressbar" aria-label="Design brief progress" aria-valuemin={1} aria-valuemax={stepLabels.length} aria-valuenow={step + 1}>
            <div className="progressFill" style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }} />
          </div>
          <ol className="stepNav designBriefStepNav" aria-label="Design brief steps">
            {stepLabels.map((label, index) => (
              <li key={label} className={index === step ? 'active' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}>
                <span>{index + 1}</span><em>{label}</em>
              </li>
            ))}
          </ol>

          <form className="stepStack designBriefForm" onSubmit={submit}>
            {step === 0 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Project context</h2>
                  <p>Start with the minimum context needed to choose a useful estimate, review or site-measure pathway.</p>
                </div>
                <div className="formGrid two">
                  <label className="field" htmlFor="design-brief-suburb">
                    <span>Suburb or postcode</span>
                    <input id="design-brief-suburb" value={input.suburbOrPostcode} onChange={(event) => update('suburbOrPostcode', event.target.value)} aria-describedby={errors.suburbOrPostcode ? 'design-brief-suburb-error' : undefined} />
                    {errors.suburbOrPostcode && <p className="fieldError" id="design-brief-suburb-error">{errors.suburbOrPostcode}</p>}
                  </label>
                  <label className="field" htmlFor="design-brief-timing">
                    <span>Project timing</span>
                    <select id="design-brief-timing" value={input.timingRange} onChange={(event) => update('timingRange', event.target.value as DesignBriefInput['timingRange'])}>
                      <option value="researching">Researching</option>
                      <option value="oneToThreeMonths">1-3 months</option>
                      <option value="readySoon">Ready soon</option>
                      <option value="urgent">Urgent</option>
                      <option value="notSure">Not sure</option>
                    </select>
                  </label>
                </div>
                <fieldset className="choiceFieldset">
                  <legend>Property type</legend>
                  <div className="choiceGrid compact">
                    {propertyTypeOptions.map((option) => (
                      <label className="checkCard optionCard tall" key={option.value}>
                        <input type="radio" name="propertyType" checked={input.propertyType === option.value} onChange={() => update('propertyType', option.value)} />
                        <span><strong>{option.label}</strong><small>{option.helper}</small></span>
                      </label>
                    ))}
                  </div>
                  {errors.propertyType && <p className="fieldError">{errors.propertyType}</p>}
                </fieldset>
                <div className="formGrid two">
                  <label className="field" htmlFor="design-brief-stage">
                    <span>Renovation stage</span>
                    <select id="design-brief-stage" value={input.renovationStage} onChange={(event) => update('renovationStage', event.target.value as DesignBriefInput['renovationStage'])}>
                      {stageOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                    </select>
                    {errors.renovationStage && <p className="fieldError">{errors.renovationStage}</p>}
                  </label>
                  <label className="field" htmlFor="design-brief-quote-status">
                    <span>Existing quote status</span>
                    <select id="design-brief-quote-status" value={input.existingQuoteStatus} onChange={(event) => update('existingQuoteStatus', event.target.value as DesignBriefInput['existingQuoteStatus'])}>
                      {quoteOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                    </select>
                    {errors.existingQuoteStatus && <p className="fieldError">{errors.existingQuoteStatus}</p>}
                  </label>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Kitchen goals</h2>
                  <p>Describe what needs to change. The summary will repeat your words rather than invent missing facts.</p>
                </div>
                <label className="field" htmlFor="design-brief-problem">
                  <span>Current kitchen problem or reason for renovating</span>
                  <textarea id="design-brief-problem" value={input.currentKitchenProblems} onChange={(event) => update('currentKitchenProblems', event.target.value)} rows={4} />
                  {errors.currentKitchenProblems && <p className="fieldError">{errors.currentKitchenProblems}</p>}
                </label>
                <fieldset className="choiceFieldset">
                  <legend>Must-have outcomes</legend>
                  <div className="choiceGrid compact">
                    {outcomeOptions.map((option) => (
                      <label className="checkCard" key={option}>
                        <input type="checkbox" checked={input.mustHaveOutcomes.includes(option)} onChange={() => update('mustHaveOutcomes', toggleListValue(input.mustHaveOutcomes, option))} />
                        <span><strong>{option}</strong></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="formGrid two">
                  <label className="field" htmlFor="design-brief-layout">
                    <span>Preferred layout direction</span>
                    <select id="design-brief-layout" value={input.preferredLayoutDirection} onChange={(event) => update('preferredLayoutDirection', event.target.value as DesignBriefInput['preferredLayoutDirection'])}>
                      <option value="sameLayout">Keep similar layout</option>
                      <option value="openToChange">Open to layout change</option>
                      <option value="needsAdvice">Needs advice</option>
                      <option value="notSure">Not sure</option>
                    </select>
                  </label>
                  <label className="field" htmlFor="design-brief-style">
                    <span>Style direction</span>
                    <input id="design-brief-style" value={input.styleDirection} onChange={(event) => update('styleDirection', event.target.value)} placeholder="Warm modern, classic, minimal, premium..." />
                  </label>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Available information</h2>
                  <p>Photos, plans and written quote details can improve review confidence. File upload is not required to complete this planning step.</p>
                </div>
                <div className="formGrid three">
                  <YesNoSelect id="design-brief-measurements" label="Measurements available?" value={input.informationAvailable.measurements} onChange={(value) => updateInfo('measurements', value)} />
                  <YesNoSelect id="design-brief-rough-plan" label="Rough plan available?" value={input.informationAvailable.roughPlan} onChange={(value) => updateInfo('roughPlan', value)} />
                  <YesNoSelect id="design-brief-photos" label="Photos available?" value={input.informationAvailable.photos} onChange={(value) => updateInfo('photos', value)} />
                  <YesNoSelect id="design-brief-written-quote" label="Written quote details available?" value={input.informationAvailable.writtenQuote} onChange={(value) => updateInfo('writtenQuote', value)} />
                  <YesNoSelect id="design-brief-appliance-specs" label="Appliance specifications available?" value={input.informationAvailable.applianceSpecs} onChange={(value) => updateInfo('applianceSpecs', value)} />
                  <label className="field" htmlFor="design-brief-budget">
                    <span>Rough budget range</span>
                    <input id="design-brief-budget" value={input.roughBudgetRange} onChange={(event) => update('roughBudgetRange', event.target.value)} placeholder="Optional" />
                  </label>
                </div>
                <fieldset className="choiceFieldset">
                  <legend>Storage priorities</legend>
                  <div className="choiceGrid compact">
                    {storageOptions.map((option) => (
                      <label className="checkCard" key={option}>
                        <input type="checkbox" checked={input.storagePriorities.includes(option)} onChange={() => update('storagePriorities', toggleListValue(input.storagePriorities, option))} />
                        <span><strong>{option}</strong></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="choiceFieldset">
                  <legend>Appliance intentions</legend>
                  <div className="choiceGrid compact">
                    {applianceOptions.map((option) => (
                      <label className="checkCard" key={option}>
                        <input type="checkbox" checked={input.applianceIntentions.includes(option)} onChange={() => update('applianceIntentions', toggleListValue(input.applianceIntentions, option))} />
                        <span><strong>{option}</strong></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </section>
            )}

            {step === 3 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Apartment, access and service prompts</h2>
                  <p>These answers help identify when a person should review the pathway before site measure or quote comparison.</p>
                </div>
                <div className="formGrid two">
                  <YesNoSelect id="design-brief-strata" label="Apartment or strata constraints?" value={input.propertyAndAccess.strataOrApartment} onChange={(value) => updateAccess('strataOrApartment', value)} />
                  <YesNoSelect id="design-brief-lift" label="Lift access involved?" value={input.propertyAndAccess.liftAccess} onChange={(value) => updateAccess('liftAccess', value)} />
                  <YesNoSelect id="design-brief-parking" label="Parking or carry-distance concerns?" value={input.propertyAndAccess.parkingConcern} onChange={(value) => updateAccess('parkingConcern', value)} />
                  <YesNoSelect id="design-brief-work-hours" label="Restricted work hours?" value={input.propertyAndAccess.restrictedWorkHours} onChange={(value) => updateAccess('restrictedWorkHours', value)} />
                  <YesNoSelect id="design-brief-approval" label="Known approval review needed?" value={input.propertyAndAccess.knownApprovalRequirement} onChange={(value) => updateAccess('knownApprovalRequirement', value)} />
                  <YesNoSelect id="design-brief-service-relocation" label="Known service relocation?" value={input.propertyAndAccess.knownServiceRelocation} onChange={(value) => updateAccess('knownServiceRelocation', value)} />
                  <YesNoSelect id="design-brief-structural" label="Known structural change?" value={input.propertyAndAccess.knownStructuralChange} onChange={(value) => updateAccess('knownStructuralChange', value)} />
                </div>
                <aside className="emptyStatePanel">
                  <p>{designBriefLegalMessage} Licensed trade, strata, access and contract prompts may require project-specific confirmation.</p>
                </aside>
              </section>
            )}

            {step === 4 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Review your design brief</h2>
                  <p>Check the deterministic summary, missing-information checklist and recommended next step before choosing a pathway.</p>
                </div>
                <div className="designBriefResultGrid">
                  <article className="advancedPanel">
                    <h3>Readiness</h3>
                    <strong>{result.readiness.label}</strong>
                    <p>{result.readiness.explanation}</p>
                  </article>
                  <article className="advancedPanel">
                    <h3>Recommended pathway</h3>
                    <strong>{result.pathway.primary.label}</strong>
                    <p>{result.pathway.primary.reason}</p>
                    {result.pathway.humanReviewRecommended && <small>Human review recommended before relying on automated routing.</small>}
                  </article>
                </div>
                <section className="advancedPanel">
                  <h3>Design brief summary</h3>
                  {result.summary.length ? (
                    <dl className="designBriefSummaryList">
                      {result.summary.map((item) => (
                        <div key={item.label}>
                          <dt>{item.label}</dt>
                          <dd>{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p>No summary details yet. Add project context to build the brief.</p>
                  )}
                </section>
                <section className="advancedPanel">
                  <h3>Missing-information checklist</h3>
                  {result.missingInformation.length ? (
                    <div className="designBriefMissingGrid">
                      {Object.entries(groupLabels).map(([group, label]) => {
                        const items = result.missingInformation.filter((item) => item.group === group);
                        if (!items.length) return null;
                        return (
                          <article key={group}>
                            <strong>{label}</strong>
                            <ul>
                              {items.map((item) => <li key={item.id}>{item.label}: {item.reason}</li>)}
                            </ul>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No major missing items beyond normal site measure and written scope confirmation.</p>
                  )}
                </section>
                <p className="wizardTrustLine">{result.pathway.safetyMessage} {designBriefLegalMessage}</p>
                {submitted && (
                  <div className="successPanel" role="status">
                    <strong>Design brief prepared locally.</strong>
                    <p>This first version does not save to Supabase. Choose the recommended pathway below when you are ready.</p>
                  </div>
                )}
                <div className="summaryCtaGrid">
                  <Link className="button primary" href={result.pathway.primary.href} onClick={() => trackKitchenEvent('design_brief_pathway_selected', { pathway: result.pathway.primary.type })}>{result.pathway.primary.label}</Link>
                  {result.pathway.secondary.map((pathway) => (
                    <Link className="button ghost" href={pathway.href} key={pathway.href} onClick={() => trackKitchenEvent('design_brief_pathway_selected', { pathway: pathway.type })}>{pathway.label}</Link>
                  ))}
                </div>
              </section>
            )}

            <div className="wizardActions">
              <button type="button" className="button ghost" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>Back</button>
              {step < stepLabels.length - 1 ? (
                <button type="button" className="button primary" onClick={nextStep}>Next</button>
              ) : (
                <button type="submit" className="button primary">Prepare design brief</button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
