'use client';

import React, { useState, useEffect } from 'react';
import { Product, Variant } from '../../types';

export interface ProductPricingDetailsProps<T extends Product | Variant> {
  product: T;
  onChange: (updatedFields: Partial<T>) => void;
  variantId?: string; // Optional variantId for handling variants
}

const ProductPricingDetails = <T extends Product | Variant>({
  product,
  onChange,
  variantId,
}: ProductPricingDetailsProps<T>) => {
  const [price, setPrice] = useState<number>(
    variantId && 'variants' in product && product.variants?.[variantId]?.price
      ? product.variants[variantId].price
      : product.price
  );
  const [cost, setCost] = useState<number>(
    variantId && 'variants' in product && product.variants?.[variantId]?.cost
      ? product.variants[variantId].cost
      : product.cost
  );
  const [compareAtPrice, setCompareAtPrice] = useState<number>(
    variantId && 'variants' in product && product.variants?.[variantId]?.compare_at_price
      ? product.variants[variantId].compare_at_price
      : product.compare_at_price
  );
  const [taxable, setTaxable] = useState<boolean>(
    variantId && 'variants' in product && product.variants?.[variantId]?.taxable
      ? product.variants[variantId].taxable
      : product.taxable
  );
  const [profit, setProfit] = useState<number>(0);
  const [margin, setMargin] = useState<number>(0);

  // Calculate profit and margin
  useEffect(() => {
    const calculatedProfit = price - cost;
    const calculatedMargin = price > 0 ? (calculatedProfit / price) * 100 : 0;
    setProfit(calculatedProfit);
    setMargin(calculatedMargin);
  }, [price, cost]);

  const handleInputChange = (field: keyof T, value: string | boolean) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

    switch (field) {
      case 'price':
        setPrice(numericValue as number);
        break;
      case 'cost':
        setCost(numericValue as number);
        break;
      case 'compare_at_price':
        setCompareAtPrice(numericValue as number);
        break;
      case 'taxable':
        setTaxable(numericValue as boolean);
        break;
      default:
        break;
    }

    if (variantId && 'variants' in product && product.variants?.[variantId]) {
      const updatedVariants = {
        ...product.variants,
        [variantId]: {
          ...(product.variants[variantId] || {}),
          [field]: numericValue,
        },
      };

      onChange({
        variants: updatedVariants,
      } as unknown as Partial<T>); // Fix for TypeScript
    } else {
      onChange({ [field]: numericValue } as Partial<T>);
    }
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium text-gray-700">Pricing</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="pl-7 p-2 border rounded-md w-full"
              placeholder="Enter price"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Compare-at Price</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => handleInputChange('compare_at_price', e.target.value)}
              className="pl-7 p-2 border rounded-md w-full"
              placeholder="Enter compare-at price"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={taxable}
          onChange={(e) => handleInputChange('taxable', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Charge tax on this product</label>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cost per item</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
              type="number"
              value={cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className="pl-7 p-2 border rounded-md w-full"
              placeholder="Enter cost"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profit</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
              type="number"
              value={profit.toFixed(2)}
              disabled
              className="pl-7 p-2 border rounded-md w-full bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Margin</label>
          <div className="relative mt-1">
            <input
              type="text"
              value={`${margin.toFixed(1)}%`}
              disabled
              className="p-2 border rounded-md w-full bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPricingDetails;
