'use client';

import React, { useState } from 'react';

interface NewVariantPopupProps {
  existingOptions: { name: string; value: string }[]; // Array of existing options (name is inherited, value is set)
  onClose: () => void; // Function to close the pop-up
  onSave: (sku: string, options: { [key: string]: string }) => void; // Save callback
}

const NewVariantPopup: React.FC<NewVariantPopupProps> = ({ existingOptions, onClose, onSave }) => {
  const [sku, setSku] = useState('');
  const [optionValues, setOptionValues] = useState<{ [key: string]: string }>(
    existingOptions.reduce((acc, option) => {
      acc[option.name] = ''; // Initialize values as empty strings
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleOptionChange = (name: string, value: string) => {
    setOptionValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!sku.trim()) {
      alert('SKU is required');
      return;
    }
    onSave(sku, optionValues); // Pass SKU and option values to the parent component
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96">
        <h2 className="text-xl font-medium mb-4">Create New Variant</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">SKU:</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Enter SKU"
          />
        </div>
        {existingOptions.map((option, index) => (
          <div key={index} className="mb-4">
            <label className="block font-medium mb-1">{option.name}:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={optionValues[option.name]}
              onChange={(e) => handleOptionChange(option.name, e.target.value)}
              placeholder={`Enter value for ${option.name}`}
            />
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewVariantPopup;
