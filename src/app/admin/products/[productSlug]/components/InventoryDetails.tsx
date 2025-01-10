'use client';

import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../types';

export interface InventoryDetailsProps<T extends Product | Variant> {
  product: T;
  onChange: (updatedFields: Partial<T>) => void;
  variantId?: string; // Optional variantId for handling variants
  onRenameVariant?: (oldSku: string, newSku: string) => void; // Callback for renaming SKU
}

const InventoryDetails = <T extends Product | Variant>({
  product,
  onChange,
  variantId,
  onRenameVariant,
}: InventoryDetailsProps<T>) => {
  const [sku, setSku] = useState<string>(variantId || '');
  const [barcode, setBarcode] = useState<string>('');

  useEffect(() => {
    // For multiple variants, set sku from variantId
    if (variantId && 'variants' in product) {
      const variant = (product as Product).variants?.[variantId];
      setSku(variantId); // Use the variantId directly as the SKU
      setBarcode(variant?.barcode || ''); // Set barcode from variant
    } else {
      // For single variant or no variants, fallback to product-level data
      setSku((product as Product).sku || '');
      setBarcode((product as Product).barcode || '');
    }
  }, [product, variantId]);

  const handleInputChange = (field: 'sku' | 'barcode', value: string) => {
    if (field === 'sku') {
      if (variantId && onRenameVariant) {
        onRenameVariant(sku, value); // Trigger the renaming callback
      }
      setSku(value);
    } else if (field === 'barcode') {
      setBarcode(value);
      if (variantId && 'variants' in product) {
        const updatedVariants = {
          ...((product as Product).variants || {}),
          [variantId]: {
            ...(product as Product).variants[variantId],
            barcode: value,
          },
        };

        onChange({
          variants: updatedVariants,
        } as unknown as Partial<T>);
      } else {
        onChange({ barcode: value } as Partial<T>);
      }
    }
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
