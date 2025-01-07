'use client';

import React, { useState } from 'react';

interface ProductAdditionalDetailsProps {
  product: {
    finish: string;
    lead_time: string;
    sqft: string;
  };
  onChange: (updatedFields: Partial<ProductAdditionalDetailsProps['product']>) => void;
}

const ProductAdditionalDetails: React.FC<ProductAdditionalDetailsProps> = ({ product, onChange }) => {
  const [finish, setFinish] = useState(product.finish);
  const [leadTime, setLeadTime] = useState(product.lead_time);
  const [sqft, setSqft] = useState(product.sqft);

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'finish':
        setFinish(value);
        break;
      case 'lead_time':
        setLeadTime(value);
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

export default ProductAdditionalDetails;
