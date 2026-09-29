import React, { useState } from 'react';
import { X, Share2, Ruler, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { getSkuStockInfo } from '../services/uniqloService';

export default function ProductDetailModal({
  product,
  onClose,
  currency,
  formatPrice,
  onAddToCart,
  onOpenSizeGuide
}) {
  if (!product) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [showShareNotification, setShowShareNotification] = useState(false);

  const imagesList = product.images || [];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.titleEn,
        text: `Check out ${product.titleEn} (${product.titleJp}) for $${product.priceUsd} on Tevy GU & Uniqlo JP Shopping!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2500);
    }
  };

  // Live stock info for the currently selected color and size
  const currentStockInfo = (selectedColor && selectedSize)
    ? getSkuStockInfo(product, selectedColor.id, selectedSize)
    : null;

  const handleAddToCartClick = () => {
    if (!selectedSize) return;
    if (currentStockInfo && !currentStockInfo.inStock) {
      alert('ទំនិញនេះដាច់ស្តុកនៅជប៉ុនហើយ (This size/color is out of stock in Japan)');
      return;
    }

    onAddToCart({
      product,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      stockStatus: currentStockInfo
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start sm:items-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative my-auto border border-gray-100 pb-24 sm:pb-6">
        
        {/* Top Floating Controls */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto p-2 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md transition"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 pointer-events-auto">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md transition"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share toast */}
        {showShareNotification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition">
            ✓ Copied link to clipboard!
          </div>
        )}

        {/* 1. Main Hero Image Gallery */}
        <div className="-mt-16 relative aspect-[3/4] bg-[#F5F5F7] overflow-hidden select-none">
          <img
            src={
              selectedColor?.image && currentImageIndex === 0
                ? selectedColor.image
                : (imagesList[currentImageIndex] || product.images[0])
            }
            alt={product.titleEn}
            className="w-full h-full object-cover transition duration-300"
          />

          {/* Navigation arrows */}
          {imagesList.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Pagination Counter Badge `2 / 10` */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            {currentImageIndex + 1} / {imagesList.length}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Japanese Title & English Name */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {product.titleJp}
            </h1>
            <p className="text-sm font-semibold text-gray-500 mt-0.5">
              {product.titleEn}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {product.titleKh}
            </p>
          </div>

          {/* Price `$12` in bold red */}
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-[#EE1D23]">
              {formatPrice(product.priceUsd, product.priceJpy)}
            </span>
            {currency !== 'JPY' && (
              <span className="text-sm text-gray-400 font-semibold">
                (¥{product.priceJpy?.toLocaleString()} JPY)
              </span>
            )}
          </div>

          {/* Action tags row (Share this product, category tag, Uniqlo link) */}
          <div className="flex items-center flex-wrap gap-2 pt-1">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="text-blue-500">🎁</span>
              <span>Share this product</span>
            </button>

            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600 flex items-center gap-1">
              <span>📁 {product.category} ›</span>
            </span>
          </div>

          {/* Color Selection */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-gray-800">
                COLOR · <span className="text-gray-900">{selectedColor?.name}</span>
              </span>
            </div>

            {/* Color Swatch Thumbnails */}
            <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
              {product.colors.map((color) => {
                const isSelected = selectedColor?.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color);
                      setCurrentImageIndex(0);
                    }}
                    className={`flex flex-col items-center p-1 rounded-xl transition flex-shrink-0 ${
                      isSelected
                        ? 'ring-2 ring-[#EE1D23] shadow-sm'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mb-1">
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-gray-700 truncate max-w-[50px]">
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-gray-800">
                SIZE
              </span>
              <button
                onClick={onOpenSizeGuide}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Size Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => {
                const skuInfo = selectedColor ? getSkuStockInfo(product, selectedColor.id, s.size) : null;
                const isAvailable = skuInfo ? skuInfo.inStock : s.available !== false;
                const isSelected = selectedSize === s.size;

                return (
                  <button
                    key={s.size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(s.size)}
                    className={`min-w-[48px] h-10 px-3 rounded-lg text-xs font-extrabold transition border relative ${
                      !isAvailable
                        ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-black text-white border-black shadow'
                        : 'bg-white border-gray-300 text-gray-800 hover:border-gray-900'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STYLING IDEAS coordinates grid */}
          {product.stylingIdeas && product.stylingIdeas.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-1.5 mb-2.5">
                <span className="text-base">📸</span>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
                  STYLING IDEAS
                </h4>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.stylingIdeas.map((style, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 group cursor-pointer shadow-sm"
                  >
                    <img
                      src={style.image}
                      alt={style.height}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1 py-0.5 rounded text-center truncate">
                      {style.height}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & Material Info */}
          <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-800">Product Info:</p>
            <p>{product.description}</p>
            <p className="text-[11px] text-gray-500 italic">{product.material}</p>
          </div>
        </div>

        {/* Sticky Bottom Order / Add to Cart Bar */}
        <div className="fixed sm:sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:p-4 shadow-lg flex items-center justify-between gap-3">
          <div className="sm:hidden flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Price</span>
            <span className="text-lg font-black text-[#EE1D23]">
              {formatPrice(product.priceUsd, product.priceJpy)}
            </span>
          </div>

          <button
            onClick={handleAddToCartClick}
            disabled={!selectedSize || (currentStockInfo && !currentStockInfo.inStock)}
            className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
              !selectedSize
                ? 'bg-[#F38A8A] text-white cursor-pointer opacity-90'
                : (currentStockInfo && !currentStockInfo.inStock)
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#EE1D23] hover:bg-red-700 text-white shadow-red-200 scale-100 hover:scale-[1.01]'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              {!selectedSize
                ? 'Select a size'
                : (currentStockInfo && !currentStockInfo.inStock)
                ? 'Out of Stock'
                : `Add to Cart • ${formatPrice(product.priceUsd, product.priceJpy)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
