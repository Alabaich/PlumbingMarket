'use client';

import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

interface MediaSelectorPopupProps {
  onClose: () => void;
  onMediaSelect: (selectedMedia: MediaItem[]) => void;
  selectedIds: string[];
}

interface MediaItem {
  id: string;
  alt: string;
  url: string;
}

const MediaSelectorPopup: React.FC<MediaSelectorPopupProps> = ({
  onClose,
  onMediaSelect,
  selectedIds,
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Initialize selected media IDs
  useEffect(() => {
    setSelectedMediaIds(selectedIds);
  }, [selectedIds]);

  // Fetch media files from Firestore
  useEffect(() => {
    const fetchMediaFiles = async () => {
      const db = getFirestore();
      const mediaCollection = collection(db, 'media');
      const mediaSnapshot = await getDocs(mediaCollection);

      const files = mediaSnapshot.docs.map((doc) => {
        const data = doc.data() as MediaItem;
        return {
          ...data,
          id: doc.id,
        };
      });

      setMediaFiles(files.sort((a, b) => (a.id < b.id ? 1 : -1)));
    };

    fetchMediaFiles();
  }, []);

  // Handle search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (mediaId: string) => {
    setSelectedMediaIds((prev) =>
      prev.includes(mediaId)
        ? prev.filter((id) => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  // Handle drag-and-drop file upload
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setUploading(true);

      try {
        const uploadedMedia = await Promise.all(
          Array.from(files).map(async (file) => {
            const storage = getStorage();
            const mediaId = `media_${Date.now()}`;
            const storageRef = ref(storage, `media/${mediaId}`);

            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            const mediaItem: MediaItem = {
              id: mediaId,
              alt: file.name.split('.')[0],
              url,
            };

            const db = getFirestore();
            const mediaDocRef = doc(db, 'media', mediaId);

            await setDoc(mediaDocRef, {
              ...mediaItem,
              type: 'image',
              created_at: new Date().toISOString(),
            });

            return mediaItem;
          })
        );

        setMediaFiles((prev) => [...uploadedMedia, ...prev]); // Append new media
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleMediaSelect = () => {
    const selectedMedia = mediaFiles.filter((file) =>
      selectedMediaIds.includes(file.id)
    );
    onMediaSelect(selectedMedia);
  };

  const filteredMedia = searchQuery
    ? mediaFiles.filter((file) =>
        file.alt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mediaFiles;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-4xl p-6 rounded-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Select Media</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <div
          className={`border-dashed border-2 p-4 rounded-md text-center mb-4 ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <p className="text-gray-500">Uploading...</p>
          ) : (
            <p className="text-gray-500">
              Drag and drop files here to upload.
            </p>
          )}
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 p-2 border rounded-md"
          />
        </div>
        <div className="grid grid-cols-5 gap-4 max-h-80 overflow-y-auto">
          {filteredMedia.map((file) => (
            <div key={file.id} className="relative">
              <img
                src={file.url}
                alt={file.alt}
                className="w-full h-auto rounded-md"
              />
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedMediaIds.includes(file.id)}
                  onChange={() => handleCheckboxChange(file.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleMediaSelect}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaSelectorPopup;
