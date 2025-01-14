'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

interface ECollection {
  id: string;
  title: string;
}

const CollectionPage: React.FC = () => {
  const { collectionSlug } = useParams() as { collectionSlug: string };
  const [collection, setCollection] = useState<ECollection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!collectionSlug) {
        console.error('Invalid collection slug');
        setLoading(false);
        return;
      }

      setLoading(true);
      const db = getFirestore();
      const collectionRef = doc(db, 'collections', collectionSlug);

      try {
        const collectionSnap = await getDoc(collectionRef);

        if (!collectionSnap.exists()) {
          setCollection(null);
        } else {
          const collectionData = collectionSnap.data();
          setCollection({
            id: collectionSnap.id,
            title: collectionData?.title || 'Untitled',
          });
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
        setCollection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionSlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">{collection.title}</h1>
    </main>
  );
};

export default CollectionPage;
