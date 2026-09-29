import React from 'react';
import { Heart, ShoppingBag, Eye, RefreshCw } from 'lucide-react';

export default function ProductCard({
  product,
  currency,
  onOpenProduct,
  formatPrice
}) {
  return (
    <div 
      onClick={() => onOpenProduct(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col relative"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.isUniqloSynced && (
            <span className="bg-[#ED0006] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              UNIQLO JP
            </span>
          )}
          {product.badge === 'SALE' && (
            <span className="bg-[#EE1D23] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow">
              SALE
            </span>
          )}
          {product.badge === 'LIMITED' && (
            <span className="bg-[#EE1D23] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow">
              LIMITED
            </span>
          )}
          {product.badge === 'NEW' && !product.isUniqloSynced && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow">
              NEW
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="pointer-events-auto p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition"
          title="Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Main Image */}
      <div className="aspect-[3/4] w-full bg-[#F5F5F7] overflow-hidden relative">
        <img
          src={product.images[0]}
          alt={product.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover quick action overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="bg-white/95 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Japanese Title */}
          <p className="text-xs text-gray-500 font-medium truncate mb-0.5">
            {product.titleJp}
          </p>

          {/* English / Khmer Title */}
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition">
            {product.titleEn}
          </h3>

          <p className="text-[11px] text-gray-400 font-normal truncate mt-0.5">
            {product.titleKh}
          </p>
        </div>

        {/* Color swatches indicators */}
        <div className="flex items-center gap-1 mt-2.5 mb-1.5">
          {product.colors.slice(0, 6).map((c) => (
            <span
              key={c.id}
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {product.colors.length > 6 && (
            <span className="text-[10px] text-gray-400">+{product.colors.length - 6}</span>
          )}
          <span className="text-[10px] text-gray-400 ml-1">
            {product.colors.length} {product.colors.length > 1 ? 'colors' : 'color'}
          </span>
        </div>

        {/* Price & Cart button */}
        <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-[#EE1D23]">
              {formatPrice(product.priceUsd, product.priceJpy)}
            </span>
            {currency !== 'JPY' && (
              <span className="text-[10px] text-gray-400">
                (¥{product.priceJpy?.toLocaleString()})
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenProduct(product);
            }}
            className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
            title="Order Item"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
