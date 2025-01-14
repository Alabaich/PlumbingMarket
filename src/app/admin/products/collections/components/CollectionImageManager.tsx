'use client';

import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import MediaSelectorPopup from '../../[productSlug]/components/MediaSelectorPopup';

interface ImageItem {
  id: string;
  alt: string;
  url: string;
}

interface CollectionImageManagerProps {
  collectionSlug: string; // The ID of the collection
  currentImageId?: string; // Existing image ID
  onImageUpdate: (imageId: string) => void; // Callback when the image is updated
}

const CollectionImageManager: React.FC<CollectionImageManagerProps> = ({
  collectionSlug,
  currentImageId,
  onImageUpdate,
}) => {
  const [localImage, setLocalImage] = useState<ImageItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch the image data if there is an existing image ID
  useEffect(() => {
    const fetchImage = async () => {
      if (!currentImageId) return;

      const db = getFirestore();
      const imageRef = doc(db, 'media', currentImageId);
      const imageSnap = await getDoc(imageRef);

      if (imageSnap.exists()) {
        const imageData = imageSnap.data() as ImageItem;
        setLocalImage(imageData);
      }
    };

    fetchImage();
  }, [currentImageId]);

  const convertToWebP = async (file: File): Promise<File> => {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.8)
    );

    if (!blob) throw new Error('Failed to convert image to WebP');
    return new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });
  };

  const uploadImage = async (file: File): Promise<ImageItem> => {
    const storage = getStorage();
    const db = getFirestore();
    const uniqueId = `media_${Date.now()}`;
    const sanitizedFileName = file.name.split('.')[0].replace(/[^a-zA-Z0-9-_]/g, '_');
    const storageRef = ref(storage, `media/${sanitizedFileName}_${uniqueId}.webp`);

    const webpFile = await convertToWebP(file);
    await uploadBytes(storageRef, webpFile);
    const url = await getDownloadURL(storageRef);

    const mediaData: ImageItem = { id: uniqueId, alt: sanitizedFileName, url };
    const mediaRef = doc(db, 'media', uniqueId);
    await setDoc(mediaRef, {
      ...mediaData,
      type: 'image',
      original_name: file.name,
      created_at: new Date().toISOString(),
    });

    return mediaData;
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadedImage = await uploadImage(file);
      setLocalImage(uploadedImage);

      const db = getFirestore();
      const collectionRef = doc(db, 'collections', collectionSlug);
      await updateDoc(collectionRef, { image: uploadedImage.id });

      onImageUpdate(uploadedImage.id);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleOpenMediaSelector = () => {
    setShowPopup(true);
  };

  const handleMediaSelect = (selectedMedia: ImageItem[]) => {
    if (selectedMedia.length === 0) return;

    const selectedImage = selectedMedia[0];
    setLocalImage(selectedImage);

    const db = getFirestore();
    const collectionRef = doc(db, 'collections', collectionSlug);
    updateDoc(collectionRef, { image: selectedImage.id }).then(() => {
      onImageUpdate(selectedImage.id);
      setShowPopup(false);
    });
  };

  return (
    <div
      className={`p-4 bg-white rounded-md shadow-sm border-dashed border-2 ${
        isDragOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setIsDragOver(false)}
    >
      {showPopup && (
        <MediaSelectorPopup
          onClose={() => setShowPopup(false)}
          onMediaSelect={handleMediaSelect}
          selectedIds={currentImageId ? [currentImageId] : []}
        />
      )}

      {uploading ? (
        <p className="text-blue-500">Uploading...</p>
      ) : localImage ? (
        <div className="relative">
          <img
            src={localImage.url}
            alt={localImage.alt}
            className="w-full rounded-md object-cover"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
            onClick={() => setLocalImage(null)}
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="w-full text-center p-4 flex flex-col items-center justify-center"
          onClick={handleOpenMediaSelector}
        >
          <div className="bg-blue-50 p-2 rounded-full">
            <Image src="/icons/big_blue_add_plus.svg" alt="Add Image" width={24} height={24} />
          </div>
          <p className="text-blue-500 mt-2">Add Image</p>
        </button>
      )}
    </div>
  );
};

export default CollectionImageManager;
