import React from 'react';
import { QuoteInput } from '@/lib/pricing';

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
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cabinetry details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="flex flex-col">
          <span>Base cabinets (linear m)</span>
          <input
            type="number"
            min="0"
            value={data.baseLinearMetres}
            onChange={(e) => onChange({ ...data, baseLinearMetres: parseFloat(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Overhead cabinets (linear m)</span>
          <input
            type="number"
            min="0"
            value={data.overheadLinearMetres}
            onChange={(e) => onChange({ ...data, overheadLinearMetres: parseFloat(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Tall cabinets (qty)</span>
          <input
            type="number"
            min="0"
            value={data.tallCabinetQty}
            onChange={(e) => onChange({ ...data, tallCabinetQty: parseInt(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Drawer banks (qty)</span>
          <input
            type="number"
            min="0"
            value={data.drawerQty}
            onChange={(e) => onChange({ ...data, drawerQty: parseInt(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Doors (qty)</span>
          <input
            type="number"
            min="0"
            value={data.doorQty}
            onChange={(e) => onChange({ ...data, doorQty: parseInt(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Panels (qty)</span>
          <input
            type="number"
            min="0"
            value={data.panelQty}
            onChange={(e) => onChange({ ...data, panelQty: parseInt(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Drawer runner level</span>
          <select
            value={data.drawerRunnerLevel}
            onChange={(e) => onChange({ ...data, drawerRunnerLevel: e.target.value as any })}
            className="p-2 border rounded"
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="heavyDuty">Heavy duty</option>
            <option value="tipOn">Tip-on</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span>Hinge level</span>
          <select
            value={data.hingeLevel}
            onChange={(e) => onChange({ ...data, hingeLevel: e.target.value as any })}
            className="p-2 border rounded"
          >
            <option value="standard">Standard soft-close</option>
            <option value="premium">Premium soft-close</option>
            <option value="pushToOpen">Push-to-open</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span>Door finish</span>
          <select
            value={data.doorFinish}
            onChange={(e) => onChange({ ...data, doorFinish: e.target.value as any })}
            className="p-2 border rounded"
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
        <label className="flex flex-col">
          <span>Panel finish</span>
          <select
            value={data.panelFinish}
            onChange={(e) => onChange({ ...data, panelFinish: e.target.value as any })}
            className="p-2 border rounded"
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
      <div>
        <h3 className="font-semibold mt-4 mb-2">Accessories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {accessoryOptions.map((opt) => (
            <label key={opt.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.selectedAccessories.includes(opt.key as any)}
                onChange={() => toggleAccessory(opt.key)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={onNext}
          >
            Next
          </button>
      </div>
    </div>
  );
};

export default CabinetryDetails;
