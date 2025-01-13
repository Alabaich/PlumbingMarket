'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

interface ProductTitleDescriptionProps {
  product: {
    title: string;
    description: string;
  };
  onChange: (updatedFields: { title?: string; description?: string }) => void;
}

const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), { ssr: false });

const ProductTitleDescription: React.FC<ProductTitleDescriptionProps> = ({
  product,
  onChange,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onChange({ title: newTitle }); // Trigger parent `onChange`
  };

  const handleDescriptionChange = (newDescription: string) => {
    onChange({ description: newDescription }); // Trigger parent `onChange`
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={product.title}
          onChange={handleTitleChange}
          className="bg-gray-50 mt-1 text-xl font-bold p-2 border-0 rounded-md w-full focus:outline-none focus:ring-0 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <RichTextEditor
          value={product.description}
          onChange={handleDescriptionChange} // Trigger parent `onChange`
        />
      </div>
    </div>
  );
};

export default ProductTitleDescription;
