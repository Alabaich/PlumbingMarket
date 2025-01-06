'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import DataTable from '../components/DataTable'; // Import Column if it's exported
 type Column<T> = {
   label: string;
   accessor: keyof T | ((row: T) => React.ReactNode);
 };

interface MediaItem {
  id: string;
  url: string;
  alt: string;
}

const Content: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const mediaColumns: Column<MediaItem>[] = [
    {
      label: 'Preview',
      accessor: (row: MediaItem) => (
        <img
          src={row.url}
          alt={row.alt}
          className="h-16 w-16 object-cover rounded-md"
        />
      ),
    },
    { label: 'Alt Text', accessor: 'alt' },
    { label: 'ID', accessor: 'id' },
  ];

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const db = getFirestore();
        const mediaCollection = collection(db, 'media');
        const querySnapshot = await getDocs(mediaCollection);

        const fetchedMedia: MediaItem[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            url: data.url || '',
            alt: data.alt || '',
          };
        });

        setMediaItems(fetchedMedia);
      } catch (error) {
        console.error('Error fetching media items:', error);
      }
    };

    fetchMedia();
  }, []);

  return (
    <main>
      <div className="flex flex-col gap-4">
        <header className="mainHeader flex justify-between items-center">
          <h3>Media</h3>
        </header>

        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <DataTable
            columns={mediaColumns}
            data={mediaItems}
            rowKey={(row) => row.id}
          />
        </div>
      </div>
    </main>
  );
};

export default Content;
