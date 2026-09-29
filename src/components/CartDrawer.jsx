import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  currency,
  formatPrice
}) {
  if (!isOpen) return null;

  const subtotalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity,
    0
  );
  const subtotalJpy = cartItems.reduce(
    (sum, item) => sum + item.product.priceJpy * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              កន្ត្រកទំនិញ (Shopping Bag)
            </h2>
            <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <ShoppingBag className="w-16 h-16 stroke-1 mb-3 text-gray-300" />
              <p className="font-bold text-gray-600">កន្ត្រកទំនិញនៅទំនេរ</p>
              <p className="text-xs text-gray-400 mt-1">
                Your shopping bag is empty. Explore Japanese products and add them here!
              </p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.product.id}-${item.size}-${item.color?.id}-${index}`} className="py-4 flex gap-3">
                {/* Item Thumbnail */}
                <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={item.color?.image || item.product.images[0]}
                    alt={item.product.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.product.titleEn}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-500">{item.product.titleJp}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-700">
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          {item.color.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 transition"
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 transition"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>

                    <span className="text-sm font-black text-red-600">
                      {formatPrice(
                        item.product.priceUsd * item.quantity,
                        item.product.priceJpy * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-[#FAF7F2]">
            <div className="space-y-1.5 text-xs text-gray-600 mb-3">
              <div className="flex justify-between">
                <span>តម្លៃទំនិញសរុប (Subtotal):</span>
                <span className="font-bold text-gray-900">
                  {formatPrice(subtotalUsd, subtotalJpy)}
                </span>
              </div>
              <div className="flex justify-between text-green-700 font-semibold">
                <span>ដឹកជញ្ជូន (Delivery):</span>
                <span>FREE (ឥតគិតថ្លៃ)</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1.5 border-t border-gray-200">
                <span>តម្លៃត្រូវទូទាត់ (Total):</span>
                <span className="text-red-600 text-base font-black">
                  {formatPrice(subtotalUsd, subtotalJpy)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full py-3.5 bg-[#EE1D23] hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-500/20 transition flex items-center justify-center space-x-2"
            >
              <span>បន្តការកុម្ម៉ង់ (Checkout Order)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
