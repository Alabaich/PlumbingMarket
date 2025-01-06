'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import DataTable from '../components/DataTable';
import Image from 'next/image';

interface Product {
  slug: string; 
  img: string;
  product: string;
  sku: string;
  vendor: string;
  type: string; // Product type
  published: boolean; // Active/Draft status
  tags: string[]; // Product tags
  [key: string]: unknown; // Add this index signature
}

const getIconPath = (name: string) => `/icons/${name.toLowerCase()}.svg`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const columns = [
    { label: '', accessor: 'img' }, // First column for product image
    { label: 'Product', accessor: 'product' }, // Second column for product name
    { label: 'Sku', accessor: 'sku' }, // Third column for SKU
    { label: 'Vendor', accessor: 'vendor' }, // Fourth column for vendor
  ];

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const productsCollection = collection(db, 'products');
      const querySnapshot = await getDocs(productsCollection);

      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const firstImage = data.images?.[0]?.src || ''; // Get the first image URL
        const productName = data.title || ''; // Get product title
        const sku = Object.keys(data.variants || {})[0] || ''; // Get the first variant SKU
        const vendor = data.vendor || ''; // Get vendor name
        const type = data.type || ''; // Get product type
        const published = data.published || false; // Get active/draft status
        const tags = data.tags || []; // Get product tags

        fetchedProducts.push({
          slug: doc.id,
          img: firstImage,
          product: productName,
          sku: sku,
          vendor: vendor,
          type: type,
          published: published,
          tags: tags,
        });
      });

      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  const allTags = Array.from(new Set(products.flatMap((product) => product.tags)));

  const filteredData = products.filter((product) => {
    const matchesSearch = product.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = statusFilter ? product.vendor === statusFilter : true;
    const matchesType = typeFilter ? product.type === typeFilter : true;
    const matchesPublished =
      publishedFilter === ''
        ? true
        : publishedFilter === 'active'
        ? product.published
        : !product.published;
    const matchesTag = tagFilter ? product.tags.includes(tagFilter) : true;

    return matchesSearch && matchesVendor && matchesType && matchesPublished && matchesTag;
  });

  return (
    <main>
      <div className="flex flex-col gap-4">
        <header className="mainHeader flex justify-between items-center">
          <h3>Products</h3>
          <div className="flex gap-2">
            <button className="btn btn-lg-gr">Export</button>
            <button className="btn btn-lg-gr">Import</button>
            <button className="btn btn-gr">Add product</button>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur-lg shadow-sm rounded-md overflow-hidden">
          <div className="p-4 border-b-[1px]">
            <div className="flex flex-col gap-4">
              <div className="flex border border-gray-300 rounded-full p-2 gap-4 hover:bg-gray-50">
                <Image
                  src={getIconPath('search')}
                  alt="Dashboard Icon"
                  width={19}
                  height={19}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm w-full active:border-none active:outline-none focus:border-none focus:outline-none"
                />
              </div>

              <div className="filters flex flex-wrap gap-4">
                {/* Vendor Filter */}
                <div className="filter flex items-center gap-2">
                <p className="text-xs text-gray-300">Vendor:</p>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="cursor-pointer text-xs py-[3px] px-4 border border-gray-300 rounded-full text-gray-300 appearance-none focus:outline-none focus:border-gray-400 focus:text-gray-600"
                >
                  <option value="">All</option>
                  {products.map((product, index) => (
                    <option key={index} value={product.vendor}>
                      {product.vendor}
                    </option>
                  ))}
                </select>
                </div>


                {/* Product Type Filter */}
                <div className="filter flex items-center gap-2">
                <p className="text-xs  text-gray-300">Product Type:</p>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="cursor-pointer text-xs  py-[3px] px-4 border border-gray-300 rounded-full text-gray-300 appearance-none focus:outline-none focus:border-gray-400 focus:text-gray-600"
                >
                  <option value="">All</option>
                  {Array.from(new Set(products.map((product) => product.type))).map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                </div>


                {/* Active/Draft Filter */}
                <div className="filter flex items-center gap-2">
                <p className="text-xs text-gray-300">Status:</p>
                <select
                  value={publishedFilter}
                  onChange={(e) => setPublishedFilter(e.target.value)}
                  className="cursor-pointer text-xs  py-[3px] px-4 border border-gray-300 rounded-full text-gray-300 appearance-none focus:outline-none focus:border-gray-400 focus:text-gray-600"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
                </div>


                {/* Tagged Filter */}
                <div className="filter flex items-center gap-2">
                <p className="text-xs text-gray-300">Tags:</p>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="cursor-pointer text-xs py-[3px] px-4 border border-gray-300 rounded-full text-gray-300 appearance-none focus:outline-none focus:border-gray-400 focus:text-gray-600"
                >
                  
                  <option value="">All</option>
                  {allTags.map((tag, index) => (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                </div>

              </div>
            </div>
          </div>
          <DataTable<Product> columns={columns} data={filteredData} />
        </div>
      </div>
    </main>
  );
};

export default Products;
