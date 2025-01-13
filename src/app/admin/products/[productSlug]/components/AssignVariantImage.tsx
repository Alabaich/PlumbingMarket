'use client';

import React, { useState, useEffect } from 'react';
import { MediaItem, Product, Variant } from '../types';
import { useUnsavedChanges } from '../../../context/UnsavedChangesContext';

interface AssignVariantImageProps {
  product: Product;
  media: MediaItem[]; // Media array
  variantId: string;
  onUpdate: (updatedVariant: Partial<Variant>) => void;
}

const AssignVariantImage: React.FC<AssignVariantImageProps> = ({
  product,
  media,
  variantId,
  onUpdate,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { setUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    if (variantId && product.variants[variantId]?.assigned_image) {
      setSelectedImage(product.variants[variantId].assigned_image);
    }
  }, [variantId, product.variants]);

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(imageId);

    // Update parent state and mark as unsaved
    onUpdate({ assigned_image: imageId });
    setUnsavedChanges(true);
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium text-gray-700">Assign Image to Variant</h3>

      <div className="grid grid-cols-6 gap-4">
        {product.images.map((imageId) => {
          const image = media.find((m) => m.id === imageId);
          return (
            <div
              key={imageId}
              className={`p-2 border rounded-md cursor-pointer transition-opacity ${
                selectedImage === imageId ? 'border-blue-500' : 'border-gray-300 opacity-60 hover:opacity-100'
              }`}
              onClick={() => handleImageSelect(imageId)}
            >
              <img
                src={image?.url || '/placeholder.png'}
                alt={image?.alt || 'Product Image'}
                className="w-full h-24 object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignVariantImage;
