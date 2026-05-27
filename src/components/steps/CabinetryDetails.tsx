import React from 'react';
import { QuoteInput, QuoteZone } from '@/lib/pricing';
import HelpTooltip from '@/components/ui/HelpTooltip';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const CabinetryDetails: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const accessoryOptions: { key: string; label: string }[] = [
    { key: 'pullOutBin', label: 'Pull-out bin' },
    { key: 'cutleryTray', label: 'Cutlery tray' },
    { key: 'spicePullOut', label: 'Spice pull-out' },
    { key: 'carousel', label: 'Corner carousel' },
    { key: 'pullOutPantry', label: 'Pull-out pantry' },
    { key: 'tallPantryDrawers', label: 'Tall pantry drawers' },
    { key: 'oilPullOut', label: 'Oil pull-out' },
    { key: 'underSinkDrawer', label: 'Under-sink drawer' },
    { key: 'applianceGarage', label: 'Appliance garage' },
    { key: 'ledLighting', label: 'LED lighting' },
    { key: 'wineRack', label: 'Wine rack' },
    { key: 'openShelves', label: 'Open shelves' }
  ];
  const toggleAccessory = (key: string) => {
    const selected = data.selectedAccessories.includes(key as any);
    if (selected) {
      onChange({ ...data, selectedAccessories: data.selectedAccessories.filter(a => a !== key) });
    } else {
      onChange({ ...data, selectedAccessories: [...data.selectedAccessories, key as any] });
    }
  };
  const createZone = (type: QuoteZone['type']) => {
    const label = type === 'other' ? 'Additional zone' : type.charAt(0).toUpperCase() + type.slice(1);
    onChange({
      ...data,
      zones: [
        ...data.zones,
        {
          id: `${type}-${Date.now()}`,
          name: label,
          type,
          baseLinearMetres: 0,
          overheadLinearMetres: 0,
          tallCabinetQty: 0,
          drawerQty: 0,
          doorQty: 0,
          panelQty: 0,
          selectedAccessories: [],
        },
      ],
    });
  };
  const updateZone = (id: string, patch: Partial<QuoteZone>) => {
    onChange({ ...data, zones: data.zones.map((zone) => (zone.id === id ? { ...zone, ...patch } : zone)) });
  };
  const removeZone = (id: string) => {
    onChange({ ...data, zones: data.zones.filter((zone) => zone.id !== id) });
  };
  const hasCabinetScope = data.baseLinearMetres + data.overheadLinearMetres + data.tallCabinetQty > 0;
  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Cabinetry details</h2>
        <p>Enter approximate quantities. The estimator uses ranges and flags low-confidence scopes for review.</p>
      </div>
      {!hasCabinetScope && <p className="fieldError" role="alert">Add at least one base, overhead or tall cabinet quantity before continuing.</p>}
      <div className="formGrid three">
        <label className="field">
          <span>Base cabinets (linear m)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={data.baseLinearMetres}
            onChange={(e) => onChange({ ...data, baseLinearMetres: parseFloat(e.target.value) || 0 })}
            aria-invalid={!hasCabinetScope}
          />
        </label>
        <label className="field">
          <span>Overhead cabinets (linear m)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={data.overheadLinearMetres}
            onChange={(e) => onChange({ ...data, overheadLinearMetres: parseFloat(e.target.value) || 0 })}
            aria-invalid={!hasCabinetScope}
          />
        </label>
        <label className="field">
          <span>Tall cabinets (qty)</span>
          <input
            type="number"
            min="0"
            value={data.tallCabinetQty}
            onChange={(e) => onChange({ ...data, tallCabinetQty: parseInt(e.target.value) || 0 })}
            aria-invalid={!hasCabinetScope}
          />
        </label>
        <label className="field">
          <span>Drawer banks (qty)</span>
          <input
            type="number"
            min="0"
            value={data.drawerQty}
            onChange={(e) => onChange({ ...data, drawerQty: parseInt(e.target.value) || 0 })}
          />
        </label>
        <label className="field">
          <span>Doors (qty)</span>
          <input
            type="number"
            min="0"
            value={data.doorQty}
            onChange={(e) => onChange({ ...data, doorQty: parseInt(e.target.value) || 0 })}
          />
        </label>
        <label className="field">
          <span>Panels (qty)</span>
          <input
            type="number"
            min="0"
            value={data.panelQty}
            onChange={(e) => onChange({ ...data, panelQty: parseInt(e.target.value) || 0 })}
          />
        </label>
        <label className="field">
          <span>Drawer runner level</span>
          <select
            value={data.drawerRunnerLevel}
            onChange={(e) => onChange({ ...data, drawerRunnerLevel: e.target.value as any })}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="heavyDuty">Heavy duty</option>
            <option value="tipOn">Tip-on</option>
          </select>
        </label>
        <label className="field">
          <span>Hinge level</span>
          <select
            value={data.hingeLevel}
            onChange={(e) => onChange({ ...data, hingeLevel: e.target.value as any })}
          >
            <option value="standard">Standard soft-close</option>
            <option value="premium">Premium soft-close</option>
            <option value="pushToOpen">Push-to-open</option>
          </select>
        </label>
        <label className="field">
          <span>Door finish <HelpTooltip label="Door finish help">Finish tier changes the visible door and drawer face allowance. Final selection needs supplier confirmation.</HelpTooltip></span>
          <select
            value={data.doorFinish}
            onChange={(e) => onChange({ ...data, doorFinish: e.target.value as any })}
          >
            <option value="melamine">Melamine</option>
            <option value="laminate">Laminate</option>
            <option value="thermo">Thermolaminated</option>
            <option value="polyurethane">Polyurethane</option>
            <option value="veneer">Timber veneer</option>
            <option value="shaker">Shaker/profiled</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="field">
          <span>Panel finish</span>
          <select
            value={data.panelFinish}
            onChange={(e) => onChange({ ...data, panelFinish: e.target.value as any })}
          >
            <option value="melamine">Melamine</option>
            <option value="laminate">Laminate</option>
            <option value="thermo">Thermolaminated</option>
            <option value="polyurethane">Polyurethane</option>
            <option value="veneer">Timber veneer</option>
            <option value="custom">Custom</option>
          </select>
        </label>
      </div>
      <details className="advancedPanel" open>
        <summary>Accessories and internal hardware</summary>
        <div className="choiceGrid compact">
          {accessoryOptions.map((opt) => (
            <label key={opt.key} className="checkCard">
              <input
                type="checkbox"
                checked={data.selectedAccessories.includes(opt.key as any)}
                onChange={() => toggleAccessory(opt.key)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </details>
      <details className="advancedPanel" open>
        <summary>Additional rooms and zones</summary>
        <p className="muted">Add cabinetry scope for pantry, laundry, bar or other connected joinery zones.</p>
        <div className="flexActions compactActions">
          <button type="button" className="button ghost" onClick={() => createZone('pantry')}>Add pantry</button>
          <button type="button" className="button ghost" onClick={() => createZone('laundry')}>Add laundry</button>
          <button type="button" className="button ghost" onClick={() => createZone('bar')}>Add bar</button>
          <button type="button" className="button ghost" onClick={() => createZone('other')}>Add other</button>
        </div>
        {data.zones.length > 0 && (
          <div className="zoneList">
            {data.zones.map((zone) => (
              <article className="zoneCard" key={zone.id}>
                <div className="adminSectionHeader">
                  <label className="field zoneName">
                    <span>Zone name</span>
                    <input value={zone.name} onChange={(event) => updateZone(zone.id, { name: event.target.value })} />
                  </label>
                  <button type="button" className="button ghost" onClick={() => removeZone(zone.id)}>Remove</button>
                </div>
                <div className="formGrid three">
                  <label className="field">
                    <span>Type</span>
                    <select value={zone.type} onChange={(event) => updateZone(zone.id, { type: event.target.value as QuoteZone['type'] })}>
                      <option value="pantry">Pantry</option>
                      <option value="laundry">Laundry</option>
                      <option value="bar">Bar</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Base cabinets (m)</span>
                    <input type="number" min="0" step="0.1" value={zone.baseLinearMetres} onChange={(event) => updateZone(zone.id, { baseLinearMetres: parseFloat(event.target.value) || 0 })} />
                  </label>
                  <label className="field">
                    <span>Overheads (m)</span>
                    <input type="number" min="0" step="0.1" value={zone.overheadLinearMetres} onChange={(event) => updateZone(zone.id, { overheadLinearMetres: parseFloat(event.target.value) || 0 })} />
                  </label>
                  <label className="field">
                    <span>Tall cabinets</span>
                    <input type="number" min="0" value={zone.tallCabinetQty} onChange={(event) => updateZone(zone.id, { tallCabinetQty: parseInt(event.target.value) || 0 })} />
                  </label>
                  <label className="field">
                    <span>Drawer banks</span>
                    <input type="number" min="0" value={zone.drawerQty} onChange={(event) => updateZone(zone.id, { drawerQty: parseInt(event.target.value) || 0 })} />
                  </label>
                  <label className="field">
                    <span>Doors</span>
                    <input type="number" min="0" value={zone.doorQty} onChange={(event) => updateZone(zone.id, { doorQty: parseInt(event.target.value) || 0 })} />
                  </label>
                  <label className="field">
                    <span>Panels</span>
                    <input type="number" min="0" value={zone.panelQty} onChange={(event) => updateZone(zone.id, { panelQty: parseInt(event.target.value) || 0 })} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}
      </details>
      <div className="wizardActions">
          <button
            className="button ghost"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="button primary"
            onClick={onNext}
            disabled={!hasCabinetScope}
          >
            Next
          </button>
      </div>
    </div>
  );
};

export default CabinetryDetails;
