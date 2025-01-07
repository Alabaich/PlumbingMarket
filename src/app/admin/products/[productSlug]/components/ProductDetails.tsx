'use client';

import React, { useState } from 'react';

interface ProductDetailsProps {
  product: {
    warranty: string;
    technical_specifications: string;
    installation_and_maintenance: string;
  };
  onChange: (updatedFields: Partial<ProductDetailsProps['product']>) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onChange }) => {
  const [warranty, setWarranty] = useState(product.warranty);
  const [technicalSpecifications, setTechnicalSpecifications] = useState(
    product.technical_specifications
  );
  const [installationAndMaintenance, setInstallationAndMaintenance] = useState(
    product.installation_and_maintenance
  );

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'warranty':
        setWarranty(value);
        break;
      case 'technical_specifications':
        setTechnicalSpecifications(value);
        break;
      case 'installation_and_maintenance':
        setInstallationAndMaintenance(value);
        break;
      default:
        break;
    }
    onChange({ [field]: value });
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Warranty</label>
        <input
          type="text"
          value={warranty}
          onChange={(e) => handleInputChange('warranty', e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Technical Specifications</label>
        <input
          type="text"
          value={technicalSpecifications}
          onChange={(e) => handleInputChange('technical_specifications', e.target.value)}
          className="mt-1 p-2 text-sm border rounded-md w-full text-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Installation and Maintenance
        </label>
        <input
          type="text"
          value={installationAndMaintenance}
          onChange={(e) => handleInputChange('installation_and_maintenance', e.target.value)}
          className="mt-1 p-2 text-sm  border rounded-md w-full text-gray-400"
        />
      </div>
    </div>
  );
};

export default ProductDetails;
