'use client';

import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import MediaSelectorPopup from './MediaSelectorPopup';

interface ImageItem {
  id: string; // ID of the media document in Firestore
  alt: string; // Alt text for the image
  url: string; // URL of the image
}

interface MediaManagerProps {
  productSlug: string; // Product slug for the Firestore document
  imageIds: string[]; // Array of image IDs from the product document
  onImagesUpdate: (updatedImageIds: string[]) => void; // Callback for parent
}


const MediaManager: React.FC<MediaManagerProps> = ({
  productSlug,
  imageIds,
  onImagesUpdate,
}) => {
  const [localImages, setLocalImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [isDragOverUpload, setIsDragOverUpload] = useState(false);

  // Fetch full image data (url, alt) from media collection
  useEffect(() => {
    const fetchImages = async () => {
      const db = getFirestore();
      const imagesData: ImageItem[] = await Promise.all(
        imageIds.map(async (id) => {
          const mediaDocRef = doc(db, 'media', id); // Fetch media details by ID
          const mediaDoc = await getDoc(mediaDocRef);
          if (mediaDoc.exists()) {
            return mediaDoc.data() as ImageItem;
          }
          return { id, alt: 'Image not found', url: '' }; // Fallback for missing data
        })
      );
      setLocalImages(imagesData); // Update local state with full media details
    };
  
    fetchImages();
  }, [imageIds]);
  

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
      canvas.toBlob(resolve, 'image/webp', 0.8)
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
  
    // Extract original file name and sanitize it for Firebase Storage
    const originalName = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9-_]/g, '_');
    const webpFile = await convertToWebP(file);
  
    // Create a unique ID for the media item
    const uniqueId = `media_${Date.now()}`;
    const storageRef = ref(storage, `media/${originalName}_${uniqueId}.webp`); // Include original name in the file path
  
    // Upload the WebP file
    await uploadBytes(storageRef, webpFile);
    const url = await getDownloadURL(storageRef);
  
    const db = getFirestore();
    const mediaDocRef = doc(db, 'media', uniqueId); // Use unique ID for Firestore
  
    const mediaItem: ImageItem = {
      id: uniqueId, // Unique ID
      alt: originalName, // Use original name as alt text
      url, // URL pointing to the uploaded file
    };
  
    // Save metadata to Firestore
    await setDoc(mediaDocRef, {
      ...mediaItem,
      type: 'image',
      original_name: file.name, // Store the original file name
      created_at: new Date().toISOString(),
    });
  
    return mediaItem;
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

      const updatedImageIds = updatedImages.map((image) => image.id);

      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug);

      await updateDoc(productDoc, {
        images: updatedImageIds,
      });

      onImagesUpdate(updatedImageIds);
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

    const updatedImageIds = reorderedImages.map((image) => image.id);

    const db = getFirestore();
    const productDoc = doc(db, 'products', productSlug);

    updateDoc(productDoc, {
      images: updatedImageIds,
    });

    onImagesUpdate(updatedImageIds);
    setDragging(index);
  };

  const handleDragStart = (index: number) => {
    setDragging(index);
  };

  const handleDeleteImage = async (imageId: string) => {
    const updatedImages = localImages.filter((image) => image.id !== imageId);
    setLocalImages(updatedImages);

    const updatedImageIds = updatedImages.map((image) => image.id);

    const db = getFirestore();
    const productDoc = doc(db, 'products', productSlug);

    await updateDoc(productDoc, {
      images: updatedImageIds,
    });

    onImagesUpdate(updatedImageIds);
  };

  const handleDragOverUpload = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOverUpload(true);
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


  const [showPopup, setShowPopup] = useState(false);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleMediaSelect = (selectedMedia: ImageItem[]) => {
    // Sync localImages with selectedMedia
    const updatedImages = selectedMedia.map((media) => {
      const existingImage = localImages.find((img) => img.id === media.id);
      return existingImage || media; // Keep existing image or add new media
    });
  
    setLocalImages(updatedImages); // Update local state
  
    const updatedImageIds = updatedImages.map((image) => image.id);
  
    const db = getFirestore();
    const productDoc = doc(db, 'products', productSlug);
  
    updateDoc(productDoc, {
      images: updatedImageIds, // Update Firestore with synchronized IDs
    });
  
    onImagesUpdate(updatedImageIds); // Notify parent with updated IDs
    setShowPopup(false); // Close the popup
  };
  
  

  return (
    <div className="p-4 bg-white rounded-md">
      {showPopup && (
        <MediaSelectorPopup
          onClose={handlePopupClose}
          onMediaSelect={handleMediaSelect}
          selectedIds={imageIds} // Pass current image IDs
        />
      )}

      <h3 className="text-lg font-sm text-gray-700">Media:</h3>
      {uploading && <p className="mt-4 text-blue-500">Uploading...</p>}

      <div className="grid grid-cols-5 gap-4 mt-4">
        {localImages.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`relative ${index === 0 ? 'col-span-2 row-span-2' : ''
              } rounded-md overflow-hidden ${dragging === index ? 'border-2 border-blue-500' : ''
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
          className={`aspect-square w-full h-auto flex items-center justify-center gap-2 flex-col text-sm border-dashed border-2 rounded-md p-4 cursor-pointer ${isDragOverUpload ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
            }`}
          onDragOver={handleDragOverUpload}
          onDragLeave={handleDragLeaveUpload}
          onDrop={handleDropUpload}
          onClick={(e) => {
            e.preventDefault(); // Prevent triggering the hidden file input
            setShowPopup(true); // Open the popup
          }}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          <div className="bg-blue-50 p-2 rounded-full">
            <Image
              src="/icons/big_blue_add_plus.svg"
              alt="Delete Icon"
              width={24}
              height={24}
            />

          </div>
          <p className='text-blue-500'>Add Media</p>

        </label>
      </div>
    </div>
  );
};

export default MediaManager;
