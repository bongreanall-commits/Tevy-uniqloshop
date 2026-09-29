import React, { useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

export default function SearchModal({
  isOpen,
  onClose,
  onPerformSearch
}) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const popularKeywords = [
    'Ribbed Easy Shorts',
    'Heavyweight T-Shirt',
    'Socks',
    'Denim Jeans',
    'Cropped Shirt',
    'Sneakers'
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onPerformSearch(query.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-24 p-3 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="p-3 border-b border-gray-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            autoFocus
            placeholder="ស្វែងរកតាមឈ្មោះ ម៉ូត ឬលេខកូដ... (Search by name or style)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-2 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-800"
          >
            បិទ
          </button>
        </form>

        {/* Popular Searches */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            <span>ពាក្យស្វែងរកពេញនិយម (Popular Searches)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => {
                  onPerformSearch(kw);
                  onClose();
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full text-xs font-semibold text-gray-700 transition"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
