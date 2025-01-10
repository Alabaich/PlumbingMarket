'use client';

import React, { useState, useEffect } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Product, Variant, MediaItem } from '../types';

interface AssignVariantImageProps {
  product: Product;
  productSlug: string; // Use productSlug for Firestore document reference
  media: MediaItem[]; // Media array
  variantId: string;
  onUpdate: (updatedVariant: Partial<Variant>) => void;
}

const AssignVariantImage: React.FC<AssignVariantImageProps> = ({
  product,
  productSlug,
  media,
  variantId,
  onUpdate,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (variantId && product.variants[variantId]?.assigned_image) {
      setSelectedImage(product.variants[variantId].assigned_image);
    }
  }, [variantId, product.variants]);

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(imageId);
  };

  const handleSave = async () => {
    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }

    try {
      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug); // Use productSlug

      const updatedVariants = {
        ...product.variants,
        [variantId]: {
          ...product.variants[variantId],
          assigned_image: selectedImage,
        },
      };

      // Log the updated payload for debugging
      console.log('Updating Firestore with:', updatedVariants);

      // Update Firestore
      await updateDoc(productDoc, { variants: updatedVariants });

      // Trigger the onUpdate callback
      onUpdate({ assigned_image: selectedImage });

      alert('Image assigned successfully!');
    } catch (error) {
      console.error('Error assigning image:', error);
      alert('Failed to assign image. Please try again.');
    }
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium text-gray-700">Assign Image to Variant</h3>

      <div className="grid grid-cols-3 gap-4">
        {product.images.map((imageId) => {
          const image = media.find((m) => m.id === imageId);
          return (
            <div
              key={imageId}
              className={`p-2 border rounded-md cursor-pointer ${
                selectedImage === imageId ? 'border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => handleImageSelect(imageId)}
            >
              <img
                src={image?.url || ''}
                alt={image?.alt || 'Product Image'}
                className="w-full h-24 object-cover"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  );
};

export default AssignVariantImage;
