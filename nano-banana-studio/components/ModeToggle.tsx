
import React from 'react';
import { Mode } from '../types';
import { ImageIcon, VideoIcon } from './icons';

interface ModeToggleProps {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="bg-slate-700 p-1 rounded-lg flex w-full">
      <button
        onClick={() => onModeChange(Mode.Image)}
        className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${selectedMode === Mode.Image ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
      >
        <ImageIcon className="w-5 h-5" /> Image
      </button>
      <button
        onClick={() => onModeChange(Mode.Video)}
        className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${selectedMode === Mode.Video ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
      >
        <VideoIcon className="w-5 h-5" /> Video
      </button>
    </div>
  );
};

export default ModeToggle;
