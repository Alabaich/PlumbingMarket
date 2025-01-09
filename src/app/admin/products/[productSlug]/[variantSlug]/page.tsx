'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ProductAdditionalDetails from '../components/ProductAdditional';
import ProductPricingDetails from '../components/Pricing';
import ShippingDetails from '../components/ShippingDetails';
import { Variant } from '../types'; // Import the Variant type

interface VariantPageProps {
  params: Promise<{ productSlug: string; variantSlug: string }>;
}

const VariantPage: React.FC<VariantPageProps> = ({ params }) => {
  const [productSlug, setProductSlug] = useState<string | null>(null);
  const [variantSlug, setVariantSlug] = useState<string | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [productData, setProductData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch parameters
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setProductSlug(resolvedParams.productSlug);
      setVariantSlug(resolvedParams.variantSlug);
    };

    unwrapParams();
  }, [params]);

  // Fetch variant and product data
  useEffect(() => {
    if (!productSlug || !variantSlug) return;

    const fetchVariant = async () => {
      try {
        const db = getFirestore();
        const productDoc = doc(db, 'products', productSlug);
        const productSnap = await getDoc(productDoc);

        if (productSnap.exists()) {
          const product = productSnap.data();
          setProductData(product);

          const productVariants = product.variants || {};
          if (productVariants[variantSlug]) {
            setVariant(productVariants[variantSlug]);
          } else {
            console.error('Variant not found');
          }
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching variant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariant();
  }, [productSlug, variantSlug]);

  const handleInputChange = (updatedFields: Partial<Variant>) => {
    setVariant((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  const handleSave = useCallback(async () => {
    if (!productSlug || !variantSlug || !variant || !productData) return;

    setSaving(true);

    try {
      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug);

      // Update the variant in the product's variants map
      const updatedVariants = {
        ...productData.variants,
        [variantSlug]: variant,
      };

      await updateDoc(productDoc, {
        variants: updatedVariants,
      });

      alert('Variant saved successfully!');
    } catch (error) {
      console.error('Error saving variant:', error);
      alert('Failed to save the variant.');
    } finally {
      setSaving(false);
    }
  }, [productSlug, variantSlug, variant, productData]);

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (!variant) {
    return <div className="text-center mt-6">Variant not found</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="p-4 bg-white shadow-md rounded-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium text-gray-700">Edit Variant</h2>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <ProductAdditionalDetails
        product={variant}
        onChange={(updatedFields) => handleInputChange(updatedFields)}
      />

      <ProductPricingDetails
        product={{
          price: variant.price,
          cost: variant.cost,
          compare_at_price: variant.compare_at_price,
          taxable: variant.taxable,
        }}
        onChange={(updatedFields) => handleInputChange(updatedFields)}
      />

      <ShippingDetails
        product={{
          requires_shipping: variant.requires_shipping,
          weight: variant.weight,
        }}
        onChange={(updatedFields) => handleInputChange(updatedFields)}
      />
    </form>
  );
};

export default VariantPage;
