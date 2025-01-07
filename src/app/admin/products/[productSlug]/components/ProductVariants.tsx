'use client';

import React from 'react';
import Link from 'next/link';
import { Variant } from '../types'; // Import the Variant type

interface ProductVariantsProps {
    productSlug: string; // Pass the productSlug to generate variant links
    variants: Record<string, Variant>;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ productSlug, variants }) => {
    return (
        <div className="p-4 bg-white shadow-md rounded-md flex flex-col gap-4">
            <h3 className="text-lg font-sm text-gray-700">Variants</h3>
            {Object.entries(variants).map(([sku, variant]) => (
                <div key={sku} className="flex flex-col gap-2">
                    <Link href={`/admin/products/${productSlug}/${sku}`} className='flex gap-4 p-2 px-4 border-2 rounded-full hover:border-gray-400 transition-all'>
                        <p className="text-sm font-sm text-gray-700">SKU: {sku}</p>
                        <p className="text-sm font-sm text-gray-700">
                            {variant.option.name}: <span className='text-gray-900'>{variant.option.value}</span>
                        </p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ProductVariants;
