'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Variant } from '../../types'; // Import the Variant type

interface ProductVariantsProps {
  productSlug: string; // Pass the productSlug to generate variant links
  variants: Record<string, Variant>;
  onDeleteVariant: (variantId: string) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ productSlug, variants, onDeleteVariant }) => {
  const [imageMap, setImageMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchVariantImages = async () => {
      const db = getFirestore();

      const imagePromises = Object.entries(variants).map(async ([sku, variant]) => {
        if (!variant.assigned_image) return { id: sku, url: '/placeholder.png' }; // Fallback to placeholder

        const mediaDoc = doc(db, 'media', variant.assigned_image);
        const mediaSnapshot = await getDoc(mediaDoc);

        if (mediaSnapshot.exists()) {
          const mediaData = mediaSnapshot.data();
          return { id: sku, url: mediaData.url || '/placeholder.png' };
        }

        return { id: sku, url: '/placeholder.png' }; // Fallback if not found
      });

      const imageResults = await Promise.all(imagePromises);

      const imageMapping = imageResults.reduce((acc, item) => {
        acc[item.id] = item.url;
        return acc;
      }, {} as { [key: string]: string });

      setImageMap(imageMapping);
    };

    fetchVariantImages();
  }, [variants]);

  const handleDelete = (variantId: string) => {
    onDeleteVariant(variantId); // Trigger the deletion
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded-md flex flex-col gap-2">
      <h3 className="text-lg font-sm text-gray-700">Variants</h3>
      {Object.entries(variants).map(([sku, variant]) => (
        <div key={sku} className="flex justify-between items-center gap-4 border-[1px] rounded-md p-2">
          <Link
            href={`/admin/products/${productSlug}/${sku}`}
            className="flex items-center gap-4  transition-all"
          >
            {imageMap[sku] ? (
              <img
                src={imageMap[sku]}
                alt={`Variant ${sku}`}
                className="h-12 w-12 rounded-md object-cover"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                No Image
              </div>
            )}
            <div>
              <p className="text-sm font-sm text-gray-700">SKU: {sku}</p>
              <div className="flex gap-4">
              <p className="text-sm font-sm text-gray-400">
                {variant.option.name}: <span className="text-gray-800">{variant.option.value}</span>
              </p>
              {variant.option2 && (
    <p className="text-sm font-sm text-gray-400">
      {variant.option2.name}: <span className="text-gray-800">{variant.option2.value}</span>
    </p>
  )}
  {variant.option3 && (
    <p className="text-sm font-sm text-gray-400">
      {variant.option3.name}: <span className="text-gray-800">{variant.option3.value}</span>
    </p>
  )}
              </div>

            </div>
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(sku)}
            className="p-2 bg-red-50 hover:bg-red-100 rounded-md flex items-center"
            title="Delete Variant"
          >

          <img
            src="/icons/trash full small.svg"
            alt="View Product"
            className="w-5 h-5"
          />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;
