import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../utils/helpers';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = debounce((query: string) => {
    onSearch(query);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Search
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        size={20}
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search bookmarks..."
        className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;