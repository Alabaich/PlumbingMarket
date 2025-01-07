'use client';

import React, { useState } from 'react';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import Image from 'next/image';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';



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

const MediaManager: React.FC<MediaManagerProps> = ({
  images,
  onImagesUpdate,
  productSlug,
}) => {
  const [localImages, setLocalImages] = useState<ImageItem[]>(images || []);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null); // Dragging state
  const [isDragOverUpload, setIsDragOverUpload] = useState(false); // Drag-over state for upload zone

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
  
    // Update Firestore with the media entry
    const db = getFirestore();
    const mediaDocRef = doc(db, 'media', mediaId);
  
    await setDoc(mediaDocRef, {
      id: mediaId,
      alt: file.name.split('.')[0],
      url,
      type: 'image',
      created_at: new Date().toISOString(),
    });
  
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
  
      // Update Firestore product with the new image order
      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug);
  
      await updateDoc(productDoc, {
        images: updatedImages.map((image) => image.id),
      });
  
      onImagesUpdate(updatedImages); // Ensure parent component is updated
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleDragOverImage = (index: number) => {
    if (dragging === null || dragging === index) return;
  
    const reorderedImages = [...localImages];
    const [draggedItem] = reorderedImages.splice(dragging, 1);
    reorderedImages.splice(index, 0, draggedItem);
  
    setLocalImages(reorderedImages);
  
    // Update Firestore with the reordered images
    const db = getFirestore();
    const productDoc = doc(db, 'products', productSlug);
  
    updateDoc(productDoc, {
      images: reorderedImages.map((image) => image.id),
    });
  
    onImagesUpdate(reorderedImages); // Ensure parent component is updated
    setDragging(index);
  };
  

  const handleDragStart = (index: number) => {
    setDragging(index);
  };

  const handleDeleteImage = async (imageId: string) => {
    const updatedImages = localImages.filter((image) => image.id !== imageId);
    setLocalImages(updatedImages);
  
    // Update Firestore product with the new image order
    const db = getFirestore();
    const productDoc = doc(db, 'products', productSlug);
  
    await updateDoc(productDoc, {
      images: updatedImages.map((image) => image.id),
    });
  
    onImagesUpdate(updatedImages); // Notify the parent about the updated images
  };

  
  const handleDragOverUpload = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOverUpload(true); // Indicate the user is dragging over the upload zone
  };

  const handleDropUpload = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOverUpload(false);

    const files = event.dataTransfer.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDragLeaveUpload = () => {
    setIsDragOverUpload(false);
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  return (
    <div className="p-4 bg-white rounded-md">
      <h3 className="text-lg font-sm text-gray-700">Media:</h3>
      {uploading && <p className="mt-4 text-blue-500">Uploading...</p>}

      <div className="grid grid-cols-5 gap-4 mt-4">
        {localImages.map((item, index) => (
          <div
            key={item.id}
            className={`relative ${
              index === 0
                ? 'col-span-2 row-span-2' // First image spans 2 columns and 2 rows
                : ''
            } rounded-md overflow-hidden ${
              dragging === index ? 'border-2 border-blue-500' : ''
            }`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={() => handleDragOverImage(index)}
            onDragEnd={handleDragEnd}
          >
            <div className="aspect-square w-full h-auto">
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
                    <button
        onClick={() => handleDeleteImage(item.id)}
        className="absolute top-2 right-2 bg-white rounded-sm text-white rounded-sm w-6 h-6 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
        title="Delete Image"
      >
        <Image
          src="/icons/trash full small.svg"
          alt="Delete Icon"
          width={16}
          height={16}
        />
      </button>
            </div>
          </div>
        ))}
        <label
          htmlFor="file-upload"
          className={`aspect-square w-full h-auto flex items-center justify-center gap-2 flex-col text-sm border-dashed border-2 rounded-md p-4 cursor-pointer ${
            isDragOverUpload ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
          onDragOver={handleDragOverUpload}
          onDragLeave={handleDragLeaveUpload}
          onDrop={handleDropUpload}
        >
          <input
            id="file-upload"
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
        </label>
      </div>
    </div>
  );
};

export default MediaManager;
