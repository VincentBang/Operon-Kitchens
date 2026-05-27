import React from 'react';
import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const BenchtopDetails: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Benchtop & splashback</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span>Benchtop type</span>
          <select
            value={data.benchtopType}
            onChange={(e) => onChange({ ...data, benchtopType: e.target.value as any })}
            className="p-2 border rounded"
          >
            <option value="laminate">Laminate</option>
            <option value="solidSurface">Solid surface</option>
            <option value="naturalStone">Natural stone (compliant)</option>
            <option value="porcelain">Porcelain/sintered</option>
            <option value="timber">Timber/bamboo</option>
            <option value="stainless">Stainless steel</option>
            <option value="custom">Other/custom</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span>Benchtop length (m)</span>
          <input
            type="number"
            min="0"
            value={data.benchtopMetres}
            onChange={(e) => onChange({ ...data, benchtopMetres: parseFloat(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Splashback type</span>
          <select
            value={data.splashbackType}
            onChange={(e) => onChange({ ...data, splashbackType: e.target.value as any })}
            className="p-2 border rounded"
          >
            <option value="tile">Tile</option>
            <option value="glass">Glass</option>
            <option value="stone">Stone/compliant slab</option>
            <option value="stainless">Stainless steel</option>
            <option value="acrylic">Acrylic/composite</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span>Splashback area (sqm)</span>
          <input
            type="number"
            min="0"
            value={data.splashbackArea}
            onChange={(e) => onChange({ ...data, splashbackArea: parseFloat(e.target.value) || 0 })}
            className="p-2 border rounded"
          />
        </label>
      </div>
      <p className="text-sm text-gray-600">Note: All benchtop options are subject to supplier compliance confirmation under current Australian regulations.</p>
      <div className="flex justify-between">
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

export default BenchtopDetails;