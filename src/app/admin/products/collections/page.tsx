'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import DataTable from '../../components/DataTable';
import Link from 'next/link';

interface Collection {
  id: string; // Collection ID
  title: string; // Collection title
  categoryPath: string; // Formatted category path
  conditions: string; // Formatted conditions
  productsCount: number; // Count of products in the collection
}

type Column<T> = {
  label: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
};

const collectionColumns: Column<Collection>[] = [
  {
    label: 'Collection',
    accessor: (row) => (
      <Link href={`/admin/products/collections/${row.id}`} className="text-blue-500 underline hover:text-blue-700">
        {row.title}
      </Link>
    ),
  },
  { label: 'Category Path', accessor: 'categoryPath' },
  { label: 'Conditions', accessor: 'conditions' },
  { label: 'Products Count', accessor: 'productsCount' },
];

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch collections from Firestore
  useEffect(() => {
    const fetchCollections = async () => {
      const db = getFirestore();
      const collectionsRef = collection(db, 'collections');
      const snapshot = await getDocs(collectionsRef);

      const fetchedCollections: Collection[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        const categoryPath =
          data.categoryPath
            ?.map((cat: { name: string }) => cat.name)
            .join(' > ') || 'N/A';

        const conditions = data.Conditions
          ? `${data.Conditions.conditionBy} ${data.Conditions.conditionWhat} ${data.Conditions.toWhat}`
          : 'N/A';

        return {
          id: docSnap.id,
          title: data.title || 'Untitled',
          categoryPath,
          conditions,
          productsCount: (data.Products || []).length,
        };
      });

      setCollections(fetchedCollections);
    };

    fetchCollections();
  }, []);

  const filteredCollections = collections.filter((collection) =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <div className="flex flex-col gap-4">
        <header className="mainHeader flex justify-between items-center">
          <h3>Collections</h3>
          <div className="flex gap-2">
            <button className="btn btn-lg-gr">Export</button>
            <button className="btn btn-lg-gr">Import</button>
            <button className="btn btn-gr">Add Collection</button>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur-lg shadow-sm rounded-md overflow-hidden">
          <div className="p-4 border-b-[1px]">
            <div className="flex flex-col gap-4">
              <div className="flex border border-gray-300 rounded-full p-2 gap-4 hover:bg-gray-50">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm w-full active:border-none active:outline-none focus:border-none focus:outline-none"
                />
              </div>
            </div>
          </div>
          <DataTable
            columns={collectionColumns}
            data={filteredCollections}
            rowKey={(row) => row.id}
          />
        </div>
      </div>
    </main>
  );
};

export default Collections;
