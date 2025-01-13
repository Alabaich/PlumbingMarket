'use client';

import React, { useState } from 'react';
import { Variant } from '../types';

interface OneVariantProps {
  productSlug: string;
  variant: Variant;
  onVariantUpdate: (updatedVariant: Variant) => void;
  onAddVariant: () => void; // Callback to add another variant
  onDeleteVariant: (variantId: string) => void; // Callback to delete the entire variant
}


const OneVariant: React.FC<OneVariantProps> = ({
  productSlug,
  variant,
  onVariantUpdate,
  onAddVariant,
  onDeleteVariant
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

  const handleRemoveOption = (key: 'option' | 'option2' | 'option3') => {
    const updatedVariant = { ...variantDetails };

    if (key === 'option') {
      if (updatedVariant.option2) {
        // Shift option2 to option
        updatedVariant.option = { ...updatedVariant.option2 };
        // Shift option3 to option2 if it exists
        if (updatedVariant.option3) {
          updatedVariant.option2 = { ...updatedVariant.option3 };
          delete updatedVariant.option3; // Remove option3
        } else {
          delete updatedVariant.option2; // Remove option2 if no option3
        }
      } else {
        // If no option2 exists, confirm deletion of the entire variant
        if (
          window.confirm(
            'This is the last option. Are you sure you want to delete this variant?'
          )
        ) {
          onDeleteVariant(variantDetails.id); // Trigger variant deletion
          return; // Exit early as the entire variant is deleted
        }
      }
    } else if (key === 'option2') {
      if (updatedVariant.option3) {
        updatedVariant.option2 = { ...updatedVariant.option3 };
        delete updatedVariant.option3; // Remove option3
      } else {
        delete updatedVariant.option2; // Remove option2 entirely
      }
    } else if (key === 'option3') {
      delete updatedVariant.option3; // Simply remove option3
    }

    setVariantDetails(updatedVariant); // Update local state
    onVariantUpdate(updatedVariant); // Notify parent of the change
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

      <div className="flex flex-col gap-2 border-[1px] border-gray-200 rounded-md p-2">
        {/* Option 1 */}
        <div className="flex justify-between items-left gap-2 px-2 border-b-[1px]">
          <div className="flex gap-2">
          <input
            type="text"
            placeholder="Option 1 Name"
            className="py-1 px-2 text-sm max-w-[75px]"
            value={variantDetails.option.name}
            onChange={(e) => handleOptionChange('option', 'name', e.target.value)} // Fixed handler
          />
          -
          <input
            type="text"
            placeholder="Option 1 Value"
            className="py-1 px-2 text-sm max-w-[75px]"
            value={variantDetails.option.value}
            onChange={(e) => handleOptionChange('option', 'value', e.target.value)} // Fixed handler
          />
          </div>


            <button
              type="button"
              onClick={() => handleRemoveOption('option')}
              className="text-red-500 text-sm"
              title="Remove Option 1"
            >
              ×
            </button>

        </div>

        {/* Option 2 */}
        {variantDetails.option2 && (
          <div className="flex items-left gap-2 px-2 border-b-[1px]">
            <input
              type="text"
              placeholder="Option 2 Name"
              className="py-1 px-2 text-sm max-w-[75px]"
              value={variantDetails.option2.name}
              onChange={(e) => handleOptionChange('option2', 'name', e.target.value)} // Fixed handler
            />
            -
            <input
              type="text"
              placeholder="Option 2 Value"
              className="py-1 px-2 text-sm max-w-[75px]"
              value={variantDetails.option2.value}
              onChange={(e) => handleOptionChange('option2', 'value', e.target.value)} // Fixed handler
            />
    <button
      type="button"
      onClick={() => handleRemoveOption('option2')}
      className="text-red-500 text-sm"
      title="Remove Option 2"
    >
      ×
    </button>
          </div>
        )}

        {/* Option 3 */}
        {variantDetails.option3 && (
          <div className="flex items-left gap-2 px-2">
            <input
              type="text"
              placeholder="Option 3 Name"
              className="py-1 px-2 text-sm max-w-[75px]"
              value={variantDetails.option3.name}
              onChange={(e) => handleOptionChange('option3', 'name', e.target.value)} // Fixed handler
            />
            -
            <input
              type="text"
              placeholder="Option 3 Value"
              className="py-1 px-2 text-sm max-w-[75px]"
              value={variantDetails.option3.value}
              onChange={(e) => handleOptionChange('option3', 'value', e.target.value)} // Fixed handler
            />
            <button
              type="button"
              onClick={() => handleRemoveOption('option3')}
              className="text-red-500 text-sm"
              title="Remove Option 3"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Another Option Button */}
        {(!variantDetails.option2 || !variantDetails.option3) && (
          <button
            type="button"
            className="text-blue-500 hover:text-blue-600 text-sm"
            onClick={handleAddOption}
          >
            + Add another option
          </button>
        )}
      </div>
    </div>
  );
};

export default OneVariant;
