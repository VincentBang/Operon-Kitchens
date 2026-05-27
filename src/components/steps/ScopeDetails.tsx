import React from 'react';
import { QuoteInput } from '@/lib/pricing';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const ScopeDetails: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Scope and layout</h2>
      <div className="flex flex-col space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.layoutChange}
            onChange={(e) => onChange({ ...data, layoutChange: e.target.checked })}
          />
          <span>I want to change the layout</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.highRiskItems}
            onChange={(e) => onChange({ ...data, highRiskItems: e.target.checked })}
          />
          <span>Includes structural changes or major service relocation</span>
        </label>
      </div>
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

export default ScopeDetails;