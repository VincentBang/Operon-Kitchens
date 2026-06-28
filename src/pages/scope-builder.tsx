import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DesignBriefYesNoUnsure } from '@/lib/designBrief';
import { trackKitchenEvent } from '@/lib/analytics';
import { evaluateAllowanceAndQuoteRisk } from '@/lib/allowanceRisk';
import {
  defaultKitchenScopeInput,
  evaluateKitchenScope,
  isScopeBuilderEnabled,
  KitchenScopeInput,
  KitchenScopeServiceChange,
  KitchenScopeSurfaceScope,
  kitchenScopeLegalMessage,
  kitchenScopeSafetyMessage,
  validateKitchenScopeRequiredFields,
} from '@/lib/kitchenScope';

const stepLabels = ['Layout', 'Cabinetry', 'Surfaces', 'Works', 'Review'];

const layoutOptions: { value: KitchenScopeInput['layoutType']; label: string; helper: string }[] = [
  { value: 'straight', label: 'Straight run', helper: 'One primary wall run.' },
  { value: 'lShape', label: 'L-shape', helper: 'Two connected wall runs.' },
  { value: 'uShape', label: 'U-shape', helper: 'Three sides of cabinetry.' },
  { value: 'galley', label: 'Galley', helper: 'Two parallel runs.' },
  { value: 'island', label: 'Island kitchen', helper: 'Island or central work zone.' },
  { value: 'peninsula', label: 'Peninsula kitchen', helper: 'Connected return bench.' },
  { value: 'notSure', label: 'Not sure', helper: 'Use this if layout is still open.' },
];

const cabinetZoneOptions = ['Base cabinets', 'Overheads', 'Tall cabinets', 'Pantry', 'Fridge zone', 'Island storage', 'Open shelving', 'Bin drawer'];
const applianceOptions = ['Cooktop', 'Oven tower', 'Dishwasher', 'Fridge', 'Rangehood', 'Microwave', 'Sink', 'Integrated appliance'];
const accessOptions = ['Apartment or strata review', 'Lift booking or restricted work hours', 'Parking or loading concern', 'Stairs or long carry distance', 'Older-property/asbestos review'];

const yesNoOptions: { value: DesignBriefYesNoUnsure; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'notSure', label: 'Not sure' },
];

const serviceOptions: { value: KitchenScopeServiceChange; label: string }[] = [
  { value: 'sameLocation', label: 'Same location' },
  { value: 'relocationLikely', label: 'Relocation may be needed' },
  { value: 'upgradeLikely', label: 'Upgrade may be needed' },
  { value: 'unknown', label: 'Not sure' },
];

function toggleListValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
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

function ServiceSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: KitchenScopeServiceChange;
  onChange: (value: KitchenScopeServiceChange) => void;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as KitchenScopeServiceChange)}>
        {serviceOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function DisabledScopeBuilder() {
  return (
    <main className="pageSurface">
      <Head>
        <title>Kitchen scope builder | Operon Kitchens</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Operon Kitchens kitchen scope builder is being prepared for local review." />
      </Head>
      <section className="wizardShell">
        <div className="wizardHeader">
          <p className="eyebrow">Local preview disabled</p>
          <h1>Kitchen scope builder is not live yet.</h1>
          <p className="muted">
            This advanced scope-preparation tool is intentionally hidden until the layout, measurement, surface, service and site-measure prompts are reviewed.
          </p>
          <p className="wizardTrustLine">{kitchenScopeSafetyMessage} {kitchenScopeLegalMessage}</p>
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

export default function ScopeBuilderPage() {
  const enabled = isScopeBuilderEnabled();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [input, setInput] = useState<KitchenScopeInput>(defaultKitchenScopeInput);
  const errors = validateKitchenScopeRequiredFields(input);
  const result = useMemo(() => evaluateKitchenScope(input), [input]);
  const allowanceRisk = useMemo(() => evaluateAllowanceAndQuoteRisk(input), [input]);

  useEffect(() => {
    if (!enabled) return;
    trackKitchenEvent('scope_builder_started', { route: '/scope-builder' });
  }, [enabled]);

  useEffect(() => {
    if (!enabled || step !== 4) return;
    trackKitchenEvent('scope_builder_review_viewed', {
      layout_type: input.layoutType,
      readiness_state: result.readiness.state,
      allowance_risk_label: allowanceRisk.overallLabel,
    });
  }, [allowanceRisk.overallLabel, enabled, input.layoutType, result.readiness.state, step]);

  if (!enabled) return <DisabledScopeBuilder />;

  const update = <K extends keyof KitchenScopeInput>(field: K, value: KitchenScopeInput[K]) => {
    setInput((current) => ({ ...current, [field]: value }));
  };

  const updateService = (field: keyof KitchenScopeInput['serviceChanges'], value: KitchenScopeServiceChange) => {
    setInput((current) => ({ ...current, serviceChanges: { ...current.serviceChanges, [field]: value } }));
  };

  const updateInterface = (field: keyof KitchenScopeInput['interfaces'], value: DesignBriefYesNoUnsure) => {
    setInput((current) => ({ ...current, interfaces: { ...current.interfaces, [field]: value } }));
  };

  const secondaryPathways = [
    { href: '/request-review' as const, label: 'Request review' },
    { href: '/site-measure' as const, label: 'Prepare for site measure' },
  ].filter((pathway) => pathway.href !== result.recommendedNextStep.href);

  const nextStep = () => {
    if (step === 0 && errors.layoutType) return;
    if (step === 1 && errors.cabinetZones) return;
    if (step === 3 && errors.scopeNotes) return;
    trackKitchenEvent('scope_builder_section_completed', { step_identifier: stepLabels[step], readiness_state: result.readiness.state });
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (errors.layoutType) return setStep(0);
    if (errors.cabinetZones) return setStep(1);
    if (errors.scopeNotes) return setStep(3);
    trackKitchenEvent('scope_builder_completed', {
      next_step: result.recommendedNextStep.href,
      readiness_state: result.readiness.state,
      allowance_risk_label: allowanceRisk.overallLabel,
      human_review_recommended: result.recommendedNextStep.humanReviewRecommended,
    });
    setSubmitted(true);
  };

  return (
    <main className="pageSurface">
      <Head>
        <title>Kitchen scope builder | Operon Kitchens</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Prepare a structured kitchen scope summary, missing-scope checklist and site-measure preparation prompts before quote review." />
      </Head>
      <section className="wizardShell scopeBuilderShell">
        <div className="wizardHeader">
          <p className="eyebrow">Structured kitchen scope</p>
          <h1>Build a kitchen scope checklist before quote review or site measure.</h1>
          <p className="muted">
            Capture layout, rough dimensions, cabinet zones, appliances, surfaces, works, services and access prompts so the next review starts with clearer scope.
          </p>
          <p className="wizardTrustLine">{kitchenScopeSafetyMessage} {kitchenScopeLegalMessage}</p>
          <div className="wizardRewardGrid" aria-label="Scope builder guidance">
            <span>Scope summary only</span>
            <span>Site measure still required</span>
            <span>Licensed trade review may be needed</span>
          </div>
        </div>

        <div className="wizardPanel">
          <p className="progressText">Step {step + 1} of {stepLabels.length}: {stepLabels[step]}</p>
          <div className="progressTrack" role="progressbar" aria-label="Scope builder progress" aria-valuemin={1} aria-valuemax={stepLabels.length} aria-valuenow={step + 1}>
            <div className="progressFill" style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }} />
          </div>
          <ol className="stepNav scopeBuilderStepNav" aria-label="Scope builder steps">
            {stepLabels.map((label, index) => (
              <li key={label} className={index === step ? 'active' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}>
                <span>{index + 1}</span><em>{label}</em>
              </li>
            ))}
          </ol>

          <form className="stepStack scopeBuilderForm" onSubmit={submit}>
            {step === 0 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Layout and rough measurements</h2>
                  <p>Start with the closest layout and any rough measurements. Final dimensions still require site measure.</p>
                </div>
                <fieldset className="choiceFieldset">
                  <legend>Layout type</legend>
                  <div className="choiceGrid compact">
                    {layoutOptions.map((option) => (
                      <label className="checkCard optionCard tall" key={option.value}>
                        <input type="radio" name="layoutType" checked={input.layoutType === option.value} onChange={() => update('layoutType', option.value)} />
                        <span><strong>{option.label}</strong><small>{option.helper}</small></span>
                      </label>
                    ))}
                  </div>
                  {errors.layoutType && <p className="fieldError">{errors.layoutType}</p>}
                </fieldset>
                <div className="formGrid three">
                  <label className="field" htmlFor="scope-room-length">
                    <span>Room length mm</span>
                    <input id="scope-room-length" inputMode="numeric" value={input.roomLengthMm} onChange={(event) => update('roomLengthMm', event.target.value)} placeholder="Optional rough value" />
                  </label>
                  <label className="field" htmlFor="scope-room-width">
                    <span>Room width mm</span>
                    <input id="scope-room-width" inputMode="numeric" value={input.roomWidthMm} onChange={(event) => update('roomWidthMm', event.target.value)} placeholder="Optional rough value" />
                  </label>
                  <label className="field" htmlFor="scope-ceiling-height">
                    <span>Ceiling height mm</span>
                    <input id="scope-ceiling-height" inputMode="numeric" value={input.ceilingHeightMm} onChange={(event) => update('ceilingHeightMm', event.target.value)} placeholder="Optional" />
                  </label>
                </div>
                <div className="formGrid two">
                  <label className="field" htmlFor="scope-wall-runs">
                    <span>Wall run notes</span>
                    <textarea id="scope-wall-runs" value={input.wallRunNotes} onChange={(event) => update('wallRunNotes', event.target.value)} rows={3} placeholder="Example: sink wall, fridge wall, island side..." />
                  </label>
                  <label className="field" htmlFor="scope-openings">
                    <span>Windows, doors and fixed openings</span>
                    <textarea id="scope-openings" value={input.openingNotes} onChange={(event) => update('openingNotes', event.target.value)} rows={3} placeholder="Example: window above sink, balcony door, nib wall..." />
                  </label>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Cabinet and storage zones</h2>
                  <p>Select the zones expected in scope. These are planning prompts, not confirmed cabinet specifications.</p>
                </div>
                <fieldset className="choiceFieldset">
                  <legend>Cabinet zones</legend>
                  <div className="choiceGrid compact">
                    {cabinetZoneOptions.map((option) => (
                      <label className="checkCard" key={option}>
                        <input type="checkbox" checked={input.cabinetZones.includes(option)} onChange={() => update('cabinetZones', toggleListValue(input.cabinetZones, option))} />
                        <span><strong>{option}</strong></span>
                      </label>
                    ))}
                  </div>
                  {errors.cabinetZones && <p className="fieldError">{errors.cabinetZones}</p>}
                </fieldset>
              </section>
            )}

            {step === 2 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Appliances, benchtop and splashback</h2>
                  <p>Capture intended positions and surface scope so allowances, exclusions and service prompts are easier to review later.</p>
                </div>
                <fieldset className="choiceFieldset">
                  <legend>Appliance positions to confirm</legend>
                  <div className="choiceGrid compact">
                    {applianceOptions.map((option) => (
                      <label className="checkCard" key={option}>
                        <input type="checkbox" checked={input.appliancePositions.includes(option)} onChange={() => update('appliancePositions', toggleListValue(input.appliancePositions, option))} />
                        <span><strong>{option}</strong></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="formGrid two">
                  <label className="field" htmlFor="scope-benchtop">
                    <span>Benchtop scope</span>
                    <select id="scope-benchtop" value={input.benchtopScope} onChange={(event) => update('benchtopScope', event.target.value as KitchenScopeSurfaceScope)}>
                      <option value="notSure">Not sure</option>
                      <option value="new">New surface included</option>
                      <option value="replace">Replace existing</option>
                      <option value="none">Not included</option>
                    </select>
                  </label>
                  <label className="field" htmlFor="scope-splashback">
                    <span>Splashback scope</span>
                    <select id="scope-splashback" value={input.splashbackScope} onChange={(event) => update('splashbackScope', event.target.value as KitchenScopeSurfaceScope)}>
                      <option value="notSure">Not sure</option>
                      <option value="new">New surface included</option>
                      <option value="replace">Replace existing</option>
                      <option value="none">Not included</option>
                    </select>
                  </label>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Works, services and access</h2>
                  <p>These prompts help identify quote-review and site-measure risks before anyone relies on a total.</p>
                </div>
                <div className="formGrid two">
                  <YesNoSelect id="scope-demolition" label="Demolition and removal included?" value={input.demolitionAndRemoval} onChange={(value) => update('demolitionAndRemoval', value)} />
                  <YesNoSelect id="scope-make-good" label="Make-good work included?" value={input.makeGoodWork} onChange={(value) => update('makeGoodWork', value)} />
                  <YesNoSelect id="scope-walls" label="Wall patching interface?" value={input.interfaces.walls} onChange={(value) => updateInterface('walls', value)} />
                  <YesNoSelect id="scope-floors" label="Floor interface?" value={input.interfaces.floors} onChange={(value) => updateInterface('floors', value)} />
                </div>
                <div className="formGrid three">
                  <ServiceSelect id="scope-plumbing" label="Plumbing" value={input.serviceChanges.plumbing} onChange={(value) => updateService('plumbing', value)} />
                  <ServiceSelect id="scope-electrical" label="Electrical" value={input.serviceChanges.electrical} onChange={(value) => updateService('electrical', value)} />
                  <ServiceSelect id="scope-gas" label="Gas" value={input.serviceChanges.gas} onChange={(value) => updateService('gas', value)} />
                  <ServiceSelect id="scope-ventilation" label="Ventilation" value={input.serviceChanges.ventilation} onChange={(value) => updateService('ventilation', value)} />
                  <ServiceSelect id="scope-lighting" label="Lighting" value={input.serviceChanges.lighting} onChange={(value) => updateService('lighting', value)} />
                </div>
                <fieldset className="choiceFieldset">
                  <legend>Access or site conditions</legend>
                  <div className="choiceGrid compact">
                    {accessOptions.map((option) => (
                      <label className="checkCard" key={option}>
                        <input type="checkbox" checked={input.accessConstraints.includes(option)} onChange={() => update('accessConstraints', toggleListValue(input.accessConstraints, option))} />
                        <span><strong>{option}</strong></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="field" htmlFor="scope-notes">
                  <span>Short scope note</span>
                  <textarea id="scope-notes" value={input.scopeNotes} onChange={(event) => update('scopeNotes', event.target.value)} rows={4} placeholder="Example: full cabinet replacement, new benchtop and appliance position review." />
                  {errors.scopeNotes && <p className="fieldError">{errors.scopeNotes}</p>}
                </label>
              </section>
            )}

            {step === 4 && (
              <section className="stepMiniSection">
                <div className="stepIntro">
                  <h2>Review your kitchen scope</h2>
                  <p>Check the structured scope summary, missing-scope items and site-measure preparation prompts.</p>
                </div>
                <div className="scopeBuilderResultGrid">
                  <article className="advancedPanel">
                    <h3>Scope readiness</h3>
                    <strong>{result.readiness.label}</strong>
                    <p>{result.readiness.explanation}</p>
                  </article>
                  <article className="advancedPanel">
                    <h3>Recommended next step</h3>
                    <strong>{result.recommendedNextStep.label}</strong>
                    <p>{result.recommendedNextStep.reason}</p>
                    {result.recommendedNextStep.humanReviewRecommended && <small>Human review recommended before relying on this scope.</small>}
                  </article>
                </div>
                <section className="advancedPanel">
                  <h3>Structured scope summary</h3>
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
                    <p>No scope details yet. Add layout, cabinetry and works information to build the checklist.</p>
                  )}
                </section>
                <section className="advancedPanel">
                  <h3>Missing-scope checklist</h3>
                  {result.missingScope.length ? (
                    <div className="scopeBuilderChecklistGrid">
                      {result.missingScope.map((item) => (
                        <article key={item.id}>
                          <strong>{item.label}</strong>
                          <p>{item.reason}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p>No major missing scope items beyond normal site measure and written scope confirmation.</p>
                  )}
                </section>
                <section className="advancedPanel">
                  <div className="riskPanelHeader">
                    <div>
                      <h3>Allowance and quote-risk prompts</h3>
                      <p>{allowanceRisk.explanation}</p>
                    </div>
                    <strong>{allowanceRisk.overallLabel}</strong>
                  </div>
                  <div className="scopeBuilderChecklistGrid">
                    {allowanceRisk.flags.map((flag) => (
                      <article key={flag.id}>
                        <strong>{flag.label}</strong>
                        <p>{flag.customerSafePrompt}</p>
                        {flag.requiresHumanReview && <small>Human review recommended</small>}
                      </article>
                    ))}
                  </div>
                  <div className="scopeBuilderResultGrid riskFollowUpGrid">
                    <article>
                      <h4>Missing inclusions to confirm</h4>
                      <ul>{allowanceRisk.missingInclusions.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                    <article>
                      <h4>Customer questions</h4>
                      <ul>{allowanceRisk.customerQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
                    </article>
                  </div>
                  <div className="compactActions">
                    <Link className="button ghost" href={allowanceRisk.recommendedPathway.href} onClick={() => trackKitchenEvent('scope_builder_pathway_selected', { href: allowanceRisk.recommendedPathway.href })}>
                      {allowanceRisk.recommendedPathway.label}
                    </Link>
                  </div>
                </section>
                <div className="scopeBuilderResultGrid">
                  <section className="advancedPanel">
                    <h3>Measurement preparation</h3>
                    <ul>{result.measurementPreparation.map((item) => <li key={item}>{item}</li>)}</ul>
                  </section>
                  <section className="advancedPanel">
                    <h3>Site-measure preparation</h3>
                    <ul>{result.siteMeasurePreparation.map((item) => <li key={item}>{item}</li>)}</ul>
                  </section>
                </div>
                <p className="wizardTrustLine">{result.safetyMessage} {kitchenScopeLegalMessage}</p>
                {submitted && (
                  <div className="successPanel" role="status">
                    <strong>Kitchen scope prepared locally.</strong>
                    <p>This local review version does not save to Supabase or create project documentation. Choose the safest next step below.</p>
                  </div>
                )}
                <div className="summaryCtaGrid">
                  <Link className="button primary" href={result.recommendedNextStep.href} onClick={() => trackKitchenEvent('scope_builder_pathway_selected', { href: result.recommendedNextStep.href })}>{result.recommendedNextStep.label}</Link>
                  {secondaryPathways.map((pathway) => (
                    <Link
                      className="button ghost"
                      href={pathway.href}
                      key={pathway.href}
                      onClick={() => trackKitchenEvent('scope_builder_pathway_selected', { href: pathway.href })}
                    >
                      {pathway.label}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="wizardActions">
              <button type="button" className="button ghost" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>Back</button>
              {step < stepLabels.length - 1 ? (
                <button type="button" className="button primary" onClick={nextStep}>Next</button>
              ) : (
                <button type="submit" className="button primary">Prepare kitchen scope</button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
