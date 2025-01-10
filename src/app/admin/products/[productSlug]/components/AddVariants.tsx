'use client';

import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Variant, Product } from '../types';

interface AddVariantProps {
  productSlug: string;
  productData: Product; // Product object passed as a prop
  onVariantAdded: (variant: Variant) => void;
}

const AddVariant: React.FC<AddVariantProps> = ({ productSlug, productData, onVariantAdded }) => {
  const [variant, setVariant] = useState({
    price: productData.price?.toString() || '', // Ensure all values are strings
    compare_at_price: productData.compare_at_price?.toString() || '',
    barcode: productData.barcode || '',
    cost: productData.cost?.toString() || '',
    requires_shipping: productData.requires_shipping || false,
    taxable: productData.taxable || false,
    weight: productData.weight?.toString() || '',
    optionName: '',
    optionValue: '',
    option2Name: '',
    option2Value: '',
    option3Name: '',
    option3Value: '',
    assigned_image: '',
  });
  const [saving, setSaving] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState<number>(0); // Tracks additional options (max 3)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = type === 'checkbox' && (e.target as HTMLInputElement).checked;

    setVariant((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? isChecked : value,
    }));
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
        assigned_image: '',
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
        finish: productData.finish || '', // Default value from productData
        lead_time: productData.lead_time || '', // Default value from productData
        sqft: productData.sqft || '', // Default value from productData
        barcode: variant.barcode || productData.barcode || '', // Default value from productData
      };
      // Remove product-level fields and add the variant
      const updates = {
        [`variants.${newVariantId}`]: newVariant,
        price: null,
        compare_at_price: null,
        cost: null,
        requires_shipping: null,
        taxable: null,
        weight: null,
        barcode: null,
      };

      // Update Firestore
      await updateDoc(productDoc, updates);

      onVariantAdded(newVariant);

      alert('Variant added successfully!');
    } catch (error) {
      console.error('Error adding variant:', error);
      alert('Failed to add variant. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
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
      </div>
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
