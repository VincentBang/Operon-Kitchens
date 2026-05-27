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
        <p>Set the project type and how much information is ready. You can refine details later.</p>
      </div>
      <div className="formGrid two">
        <label className="field">
          <span>Property type</span>
          <select value={data.propertyType} onChange={(event) => onChange({ ...data, propertyType: event.target.value as QuoteInput['propertyType'] })}>
            <option value="house">House</option>
            <option value="townhouse">Townhouse</option>
            <option value="strataApartment">Strata apartment</option>
          </select>
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.layoutChange} onChange={(event) => onChange({ ...data, layoutChange: event.target.checked })} />
          <span><strong>Layout change likely</strong><small>Cabinets, appliances or work zones may move.</small></span>
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.measurementsProvided} onChange={(event) => onChange({ ...data, measurementsProvided: event.target.checked })} />
          <span><strong>Measurements ready</strong><small>Rough wall runs or dimensions are available.</small></span>
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.photosProvided} onChange={(event) => onChange({ ...data, photosProvided: event.target.checked })} />
          <span><strong>Photos or plans ready</strong><small>Useful for confidence and review.</small></span>
        </label>
      </div>
      <div className="wizardActions end">
        <button className="button primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
