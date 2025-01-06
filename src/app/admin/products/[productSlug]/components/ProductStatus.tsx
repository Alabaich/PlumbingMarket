'use client';

import React, { useState } from 'react';

interface ProductStatusProps {
  published: boolean;
  onChange: (updatedFields: { published: boolean }) => void;
}

const ProductStatus: React.FC<ProductStatusProps> = ({ published, onChange }) => {
  const [status, setStatus] = useState(published);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value === 'true';
    setStatus(newStatus);
    onChange({ published: newStatus });
  };

  return (
    <div className="w-[20%] ">
      <div className='p-4 rounded-md bg-white flex flex-col gap-4'>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={status.toString()}
          onChange={handleStatusChange}
          className="mt-1 p-2 border rounded-md w-full"
        >
          <option value="true">Active</option>
          <option value="false">Draft</option>
        </select>
      </div>
    </div>
  );
};

export default ProductStatus;
