'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useUnsavedChanges } from '../../../context/UnsavedChangesContext';
import { ECollection } from '../../types';
import CollectionDetails from '../components/CollectionDetails';
import CollectionImageManager from '../components/CollectionImageManager';
import CollectionProducts from '../components/CollectionProducts';

const CollectionPage: React.FC = () => {
  const { collectionSlug } = useParams() as { collectionSlug: string };
  const [collection, setCollection] = useState<ECollection | null>(null);
  const [products, setProducts] = useState<string[]>([]); // State to hold the product slugs
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setSaveCallback, setUnsavedChanges } = useUnsavedChanges();

  // Fetch collection data
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
            title: collectionData.title || 'Untitled',
            description: collectionData.description || '',
            conditions: collectionData.conditions || [],
            categoryPath: collectionData.categoryPath || [],
            image: collectionData.image || '',
          });
          setProducts(collectionData.Products || []); // Fetch the products field
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

  // Handle input changes
  const handleInputChange = (updatedFields: Partial<ECollection>) => {
    setCollection((prev) => {
      if (!prev) return null; // Ensure `prev` exists
      return {
        ...prev,
        ...updatedFields,
      } as ECollection; // Cast to ECollection to satisfy TypeScript
    });
    setUnsavedChanges(true);
  };

  // Handle product updates
  const handleProductsUpdate = (updatedProducts: string[]) => {
    setProducts(updatedProducts);
    setUnsavedChanges(true);
  };

  // Save changes to Firestore
  const handleSave = useCallback(async () => {
    if (!collectionSlug || !collection) return;

    setSaving(true);
    const db = getFirestore();
    const collectionRef = doc(db, 'collections', collectionSlug);

    try {
      await updateDoc(collectionRef, {
        ...collection,
        Products: products, // Save the updated products field
      });
      setUnsavedChanges(false);
      alert('Collection saved successfully!');
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save the collection.');
    } finally {
      setSaving(false);
    }
  }, [collectionSlug, collection, products, setUnsavedChanges]);

  // Set up the save callback
  useEffect(() => {
    setSaveCallback(() => handleSave);
    return () => setSaveCallback(() => null);
  }, [setSaveCallback, handleSave]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="p-6"
    >
      {/* Save Button */}
      <div className="flex justify-end mb-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-full">
          <CollectionDetails collection={collection} onChange={handleInputChange} />
          <CollectionProducts
            collectionId={collectionSlug}
            products={products} // Pass the fetched products as props
            onProductsUpdate={handleProductsUpdate} // Update products state
          />
        </div>
        <div className="flex flex-col gap-2 w-[30%] min-w-[30%]">
          <CollectionImageManager
            collectionSlug={collectionSlug}
            currentImageId={collection.image}
            onImageUpdate={(imageId) => handleInputChange({ image: imageId })}
          />
        </div>
      </div>
    </form>
  );
};

export default CollectionPage;
