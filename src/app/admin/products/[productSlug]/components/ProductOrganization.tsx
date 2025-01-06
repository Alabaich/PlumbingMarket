'use client';

import React, { useState } from 'react';

interface ProductOrganizationProps {
  product: { type: string; vendor: string };
  onChange: (updatedFields: { type?: string; vendor?: string }) => void;
}

const ProductOrganization: React.FC<ProductOrganizationProps> = ({ product, onChange }) => {
  const [type, setType] = useState(product.type);
  const [vendor, setVendor] = useState(product.vendor);

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value;
    setType(newType);
    onChange({ type: newType });
  };

  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVendor = e.target.value;
    setVendor(newVendor);
    onChange({ vendor: newVendor });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Type</label>
        <input
          type="text"
          value={type}
          onChange={handleTypeChange}
          placeholder="Enter product type..."
          className="mt-1 p-2 text-sm border rounded-md w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Vendor</label>
        <input
          type="text"
          value={vendor}
          onChange={handleVendorChange}
          placeholder="Enter vendor name..."
          className="mt-1 p-2 border text-sm rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default ProductOrganization;
