'use client';

import React from 'react';
import Link from 'next/link';
import { Variant } from '../types'; // Import the Variant type

interface ProductVariantsProps {
    productSlug: string; // Pass the productSlug to generate variant links
    variants: Record<string, Variant>;
    onDeleteVariant: (variantId: string) => void; 
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ productSlug, variants, onDeleteVariant }) => {
    const handleDelete = (variantId: string) => {
            onDeleteVariant(variantId); // Trigger the deletion
    };
    
    return (
        <div className="p-4 bg-white shadow-sm rounded-md flex flex-col gap-4">
            <h3 className="text-lg font-sm text-gray-700">Variants</h3>
            {Object.entries(variants).map(([sku, variant]) => (
                <div key={sku} className="flex justify-between gap-2">
                    <Link href={`/admin/products/${productSlug}/${sku}`} className='flex gap-4 p-2 px-4 border-2 rounded-full hover:border-gray-400 transition-all'>
                        <p className="text-sm font-sm text-gray-700">SKU: {sku}</p>
                        <p className="text-sm font-sm text-gray-700">
                            {variant.option.name}: <span className='text-gray-900'>{variant.option.value}</span>
                        </p>

                    </Link>
                    <button
                        type="button"
                        onClick={() => handleDelete(sku)}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Delete Variant"
                    >
                        ✕
                    </button>

                </div>
            ))}
        </div>
    );
};

export default ProductVariants;
