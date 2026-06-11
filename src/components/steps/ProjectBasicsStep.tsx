import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
}

const projectTypeOptions: { value: QuoteInput['projectType']; title: string; description: string }[] = [
  { value: 'fullRenovation', title: 'Full renovation', description: 'Cabinetry, surfaces, trades and removal may all be in scope.' },
  { value: 'cabinetryBenchtopRefresh', title: 'Cabinetry + benchtop refresh', description: 'Good when the layout mostly stays and selections need review.' },
  { value: 'benchtopOnly', title: 'Benchtop only', description: 'Focused surface replacement with cut-outs and compliance checks.' },
  { value: 'notSure', title: 'Not sure yet', description: 'Use this if you want the estimate to flag what needs clarification.' },
];

const timingOptions: { value: QuoteInput['roughTiming']; title: string; description: string }[] = [
  { value: 'planning', title: 'Planning', description: 'Researching budget and scope.' },
  { value: 'oneToThreeMonths', title: '1-3 months', description: 'Starting to compare options.' },
  { value: 'readySoon', title: 'Ready soon', description: 'Need review and next steps.' },
  { value: 'urgent', title: 'Urgent', description: 'Quote or site timing is pressing.' },
];

export default function ProjectBasicsStep({ data, onChange, onNext }: Props) {
  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Project basics</h2>
        <p>Start with your project intent, suburb and timing. This first step keeps the estimate moving while separating information confidence from items that may need review.</p>
        <p className="stepHint">Not sure yet is okay. The planning estimate improves as more details are added.</p>
      </div>

      <section className="stepMiniSection">
        <h3>What are you planning?</h3>
        <div className="choiceGrid compact">
          {projectTypeOptions.map((option) => (
            <label className="checkCard optionCard" key={option.value}>
              <input
                type="radio"
                name="projectType"
                checked={data.projectType === option.value}
                onChange={() => onChange({ ...data, projectType: option.value })}
              />
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="stepMiniSection">
        <h3>Where and when?</h3>
        <p className="sectionHelper">Use the suburb and timing to shape the planning range and follow-up pathway. Budget band is optional.</p>
        <div className="formGrid two">
          <label className="field">
            <span>Suburb</span>
            <input value={data.suburb} placeholder="e.g. Randwick" onChange={(event) => onChange({ ...data, suburb: event.target.value })} />
          </label>
          <label className="field">
            <span>Budget band optional</span>
            <select value={data.budgetBand} onChange={(event) => onChange({ ...data, budgetBand: event.target.value as QuoteInput['budgetBand'] })}>
              <option value="notSpecified">Prefer not to say</option>
              <option value="under25k">Under $25k</option>
              <option value="25kTo45k">$25k-$45k</option>
              <option value="45kTo70k">$45k-$70k</option>
              <option value="70kPlus">$70k+</option>
            </select>
          </label>
        </div>
      </section>

      <section className="stepMiniSection">
        <h3>Timing</h3>
        <div className="choiceGrid compact">
          {timingOptions.map((option) => (
            <label className="checkCard optionCard" key={option.value}>
              <input
                type="radio"
                name="roughTiming"
                checked={data.roughTiming === option.value}
                onChange={() => onChange({ ...data, roughTiming: option.value })}
              />
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="stepMiniSection">
        <h3>Helpful context</h3>
        <p className="sectionHelper">These answers help Operon Kitchens decide whether quote review, site measure preparation or more scope detail should come next.</p>
        <div className="formGrid two">
          <label className="checkCard">
            <input type="checkbox" checked={data.hasExistingQuote} onChange={(event) => onChange({ ...data, hasExistingQuote: event.target.checked })} />
            <span><strong>I have an existing quote</strong><small>You can add quote details later for review.</small></span>
          </label>
          <label className="checkCard">
            <input type="checkbox" checked={data.layoutChange} onChange={(event) => onChange({ ...data, layoutChange: event.target.checked })} />
            <span><strong>Layout change likely</strong><small>Cabinets, appliances or work zones may move.</small></span>
          </label>
        </div>
      </section>

      <div className="wizardActions end">
        <button className="button primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
