'use client';

import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Variant } from '../types';


interface AddVariantProps {
    productSlug: string;
    onVariantAdded: (variant: Variant) => void;
  }
  

  const AddVariant: React.FC<AddVariantProps> = ({ productSlug, onVariantAdded }) => {
  const [variant, setVariant] = useState({
    price: '',
    compare_at_price: '',
    cost: '',
    requires_shipping: false,
    taxable: false,
    weight: '',
    optionName: '',
    optionValue: '',
    option2Name: '',
    option2Value: '',
    option3Name: '',
    option3Value: '',
  });
  const [saving, setSaving] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState<number>(0); // Tracks additional options (max 3)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    // Narrow down the type to HTMLInputElement for checkboxes
    const isChecked = type === 'checkbox' && (e.target as HTMLInputElement).checked;
  
    setVariant((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? isChecked : value,
    }));
  };
  

  const handleAddOption = () => {
    if (additionalOptions < 2) {
      setAdditionalOptions((prev) => prev + 1);
    }
  };

  const handleSaveVariant = async () => {
    if (!variant.optionName || !variant.optionValue) {
      alert('Please fill out the required option name and value.');
      return;
    }
  
    setSaving(true);
  
    try {
      const db = getFirestore();
      const productDoc = doc(db, 'products', productSlug);
      const newVariantId = `variant_${Date.now()}`;
  
      const newVariant: Variant = {
        id: newVariantId,
        compare_at_price: parseFloat(variant.compare_at_price || '0'),
        cost: parseFloat(variant.cost || '0'),
        price: parseFloat(variant.price || '0'),
        requires_shipping: variant.requires_shipping,
        taxable: variant.taxable,
        weight: parseFloat(variant.weight || '0'),
        option: { name: variant.optionName, value: variant.optionValue },
        ...(variant.option2Name && variant.option2Value
          ? { option2: { name: variant.option2Name, value: variant.option2Value } }
          : {}),
        ...(variant.option3Name && variant.option3Value
          ? { option3: { name: variant.option3Name, value: variant.option3Value } }
          : {}),
        finish: '',
        lead_time: '',
        sqft: '',
      };
  
      // Update Firestore
      await updateDoc(productDoc, {
        [`variants.${newVariantId}`]: newVariant,
      });
  
      onVariantAdded(newVariant);
  
      // Reset form
      setVariant({
        compare_at_price: '',
        cost: '',
        price: '',
        requires_shipping: false,
        taxable: false,
        weight: '',
        optionName: '',
        optionValue: '',
        option2Name: '',
        option2Value: '',
        option3Name: '',
        option3Value: '',
      });
      setAdditionalOptions(0);
  
      alert('Variant added successfully!');
    } catch (error) {
      console.error('Error adding variant:', error);
      alert('Failed to add variant. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h3 className="text-lg font-medium text-gray-700">Add New Variant</h3>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input
          type="text"
          name="optionName"
          value={variant.optionName}
          onChange={handleInputChange}
          placeholder="Option Name (e.g., Size)"
          className="p-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="optionValue"
          value={variant.optionValue}
          onChange={handleInputChange}
          placeholder="Option Value (e.g., Small)"
          className="p-2 border rounded-md"
          required
        />
        {additionalOptions >= 1 && (
          <>
            <input
              type="text"
              name="option2Name"
              value={variant.option2Name}
              onChange={handleInputChange}
              placeholder="Option 2 Name (e.g., Color)"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="option2Value"
              value={variant.option2Value}
              onChange={handleInputChange}
              placeholder="Option 2 Value (e.g., Blue)"
              className="p-2 border rounded-md"
            />
          </>
        )}
        {additionalOptions >= 2 && (
          <>
            <input
              type="text"
              name="option3Name"
              value={variant.option3Name}
              onChange={handleInputChange}
              placeholder="Option 3 Name (e.g., Material)"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="option3Value"
              value={variant.option3Value}
              onChange={handleInputChange}
              placeholder="Option 3 Value (e.g., Cotton)"
              className="p-2 border rounded-md"
            />
          </>
        )}
      </div>
      {additionalOptions < 2 && (
        <button
          onClick={handleAddOption}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          + Add Another Option
        </button>
      )}
      <button
        onClick={handleSaveVariant}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Variant'}
      </button>
    </div>
  );
};

export default AddVariant;
