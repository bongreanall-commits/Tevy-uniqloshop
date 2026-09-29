import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Tag } from 'lucide-react';

export default function HeroCategoryBanner({
  activeGender,
  onOpenCategoryModal,
  selectedCategory,
  onSelectCategory,
  slides,
  onSelectFeaturedTag
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const categoryCards = [
    {
      id: 'top-tshirts',
      name: 'T-Shirts',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M18 10 L26 18 C28 20 36 20 38 18 L46 10 L58 18 L50 28 L46 25 L46 54 L18 54 L18 25 L14 28 L6 18 Z" />
          <path d="M26 10 C28 14 36 14 38 10" />
        </svg>
      )
    },
    {
      id: 'casual-shirts',
      name: 'Shirts',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M18 12 L26 20 L32 14 L38 20 L46 12 L56 20 L50 30 L45 27 L45 54 L19 54 L19 27 L14 30 L8 20 Z" />
          <line x1="32" y1="20" x2="32" y2="54" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'jeans',
      name: 'Denim',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M18 10 L46 10 L44 56 L34 56 L32 28 L30 56 L20 56 Z" />
          <path d="M18 18 L46 18" />
          <path d="M22 18 C22 22 26 24 26 24" />
          <path d="M42 18 C42 22 38 24 38 24" />
        </svg>
      )
    },
    {
      id: 'outerwear',
      name: 'Outerwear',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M16 12 L24 20 L40 20 L48 12 L60 22 L52 32 L46 28 L46 54 L18 54 L18 28 L12 32 L4 22 Z" />
          <line x1="32" y1="20" x2="32" y2="54" />
          <circle cx="32" cy="28" r="1.5" fill="currentColor" />
          <circle cx="32" cy="38" r="1.5" fill="currentColor" />
          <circle cx="32" cy="48" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'shoes',
      name: 'Shoes',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M8 38 C14 36 22 34 26 24 C28 20 34 18 42 22 L46 26 L56 34 C58 36 58 40 58 42 L58 46 L8 46 Z" />
          <path d="M8 46 L58 46 L58 50 L8 50 Z" />
          <path d="M26 24 L36 34" />
          <path d="M30 22 L40 32" />
        </svg>
      )
    },
    {
      id: 'accessories',
      name: 'Caps',
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M14 42 C14 26 22 18 36 18 C46 18 52 26 52 42 Z" />
          <path d="M10 42 C10 42 6 44 6 48 C6 50 10 50 16 50 L56 50 C58 50 60 48 58 44 C56 42 52 42 52 42 Z" />
          <circle cx="36" cy="18" r="2.5" fill="currentColor" />
        </svg>
      )
    },
  ];

  // Default slide items if none passed
  const activeSlides = (slides && slides.length > 0) ? slides.filter(s => s.active !== false) : [
    {
      id: 'slide-categories',
      type: 'categories',
      badge: 'MEN',
      titleKh: 'ចុចទីនេះដើម្បី មើលម៉ូតតាមផ្នែក',
      subtitleEn: 'Click here to select category',
      bgColor: '#F4EFEA',
    },
    {
      id: 'slide-promo-1',
      type: 'promo',
      badge: 'SPRING / SUMMER 2026',
      titleKh: 'ម៉ូតថ្មីទើបមកដល់ UNIQLO AIRism & GU',
      subtitleEn: 'New Arrivals 2026 Collection Direct from Tokyo',
      descriptionKh: 'សាច់ក្រណាត់ត្រជាក់ស្រួល សាកសមបំផុតសម្រាប់អាកាសធាតុកម្ពុជា',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      bgColor: '#EBE7E0',
      buttonText: 'មើលម៉ូតថ្មីៗ (Shop New)',
      buttonFilter: 'new'
    },
    {
      id: 'slide-promo-2',
      type: 'promo',
      badge: 'LIMITED SALE 30%',
      titleKh: 'ប្រូម៉ូសិនពិសេសប្រចាំសប្តាហ៍',
      subtitleEn: 'Special Weekend Offers - Fast Retailing Japan',
      descriptionKh: 'បញ្ចុះតម្លៃពិសេសលើអាវយឺត ខោខូវប៊យ និងរ៉ូបម៉ូតជប៉ុន',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
      bgColor: '#F5EBE6',
      buttonText: 'មើលទំនិញបញ្ចុះតម្លៃ (Shop Sale)',
      buttonFilter: 'sale'
    }
  ];

  // Auto-play timer (slides every 6 seconds)
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, activeSlides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentSlideData = activeSlides[currentSlide] || activeSlides[0];

  return (
    <div 
      className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="rounded-2xl sm:rounded-3xl shadow-sm border border-[#E9E2D8] relative overflow-hidden transition-all duration-500"
        style={{ backgroundColor: currentSlideData.bgColor || '#F4EFEA' }}
      >
        
        {/* Navigation Chevrons (Appear on hover) */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* SLIDE TYPE 1: Category Quick Selector (Matches Screenshot 1) */}
        {currentSlideData.type === 'categories' ? (
          <div className="p-4 sm:p-7">
            {/* Banner Title Header */}
            <div 
              onClick={onOpenCategoryModal}
              className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group select-none mb-6"
            >
              <div>
                <div className="flex items-center space-x-2.5 mb-1.5">
                  <span className="bg-[#1C1C1E] text-white text-xs sm:text-sm font-extrabold px-3 py-1 rounded-md tracking-wider">
                    {activeGender === 'mini_app' ? 'POPULAR' : activeGender === 'ALL' ? 'MEN' : activeGender}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2">
                    <span>{currentSlideData.titleKh || 'ចុចទីនេះដើម្បី មើលម៉ូតតាមផ្នែក'}</span>
                  </h2>
                  {/* Red Circle Arrow button */}
                  <div className="w-8 h-8 rounded-full bg-[#EE1D23] text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-red-700 transition duration-200">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </div>
                </div>

                {/* English Subtitle with signature red underline */}
                <div className="inline-block">
                  <p className="text-xs sm:text-sm font-bold text-gray-500 tracking-tight">
                    {currentSlideData.subtitleEn || 'Click here to select category'}
                  </p>
                  <div className="h-0.5 w-14 bg-[#EE1D23] mt-1 rounded-full"></div>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-2 text-xs text-gray-600 font-medium mt-2 sm:mt-0 bg-white/70 px-3 py-1.5 rounded-full border border-gray-200">
                <span>ចុចមើលម៉ូតសរុបទាំងអស់ (Browse 18+ Categories)</span>
                <span className="text-red-600 font-bold">›</span>
              </div>
            </div>

            {/* Quick Category Icons Row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-4">
              {categoryCards.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl transition duration-200 border text-center ${
                      isSelected
                        ? 'bg-white border-[#EE1D23] shadow-md ring-2 ring-red-500/20 text-[#EE1D23]'
                        : 'bg-white border-gray-200/90 text-gray-800 hover:border-gray-400 hover:shadow-sm'
                    }`}
                  >
                    <div className={`mb-2 transition ${isSelected ? 'text-red-600 scale-105' : 'text-gray-700'}`}>
                      {cat.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Show All bar when a category is filtered */}
            {selectedCategory && (
              <div className="mt-3 flex items-center justify-between bg-white/90 px-3.5 py-1.5 rounded-xl border border-red-200 text-xs">
                <span className="font-bold text-gray-700">
                  កំពុងច្រោះតាមប្រភេទ: <span className="text-red-600 uppercase">{selectedCategory}</span>
                </span>
                <button
                  onClick={() => onSelectCategory(null)}
                  className="font-bold text-red-600 hover:text-red-800 underline text-xs"
                >
                  បង្ហាញទំនិញទាំងអស់ (Show All Items) ✕
                </button>
              </div>
            )}
          </div>
        ) : (
          /* SLIDE TYPE 2: Promotional / Campaign Banner */
          <div className="relative min-h-[220px] sm:min-h-[250px] flex items-center p-6 sm:p-10 overflow-hidden">
            {/* Background Image with Gradient Overlay */}
            {currentSlideData.image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.subtitleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
              </div>
            )}

            {/* Content text */}
            <div className="relative z-10 max-w-xl text-white space-y-2.5">
              <span className="inline-block bg-[#EE1D23] text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider shadow">
                {currentSlideData.badge || 'SPECIAL'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {currentSlideData.titleKh}
              </h2>

              <p className="text-xs sm:text-sm font-bold text-gray-200">
                {currentSlideData.subtitleEn}
              </p>

              {currentSlideData.descriptionKh && (
                <p className="text-xs text-gray-300 font-normal">
                  {currentSlideData.descriptionKh}
                </p>
              )}

              {currentSlideData.buttonText && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (currentSlideData.buttonFilter && onSelectFeaturedTag) {
                        onSelectFeaturedTag(currentSlideData.buttonFilter);
                      }
                      const gridEl = document.querySelector('section');
                      if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-900 hover:bg-red-600 hover:text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    <span>{currentSlideData.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Carousel Pagination Dots Indicator (Matching Screenshot 1: active red pill + gray dots) */}
        <div className="flex justify-center items-center space-x-1.5 pb-3 pt-1 select-none">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === idx
                  ? 'w-4 h-1.5 bg-[#EE1D23]'
                  : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
