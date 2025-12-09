import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../../utils/hooks';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  loading = false,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
        ) : (
          <Search className="text-slate-400" size={20} />
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        className="block w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

  