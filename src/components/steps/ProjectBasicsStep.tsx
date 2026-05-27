import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
}

export default function ProjectBasicsStep({ data, onChange, onNext }: Props) {
  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Project basics</h2>
        <p>Start with the project type, timing and whether you already have a quote. You can refine details later.</p>
      </div>
      <div className="formGrid two">
        <label className="field">
          <span>Project type</span>
          <select value={data.projectType} onChange={(event) => onChange({ ...data, projectType: event.target.value as QuoteInput['projectType'] })}>
            <option value="fullRenovation">Full kitchen renovation</option>
            <option value="cabinetryBenchtopRefresh">Cabinetry and benchtop refresh</option>
            <option value="benchtopOnly">Benchtop only</option>
            <option value="notSure">Not sure yet</option>
          </select>
        </label>
        <label className="field">
          <span>Suburb</span>
          <input value={data.suburb} placeholder="e.g. Randwick" onChange={(event) => onChange({ ...data, suburb: event.target.value })} />
        </label>
        <label className="field">
          <span>Rough timing</span>
          <select value={data.roughTiming} onChange={(event) => onChange({ ...data, roughTiming: event.target.value as QuoteInput['roughTiming'] })}>
            <option value="planning">Planning</option>
            <option value="oneToThreeMonths">1-3 months</option>
            <option value="readySoon">Ready soon</option>
            <option value="urgent">Urgent</option>
          </select>
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
        <label className="checkCard">
          <input type="checkbox" checked={data.hasExistingQuote} onChange={(event) => onChange({ ...data, hasExistingQuote: event.target.checked })} />
          <span><strong>I have an existing quote</strong><small>You can upload it later for review.</small></span>
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.layoutChange} onChange={(event) => onChange({ ...data, layoutChange: event.target.checked })} />
          <span><strong>Layout change likely</strong><small>Cabinets, appliances or work zones may move.</small></span>
        </label>
      </div>
      <div className="wizardActions end">
        <button className="button primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
