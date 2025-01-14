'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface CategoryPathProps {
  categoryPath: { id: string; name: string }[];
  onCategoryPathUpdate: (updatedPath: { id: string; name: string }[]) => void;
}

const getIconPath = (name: string) => `/icons/${name.toLowerCase()}.svg`;

const CategoryPath: React.FC<CategoryPathProps> = ({ categoryPath, onCategoryPathUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const db = getFirestore();

  // Generate ID based on the category name
  const generateId = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  // Fetch category suggestions from Firestore
  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);

      const allCategories = new Set<string>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.categoryPath && Array.isArray(data.categoryPath)) {
          data.categoryPath.forEach((cat: { name: string }) => allCategories.add(cat.name));
        }
      });

      const filteredSuggestions = Array.from(allCategories).filter((category) =>
        category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching category suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Add new category to the path
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: generateId(newCategoryName.trim()),
        name: newCategoryName.trim(),
      };

      const updatedPath = [...categoryPath, newCategory];
      onCategoryPathUpdate(updatedPath);
      setNewCategoryName('');
      setSuggestions([]);
    }
  };

  // Delete category from the path
  const handleDeleteCategory = (categoryId: string) => {
    const updatedPath = categoryPath.filter((category) => category.id !== categoryId);
    onCategoryPathUpdate(updatedPath);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCategoryName(value);
    fetchSuggestions(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setNewCategoryName(suggestion);
    setSuggestions([]);
  };

  // Handle drag-and-drop
  const handleDragStart = (index: number) => {
    setDragging(index);
  };

  const handleDragOver = (index: number) => {
    if (dragging === null || dragging === index) return;

    const reorderedPath = [...categoryPath];
    const [movedItem] = reorderedPath.splice(dragging, 1);
    reorderedPath.splice(index, 0, movedItem);

    onCategoryPathUpdate(reorderedPath);
    setDragging(index);
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded-md flex flex-col gap-4">
      <label className="text-sm font-medium text-gray-700">Category Path</label>

      <div className="relative flex gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={handleInputChange}
          placeholder="Category Name"
          className="p-2 border rounded-md flex-1 text-sm"
        />
        <button
          onClick={handleAddCategory}
          className="p-2 bg-blue-50 text-white rounded-sm hover:bg-blue-100"
          disabled={!newCategoryName.trim()}
        >
          <Image
            src={getIconPath('add_plus')}
            alt="Add Icon"
            width={19}
            height={19}
          />
        </button>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-md z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryPath.map((category, index) => (
          <div
            key={category.id}
            className={`relative flex items-center gap-2 bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-full text-gray-400 hover:text-gray-600 ${
              dragging === index ? 'border border-blue-500' : ''
            }`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={() => handleDragOver(index)}
            onDragEnd={handleDragEnd}
          >
            <span>{category.name}</span>
            <span
              onClick={() => handleDeleteCategory(category.id)}
              className="cursor-pointer"
            >
              <Image
                src={getIconPath('cross-sm')}
                alt="Delete Icon"
                width={15}
                height={15}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPath;
