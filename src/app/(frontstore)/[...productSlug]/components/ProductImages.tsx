'use client';

import React, { useEffect, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface ProductImagesProps {
  images: string[]; // Array of media object IDs from Firestore
}

interface MediaItem {
  id: string;
  url: string;
  alt: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const db = getFirestore();
      const fetchedMedia: MediaItem[] = await Promise.all(
        images.map(async (imageId) => {
          const mediaDoc = doc(db, 'media', imageId);
          const mediaSnap = await getDoc(mediaDoc);

          if (mediaSnap.exists()) {
            const mediaData = mediaSnap.data();
            return {
              id: imageId,
              url: mediaData.url || '/placeholder.png',
              alt: mediaData.alt || `Image ${imageId}`,
            };
          } else {
            return { id: imageId, url: '/placeholder.png', alt: `Image ${imageId}` };
          }
        })
      );
      setMediaItems(fetchedMedia);
    };

    fetchImages();
  }, [images]);

  return (
    <div className="mb-4">
      {mediaItems.length > 0 ? (
        <Splide
          options={{
            type: 'loop',
            autoplay: true,
            interval: 3000,
            perPage: 1,
            arrows: true,
            pagination: true,
            gap: '1rem',
          }}
        >
          {mediaItems.map((media) => (
            <SplideSlide key={media.id}>
              <img
                src={media.url}
                alt={media.alt}
                className="w-full h-auto object-cover rounded-md"
              />
            </SplideSlide>
          ))}
        </Splide>
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default ProductImages;
