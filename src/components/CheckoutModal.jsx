import React, { useState } from 'react';
import { X, CheckCircle, Send, QrCode, Phone, MapPin, User, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAMBODIA_PROVINCES } from '../data/mockData';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  currency,
  formatPrice
}) {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [province, setProvince] = useState(CAMBODIA_PROVINCES[0]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('aba');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity,
    0
  );
  const subtotalJpy = cartItems.reduce(
    (sum, item) => sum + item.product.priceJpy * item.quantity,
    0
  );

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !address) {
      alert('សូមបំពេញឈ្មោះ លេខទូរស័ព្ទ និងអាសយដ្ឋានដឹកជញ្ជូន (Please fill all required fields)');
      return;
    }

    const generatedId = 'GU-KH-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setIsSubmitted(true);

    const newOrder = {
      id: generatedId,
      customerName: fullName,
      phoneNumber,
      telegramHandle,
      province,
      address,
      paymentMethod,
      notes,
      items: cartItems.map((it) => ({
        productId: it.product.id,
        titleEn: it.product.titleEn,
        titleJp: it.product.titleJp,
        priceUsd: it.product.priceUsd,
        priceJpy: it.product.priceJpy,
        size: it.size,
        color: it.color?.name || 'Default',
        quantity: it.quantity,
        image: it.color?.image || it.product.images[0]
      })),
      totalUsd: subtotalUsd,
      totalJpy: subtotalJpy,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Fire festive celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    onOrderSuccess(newOrder);
  };

  const handleOpenTelegram = () => {
    const textLines = [
      `🛍️ *ការកុម្ម៉ង់ទំនិញថ្មីពី TEVY GU SHOPPING*`,
      `*លេខកូដកុម្ម៉ង់:* \`${orderId}\``,
      `*ឈ្មោះអតិថិជន:* ${fullName}`,
      `*លេខទូរស័ព្ទ:* ${phoneNumber} ${telegramHandle ? `(${telegramHandle})` : ''}`,
      `*ទីតាំងដឹកជញ្ជូន:* ${province}, ${address}`,
      `*វិធីទូទាត់:* ${paymentMethod.toUpperCase()}`,
      `-----------------------------`,
      `*បញ្ជីទំនិញ:*`,
      ...cartItems.map(
        (it, idx) =>
          `${idx + 1}. ${it.product.titleEn} (${it.product.titleJp})\n   - ទំហំ Size: ${it.size}\n   - ពណ៌ Color: ${it.color?.name || 'Default'}\n   - ចំនួន Qty: ${it.quantity} x $${it.product.priceUsd}`
      ),
      `-----------------------------`,
      `*តម្លៃសរុប:* $${subtotalUsd} (ដឹកជូនដោយឥតគិតថ្លៃ Free Delivery)`,
      notes ? `*ចំណាំ:* ${notes}` : ''
    ].filter(Boolean).join('\n');

    const encoded = encodeURI(textLines);
    window.open(`https://t.me/share/url?url=&text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-gray-100 max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              {isSubmitted ? 'ការកុម្ម៉ង់បានជោគជ័យ 🎉' : 'កុម្ម៉ង់ទំនិញ (Checkout Order)'}
            </h3>
            <p className="text-xs text-gray-500">
              GU Brand Authentic Japan personal shopping delivery to Cambodia
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-gray-900">
                  អរគុណសម្រាប់ការកុម្ម៉ង់!
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  លេខកូដកុម្ម៉ង់របស់អ្នកគឺ: <span className="font-mono font-bold text-red-600 text-sm">{orderId}</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between font-bold border-b border-gray-200 pb-2">
                  <span>អ្នកទទួល: {fullName}</span>
                  <span className="text-gray-600">{phoneNumber}</span>
                </div>
                <p><span className="text-gray-500">អាសយដ្ឋាន:</span> {province}, {address}</p>
                <p><span className="text-gray-500">តម្លៃទូទាត់សរុប:</span> <span className="font-black text-red-600">${subtotalUsd}</span></p>
                <p><span className="text-gray-500">វិធីទូទាត់:</span> {paymentMethod.toUpperCase()}</p>
              </div>

              {/* Direct Telegram Forwarding Button */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={handleOpenTelegram}
                  className="w-full py-3.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center space-x-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>ផ្ញើការកុម្ម៉ង់ទៅកាន់ Telegram Shop</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition text-xs"
                >
                  ត្រឡប់ទៅទំព័រដើម (Back to Home)
                </button>
              </div>
            </div>
          ) : (
            /* Order Input Form */
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              
              {/* Order Items Brief */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/80">
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                  <span>ទំនិញដែលបានជ្រើសរើស ({cartItems.length} មុខ)</span>
                  <span className="text-red-600 font-black">
                    {formatPrice(subtotalUsd, subtotalJpy)}
                  </span>
                </div>
                <div className="max-h-24 overflow-y-auto divide-y divide-gray-100 text-[11px] text-gray-600">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="py-1 flex justify-between">
                      <span className="truncate max-w-[240px]">
                        {item.quantity}x {item.product.titleEn} ({item.size})
                      </span>
                      <span className="font-semibold">
                        ${item.product.priceUsd * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ឈ្មោះពេញ (Full Name) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sokha Chan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    លេខទូរស័ព្ទ (Phone Number) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="012 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Telegram Username */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Telegram Username (ស្រេចចិត្ត Optional)
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="@username"
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Province & Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  រាជធានី / ខេត្ត (Province / City) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                  >
                    {CAMBODIA_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  អាសយដ្ឋានលម្អិត (House / Street / Sangkat / Khan) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="ផ្ទះលេខ ផ្លូវលេខ សង្កាត់ ខណ្ឌ..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  វិធីសាស្ត្រទូទាត់ប្រាក់ (Payment Method)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'aba', label: 'ABA Pay KHQR', icon: '🏦' },
                    { id: 'acleda', label: 'ACLEDA / Wing', icon: '💳' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  ].map((pay) => (
                    <button
                      type="button"
                      key={pay.id}
                      onClick={() => setPaymentMethod(pay.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                        paymentMethod === pay.id
                          ? 'border-[#EE1D23] bg-red-50/50 text-[#EE1D23] ring-1 ring-red-500'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-base">{pay.icon}</span>
                      <span className="truncate w-full">{pay.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#EE1D23] hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-lg shadow-red-500/20 transition flex items-center justify-center space-x-2 mt-4"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>បញ្ជាក់ការកុម្ម៉ង់ (Confirm Order) • {formatPrice(subtotalUsd, subtotalJpy)}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
