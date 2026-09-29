import React from 'react';
import ProductCard from './ProductCard';
import { Tag, Clock, Sparkles, Filter, X, RefreshCw } from 'lucide-react';

export default function ProductGrid({
  products,
  currency,
  activeGender,
  setActiveGender,
  selectedCategory,
  onClearCategory,
  selectedFeaturedTag,
  onSelectFeaturedTag,
  onOpenProduct,
  formatPrice,
  searchQuery,
  onClearSearch,
  isUniqloFilterOnly,
  onToggleUniqloFilter
}) {
  const genderCounts = [
    { id: 'ALL', label: 'All', count: 1228 },
    { id: 'MEN', label: 'Men', count: 439 },
    { id: 'WOMEN', label: 'Women', count: 596 },
    { id: 'KIDS', label: 'Kids', count: 193 },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Filter Bar from Image 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        
        {/* Gender count pill buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {genderCounts.map((tab) => {
            const isActive =
              (tab.id === 'ALL' && activeGender === 'ALL') ||
              activeGender === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveGender(tab.id);
                  if (tab.id === 'ALL') {
                    onClearCategory();
                    onSelectFeaturedTag(null);
                    if (onClearSearch) onClearSearch();
                    if (isUniqloFilterOnly) onToggleUniqloFilter();
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#EE1D23] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Quick action chips (Uniqlo JP, Sale, Limited Offer, New Arrival) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Uniqlo Synced Filter Button */}
          <button
            onClick={onToggleUniqloFilter}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${
              isUniqloFilterOnly
                ? 'bg-[#ED0006] text-white border-red-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
            <span>Uniqlo JP Items</span>
          </button>

          <button
            onClick={() =>
              onSelectFeaturedTag(selectedFeaturedTag === 'sale' ? null : 'sale')
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${
              selectedFeaturedTag === 'sale'
                ? 'bg-red-50 text-red-600 border-red-500 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>Sale</span>
          </button>

          <button
            onClick={() =>
              onSelectFeaturedTag(
                selectedFeaturedTag === 'limited' ? null : 'limited'
              )
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${
              selectedFeaturedTag === 'limited'
                ? 'bg-amber-50 text-amber-600 border-amber-500 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Limited Offer</span>
          </button>

          <button
            onClick={() =>
              onSelectFeaturedTag(selectedFeaturedTag === 'new' ? null : 'new')
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${
              selectedFeaturedTag === 'new'
                ? 'bg-blue-50 text-blue-600 border-blue-500 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>New Arrival</span>
          </button>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedCategory || selectedFeaturedTag || searchQuery || isUniqloFilterOnly) && (
        <div className="flex items-center flex-wrap gap-2 mb-4 bg-white/70 p-2.5 rounded-xl border border-gray-200 text-xs">
          <span className="font-bold text-gray-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtering:
          </span>

          {isUniqloFilterOnly && (
            <span className="bg-red-50 text-red-600 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              Source: Uniqlo JP Synced
              <button onClick={onToggleUniqloFilter}>
                <X className="w-3.5 h-3.5 hover:text-red-800" />
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="bg-red-50 text-red-600 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              Category: {selectedCategory}
              <button onClick={onClearCategory}>
                <X className="w-3.5 h-3.5 hover:text-red-800" />
              </button>
            </span>
          )}

          {selectedFeaturedTag && (
            <span className="bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              Tag: {selectedFeaturedTag}
              <button onClick={() => onSelectFeaturedTag(null)}>
                <X className="w-3.5 h-3.5 hover:text-amber-900" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              Search: "{searchQuery}"
              <button onClick={onClearSearch}>
                <X className="w-3.5 h-3.5 hover:text-blue-900" />
              </button>
            </span>
          )}

          {/* Quick Clear Button */}
          <button
            onClick={() => {
              onClearCategory();
              onSelectFeaturedTag(null);
              if (onClearSearch) onClearSearch();
              if (isUniqloFilterOnly) onToggleUniqloFilter();
            }}
            className="ml-auto text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition border border-red-200"
          >
            បង្ហាញទំនិញទាំងអស់ (Show All Items)
          </button>
        </div>
      )}

      {/* Product count & grid header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm font-black text-gray-900 tracking-tight">
            {activeGender === 'ALL'
              ? 'ទំនិញទាំងអស់ (All Products)'
              : `ទំនិញសម្រាប់ ${activeGender}`}
          </span>
          <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
            {products.length} Items Available
          </span>
        </div>
        <p className="text-[11px] text-gray-400 hidden sm:block">
          Scroll down to browse all Japanese apparel & accessories ↓
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 my-8">
          <p className="text-gray-500 font-semibold mb-2">
            រកមិនឃើញទំនិញដែលអ្នកកំពុងស្វែងរកទេ (No items found)
          </p>
          <button
            onClick={() => {
              onClearCategory();
              onSelectFeaturedTag(null);
              if (onClearSearch) onClearSearch();
              if (isUniqloFilterOnly) onToggleUniqloFilter();
            }}
            className="text-xs font-bold text-red-600 underline"
          >
            Clear all filters & show all items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onOpenProduct={onOpenProduct}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </section>
  );
}
