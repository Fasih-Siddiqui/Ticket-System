import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Filter } from 'lucide-react';

export default function TableHeader({
  columns = [],
  sortField,
  sortDirection,
  onSort,
  activeFilters = {},
  onFilter,
  columnFilters = {},
  onColumnFilterChange,
  showCheckbox = false,
  operationsLabel = 'Operations',
}) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {showCheckbox && (
          <th className="w-12 px-6 py-3">
            <input type="checkbox" className="rounded border-gray-300" />
          </th>
        )}
        {columns.map((column) => (
          <th key={column.id} className="px-6 py-3 font-bold">
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase">
                <span>{column.label}</span>
                <div className="flex items-center gap-1">
                  {onSort && (
                    <button
                      onClick={() => onSort(column.id)}
                      className="p-1 rounded border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                      title="Sort"
                    >
                      {sortField === column.id ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5 text-blue-500" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-blue-500" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </button>
                  )}
                  {onFilter && (
                    <button
                      onClick={() => onFilter(column.id)}
                      className="p-1 rounded border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                      title="Filter"
                    >
                      <Filter
                        className={`h-3.5 w-3.5 ${activeFilters?.[column.id]
                          ? 'text-blue-500'
                          : 'text-gray-400'
                          }`}
                      />
                    </button>
                  )}
                </div>
              </div>
              {activeFilters[column.id] && (
                <input
                  type="text"
                  className="mt-1 px-2 py-1 border border-gray-300 rounded text-xs w-full"
                  placeholder={`Filter ${column.label}`}
                  value={columnFilters[column.id] || ''}
                  onChange={e => onColumnFilterChange && onColumnFilterChange(column.id, e.target.value)}
                />
              )}
            </div>
          </th>
        ))}
        {operationsLabel && (
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            {operationsLabel}
          </th>
        )}
      </tr>
    </thead>
  );
} 