'use client';

import React, { useState, useEffect } from 'react';

interface ProductStatusProps {
  published: boolean;
  onChange: (updatedFields: { published: boolean }) => void;
}

const ProductStatus: React.FC<ProductStatusProps> = ({ published, onChange }) => {
  const [status, setStatus] = useState(published);

  useEffect(() => {
    setStatus(published); // Ensure state is in sync with prop updates
  }, [published]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value === 'true'; // Convert string to boolean
    setStatus(newStatus);
    onChange({ published: newStatus });
  };

  return (
    <div className="p-4 rounded-md bg-white flex flex-col gap-4 shadow-sm">
      <label className="block text-sm font-medium text-gray-700">Status</label>
      <select
        value={status ? 'true' : 'false'} // Convert boolean to string for select
        onChange={handleStatusChange}
        className="text-sm mt-1 p-2 border rounded-md w-full"
      >
        <option value="true">Active</option>
        <option value="false">Draft</option>
      </select>
    </div>
  );
};

export default ProductStatus;
