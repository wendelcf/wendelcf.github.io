
import React, { useState } from 'react';
import { GeneratedMedia } from '../types';
import { BananaIcon, DownloadIcon, ImageIcon, UseAsBaseIcon } from './icons';
import Spinner from './Spinner';

interface MediaDisplayProps {
  media: GeneratedMedia | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  onUseAsBase: () => void;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ media, isLoading, loadingMessage, error, onUseAsBase }) => {
  const [isHovered, setIsHovered] = useState(false);

  const downloadMedia = () => {
    if (!media) return;
    const link = document.createElement('a');
    link.href = media.src;
    const fileExtension = media.type === 'image' ? 'jpg' : 'mp4';
    link.download = `creation-${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const WelcomeScreen = () => (
    <div className="text-center text-slate-400">
      <BananaIcon className="w-24 h-24 mx-auto text-slate-700" />
      <h2 className="mt-4 text-3xl font-bold text-slate-300">Welcome to Nano Banana Studio</h2>
      <p className="mt-2 text-lg">Your AI-powered media creation suite.</p>
      <p>Use the panel on the left to start creating!</p>
    </div>
  );

  const LoadingScreen = () => (
    <div className="text-center text-slate-400">
      <Spinner className="w-16 h-16 mx-auto text-cyan-500" />
      <p className="mt-4 text-xl font-semibold text-slate-300 animate-pulse">{loadingMessage}</p>
    </div>
  );
  
  const ErrorScreen = () => (
      <div className="text-center text-red-400">
        <ImageIcon className="w-24 h-24 mx-auto text-red-500/50" />
        <h3 className="mt-4 text-2xl font-bold text-red-300">Generation Failed</h3>
        <p className="mt-2 text-md bg-red-900/50 p-3 rounded-md">{error}</p>
      </div>
  );

  return (
    <div className="bg-slate-800/50 w-full h-full min-h-[60vh] rounded-lg shadow-lg flex items-center justify-center p-4">
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        {isLoading ? <LoadingScreen /> :
         error ? <ErrorScreen /> :
         !media ? <WelcomeScreen /> : (
          <>
            <div 
              className="relative w-full max-w-full max-h-[70vh] aspect-auto flex justify-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {media.type === 'image' ? (
                <img src={media.src} alt="Generated media" className="object-contain max-w-full max-h-full rounded-md shadow-2xl" />
              ) : (
                <video src={`${media.src}&key=${process.env.API_KEY}`} controls className="object-contain max-w-full max-h-full rounded-md shadow-2xl">
                    Your browser does not support the video tag.
                </video>
              )}
              {media.type === 'image' && isHovered && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 opacity-100 rounded-md">
                  <button onClick={downloadMedia} className="flex items-center gap-2 bg-slate-700/80 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <DownloadIcon className="w-5 h-5"/> Download
                  </button>
                  <button onClick={onUseAsBase} className="flex items-center gap-2 bg-slate-700/80 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    <UseAsBaseIcon className="w-5 h-5"/> Use as Base
                  </button>
                </div>
              )}
            </div>
            {media.text && (
              <p className="text-slate-400 mt-2 text-center bg-slate-700/50 p-3 rounded-md w-full max-w-lg">{media.text}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaDisplay;
