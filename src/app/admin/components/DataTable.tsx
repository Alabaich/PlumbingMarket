import React from 'react';
import Link from 'next/link';

type Column = {
  label: string; // column header text
  accessor: string; // key in the data object
};

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column[];
  data: T[];
}

export default function DataTable<T extends Record<string, unknown>>({ columns, data }: DataTableProps<T>) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-[#F1F4F7] text-left">
          {columns.map((col: Column) => (
            <th key={col.accessor} className="px-4 py-2 font-light">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-[1px] border-gray-200 hover:bg-gray-100 transition">
            {columns.map((col) => (
              <td key={col.accessor} className="px-4 py-2 font-light">
                {col.accessor === 'img' ? (
                  <img src={row[col.accessor] as string} alt="Product Image" className="h-16 w-16 object-cover rounded-md" />
                ) : col.accessor === 'product' ? (
                  <Link
                    href={`/admin/products/${row['slug']}`}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    {String(row[col.accessor])}
                  </Link>
                ) : (
                  String(row[col.accessor])
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
