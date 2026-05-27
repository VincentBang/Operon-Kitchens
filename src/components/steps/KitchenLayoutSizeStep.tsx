import { QuoteInput, QuoteZone } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function KitchenLayoutSizeStep({ data, onChange, onNext, onBack }: Props) {
  const hasCabinetScope = data.baseLinearMetres + data.overheadLinearMetres + data.tallCabinetQty > 0 || data.kitchenSize !== 'notSure';
  const updateZone = (id: string, patch: Partial<QuoteZone>) => {
    onChange({ ...data, zones: data.zones.map((zone) => (zone.id === id ? { ...zone, ...patch } : zone)) });
  };
  const addZone = (type: QuoteZone['type']) => {
    const name = type === 'other' ? 'Additional zone' : type.charAt(0).toUpperCase() + type.slice(1);
    onChange({
      ...data,
      zones: [...data.zones, {
        id: `${type}-${Date.now()}`,
        name,
        type,
        baseLinearMetres: 0,
        overheadLinearMetres: 0,
        tallCabinetQty: 0,
        drawerQty: 0,
        doorQty: 0,
        panelQty: 0,
        selectedAccessories: [],
      }],
    });
  };

  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Kitchen layout and size</h2>
        <p>Approximate joinery quantities are enough for a planning range. Final measure comes later.</p>
      </div>
      {!hasCabinetScope && <p className="fieldError" role="alert">Choose a rough size or add at least one cabinet quantity before continuing.</p>}
      <div className="formGrid three">
        <label className="field">
          <span>Layout type</span>
          <select value={data.layoutType} onChange={(event) => onChange({ ...data, layoutType: event.target.value as QuoteInput['layoutType'] })}>
            <option value="notSure">Not sure</option>
            <option value="straight">Straight</option>
            <option value="galley">Galley</option>
            <option value="lShape">L-shape</option>
            <option value="uShape">U-shape</option>
            <option value="island">Island</option>
          </select>
        </label>
        <label className="field">
          <span>Rough kitchen size</span>
          <select value={data.kitchenSize} onChange={(event) => onChange({ ...data, kitchenSize: event.target.value as QuoteInput['kitchenSize'] })}>
            <option value="notSure">Not sure</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
        <label className="field">
          <span>Base cabinets (linear m)</span>
          <input type="number" min="0" step="0.1" value={data.baseLinearMetres} aria-invalid={!hasCabinetScope} onChange={(event) => onChange({ ...data, baseLinearMetres: parseFloat(event.target.value) || 0 })} />
        </label>
        <label className="field">
          <span>Overhead cabinets (linear m)</span>
          <input type="number" min="0" step="0.1" value={data.overheadLinearMetres} onChange={(event) => onChange({ ...data, overheadLinearMetres: parseFloat(event.target.value) || 0 })} />
        </label>
        <label className="field">
          <span>Tall cabinets (qty)</span>
          <input type="number" min="0" value={data.tallCabinetQty} onChange={(event) => onChange({ ...data, tallCabinetQty: parseInt(event.target.value) || 0 })} />
        </label>
        <label className="field">
          <span>Drawer banks (qty)</span>
          <input type="number" min="0" value={data.drawerQty} onChange={(event) => onChange({ ...data, drawerQty: parseInt(event.target.value) || 0 })} />
        </label>
        <label className="field">
          <span>Doors (qty)</span>
          <input type="number" min="0" value={data.doorQty} onChange={(event) => onChange({ ...data, doorQty: parseInt(event.target.value) || 0 })} />
        </label>
        <label className="field">
          <span>Panels (qty)</span>
          <input type="number" min="0" value={data.panelQty} onChange={(event) => onChange({ ...data, panelQty: parseInt(event.target.value) || 0 })} />
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.measurementsProvided} onChange={(event) => onChange({ ...data, measurementsProvided: event.target.checked })} />
          <span><strong>Measurements ready</strong><small>Approximate cabinet run or room dimensions are available.</small></span>
        </label>
        <label className="checkCard">
          <input type="checkbox" checked={data.photosProvided} onChange={(event) => onChange({ ...data, photosProvided: event.target.checked })} />
          <span><strong>Floorplan/photos ready</strong><small>Files can be noted in the upload step.</small></span>
        </label>
      </div>
      <details className="advancedPanel">
        <summary>Additional rooms or zones</summary>
        <div className="flexActions compactActions">
          {(['pantry', 'laundry', 'bar', 'other'] as QuoteZone['type'][]).map((type) => (
            <button key={type} type="button" className="button ghost" onClick={() => addZone(type)}>Add {type}</button>
          ))}
        </div>
        <div className="zoneList">
          {data.zones.map((zone) => (
            <article className="zoneCard" key={zone.id}>
              <div className="formGrid three">
                <label className="field">
                  <span>Zone name</span>
                  <input value={zone.name} onChange={(event) => updateZone(zone.id, { name: event.target.value })} />
                </label>
                <label className="field">
                  <span>Base lm</span>
                  <input type="number" min="0" step="0.1" value={zone.baseLinearMetres} onChange={(event) => updateZone(zone.id, { baseLinearMetres: parseFloat(event.target.value) || 0 })} />
                </label>
                <label className="field">
                  <span>Overhead lm</span>
                  <input type="number" min="0" step="0.1" value={zone.overheadLinearMetres} onChange={(event) => updateZone(zone.id, { overheadLinearMetres: parseFloat(event.target.value) || 0 })} />
                </label>
              </div>
              <button type="button" className="textLink" onClick={() => onChange({ ...data, zones: data.zones.filter((item) => item.id !== zone.id) })}>Remove zone</button>
            </article>
          ))}
        </div>
      </details>
      <div className="wizardActions">
        <button className="button ghost" onClick={onBack}>Back</button>
        <button className="button primary" onClick={onNext} disabled={!hasCabinetScope}>Next</button>
      </div>
    </div>
  );
}
