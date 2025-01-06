'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Variant } from '../types'; // Import the Variant type
import { use } from 'react'; // Unwrap the promise for `params`

interface VariantPageProps {
  params: Promise<{ productSlug: string; variantSlug: string }>;
}

const VariantPage: React.FC<VariantPageProps> = ({ params }) => {
  const { productSlug, variantSlug } = use(params); // Unwrap the `params` Promise

  const [variant, setVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const db = getFirestore();

        // Fetch the product document
        const productDoc = doc(db, 'products', productSlug);
        const productSnap = await getDoc(productDoc);

        if (productSnap.exists()) {
          const productData = productSnap.data();

          // Check if the variant exists in the product's variants
          const productVariants = productData.variants || {};
          if (productVariants[variantSlug]) {
            setVariant(productVariants[variantSlug]);
          } else {
            console.error('Variant not found for the provided slug');
          }
        } else {
          console.error('Product not found for the provided slug');
        }
      } catch (error) {
        console.error('Error fetching variant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariant();
  }, [productSlug, variantSlug]);

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (!variant) {
    return <div className="text-center mt-6">Variant not found</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-medium text-gray-700">Variant Details</h2>
      <p className="text-sm font-medium text-gray-700">
        <strong>SKU:</strong> {variantSlug}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Name:</strong> {variant.name}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Price:</strong> ${variant.price}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Compare at Price:</strong> ${variant.compare_at_price}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Cost:</strong> ${variant.cost}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Requires Shipping:</strong> {variant.requires_shipping ? 'Yes' : 'No'}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Taxable:</strong> {variant.taxable ? 'Yes' : 'No'}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Weight:</strong> {variant.weight} lbs
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Option Name:</strong> {variant.option.name}
      </p>
      <p className="text-sm font-medium text-gray-700">
        <strong>Option Value:</strong> {variant.option.value}
      </p>
    </div>
  );
};

export default VariantPage;
