
import React, { useEffect, useState } from 'react';
import * as dbService from '../services/dbService';
import { Creation } from '../types';
import { XCircleIcon, ReloadIcon, TrashIcon, VideoIcon } from './icons';

interface GalleryModalProps {
  onClose: () => void;
  onReload: (creation: Creation) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ onClose, onReload }) => {
  const [creations, setCreations] = useState<Creation[]>([]);
  
  useEffect(() => {
    const fetchCreations = async () => {
      const allCreations = await dbService.getAllCreations();
      setCreations(allCreations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    };
    fetchCreations();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to permanently delete this creation?")) {
      await dbService.deleteCreation(id);
      setCreations(creations.filter(c => c.id !== id));
    }
  };

  const CreationItem: React.FC<{ creation: Creation }> = ({ creation }) => {
    const [isHovered, setIsHovered] = useState(false);
    const media = creation.generatedMedia;
    
    return (
      <div 
        className="relative aspect-square bg-slate-700 rounded-lg overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {media.type === 'image' ? (
          <img src={media.src} className="w-full h-full object-cover" alt="Creation thumbnail" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <VideoIcon className="w-12 h-12 text-slate-500" />
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 p-3 text-white w-full">
            <p className="text-xs font-mono truncate">{creation.prompt || 'No prompt'}</p>
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <button title="Reload Creation" onClick={() => onReload(creation)} className="p-2 bg-slate-800/80 rounded-full hover:bg-cyan-600"><ReloadIcon className="w-5 h-5"/></button>
            <button title="Delete Creation" onClick={() => handleDelete(creation.id!)} className="p-2 bg-slate-800/80 rounded-full hover:bg-red-600"><TrashIcon className="w-5 h-5"/></button>
          </div>
          {media.type === 'video' && <div className="absolute top-2 left-2 p-1 bg-black/50 rounded-full"><VideoIcon className="w-4 h-4 text-white"/></div>}
        </div>
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 w-full max-w-6xl h-full max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold">My Creations</h2>
          <button onClick={onClose}><XCircleIcon className="w-8 h-8 text-slate-400 hover:text-white"/></button>
        </div>
        <div className="p-4 md:p-6 flex-grow overflow-y-auto">
            {creations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {creations.map(c => <CreationItem key={c.id} creation={c} />)}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <p className="text-xl">Your gallery is empty.</p>
                    <p>Start creating to see your work here!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
