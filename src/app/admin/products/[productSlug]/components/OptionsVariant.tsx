'use client';

import React, { useState } from 'react';
import { Variant } from '../types';

interface VariantOptionsEditorProps {
  variant: Variant;
  onVariantUpdate: (updatedVariant: Variant) => void;
}

const VariantOptionsEditor: React.FC<VariantOptionsEditorProps> = ({
  variant,
  onVariantUpdate,
}) => {
  const [variantDetails, setVariantDetails] = useState<Variant>(variant);
  const [dragging, setDragging] = useState<'option' | 'option2' | 'option3' | null>(null);

  const handleOptionChange = (
    key: 'option' | 'option2' | 'option3',
    nameOrValue: 'name' | 'value',
    value: string
  ) => {
    const updatedVariant = {
      ...variantDetails,
      [key]: {
        ...variantDetails[key],
        [nameOrValue]: value,
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
        updatedVariant.option = { ...updatedVariant.option2 };
        if (updatedVariant.option3) {
          updatedVariant.option2 = { ...updatedVariant.option3 };
          delete updatedVariant.option3;
        } else {
          delete updatedVariant.option2;
        }
      } else {
        alert('Cannot delete the last option.');
        return;
      }
    } else if (key === 'option2') {
      if (updatedVariant.option3) {
        updatedVariant.option2 = { ...updatedVariant.option3 };
        delete updatedVariant.option3;
      } else {
        delete updatedVariant.option2;
      }
    } else if (key === 'option3') {
      delete updatedVariant.option3;
    }

    setVariantDetails(updatedVariant); // Update local state
    onVariantUpdate(updatedVariant); // Notify parent of the change
  };

  const handleDragStart = (key: 'option' | 'option2' | 'option3') => {
    setDragging(key);
  };

  const handleDragOver = (target: 'option' | 'option2' | 'option3') => {
    if (!dragging || dragging === target) return;

    const updatedVariant = {
      ...variantDetails,
      [dragging]: variantDetails[target],
      [target]: variantDetails[dragging],
    };

    setVariantDetails(updatedVariant); // Swap the options in state
    onVariantUpdate(updatedVariant); // Notify parent of the updated state
    setDragging(null); // Reset dragging state
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Edit Variant Options:</h3>
      </div>

      <div className="flex flex-col gap-2 border-[1px] border-gray-200 rounded-md p-2">
        {['option', 'option2', 'option3'].map((key) => {
          const optionKey = key as 'option' | 'option2' | 'option3';
          const option = variantDetails[optionKey];
          if (!option) return null;

          return (
            <div
              key={optionKey}
              draggable
              onDragStart={() => handleDragStart(optionKey)}
              onDragOver={(e) => {
                e.preventDefault(); // Allow drop
                handleDragOver(optionKey);
              }}
              className={`flex justify-between items-center gap-2 px-2 border-b-[1px] ${
                dragging === optionKey ? 'bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="cursor-grab"
                  title="Drag to reorder"
                  style={{
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                    background: 'url(/icons/dragVertical.svg) center center no-repeat',
                  }}
                />
                <input
                  type="text"
                  placeholder={`${key} Name`}
                  className="py-1 px-2 text-sm max-w-[75px]"
                  value={option.name}
                  onChange={(e) => handleOptionChange(optionKey, 'name', e.target.value)}
                />
                -
                <input
                  type="text"
                  placeholder={`${key} Value`}
                  className="py-1 px-2 text-sm max-w-[75px]"
                  value={option.value}
                  onChange={(e) => handleOptionChange(optionKey, 'value', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveOption(optionKey)}
                className="text-red-500 text-sm"
                title={`Remove ${key}`}
              >
                ×
              </button>
            </div>
          );
        })}

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

export default VariantOptionsEditor;
