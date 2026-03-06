"use client";

import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2, Upload } from 'lucide-react';

interface EditableImageProps {
  initialValue?: string;
  onSave: (value: string) => void;
  className?: string;
  aspectRatio?: string;
  alt?: string;
}

export function EditableImage({
  initialValue,
  onSave,
  className = '',
  aspectRatio = 'aspect-video',
  alt = 'Editable image'
}: EditableImageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onSave(data.secure_url);
      setPreviewUrl(data.secure_url);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(initialValue); // Revert on error
    } finally {
      setIsUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`group relative overflow-hidden cursor-pointer ${aspectRatio} ${className}`}
      onClick={triggerUpload}
    >
      {previewUrl ? (
        <img 
          src={previewUrl} 
          alt={alt} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isUploading ? 'opacity-50 grayscale' : ''}`} 
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2">
          <ImageIcon className="w-8 h-8" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Click to upload</span>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl">
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-black" />
          ) : (
            <Upload className="w-5 h-5 text-black" />
          )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
}
