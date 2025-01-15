'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { Product, MediaItem, Variant } from '../../types';

interface CollectionProductsProps {
  collectionId: string; // ID of the collection to fetch
  products: string[]; // Initial products from the parent component
  onProductsUpdate: (updatedProducts: string[]) => void; // Callback to update the parent
}

const CollectionProducts: React.FC<CollectionProductsProps> = ({ collectionId, products, onProductsUpdate }) => {
  const router = useRouter();
  const [localProducts, setLocalProducts] = useState<(Product & { slug: string; imageUrl?: string; displaySku: string })[]>([]);
  const [allProducts, setAllProducts] = useState<(Product & { slug: string; displaySku: string })[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<(Product & { slug: string; displaySku: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchImage = async (imageId: string): Promise<string> => {
      const db = getFirestore();
      const mediaDocRef = doc(db, 'media', imageId);
      const mediaSnap = await getDoc(mediaDocRef);
      return mediaSnap.exists() ? (mediaSnap.data() as MediaItem).url : '';
    };

    const getDisplaySku = (product: Product): string => {
      const variantKeys = Object.keys(product.variants || {});
      if (variantKeys.length > 0) {
        const firstVariantKey = variantKeys[0];
        const firstVariant: Variant = product.variants[firstVariantKey];
        return firstVariant?.barcode || product.sku; // Prefer variant barcode; fallback to product SKU
      }
      return product.sku; // Fallback if no variants
    };

    const fetchProducts = async () => {
      const db = getFirestore();

      // Fetch products from the collection
      const productPromises = products.map(async (slug) => {
        const productDoc = doc(db, 'products', slug);
        const productSnap = await getDoc(productDoc);
        if (productSnap.exists()) {
          const productData = productSnap.data() as Product;
          let imageUrl = '';
          if (productData.images?.length) {
            imageUrl = await fetchImage(productData.images[0]); // Fetch the first image URL
          }
          const displaySku = getDisplaySku(productData);
          return { ...productData, slug, imageUrl, displaySku };
        }
        return null;
      });

      const resolvedProducts = (await Promise.all(productPromises)).filter(Boolean) as (Product & { slug: string; imageUrl?: string; displaySku: string })[];
      setLocalProducts(resolvedProducts);

      // Fetch all products for search
      const productsCollection = collection(db, 'products');
      const querySnapshot = await getDocs(productsCollection);
      const allProductsData: (Product & { slug: string; displaySku: string })[] = [];
      querySnapshot.forEach((doc) => {
        const product = doc.data() as Product;
        const displaySku = getDisplaySku(product);
        allProductsData.push({ slug: doc.id, ...product, displaySku });
      });
      setAllProducts(allProductsData);
    };

    fetchProducts();
  }, [products]);

  const handleAddProduct = (product: Product & { slug: string; displaySku: string }) => {
    const updatedProducts = [...localProducts.map((p) => p.slug), product.slug];
    setLocalProducts((prev) => [...prev, product]);
    onProductsUpdate(updatedProducts);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveProduct = (slug: string) => {
    const updatedProducts = localProducts.filter((product) => product.slug !== slug).map((p) => p.slug);
    setLocalProducts((prev) => prev.filter((product) => product.slug !== slug));
    onProductsUpdate(updatedProducts);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setShowDropdown(false);
      return;
    }

    const alreadyAddedSlugs = new Set(localProducts.map((product) => product.slug));
    const filtered = allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(term.toLowerCase()) &&
        !alreadyAddedSlugs.has(product.slug)
    );
    setFilteredProducts(filtered);
    setShowDropdown(filtered.length > 0);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Collection Products</h2>
      <ul className="space-y-4">
        {localProducts.map((product, index) => (
          <li
            key={index}
            className="flex items-center gap-4"
          >
            <div
              className="flex-1 flex items-center gap-4 cursor-pointer"
              onClick={() => router.push(`/admin/products/${product.slug}`)}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  No Image
                </div>
              )}
              <div>
                <p className="font-medium text-gray-700">{product.title}</p>
                <p className="text-sm text-gray-500">SKU: {product.displaySku}</p>
              </div>
            </div>
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={() => handleRemoveProduct(product.slug)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 relative">
        <h3 className="text-lg font-bold mb-2">Add Products</h3>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 w-full border rounded-md"
        />
        {showDropdown && (
          <ul className="absolute z-10 bg-white border rounded-md mt-2 w-full shadow-lg max-h-48 overflow-y-auto">
            {filteredProducts.map((product) => (
              <li
                key={product.slug}
                className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddProduct(product)}
              >
                <div>
                  <p className="font-medium text-gray-700">{product.title}</p>
                  <p className="text-sm text-gray-500">SKU: {product.displaySku}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CollectionProducts;
