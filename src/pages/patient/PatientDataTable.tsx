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

const glassContainer = 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-glow overflow-hidden';

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
      <div className={glassContainer}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-300 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={glassContainer}>
        <div className="p-8 text-center text-white/70">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={glassContainer}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm text-white">
          <thead className="bg-white/5">
            <tr >
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.25em] text-white/60"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''} transition-colors`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-white/80">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="bg-white/5 px-6 py-3 flex items-center justify-between border-t border-white/10 text-white/70">
          <div className="text-sm">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={pagination.onPrevPage}
              disabled={pagination.currentPage === 0}
              className="px-3 py-1 rounded-xl border border-white/20 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={pagination.onNextPage}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className="px-3 py-1 rounded-xl border border-white/20 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

