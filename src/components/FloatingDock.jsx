import React from 'react';
import { Home, Camera, Store, ShoppingBag } from 'lucide-react';

export default function FloatingDock({
  onGoHome,
  onOpenSearch,
  onOpenCategoryModal,
  onOpenCart,
  cartCount
}) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <nav 
        aria-label="Bottom Quick Navigation"
        className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-2xl rounded-full px-4 py-2 flex items-center space-x-6 text-gray-700 transition hover:shadow-red-500/10"
      >
        {/* Home */}
        <button
          onClick={onGoHome}
          className="p-2 rounded-full hover:bg-gray-100 hover:text-red-600 transition flex flex-col items-center"
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Camera / Visual Search */}
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-full hover:bg-gray-100 hover:text-red-600 transition flex flex-col items-center"
          title="Search"
        >
          <Camera className="w-5 h-5" />
        </button>

        {/* Store / Categories */}
        <button
          onClick={onOpenCategoryModal}
          className="p-2 rounded-full hover:bg-gray-100 hover:text-red-600 transition flex flex-col items-center"
          title="All Categories"
        >
          <Store className="w-5 h-5" />
        </button>

        {/* Shopping Cart */}
        <button
          onClick={onOpenCart}
          className="p-2 rounded-full hover:bg-gray-100 hover:text-red-600 transition flex flex-col items-center relative"
          title="Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#EE1D23] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white shadow">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
}
