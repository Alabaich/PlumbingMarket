import React from 'react';
import Link from 'next/link';

type Column<T> = {
  label: string; // Column header text
  accessor: keyof T | ((row: T) => React.ReactNode); // Key in the data object or custom render function
};

interface DataTableProps<T> {
  columns: Column<T>[]; // Array of column definitions
  data: T[]; // Array of data rows
  rowKey: (row: T) => React.Key; // Function to generate a unique key for each row
}


export default function DataTable<T>({ columns, data, rowKey }: DataTableProps<T>) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-[#F1F4F7] text-left">
          {columns.map((col, index) => (
            <th key={index} className="px-4 py-2 font-light">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={rowKey(row)} className="border-[1px] border-gray-200 hover:bg-gray-100 transition">
            {columns.map((col, index) => (
              <td key={index} className="px-4 py-2 font-light">
                {typeof col.accessor === 'function' ? (
                  col.accessor(row)
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
