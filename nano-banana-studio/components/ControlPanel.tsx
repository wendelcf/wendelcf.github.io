
import React from 'react';
import { AppState, Mode } from '../types';
import ModeToggle from './ModeToggle';
import ImageUploader from './ImageUploader';
import AspectRatioSelector from './AspectRatioSelector';
import { SparklesIcon, TranslateIcon, ClearIcon, ExpandIcon } from './icons';
import Spinner from './Spinner';
import { translateText } from '../services/geminiService';

interface ControlPanelProps {
  appState: AppState;
  isLoading: boolean;
  onStateChange: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
  onImageUpload: (file: File, type: 'baseImage' | 'blendImage') => void;
  onSubmit: () => void;
  onClearAll: () => void;
  onOpenPromptHelper: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  appState, isLoading, onStateChange, onImageUpload, onSubmit, onClearAll, onOpenPromptHelper
}) => {
  const isEditing = !!appState.baseImage;
  const isImageMode = appState.mode === Mode.Image;
  const isVideoMode = appState.mode === Mode.Video;

  const getButtonText = () => {
    if (isVideoMode) return "Generate Video";
    if (isImageMode) {
      return isEditing ? "Generate Edit" : "Create Image";
    }
    return "Generate";
  };
  
  const handleTranslate = async (field: 'prompt' | 'negativePrompt') => {
    const textToTranslate = appState[field];
    if (!textToTranslate.trim()) return;
    try {
        const translatedText = await translateText(textToTranslate, 'en');
        onStateChange(field, translatedText);
    } catch (e) {
        console.error("Translation failed", e);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-6 h-full flex flex-col">
      <ModeToggle selectedMode={appState.mode} onModeChange={(mode) => onStateChange('mode', mode)} />
      
      <div className="flex-grow space-y-6 overflow-y-auto pr-2">
        {/* Main Prompt */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="font-semibold text-slate-300">Describe Your Vision</label>
          <div className="relative">
            <textarea
              id="prompt"
              value={appState.prompt}
              onChange={(e) => onStateChange('prompt', e.target.value)}
              placeholder={isImageMode ? "e.g., A cinematic shot of a robot drinking coffee in a neon-lit Tokyo alley" : "e.g., A majestic eagle soaring over a mountain range at sunrise"}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none h-32"
              rows={4}
            />
             <div className="absolute bottom-2 right-2 flex gap-1">
                <button onClick={() => handleTranslate('prompt')} title="Translate to English" className="p-1.5 bg-slate-600/50 hover:bg-slate-600 rounded"><TranslateIcon className="w-4 h-4" /></button>
                <button onClick={onOpenPromptHelper} title="Prompt Helper & Tips" className="p-1.5 bg-slate-600/50 hover:bg-slate-600 rounded"><SparklesIcon className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Base and Blend Image Uploaders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(isImageMode || isVideoMode) && (
            <ImageUploader
              label="Base Image"
              onImageUpload={(file) => onImageUpload(file, 'baseImage')}
              currentImage={appState.baseImage}
              onClear={() => { onStateChange('baseImage', null); onStateChange('baseImageMimeType', null);}}
            />
          )}
          {isImageMode && isEditing && (
            <ImageUploader
              label="Blend Image"
              onImageUpload={(file) => onImageUpload(file, 'blendImage')}
              currentImage={appState.blendImage}
              onClear={() => { onStateChange('blendImage', null); onStateChange('blendImageMimeType', null); }}
            />
          )}
        </div>

        {/* Negative Prompt */}
        {isImageMode && !isEditing && (
          <div className="space-y-2">
            <label htmlFor="negativePrompt" className="font-semibold text-slate-300">Negative Prompt (Optional)</label>
             <div className="relative">
                <textarea
                  id="negativePrompt"
                  value={appState.negativePrompt}
                  onChange={(e) => onStateChange('negativePrompt', e.target.value)}
                  placeholder="e.g., blurry, watermark, text, signature"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none h-24"
                  rows={2}
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                    <button onClick={() => handleTranslate('negativePrompt')} title="Translate to English" className="p-1.5 bg-slate-600/50 hover:bg-slate-600 rounded"><TranslateIcon className="w-4 h-4" /></button>
                </div>
            </div>
          </div>
        )}
        
        {/* Aspect Ratio */}
        {isImageMode && !isEditing && (
          <AspectRatioSelector
            selectedRatio={appState.aspectRatio}
            onRatioChange={(ratio) => onStateChange('aspectRatio', ratio)}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 pt-4 border-t border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onSubmit}
            disabled={isLoading || !appState.prompt}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 text-lg"
          >
            {isLoading ? <Spinner /> : <SparklesIcon />}
            {isLoading ? "Creating..." : getButtonText()}
          </button>
          <button
            onClick={onClearAll}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold py-3 px-4 rounded-md transition-colors duration-200"
          >
            <ClearIcon className="w-5 h-5" /> Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
