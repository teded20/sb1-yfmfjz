import React from 'react';
import { Golfer } from '../types';

interface GolferSelectProps {
  golfers: Golfer[];
  selectedGolfers: string[];
  onChange: (golfers: string[]) => void;
  max: number;
  label: string;
  disabled?: boolean;
}

function GolferSelect({
  golfers,
  selectedGolfers,
  onChange,
  max,
  label,
  disabled = false,
}: GolferSelectProps) {
  const handleSelect = (golferId: string) => {
    if (selectedGolfers.includes(golferId)) {
      onChange(selectedGolfers.filter((id) => id !== golferId));
    } else if (selectedGolfers.length < max) {
      onChange([...selectedGolfers, golferId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">
          {selectedGolfers.length}/{max} selected
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {golfers.map((golfer) => (
          <button
            key={golfer.id}
            onClick={() => handleSelect(golfer.id)}
            disabled={
              disabled ||
              (selectedGolfers.length >= max &&
                !selectedGolfers.includes(golfer.id))
            }
            className={`p-4 rounded-lg border text-left transition-colors ${
              selectedGolfers.includes(golfer.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">{golfer.name}</div>
            <div className="text-sm text-gray-500">Rank: {golfer.rank}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GolferSelect;