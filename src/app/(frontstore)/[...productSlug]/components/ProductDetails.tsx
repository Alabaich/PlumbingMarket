'use client';

import React from 'react';

interface ProductDetailsProps {
  title: string;
  description: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ProductDetails;
