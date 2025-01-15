"use client";

import { useEffect, useState } from "react";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import { ECollection } from "../../types";

interface ProductCollectionsProps {
  productSlug: string; // Pass the productSlug as a prop
}

export default function ProductCollections({ productSlug }: ProductCollectionsProps) {
  const [collections, setCollections] = useState<ECollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productSlug) return;

    async function fetchCollectionsByProduct() {
      try {
        setLoading(true);
        setError(null);

        const db = getFirestore();
        const q = query(
          collection(db, "collections"),
          where("Products", "array-contains", productSlug)
        );
        const querySnapshot = await getDocs(q);

        const fetchedCollections = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ECollection[];

        setCollections(fetchedCollections);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Failed to load collections. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCollectionsByProduct();
  }, [productSlug]);

  if (loading) {
    return <div>Loading collections...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (collections.length === 0) {
    return <div>No collections found for this product.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-xl font-bold mb-4">Collections</h2>
      <ul className="list-disc pl-5">
        {collections.map((collection) => (
          <li key={collection.id} className="mb-2 text-gray-700 hover:text-gray-900">
            {collection.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
