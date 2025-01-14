'use client';

import React from 'react';

interface Specification {
  name: string;
  value: string;
}

interface ProductSpecificationsProps {
  specifications: Specification[];
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Specifications</h2>
      <ul className="list-disc pl-6">
        {specifications.map((spec, index) => (
          <li key={index}>
            <strong>{spec.name}:</strong> {spec.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSpecifications;

