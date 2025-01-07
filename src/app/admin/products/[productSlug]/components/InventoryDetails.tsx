'use client';

import React, { useState } from 'react';

interface InventoryDetailsProps {
  product: {
    sku: string;
    barcode: string;
  };
  onChange: (updatedFields: Partial<InventoryDetailsProps['product']>) => void;
}

const InventoryDetails: React.FC<InventoryDetailsProps> = ({ product, onChange }) => {
  const [sku, setSku] = useState(product.sku);
  const [barcode, setBarcode] = useState(product.barcode);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'sku') {
      setSku(value);
    } else if (field === 'barcode') {
      setBarcode(value);
    }

    onChange({ [field]: value });
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium text-gray-700">Inventory</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            className="mt-1 p-2 text-sm border rounded-md w-full"
            placeholder="Enter SKU"
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Barcode</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => handleInputChange('barcode', e.target.value)}
            className="mt-1 text-sm p-2 border rounded-md w-full"
            placeholder="Enter Barcode"
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;
