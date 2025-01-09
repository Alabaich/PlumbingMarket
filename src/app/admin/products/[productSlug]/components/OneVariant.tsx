'use client';

import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Variant } from '../types';

interface OneVariantProps {
  productSlug: string;
  variant: Variant;
  onVariantUpdate: (updatedVariant: Variant) => void;
}

const OneVariant: React.FC<OneVariantProps> = ({ productSlug, variant, onVariantUpdate }) => {
  const [variantDetails, setVariantDetails] = useState<Variant>(variant);

  const handleInputChange = (field: keyof Variant, value: string | number) => {
    setVariantDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (key: 'option' | 'option2' | 'option3', nameOrValue: 'name' | 'value', value: string) => {
    setVariantDetails((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [nameOrValue]: value,
      },
    }));
  };

  const handleSave = async () => {
    const db = getFirestore();
    const productRef = doc(db, 'products', productSlug);

    try {
      await updateDoc(productRef, {
        [`variants.${variantDetails.id}`]: variantDetails,
      });
      onVariantUpdate(variantDetails);
      alert('Variant updated successfully!');
    } catch (error) {
      console.error('Error updating variant:', error);
      alert('Failed to update the variant.');
    }
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
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Manage Variant</h2>
      {/* Option Fields */}
      <div className="flex gap-4">
        <div>
          <label>Option 1 Name</label>
          <input
            type="text"
            value={variantDetails.option.name}
            onChange={(e) => handleOptionChange('option', 'name', e.target.value)}
          />
        </div>
        <div>
          <label>Option 1 Value</label>
          <input
            type="text"
            value={variantDetails.option.value}
            onChange={(e) => handleOptionChange('option', 'value', e.target.value)}
          />
        </div>
      </div>

      {variantDetails.option2 && (
        <div className="flex gap-4">
          <div>
            <label>Option 2 Name</label>
            <input
              type="text"
              value={variantDetails.option2.name}
              onChange={(e) => handleOptionChange('option2', 'name', e.target.value)}
            />
          </div>
          <div>
            <label>Option 2 Value</label>
            <input
              type="text"
              value={variantDetails.option2.value}
              onChange={(e) => handleOptionChange('option2', 'value', e.target.value)}
            />
          </div>
        </div>
      )}

      {variantDetails.option3 && (
        <div className="flex gap-4">
          <div>
            <label>Option 3 Name</label>
            <input
              type="text"
              value={variantDetails.option3.name}
              onChange={(e) => handleOptionChange('option3', 'name', e.target.value)}
            />
          </div>
          <div>
            <label>Option 3 Value</label>
            <input
              type="text"
              value={variantDetails.option3.value}
              onChange={(e) => handleOptionChange('option3', 'value', e.target.value)}
            />
          </div>
        </div>
      )}

      <button type="button" onClick={handleAddOption}>
        Add Another Option
      </button>

      {/* Save Button */}
      <button onClick={handleSave}>Save Variant</button>
    </div>
  );
};

export default OneVariant;
