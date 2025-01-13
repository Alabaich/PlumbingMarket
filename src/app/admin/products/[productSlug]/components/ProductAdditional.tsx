'use client';

import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../types';

export interface ProductAdditionalDetailsProps<T extends Product | Variant> {
  product: T;
  onChange: (updatedFields: Partial<T>) => void;
  variantId?: string; // Include optional variantId
}



const ProductAdditionalDetails = <T extends Product | Variant>({
  product,
  onChange,
  variantId,
}: ProductAdditionalDetailsProps<T>) => {
  const [finish, setFinish] = useState<string | undefined>('');
  const [leadTime, setLeadTime] = useState<string | undefined>('');
  const [sqft, setSqft] = useState<string | undefined>('');

  useEffect(() => {
    if (variantId && 'variants' in product && product.variants?.[variantId]) {
      const variant = product.variants[variantId];
      setFinish(variant.finish || '');
      setLeadTime(variant.lead_time || '');
      setSqft(variant.sqft || '');
    } else {
      setFinish(product.finish || '');
      setLeadTime(product.lead_time || '');
      setSqft(product.sqft || '');
    }
  }, [product, variantId]);

  const handleInputChange = (field: keyof T, value: string) => {
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
  
    if (variantId && 'variants' in product && product.variants?.[variantId]) {
      const updatedVariants = {
        ...product.variants,
        [variantId]: {
          ...(product.variants[variantId] || {}),
          [field]: value,
        },
      };
  
      // Explicit cast through `unknown`
      onChange({ variants: updatedVariants } as unknown as Partial<T>);
    } else {
      onChange({ [field]: value } as Partial<T>);
    }
  };
  

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
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