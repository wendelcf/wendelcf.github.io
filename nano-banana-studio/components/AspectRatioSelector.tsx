
import React from 'react';
import { AspectRatio } from '../types';
import { SquareIcon, WideIcon, TallIcon, LandscapeIcon, PortraitIcon } from './icons';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
}

const ratios: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { value: '1:1', label: 'Square', icon: <SquareIcon className="w-6 h-6" /> },
  { value: '16:9', label: 'Wide', icon: <WideIcon className="w-6 h-6" /> },
  { value: '9:16', label: 'Tall', icon: <TallIcon className="w-6 h-6" /> },
  { value: '4:3', label: 'Landscape', icon: <LandscapeIcon className="w-6 h-6" /> },
  { value: '3:4', label: 'Portrait', icon: <PortraitIcon className="w-6 h-6" /> },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange }) => {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-slate-300">Aspect Ratio</label>
      <div className="grid grid-cols-5 gap-2">
        {ratios.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onRatioChange(value)}
            title={label}
            className={`flex flex-col items-center justify-center p-2 border-2 rounded-md transition-colors duration-200 ${selectedRatio === value ? 'border-cyan-500 bg-cyan-900/50' : 'border-slate-600 bg-slate-700 hover:border-slate-500'}`}
          >
            {icon}
            <span className="text-xs mt-1 text-slate-400">{value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
