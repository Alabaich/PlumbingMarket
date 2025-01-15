'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ECollection } from '../../types';

const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), { ssr: false });

interface CollectionDetailsProps {
  collection: ECollection;
  onChange: (updatedFields: Partial<ECollection>) => void;
}

const CollectionDetails: React.FC<CollectionDetailsProps> = ({ collection, onChange }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onChange({ title: newTitle });
  };

  const handleDescriptionChange = (newDescription: string) => {
    onChange({ description: newDescription });
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded-md flex flex-col gap-4">
      {/* Collection Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={collection.title || ''}
          onChange={handleTitleChange}
          className="bg-gray-50 mt-1 text-xl font-bold p-2 border-0 rounded-md w-full focus:outline-none focus:ring-0 focus:border-transparent"
        />
      </div>

      {/* Collection Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <RichTextEditor
          value={collection.description || ''}
          onChange={handleDescriptionChange}
        />
      </div>
    </div>
  );
};

export default CollectionDetails;
