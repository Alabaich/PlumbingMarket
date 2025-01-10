'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import ProductAdditionalDetails from '../components/ProductAdditional';
import ProductPricingDetails from '../components/Pricing';
import ShippingDetails from '../components/ShippingDetails';
import { Variant, MediaItem } from '../types'; // Import types
import InventoryDetails from '../components/InventoryDetails';
import AssignVariantImage from '../components/AssignVariantImage';

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

  const handleInputChange = (updatedFields: Partial<Variant>) => {
    setVariant((prev: Variant | null) => {
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
  
      // Log the updated payload

  
      // Update Firestore
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
      className="p-4 shadow-md rounded-md flex flex-col gap-4"
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
        product={variant}
        onChange={(updatedFields) => handleInputChange(updatedFields)}
      />

      <ShippingDetails
        product={variant}
        onChange={(updatedFields) => handleInputChange(updatedFields)}
      />

<InventoryDetails
  product={productData} // Pass the product data
  onChange={(updatedFields) => handleInputChange(updatedFields)}
  variantId={variantSlug || undefined} // Use variantSlug as the variant ID
  onRenameVariant={(oldSku, newSku) => {
    if (!productData?.variants) return;

    // Rename the SKU in the variants object
    const updatedVariants = { ...productData.variants };
    updatedVariants[newSku] = { ...updatedVariants[oldSku] };
    delete updatedVariants[oldSku];

    setVariantSlug(newSku); // Update the state for the new SKU
    setProductData((prev: any) => ({ ...prev, variants: updatedVariants }));

    // Update Firestore with the renamed SKU
    const db = getFirestore();
    const productDoc = doc(db, 'products', productSlug!);
    updateDoc(productDoc, { variants: updatedVariants }).catch((err) =>
      console.error('Error renaming variant key:', err)
    );
  }}
/>



      <AssignVariantImage
        product={productData}
        productSlug={productSlug!} // Pass productSlug here
        media={mediaItems} // Pass media array
        variantId={variantSlug || ''} // Use variantSlug
        onUpdate={(updatedVariant) => {
          setProductData((prev: any) => ({
            ...prev,
            variants: {
              ...prev.variants,
              [variantSlug || '']: {
                ...prev.variants[variantSlug || ''],
                ...updatedVariant,
              },
            },
          }));
        }}
      />
    </form>
  );
};

export default VariantPage;
