
import React, { useCallback, useState } from 'react';
import { UploadIcon, XCircleIcon } from './icons';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (file: File) => void;
  currentImage: string | null;
  onClear: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, currentImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onImageUpload(files[0]);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFileChange(event.dataTransfer.files);
  }, [onImageUpload]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold text-slate-300">{label}</label>
      <div
        className={`relative w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-slate-400 transition-colors duration-200 ${isDragging ? 'border-cyan-500 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        {currentImage ? (
          <>
            <img src={currentImage.startsWith('data:') ? currentImage : `data:image/png;base64,${currentImage}`} alt="Uploaded preview" className="object-cover w-full h-full rounded-lg" />
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
              title="Clear image"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </>
        ) : (
          <div className="text-center p-4">
            <UploadIcon className="w-8 h-8 mx-auto text-slate-500" />
            <p className="mt-2 text-sm">Drag & drop or click</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
