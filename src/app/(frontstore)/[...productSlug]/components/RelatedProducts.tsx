'use client';

import React from 'react';

interface RelatedProduct {
  id: string;
  title: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Related Products</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col items-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <p className="text-sm text-center">{product.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
