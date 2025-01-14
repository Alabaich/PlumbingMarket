'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProductDetails from './components/ProductDetails';
import ProductImages from './components/ProductImages';
import ProductSpecifications from './components/ProductSpecifications';
import RelatedProducts from './components/RelatedProducts';

const ProductPage = () => {
  const [product, setProduct] = useState<any | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProduct = async () => {
      const pathParts = pathname.split('/').slice(1);
      const productSlug = pathParts[pathParts.length - 1];
      const categoryPath = pathParts.slice(0, -1).join('/');

      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);

        let foundProduct = null;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const currentCategoryPath = Array.isArray(data.categoryPath)
            ? data.categoryPath.map((cat: { id: string }) => cat.id).join('/')
            : '';

          if (currentCategoryPath === categoryPath && doc.id === productSlug) {
            foundProduct = { id: doc.id, ...data };
          }
        });

        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [pathname]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="p-6">
        <div className="flex gap-2">
        <ProductImages images={product.images || []} />
      <ProductDetails title={product.title} description={product.description} />
      
        </div>

      <ProductSpecifications specifications={product.specifications || []} />
      <RelatedProducts products={product.relatedProducts || []} />
    </div>
  );
};

export default ProductPage;
