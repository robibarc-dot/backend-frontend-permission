'use client';

import React, { useMemo, useState } from 'react';
import TableDataFilter, { FilterConfig } from './TableDataFilter';
import { Trash2 } from 'lucide-react';

export interface Column<T> {
  header: string;
  key: keyof T | 'actions';
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filterConfigs: FilterConfig[];
  onDelete?: (item: T) => Promise<void>;
  isDeleting?: boolean;
  perPage?: number;
}

export default function DynamicDataTable<T extends { id: number | string; name?: string }>({
  data = [],
  columns,
  filterConfigs,
  onDelete,
  isDeleting = false,
  perPage = 5,
}: DynamicTableProps<T>) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<{ key: keyof T; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null as T | null });

  const filtered = useMemo(() => {
    let result = [...data];

    Object.keys(filters).forEach((key) => {
      const val = String(filters[key]).toLowerCase();
      result = result.filter((item) =>
        String(item[key as keyof T] || "").toLowerCase().includes(val)
      );
    });

    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy.key];
        const bVal = b[sortBy.key];
        const dir = sortBy.dir === 'asc' ? 1 : -1;
        return aVal < bVal ? -1 * dir : 1 * dir;
      });
      
    }

    return result;
  }, [data, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: keyof T, sortable?: boolean) => {
    if (!sortable) return;
    setSortBy({
      key,
      dir: sortBy?.key === key && sortBy.dir === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="mx-auto space-y-4">
      <TableDataFilter
        configs={filterConfigs}
        onFilterChange={(newFilters) => { setFilters(newFilters); setPage(1); }}
      />

      <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Sl No</th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(col.key as keyof T, col.sortable)}
                  className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase ${
                    col.sortable ? 'cursor-pointer hover:text-blue-600' : ''
                  } ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.header}
                  {col.sortable && sortBy?.key === col.key && (sortBy.dir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pageData.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm text-gray-500">{(page - 1) * perPage + index + 1}</td>
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-4 text-sm ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    <div className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                      {col.render ? col.render(row, index) : String(row[col.key as keyof T] || '')}
                      
                      {col.key === 'actions' && onDelete && (
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, item: row })}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center px-2 py-3 text-sm text-gray-600 font-medium">
        <div>Showing {pageData.length} of {filtered.length} entries</div>
        <div className="flex gap-2">
          <button 
             onClick={() => setPage(p => p - 1)} 
             disabled={page === 1} 
             className="px-4 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <button 
            onClick={() => setPage(p => p + 1)} 
            disabled={page === totalPages} 
            className="px-4 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-sm mb-6">
              You are about to delete <span className="font-bold text-gray-800">{deleteModal.item?.name || 'this item'}</span>. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, item: null })} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
              <button 
                onClick={async () => {
                   if (onDelete && deleteModal.item) {
                     await onDelete(deleteModal.item);
                     setDeleteModal({ isOpen: false, item: null });
                   }
                }} 
                disabled={isDeleting} 
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-200 transition-all"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
