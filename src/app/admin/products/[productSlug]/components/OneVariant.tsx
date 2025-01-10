'use client';

import React, { useState } from 'react';
import { Variant } from '../types';

interface OneVariantProps {
  productSlug: string;
  variant: Variant;
  onVariantUpdate: (updatedVariant: Variant) => void;
  onAddVariant: () => void; // Callback to add another variant
}

const OneVariant: React.FC<OneVariantProps> = ({
  productSlug,
  variant,
  onVariantUpdate,
  onAddVariant,
}) => {
  const [variantDetails, setVariantDetails] = useState<Variant>(variant);

  const handleOptionChange = (
    key: 'option' | 'option2' | 'option3',
    nameOrValue: 'name' | 'value',
    value: string
  ) => {
    const updatedVariant = {
      ...variantDetails,
      [key]: {
        ...variantDetails[key],
        [nameOrValue]: value, // Correctly updating name or value
      },
    };

    setVariantDetails(updatedVariant); // Update local state
    onVariantUpdate(updatedVariant); // Notify parent of the change
  };


  const handleAddOption = () => {
    if (!variantDetails.option2) {
      setVariantDetails((prev) => ({
        ...prev,
        option2: { name: '', value: '' },
      }));
    } else if (!variantDetails.option3) {
      setVariantDetails((prev) => ({
        ...prev,
        option3: { name: '', value: '' },
      }));
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md border border-gray-200">
      <div className="flex widt-full justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Variants:</h3>
        <div className="">
          <button
            type="button"
            onClick={onAddVariant}
            className="bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-md hover:bg-blue-100 transition"
          >
            + Add Another Variant
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Option 1 */}
        <div className="flex flex-wrap items-center gap-2 shadow-sm p-2 rounded-md border-[1px]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="py-1 px-2 border border-gray-300 rounded-md text-sm"
              value={variantDetails.option.name}
              onChange={(e) => handleOptionChange('option', 'name', e.target.name)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="py-1 px-2 border border-gray-300 rounded-md text-sm"
              value={variantDetails.option.value}
              onChange={(e) => handleOptionChange('option', 'value', e.target.value)}
            />
          </div>
        </div>



        {/* Option 2 */}
        {variantDetails.option2 && (
        <div className="flex flex-wrap items-center gap-2 shadow-sm p-2 rounded-md border-[1px]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Option 2 Name"
              className="py-1 px-2 border border-gray-300 rounded-md text-sm"
              value={variantDetails.option2.name}
              onChange={(e) => handleOptionChange('option2', 'name', e.target.value)} // Correct handler for name
            />
            </div>
            <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Option 2 Value"
              className="py-1 px-2 border border-gray-300 rounded-md text-sm"
              value={variantDetails.option2.value}
              onChange={(e) => handleOptionChange('option2', 'value', e.target.value)} // Correct handler for value
            />
            </div>

          </div>
        )}

        {/* Option 3 */}
        {variantDetails.option3 && (
        <div className="flex flex-wrap items-center gap-2 shadow-sm p-2 rounded-md border-[1px]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Option 3 Name"
              className="py-1 px-2 border border-gray-300 rounded-md text-sm"
              value={variantDetails.option3.name}
              onChange={(e) => handleOptionChange('option3', 'name', e.target.value)} // Correct handler for name
            />
            </div><div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Option 3 Value"
              className="py-1 px-2 border border-gray-300 rounded-md text-sm"
              value={variantDetails.option3.value}
              onChange={(e) => handleOptionChange('option3', 'value', e.target.value)} // Correct handler for value
            />
            </div>
          </div>
        )}

        {/* Add Another Option Button */}
        {(!variantDetails.option2 || !variantDetails.option3) && (
          <button
            type="button"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm"
            onClick={handleAddOption}
          >
            <span className="text-lg">+</span> Add another option
          </button>
        )}
      </div>
    </div>
  );
};

export default OneVariant;
