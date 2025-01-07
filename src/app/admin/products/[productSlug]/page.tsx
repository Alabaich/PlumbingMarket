'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import ProductTitleDescription from './components/ProductTitleDescription';
import ProductStatus from './components/ProductStatus';
import MediaManager from './components/MediaManager';
import ProductTags from './components/ProductTags';
import ProductOrganization from './components/ProductOrganization';
import { Product, MediaItem, Variant } from './types';
import ProductVariants from './components/ProductVariants';
import ProductDetails from './components/ProductDetails';

const ProductPage: React.FC<{ params: Promise<{ productSlug: string }> }> = ({ params }) => {
  const [productSlug, setProductSlug] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // State for save operation

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
      try {
        const db = getFirestore();
        const productDoc = doc(db, 'products', productSlug!);
        const docSnap = await getDoc(productDoc);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          const imageIds = productData.images || [];

          // Fetch all media items
          const mediaCollection = collection(db, 'media');
          const mediaDocs = await getDocs(mediaCollection);

          // Map media items to their IDs, ensuring all required properties are included
          const mediaItemsMap = mediaDocs.docs.reduce((acc, doc) => {
            const data = doc.data();
            if (data.url && data.alt) {
              acc[doc.id] = { id: doc.id, alt: data.alt, url: data.url }; // Ensure `alt` and `url` are present
            }
            return acc;
          }, {} as Record<string, MediaItem>);

          // Sort media items based on the order in `imageIds`
          const sortedMediaItems = imageIds
            .map((id: string) => mediaItemsMap[id]) // Map IDs to media items
            .filter((item: MediaItem | undefined) => item !== undefined); // Remove undefined items

          setProduct({
            title: productData.title || '',
            description: productData.description || '',
            published: productData.published || false,
            images: sortedMediaItems, // Use sorted media items
            tags: productData.tags || [],
            type: productData.type || '',
            vendor: productData.vendor || '',
            variants: productData.variants || {},
            finish: productData.finish || '', // Add missing fields
            lead_time: productData.lead_time || '',
            warranty: productData.warranty || '',
            technical_specifications: productData.technical_specifications || '',
            installation_and_maintenance: productData.installation_and_maintenance || '',
            sqft: productData.sqft || '',
          });
        } else {
          console.error('No product found for the provided slug');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };



    fetchProduct();
  }, [productSlug]);

  const handleSave = async (updatedProduct: Product) => {
    if (!productSlug) return;
    setSaving(true);

    try {
      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug);

      const updateData = {
        title: updatedProduct.title,
        description: updatedProduct.description,
        images: updatedProduct.images.map((image) => image.id), // Save image IDs only
        tags: updatedProduct.tags, // Save updated tags
        type: updatedProduct.type, // Save product type
        vendor: updatedProduct.vendor,
        published: updatedProduct.published,
      };

      await updateDoc(productDoc, updateData);

      // Re-fetch product after updating to ensure the latest data is in sync
      const docSnap = await getDoc(productDoc);
      if (docSnap.exists()) {
        const productData = docSnap.data();
        const imageIds = productData.images || [];

        // Fetch media items by their IDs
        const mediaCollection = collection(db, 'media');
        const mediaDocs = await getDocs(mediaCollection);

        const mediaItems = mediaDocs.docs
          .filter((doc) => imageIds.includes(doc.id))
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setProduct({
          title: productData.title || '',
          description: productData.description || '',
          published: productData.published || false,
          images: mediaItems as MediaItem[],
          tags: productData.tags || [],
          type: productData.type || '',
          vendor: productData.vendor || '',
          variants: productData.variants || {},
          finish: productData.finish || '',
          lead_time: productData.lead_time || '',
          warranty: productData.warranty || '',
          technical_specifications: productData.technical_specifications || '',
          installation_and_maintenance: productData.installation_and_maintenance || '',
          sqft: productData.sqft || '',
        });
      }

      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save the product.');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center mt-6">Product not found</div>;
  }

  return (
    <div className="p-2 w-full flex flex-col gap-4">
      <div className="flex bg-white rounded-md p-4 justify-between items-center">
        <h1 className="text-xl">{product.title}</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={() => handleSave(product)}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="w-full flex gap-4">
        <div className="flex flex-col gap-4 w-[80%]">
          <ProductTitleDescription
            product={product}
            onChange={(updatedFields) =>
              setProduct((prev) => ({ ...prev, ...updatedFields } as Product))
            }
          />
          <MediaManager
            productSlug={productSlug!}
            images={product.images || []} // Pass the images array
            onImagesUpdate={(updatedImages) =>
              setProduct((prev) => ({ ...prev, images: updatedImages } as Product))
            }
          />
          <ProductVariants
            productSlug={productSlug!}
            variants={product.variants || {}}
          />

          <ProductDetails
            product={product}
            onChange={(updatedFields) =>
              setProduct((prev) => ({ ...prev, ...updatedFields } as Product))
            }
          />




        </div>
        <div className="flex flex-col gap-4 w-[20%] ">
          <ProductStatus
            published={product.published}
            onChange={(updatedFields) =>
              setProduct((prev) => ({ ...prev, ...updatedFields } as Product))
            }
          />
          <ProductTags
            tags={product.tags || []}
            onTagsUpdate={(updatedTags) =>
              setProduct((prev) => ({ ...prev, tags: updatedTags } as Product))
            }
          />
          <ProductOrganization
            product={{ type: product.type, vendor: product.vendor }}
            onChange={(updatedFields) =>
              setProduct((prev) => ({ ...prev, ...updatedFields } as Product))
            }
          />
        </div>


      </div>


    </div>
  );
};

export default ProductPage;
