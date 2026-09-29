import React from 'react';
import { X, Tag, Clock, Sparkles, Flame, Sun, ArrowRight, ChevronDown } from 'lucide-react';
import { CATEGORIES, FEATURED_TAGS } from '../data/mockData';

export default function CategoryModal({
  isOpen,
  onClose,
  activeGender,
  setActiveGender,
  selectedCategory,
  onSelectCategory,
  selectedFeaturedTag,
  onSelectFeaturedTag
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-6xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto border border-gray-100">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 bg-white z-20 px-4 sm:px-8 py-3.5 border-b border-gray-200 flex items-center justify-between">
          {/* Gender Navigation */}
          <div className="flex items-center space-x-6">
            {['MEN', 'WOMEN', 'KIDS'].map((gender) => (
              <button
                key={gender}
                onClick={() => setActiveGender(gender)}
                className={`text-sm sm:text-base font-bold tracking-wider transition pb-1 relative ${
                  activeGender === gender
                    ? 'text-gray-950 font-black'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {gender}
                {activeGender === gender && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-950 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Right badges & close */}
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 px-2.5 py-1 bg-gray-100 text-xs font-bold text-gray-800 rounded-full border border-gray-200">
              <span className="bg-[#002B66] text-white text-[10px] font-black px-1 rounded-sm">GU</span>
              <span>JP</span>
            </span>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition"
              aria-label="Close category menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body: Category Grid */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              SHOP BY CATEGORY
            </h3>
          </div>

          {/* 18-Category Grid matching Image 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className={`group relative bg-[#F7F7F8] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-[#EE1D23] ring-2 ring-red-500/20 shadow-md'
                      : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  {/* Item count badge (dark circle/pill top right) */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-[#1C1C1E]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                      {cat.count}
                    </span>
                  </div>

                  {/* Image Container with aspect ratio matching screenshot */}
                  <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Category Name Banner */}
                  <div className="p-2 sm:p-2.5 text-center bg-white border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-800 tracking-tight group-hover:text-red-600 transition truncate">
                      {cat.nameEn}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium truncate">
                      {cat.nameKh}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom FEATURED Strip matching Image 3 */}
        <div className="bg-[#FAF7F2] border-t border-gray-200 px-4 sm:px-8 py-4 relative">
          {/* Centered red arrow collapse toggle button */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-red-600 hover:bg-red-50 transition"
              title="Close drawer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
              FEATURED
            </h4>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 text-center">
            {FEATURED_TAGS.map((tag) => {
              const isSelected = selectedFeaturedTag === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => {
                    onSelectFeaturedTag(isSelected ? null : tag.id);
                    onClose();
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center border transition ${
                    isSelected
                      ? 'bg-white border-red-500 shadow text-red-600 font-bold'
                      : 'bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {tag.id === 'sale' && <Tag className="w-3.5 h-3.5 text-red-500" />}
                    {tag.id === 'limited' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                    {tag.id === 'new' && <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                    {tag.id === 'bestseller' && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                    {tag.id === 'summer2026' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    {tag.id === 'coming-soon' && <ArrowRight className="w-3.5 h-3.5 text-purple-500" />}
                    <span className="text-xs font-bold">{tag.label}</span>
                  </div>
                  {tag.count && (
                    <span className="text-[10px] text-gray-400 font-medium">({tag.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
