'use client';

import React, { useState } from 'react';

interface ProductTitleDescriptionProps {
  product: { title: string; description: string };
  onChange: (updatedFields: { title?: string; description?: string }) => void;
}

const ProductTitleDescription: React.FC<ProductTitleDescriptionProps> = ({
  product,
  onChange,
}) => {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onChange({ title: newTitle });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onChange({ description: newDescription });
  };

  return (
    <div className="w-[80%] p-4 rounded-md flex flex-col gap-4 bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          rows={4}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default ProductTitleDescription;
