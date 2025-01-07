'use client';

import React, { useState } from 'react';

interface ShippingDetailsProps {
  product: {
    requires_shipping: boolean;
    weight: number;
  };
  onChange: (updatedFields: Partial<ShippingDetailsProps['product']>) => void;
}

const ShippingDetails: React.FC<ShippingDetailsProps> = ({ product, onChange }) => {
  const [requiresShipping, setRequiresShipping] = useState(product.requires_shipping);
  const [weight, setWeight] = useState(product.weight);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'requires_shipping') {
      setRequiresShipping(value as boolean);
      onChange({ requires_shipping: value as boolean });
      return;
    }

    const numericValue = parseFloat(value as string) || 0; // Convert string to number
    setWeight(numericValue);
    onChange({ weight: numericValue });
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium text-gray-700">Shipping</h3>

      {/* Requires Shipping Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={requiresShipping}
          onChange={(e) => handleInputChange('requires_shipping', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">
          This is a physical product
        </label>
      </div>

      {/* Weight Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Weight</label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            lb
          </span>
          <input
            type="number"
            value={weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="pl-10 p-2 border rounded-md w-full"
            placeholder="Enter weight"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Weight of the product in Lb</p>
      </div>
    </div>
  );
};

export default ShippingDetails;
