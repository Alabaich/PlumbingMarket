'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { useUnsavedChanges } from '../../../context/UnsavedChangesContext';
import ProductAdditionalDetails from '../components/ProductAdditional';
import ProductPricingDetails from '../components/Pricing';
import ShippingDetails from '../components/ShippingDetails';
import InventoryDetails from '../components/InventoryDetails';
import AssignVariantImage from '../components/AssignVariantImage';
import VariantOptionsEditor from '../components/OptionsVariant';
import ProductVariantNavigator from '../components/ProductVariantNavigator';
import { Variant, MediaItem } from '../types';

interface VariantPageProps {
  params: Promise<{ productSlug: string; variantSlug: string }>;
}

const VariantPage: React.FC<VariantPageProps> = ({ params }) => {
  const [productSlug, setProductSlug] = useState<string | null>(null);
  const [variantSlug, setVariantSlug] = useState<string | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [productData, setProductData] = useState<any | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]); // State for media items
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { setSaveCallback, setUnsavedChanges } = useUnsavedChanges();

  // Fetch parameters
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setProductSlug(resolvedParams.productSlug);
      setVariantSlug(resolvedParams.variantSlug);
    };

    unwrapParams();
  }, [params]);

  // Fetch product, variant, and media data
  useEffect(() => {
    if (!productSlug || !variantSlug) return;

    const fetchData = async () => {
      try {
        const db = getFirestore();

        // Fetch product data
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

        // Fetch media items
        const mediaCollection = collection(db, 'media');
        const mediaSnapshot = await getDocs(mediaCollection);
        const mediaData = mediaSnapshot.docs.map((doc) => doc.data() as MediaItem);
        setMediaItems(mediaData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productSlug, variantSlug]);

  // Mark as dirty on input change
  const handleInputChange = (updatedFields: Partial<Variant>) => {
    setVariant((prev: Variant | null) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });

    // Mark as dirty
    setUnsavedChanges(true);
  };

  const handleSave = useCallback(async () => {
    if (!productSlug || !variantSlug || !variant || !productData) return;

    setSaving(true);

    try {
      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug);

      // Merge `assigned_image` into the variant
      const updatedVariant = {
        ...variant,
        assigned_image: productData?.variants[variantSlug]?.assigned_image || variant?.assigned_image || null,
      };

      // Update the variant in the product's variants map
      const updatedVariants = {
        ...productData.variants,
        [variantSlug]: updatedVariant,
      };

      // Update Firestore
      await updateDoc(productDoc, {
        variants: updatedVariants,
      });

      setUnsavedChanges(false); // Reset unsaved changes
      alert('Variant saved successfully!');
    } catch (error) {
      console.error('Error saving variant:', error);
      alert('Failed to save the variant.');
    } finally {
      setSaving(false);
    }
  }, [productSlug, variantSlug, variant, productData, setUnsavedChanges]);

  // Register the save callback with the Unsaved Changes context
  useEffect(() => {
    setSaveCallback(() => handleSave);
    return () => setSaveCallback(() => null);
  }, [setSaveCallback, handleSave]);

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (!variant) {
    return <div className="text-center mt-6">Variant not found</div>;
  }

  const variantsList = Object.entries(productData.variants || {}).map(([id, variant]: any) => ({
    id,
    image: variant.assigned_image || null,
    options: variant.option
      ? {
        [variant.option.name]: variant.option.value,
        ...(variant.option2 ? { [variant.option2.name]: variant.option2.value } : {}),
        ...(variant.option3 ? { [variant.option3.name]: variant.option3.value } : {}),
      }
      : {},
    name: variant.name || '',
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="flex flex-col gap-4"
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

      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-4 w-[30%]">
          <ProductVariantNavigator
            productSlug={productSlug!}
            productTitle={productData.title || 'Product'}
            productImages={productData.images}
            productStatus={productData.published ? 'Active' : 'Inactive'}
            variants={variantsList}
            currentVariantId={variantSlug!}
          />
          <ShippingDetails
            product={variant}
            onChange={(updatedFields) => handleInputChange(updatedFields)}
          />
          <InventoryDetails
            product={productData}
            onChange={(updatedFields) => handleInputChange(updatedFields)}
            variantId={variantSlug || undefined}
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <AssignVariantImage
            product={productData}
            media={mediaItems}
            variantId={variantSlug || ''}
            onUpdate={(updatedVariant) => {
              setVariant((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  ...updatedVariant,
                  id: prev.id || variantSlug || '', // Ensure `id` is always a string
                };
              });

              setProductData((prev: any) => {
                if (!prev) return null;
                return {
                  ...prev,
                  variants: {
                    ...prev.variants,
                    [variantSlug || '']: {
                      ...prev.variants[variantSlug || ''],
                      ...updatedVariant,
                      id: prev.variants[variantSlug || ''].id || variantSlug || '', // Ensure `id` is always a string
                    },
                  },
                };
              });
            }}
          />



          <VariantOptionsEditor
            variant={variant}
            onVariantUpdate={(updatedVariant) => {
              setVariant(updatedVariant);
              setProductData((prev: any) => ({
                ...prev,
                variants: {
                  ...prev.variants,
                  [variantSlug || '']: updatedVariant,
                },
              }));
              setUnsavedChanges(true);
            }}
          />


          <ProductPricingDetails
            product={variant}
            onChange={(updatedFields) => handleInputChange(updatedFields)}
          />

          <ProductAdditionalDetails
            product={variant}
            onChange={(updatedFields) => handleInputChange(updatedFields)}
          />
        </div>
      </div>














    </form>
  );
};

export default VariantPage;
