import React from 'react';
import { Menu, User, ShoppingBag, Search, ChevronDown, Check, ShieldCheck } from 'lucide-react';

export default function Header({
  activeGender,
  setActiveGender,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenLogin,
  currency,
  setCurrency,
  currentUser,
  onOpenCategoryModal,
  onOpenAdminLogin,
  announcementText,
  scrollingNews,
  onGoHome
}) {
  // Default news messages if none provided
  const newsList = (scrollingNews && scrollingNews.length > 0) ? scrollingNews : [
    announcementText || 'GU & UNIQLO JAPAN មកពីជប៉ុនផ្ទាល់ 🇯🇵 - Free Delivery ដឹកជូនដល់ផ្ទះ',
    'ធានាទំនិញសុទ្ធ 100% នាំចូលផ្ទាល់ពីរោងចក្រ Fast Retailing ប្រទេសជប៉ុន ✨',
    'ទទួលកុម្ម៉ង់រៀងរាល់ថ្ងៃ ដឹកជញ្ជូនរហ័សទាន់ចិត្តទូទាំង ២៥ ខេត្ត-ក្រុង 🚚',
    'ពិនិត្យស្តុកទំនិញជាក់ស្តែងពីជប៉ុន Real-Time Live Stock Tracking ⚡'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
      {/* Top Banner Notice with Continuous Scrolling News Ticker */}
      <div className="bg-[#FFF5F5] border-b border-red-100/70 h-8 text-xs text-red-600 font-medium flex items-center overflow-hidden relative select-none">
        
        {/* Left fixed brand tag */}
        <div className="bg-[#FFF5F5] pl-3 pr-2.5 h-full z-10 flex items-center space-x-1.5 flex-shrink-0 border-r border-red-100 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
          <span className="w-3.5 h-2.5 inline-block bg-white border border-gray-300 rounded-[2px] relative overflow-hidden flex-shrink-0">
            <span className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-red-600"></span>
          </span>
          <span className="font-extrabold text-[11px] text-red-700 tracking-tight whitespace-nowrap">
            NEWS 🇯🇵
          </span>
        </div>

        {/* Scrolling continuous news ribbon */}
        <div className="flex-1 overflow-hidden relative cursor-default h-full flex items-center">
          <div className="animate-marquee-infinite py-1 flex items-center">
            {/* Render news list twice for perfect seamless infinite loop */}
            {[...newsList, ...newsList].map((item, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center mx-5 text-xs font-semibold text-gray-800 hover:text-red-600 transition whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 flex-shrink-0 animate-pulse"></span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right fixed tag */}
        <div className="hidden sm:flex bg-[#FFF5F5] pr-3 pl-2.5 h-full z-10 items-center space-x-2 text-gray-700 flex-shrink-0 border-l border-red-100 text-[11px] font-bold shadow-[-2px_0_4px_rgba(0,0,0,0.02)]">
          <span>🚚 Free Delivery</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Hamburger, Login, & Admin Access */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={onOpenCategoryModal}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            aria-label="Menu"
            title="Browse categories"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button 
            onClick={onOpenLogin}
            className="flex items-center space-x-1.5 text-xs font-semibold text-gray-800 hover:text-red-600 transition px-2 py-1 rounded-md hover:bg-gray-50"
          >
            <User className="w-4 h-4 text-red-600" />
            <span className="truncate max-w-[80px] sm:max-w-none">{currentUser ? currentUser.name : 'Login'}</span>
          </button>

          {/* Discreet Admin Portal Icon */}
          <button
            onClick={onOpenAdminLogin}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Admin Management Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Brand Logo (Returns to default home page) */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group select-none" 
          onClick={onGoHome}
          title="Return to Home"
        >
          <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-200">
            <span className="bg-[#002B66] text-yellow-400 font-black text-xs sm:text-sm tracking-wider px-1.5 sm:px-2 py-0.5 rounded uppercase">
              GU
            </span>
            <span className="bg-[#ED0006] text-white font-black text-xs sm:text-sm tracking-wider px-1.5 sm:px-2 py-0.5 rounded uppercase">
              UNIQLO
            </span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight hidden md:inline group-hover:text-red-600 transition">
            TEVY JP SHOPPING
          </span>
        </div>

        {/* Right: Currency/Region & Cart */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Currency / Region pill */}
          <div className="relative group">
            <button className="flex items-center space-x-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 rounded-full transition border border-gray-200">
              <span className="text-[10px] font-black">JP</span>
              <span className="text-[11px]">({currency})</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 hidden group-hover:block z-50">
              <div className="text-[10px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Currency</div>
              <button 
                onClick={() => setCurrency('USD')}
                className={`w-full text-left px-2 py-1 text-xs rounded-md flex items-center justify-between ${currency === 'USD' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <span>USD ($)</span>
                {currency === 'USD' && <Check className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setCurrency('JPY')}
                className={`w-full text-left px-2 py-1 text-xs rounded-md flex items-center justify-between ${currency === 'JPY' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <span>JPY (¥)</span>
                {currency === 'JPY' && <Check className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setCurrency('KHR')}
                className={`w-full text-left px-2 py-1 text-xs rounded-md flex items-center justify-between ${currency === 'KHR' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <span>KHR (៛)</span>
                {currency === 'KHR' && <Check className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Cart Icon */}
          <button 
            onClick={onOpenCart}
            className="relative p-2 rounded-full hover:bg-gray-100 transition text-gray-800"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Subheader: Gender Tabs & Search Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {['ALL', 'MEN', 'WOMEN', 'KIDS'].map((gender) => (
            <button
              key={gender}
              onClick={() => setActiveGender(gender)}
              className={`text-xs sm:text-sm font-bold tracking-wider transition px-2 py-1 rounded-md ${
                activeGender === gender
                  ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {gender}
            </button>
          ))}
          {/* mini_app pill tab */}
          <button
            onClick={() => setActiveGender('mini_app')}
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition ${
              activeGender === 'mini_app'
                ? 'border-red-600 text-red-600 bg-red-50 font-extrabold shadow-sm'
                : 'border-red-500/80 text-red-500 hover:bg-red-50'
            }`}
          >
            mini_app
          </button>
        </div>

        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition flex items-center gap-1 text-xs"
          title="Search products"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline text-gray-500">ស្វែងរក...</span>
        </button>
      </div>
    </header>
  );
}
