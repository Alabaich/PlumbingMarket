'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUnsavedChanges } from '../../context/UnsavedChangesContext';
import ProductTitleDescription from './components/ProductTitleDescription';
import ProductStatus from './components/ProductStatus';
import MediaManager from './components/MediaManager';
import ProductTags from './components/ProductTags';
import ProductOrganization from './components/ProductOrganization';
import { Product } from './types';
import ProductVariants from './components/ProductVariants';
import ProductDetails from './components/ProductDetails';
import ProductAdditionalDetails from './components/ProductAdditional';
import ProductPricingDetails from './components/Pricing';
import InventoryDetails from './components/InventoryDetails';
import ShippingDetails from './components/ShippingDetails';
import AddVariant from './components/AddVariants';
import OneVariant from './components/OneVariant';
import { ProductAdditionalDetailsProps } from './components/ProductAdditional';




const ProductPage: React.FC<{ params: Promise<{ productSlug: string }> }> = ({ params }) => {
  const [productSlug, setProductSlug] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setSaveCallback, setUnsavedChanges } = useUnsavedChanges();

  // Fetch product data on mount
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setProductSlug(resolvedParams.productSlug);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!productSlug) return;

    const fetchProduct = async () => {
      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug);
      const docSnap = await getDoc(productDoc);

      if (docSnap.exists()) {
        const productData = docSnap.data() as Product;
        setProduct(productData);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productSlug]);

  // Handle input changes and mark as dirty
  const handleInputChange = (updatedFields: Partial<Product>) => {
    setProduct((prev) => {
      const updatedProduct = { ...prev, ...updatedFields } as Product;
      return updatedProduct;
    });

    // Mark as dirty outside the state update
    setUnsavedChanges(true);
  };


  const handleSave = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); // Prevent form submission if triggered by a form
    if (!productSlug || !product) return;

    setSaving(true);
    const db = getFirestore();
    const productDoc = doc(db, 'products', productSlug);

    try {
      await updateDoc(productDoc, { ...product });
      setUnsavedChanges(false);
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save the product.');
    } finally {
      setSaving(false);
    }
  }, [productSlug, product, setUnsavedChanges]);


  useEffect(() => {
    setSaveCallback(() => handleSave);
    return () => setSaveCallback(() => null);
  }, [setSaveCallback, handleSave]);


  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center mt-6">Product not found</div>;
  }

  return (
    <form onSubmit={handleSave} className="p-2 w-full flex flex-col gap-4 max-w-[100%]">

      <div className="flex bg-white rounded-md p-2 justify-between items-center">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="w-full flex gap-4">
        <div className="flex flex-col gap-4 w-[80%] max-w-[80%]">
          <ProductTitleDescription product={product} onChange={handleInputChange} />
          <MediaManager
            productSlug={productSlug!}
            imageIds={product.images || []}
            onImagesUpdate={(updatedImages) => handleInputChange({ images: updatedImages })}
          />

          {product.variants && Object.keys(product.variants).length === 0 && (
            <AddVariant
              productSlug={productSlug!} // Ensures `productSlug` is treated as non-null
              productData={product}
              onVariantAdded={(newVariant) => {
                const updatedVariants = {
                  ...product.variants,
                  [newVariant.id]: newVariant,
                };
                handleInputChange({ variants: updatedVariants });
              }}
            />



          )}

          {product.variants && Object.keys(product.variants).length === 1 && (

            <OneVariant
              productSlug={productSlug!}
              variant={{
                ...Object.values(product.variants)[0], // Extract the single variant
                id: Object.keys(product.variants)[0], // Add the id dynamically
              }}
              onVariantUpdate={(updatedVariant) => {
                // Update the single variant in the product
                const updatedVariants = {
                  ...product.variants,
                  [updatedVariant.id]: updatedVariant,
                };
                handleInputChange({ variants: updatedVariants });
              }}
              onAddVariant={() => {
                // Add another variant logic
                const newVariantId = `variant_${Date.now()}`;
                const newVariant = {
                  id: newVariantId,
                  price: 0, // Default price
                  compare_at_price: 0, // Default compare price
                  barcode: '',
                  cost: 0,
                  requires_shipping: false,
                  taxable: false,
                  weight: 0,
                  assigned_image: '', // Default empty image
                  finish: '', // Default empty finish
                  lead_time: '', // Default lead time
                  sqft: '', // Default sqft
                  option: { name: 'Size', value: '' }, // Default option
                };

                const updatedVariants = {
                  ...product.variants,
                  [newVariantId]: newVariant,
                };

                // Update product with the new variant
                handleInputChange({ variants: updatedVariants });
              }}
            />



          )}

          {product.variants && Object.keys(product.variants).length > 1 && (
            <ProductVariants
              productSlug={productSlug!}
              variants={product.variants}
            />
          )}



          <ProductDetails product={product} onChange={handleInputChange} />
          {(!product.variants || Object.keys(product.variants).length <= 1) && (
            <>
              <ProductAdditionalDetails
                product={product}
                onChange={(updatedFields) => handleInputChange(updatedFields)}
                variantId={Object.keys(product.variants || {})[0]} // Pass the first variant's ID if it exists
              />




              <ProductPricingDetails
                product={product}
                onChange={(updatedFields) => handleInputChange(updatedFields)}
                variantId={Object.keys(product.variants || {})[0]} // Pass the first variant's ID if it exists
              />


              <ShippingDetails
                product={product}
                onChange={(updatedFields) => handleInputChange(updatedFields)}
                variantId={Object.keys(product.variants || {})[0]} // Pass the first variant's ID if it exists
              />

            </>
          )}

        </div>
        <div className="flex flex-col gap-4 w-[20%] ">
          <ProductStatus published={product.published} onChange={handleInputChange} />
          <ProductTags
            tags={product.tags || []}
            onTagsUpdate={(updatedTags) => handleInputChange({ tags: updatedTags })}
          />
          <ProductOrganization
            product={{ type: product.type, vendor: product.vendor }}
            onChange={handleInputChange}
          />
          {(!product.variants || Object.keys(product.variants).length <= 1) && (
            <InventoryDetails
              product={product}
              onChange={(updatedFields) => handleInputChange(updatedFields)}
              variantId={Object.keys(product.variants || {})[0]} // Pass the first variant's ID if it exists
            />

          )}


        </div>
      </div>
    </form>
  );
};

export default ProductPage;
