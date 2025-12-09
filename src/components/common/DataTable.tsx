import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
  };
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
  onRowClick,
  pagination,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 text-center text-slate-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-600"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} transition-colors`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-slate-700">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={pagination.onPrevPage}
              disabled={pagination.currentPage === 0}
              className="px-3 py-1 rounded-xl border border-slate-200 text-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={pagination.onNextPage}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className="px-3 py-1 rounded-xl border border-slate-200 text-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

