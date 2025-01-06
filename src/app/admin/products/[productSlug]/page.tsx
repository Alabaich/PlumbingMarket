'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ProductTitleDescription from './components/ProductTitleDescription';
import ProductStatus from './components/ProductStatus';

interface Product {
  title: string;
  description: string;
  published: boolean;
}

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
        const productDoc = doc(db, 'products', productSlug);
        const docSnap = await getDoc(productDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            title: data.title || '',
            description: data.description || '',
            published: data.published || false,
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
  
      // Convert `Product` to Firestore-compatible update object
      const updateData: { [key: string]: any } = {
        title: updatedProduct.title,
        description: updatedProduct.description,
      };
  
      await updateDoc(productDoc, updateData);
  
      setProduct(updatedProduct); // Update state with the saved product
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
      <div className="w-full flex gap-2">
      <ProductTitleDescription
        product={product}
        onChange={(updatedFields) =>
          setProduct((prev) => ({ ...prev, ...updatedFields } as Product))
        }
      />
            <ProductStatus
        published={product.published}
        onChange={(updatedFields) =>
          setProduct((prev) => ({ ...prev, ...updatedFields } as Product))
        }
      />

      </div>


    </div>
  );
};

export default ProductPage;
