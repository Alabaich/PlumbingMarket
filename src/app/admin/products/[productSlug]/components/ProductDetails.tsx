'use client';

import React, { useState } from 'react';

interface ProductDetailsProps {
  product: {
    finish: string;
    lead_time: string;
    warranty: string;
    technical_specifications: string;
    installation_and_maintenance: string;
    sqft: string;
  };
  onChange: (updatedFields: Partial<ProductDetailsProps['product']>) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onChange }) => {
  const [finish, setFinish] = useState(product.finish);
  const [leadTime, setLeadTime] = useState(product.lead_time);
  const [warranty, setWarranty] = useState(product.warranty);
  const [technicalSpecifications, setTechnicalSpecifications] = useState(
    product.technical_specifications
  );

  const [installationAndMaintenance, setInstallationAndMaintenance] = useState(
    product.installation_and_maintenance
  );
  const [sqft, setSqft] = useState(product.sqft);

  console.log(product)
  console.log(product.technical_specifications)

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'finish':
        setFinish(value);
        break;
      case 'lead_time':
        setLeadTime(value);
        break;
      case 'warranty':
        setWarranty(value);
        break;
      case 'technical_specifications':
        setTechnicalSpecifications(value);
        break;
      case 'installation_and_maintenance':
        setInstallationAndMaintenance(value);
        break;
      case 'sqft':
        setSqft(value);
        break;
      default:
        break;
    }
    onChange({ [field]: value });
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700">Finish</label>
        <input
          type="text"
          value={finish}
          onChange={(e) => handleInputChange('finish', e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Lead Time</label>
        <input
          type="text"
          value={leadTime}
          onChange={(e) => handleInputChange('lead_time', e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
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
        <textarea
          value={technicalSpecifications}
          onChange={(e) => handleInputChange('technical_specifications', e.target.value)}
          rows={4}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Installation and Maintenance
        </label>
        <textarea
          value={installationAndMaintenance}
          onChange={(e) => handleInputChange('installation_and_maintenance', e.target.value)}
          rows={4}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Square Footage</label>
        <input
          type="text"
          value={sqft}
          onChange={(e) => handleInputChange('sqft', e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default ProductDetails;
