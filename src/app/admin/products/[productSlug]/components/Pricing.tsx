'use client';

import React, { useState, useEffect } from 'react';

interface ProductPricingProps {
  product: {
    price: number;
    cost: number;
    compare_at_price: number;
    taxable: boolean; // For the "Charge tax on this product" checkbox
  };
  onChange: (updatedFields: Partial<ProductPricingProps['product']>) => void;
}

const ProductPricingDetails: React.FC<ProductPricingProps> = ({ product, onChange }) => {
  const [price, setPrice] = useState(product.price);
  const [cost, setCost] = useState(product.cost);
  const [compareAtPrice, setCompareAtPrice] = useState(product.compare_at_price);
  const [taxable, setTaxable] = useState(product.taxable); // Checkbox state
  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState(0);

  // Calculate profit and margin whenever price or cost changes
  useEffect(() => {
    const calculatedProfit = price - cost;
    const calculatedMargin = price > 0 ? (calculatedProfit / price) * 100 : 0;
    setProfit(calculatedProfit);
    setMargin(calculatedMargin);
  }, [price, cost]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'taxable') {
      setTaxable(value as boolean);
      onChange({ taxable: value as boolean });
      return;
    }

    const numericValue = parseFloat(value as string) || 0; // Convert string to number
    switch (field) {
      case 'price':
        setPrice(numericValue);
        break;
      case 'cost':
        setCost(numericValue);
        break;
      case 'compare_at_price':
        setCompareAtPrice(numericValue);
        break;
      default:
        break;
    }

    onChange({ [field]: numericValue });
  };

  return (
    <div className="p-4 rounded-md flex flex-col gap-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium text-gray-700">Pricing</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
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

        {/* Compare-at Price */}
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

      {/* Taxable Checkbox */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={taxable}
          onChange={(e) => handleInputChange('taxable', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Charge tax on this product</label>
      </div>

      {/* Profit and Margin */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Cost */}
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

        {/* Profit */}
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

        {/* Margin */}
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
