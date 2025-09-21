
import React from 'react';
import { BananaIcon, GalleryIcon } from './icons';

interface HeaderProps {
  onGalleryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGalleryClick }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <BananaIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Nano Banana Studio
        </h1>
      </div>
      <button
        onClick={onGalleryClick}
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
      >
        <GalleryIcon className="w-5 h-5" />
        My Creations
      </button>
    </header>
  );
};

export default Header;
