'use client';

import React, { useState } from 'react';
import { Search, X, Filter, Calendar, ChevronDown, RotateCcw, ChevronUp } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  placeholder?: string;
  options?: FilterOption[];
}

interface Props {
  configs: FilterConfig[];
  onFilterChange: (filters: Record<string, any>) => void;
  className?: string;
}

const TableDataFilter = ({ configs, onFilterChange, className = "" }: Props) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  const [isExpanded, setIsExpanded] = useState(false); 

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeCount = Object.keys(filters).length;

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
        
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-6 py-4 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-all duration-300 ${isExpanded ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-200'}`}>
              <Filter size={18} className={isExpanded ? 'text-white' : 'text-slate-500'} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Advanced Filters</h3>
                {activeCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
                {isExpanded ? 'Hide filter options' : 'Click to show filter options'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                Reset
              </button>
            )}
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown size={20} className="text-slate-400" />
            </div>
          </div>
        </div>

        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[1000px] border-t border-slate-100 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {configs.map((config) => (
                <div key={config.key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2">
                    {config.label}
                    {filters[config.key] && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </label>

                  {config.type === 'text' && (
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder={config.placeholder || `Search...`}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                        value={filters[config.key] || ''}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                      />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  )}

                  {config.type === 'select' && (
                    <div className="relative group">
                      <select
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 appearance-none cursor-pointer"
                        value={filters[config.key] || ''}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {config.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  )}

                  {config.type === 'date' && (
                    <div className="relative group">
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 cursor-pointer"
                        value={filters[config.key] || ''}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                      />
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableDataFilter;