'use client';

import React, { useState } from 'react';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import Image from 'next/image';

interface ImageItem {
  id: string;
  alt: string; // Alt text for the image
  url: string; // URL of the image
}

interface MediaManagerProps {
    productSlug: string; // Now included in the props interface
    images: ImageItem[];
    onImagesUpdate: (updatedImages: ImageItem[]) => void;
  }
  

const MediaManager: React.FC<MediaManagerProps> = ({ images, onImagesUpdate }) => {
  const [localImages, setLocalImages] = useState<ImageItem[]>(images || []);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null); // Dragging state

  const convertToWebP = async (file: File): Promise<File> => {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.8) // Convert to WebP with 80% quality
    );

    if (!blob) {
      throw new Error('Failed to convert image to WebP');
    }

    return new File([blob], `${file.name.split('.')[0]}.webp`, {
      type: 'image/webp',
    });
  };

  const uploadMedia = async (file: File): Promise<ImageItem> => {
    const storage = getStorage();

    const webpFile = await convertToWebP(file); // Convert to .webp
    const mediaId = `media_${Date.now()}`; // Generate unique ID
    const storageRef = ref(storage, `media/${mediaId}`); // Path in Firebase Storage

    await uploadBytes(storageRef, webpFile); // Upload .webp file
    const url = await getDownloadURL(storageRef); // Get public URL

    return { id: mediaId, alt: file.name.split('.')[0], url };
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    try {
      const uploadedImages = await Promise.all(
        Array.from(files).map((file) => uploadMedia(file))
      );

      const updatedImages = [...localImages, ...uploadedImages];
      setLocalImages(updatedImages);
      onImagesUpdate(updatedImages); // Notify parent about the updated array
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDragging(index);
  };

  const handleDragOver = (index: number) => {
    if (dragging === null || dragging === index) return;
  
    const reorderedImages = [...localImages];
    const [draggedItem] = reorderedImages.splice(dragging, 1);
    reorderedImages.splice(index, 0, draggedItem);
  
    setLocalImages(reorderedImages);
    onImagesUpdate(reorderedImages); // Notify parent about the updated order
    setDragging(index);
  };
  

  const handleDragEnd = () => {
    setDragging(null);
  };

  return (
    <div className="p-4 bg-white rounded-md">
      {uploading && <p className="mt-4 text-blue-500">Uploading...</p>}

      <div className="mt-4 flex wrap gap-4">
        {localImages.map((item, index) => (
          <div
            key={item.id}
            className={`relative w-[150px] h-[150px] object-cover rounded-md ${
              dragging === index ? 'border-2 border-blue-500' : ''
            }`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={() => handleDragOver(index)}
            onDragEnd={handleDragEnd}
          >
            <img
              src={item.url}
              alt={item.alt}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
        <div
          className={`w-[150px] h-[150px] flex items-center justify-center gap-2 flex-col text-sm border-dashed border-2 rounded-md p-4 ${
            dragging === null ? 'border-gray-300' : 'border-blue-500'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          <p className="text-center text-gray-500">Add Image</p>
          <Image
            src="/icons/file_add.svg"
            alt="Add Icon"
            width={19}
            height={19}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaManager;
