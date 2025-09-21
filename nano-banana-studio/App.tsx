
import React, { useState, useEffect, useCallback } from 'react';
import type { VideosOperation } from '@google/genai';
import { AppState, Mode, AspectRatio, GeneratedMedia, Creation } from './types';
import { generateNewImage, editImage, generateVideo, checkVideoStatus, translateText, buildCreativePrompt } from './services/geminiService';
import * as dbService from './services/dbService';
import { fileToBase64 } from './utils/fileUtils';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import MediaDisplay from './components/MediaDisplay';
import GalleryModal from './components/GalleryModal';
import PromptHelperModal from './components/PromptHelperModal';
import { BananaIcon } from './components/icons';

const initialAppState: AppState = {
  prompt: '',
  negativePrompt: '',
  baseImage: null,
  baseImageMimeType: null,
  blendImage: null,
  blendImageMimeType: null,
  aspectRatio: '1:1',
  mode: Mode.Image,
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPromptHelperOpen, setIsPromptHelperOpen] = useState(false);
  // FIX: Changed NodeJS.Timeout to number for browser compatibility.
  const [videoPollInterval, setVideoPollInterval] = useState<number | null>(null);

  useEffect(() => {
    dbService.initDB();
    // Cleanup interval on unmount
    return () => {
      if (videoPollInterval) {
        clearInterval(videoPollInterval);
      }
    };
  }, [videoPollInterval]);

  const clearAll = () => {
    setAppState(initialAppState);
    setGeneratedMedia(null);
    setError(null);
  };

  const handleStateChange = <K extends keyof AppState>(key: K, value: AppState[K]) => {
    setAppState(prevState => ({ ...prevState, [key]: value }));
  };

  const handleImageUpload = async (file: File, type: 'baseImage' | 'blendImage') => {
    try {
      const { base64 } = await fileToBase64(file);
      if (type === 'baseImage') {
        setAppState(prev => ({ ...prev, baseImage: base64, baseImageMimeType: file.type }));
      } else {
        setAppState(prev => ({ ...prev, blendImage: base64, blendImageMimeType: file.type }));
      }
    } catch (err) {
      setError('Failed to read image file.');
    }
  };

  // FIX: Provided a specific type for the 'operation' parameter instead of 'any'.
  const pollVideoOperation = useCallback((operation: VideosOperation) => {
    const loadingMessages = [
      "Warming up the video synthesizer...",
      "Polling for quantum entanglement...",
      "Aligning the cinematic universe...",
      "Rendering pixel by pixel...",
      "Finalizing the director's cut...",
      "Compressing to internet-size...",
    ];
    let messageIndex = 0;
    setLoadingMessage(loadingMessages[messageIndex]);

    const intervalId = setInterval(async () => {
      try {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);

        const updatedOp = await checkVideoStatus(operation);
        if (updatedOp.done) {
          clearInterval(intervalId);
          setVideoPollInterval(null);
          const videoUri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
          if (videoUri) {
            const newMedia: GeneratedMedia = {
              id: `vid-${Date.now()}`,
              src: videoUri,
              type: 'video',
              text: 'Your video has been generated.',
            };
            setGeneratedMedia(newMedia);
            
            const creation: Creation = { ...appState, createdAt: new Date(), generatedMedia: newMedia };
            await dbService.addCreation(creation);

          } else {
            throw new Error("Video generation finished, but no URI was found.");
          }
          setIsLoading(false);
          setLoadingMessage('');
        }
      } catch (err: any) {
        setError(`Video polling failed: ${err.message}`);
        setIsLoading(false);
        setLoadingMessage('');
        clearInterval(intervalId);
        setVideoPollInterval(null);
      }
    }, 10000);
    setVideoPollInterval(intervalId);
  }, [appState]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedMedia(null);

    try {
      let newMedia: GeneratedMedia | null = null;
      if (appState.mode === Mode.Video) {
        setLoadingMessage("Initializing video generation...");
        const operation = await generateVideo(appState.prompt, appState.baseImage, appState.baseImageMimeType);
        pollVideoOperation(operation);
        return; // Polling will handle the rest
      } else { // Image mode
        if (appState.baseImage && appState.baseImageMimeType) {
          setLoadingMessage("Editing your image...");
          const result = await editImage(appState.prompt, appState.baseImage, appState.baseImageMimeType, appState.blendImage, appState.blendImageMimeType);
          newMedia = result;
        } else {
          setLoadingMessage("Creating your vision...");
          const base64Image = await generateNewImage(appState.prompt, appState.aspectRatio);
           newMedia = {
            id: `img-${Date.now()}`,
            src: `data:image/jpeg;base64,${base64Image}`,
            type: 'image',
            text: 'Your image has been generated.',
            mimeType: 'image/jpeg',
           };
        }
      }

      if (newMedia) {
        setGeneratedMedia(newMedia);
        const creation: Creation = { ...appState, createdAt: new Date(), generatedMedia: newMedia };
        await dbService.addCreation(creation);
      }

    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      if (appState.mode === Mode.Image) {
        setIsLoading(false);
        setLoadingMessage('');
      }
    }
  };
  
  const useAsBaseImage = () => {
    if (generatedMedia && generatedMedia.type === 'image') {
      const newBaseImage = generatedMedia.src.split(',')[1];
      setAppState({
        ...initialAppState,
        mode: Mode.Image,
        baseImage: newBaseImage,
        baseImageMimeType: generatedMedia.mimeType || 'image/png'
      });
      setGeneratedMedia(null);
    }
  };

  const reloadCreation = (creation: Creation) => {
    setAppState({
      prompt: creation.prompt,
      negativePrompt: creation.negativePrompt,
      baseImage: creation.baseImage,
      baseImageMimeType: creation.baseImageMimeType,
      blendImage: creation.blendImage,
      blendImageMimeType: creation.blendImageMimeType,
      aspectRatio: creation.aspectRatio,
      mode: creation.mode,
    });
    setGeneratedMedia(creation.generatedMedia);
    setIsGalleryOpen(false);
  };
  

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header onGalleryClick={() => setIsGalleryOpen(true)} />
      <main className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="md:col-span-1 lg:col-span-2">
           <ControlPanel
            appState={appState}
            isLoading={isLoading}
            onStateChange={handleStateChange}
            onImageUpload={handleImageUpload}
            onSubmit={handleSubmit}
            onClearAll={clearAll}
            onOpenPromptHelper={() => setIsPromptHelperOpen(true)}
          />
        </div>
        <div className="md:col-span-1 lg:col-span-3">
          <MediaDisplay
            media={generatedMedia}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
            onUseAsBase={useAsBaseImage}
          />
        </div>
      </main>
      
      {isGalleryOpen && (
        <GalleryModal 
          onClose={() => setIsGalleryOpen(false)}
          onReload={reloadCreation}
        />
      )}
      
      {isPromptHelperOpen && (
        <PromptHelperModal
          onClose={() => setIsPromptHelperOpen(false)}
          currentPrompt={appState.prompt}
          onApplyPrompt={(p) => handleStateChange('prompt', p)}
          buildCreativePrompt={buildCreativePrompt}
        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-800 text-white p-4 rounded-lg shadow-lg z-50">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="absolute top-1 right-2 text-xl">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;
