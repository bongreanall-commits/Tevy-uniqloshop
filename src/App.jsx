import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroCategoryBanner from './components/HeroCategoryBanner';
import ProductGrid from './components/ProductGrid';
import CategoryModal from './components/CategoryModal';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import SizeGuideModal from './components/SizeGuideModal';
import SearchModal from './components/SearchModal';
import LoginModal from './components/LoginModal';
import FloatingDock from './components/FloatingDock';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/mockData';
import { syncUniqloStock } from './services/uniqloService';

// Pre-seeded real Uniqlo Japan products with live stock mappings
const INITIAL_UNIQLO_PRODUCTS = [
  {
    id: 'uniqlo-e465185-000',
    uniqloId: 'E465185-000',
    sourceUrl: 'https://www.uniqlo.com/jp/ja/products/E465185-000/00',
    titleJp: 'エアリズムコットンオーバーサイズTシャツ/5分袖',
    titleEn: 'AIRism Cotton Oversized T-Shirt (Half Sleeve)',
    titleKh: 'អាវយឺត AIRism Cotton Oversized 5分袖 ពេញនិយមបំផុតនៅជប៉ុន',
    priceUsd: 16,
    priceJpy: 1990,
    category: 'top-tshirts',
    gender: 'MEN',
    badge: 'NEW',
    isUniqloSynced: true,
    lastSynced: new Date().toISOString(),
    images: [
      'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_00_465185_3x4.jpg',
      'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_09_465185_3x4.jpg',
      'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_11_465185_3x4.jpg',
      'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/sub/jpgoods_465185_sub3_3x4.jpg'
    ],
    colors: [
      { id: '00', name: 'WHITE (00)', hex: '#FFFFFF', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_00_465185_3x4.jpg' },
      { id: '09', name: 'BLACK (09)', hex: '#111111', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_09_465185_3x4.jpg' },
      { id: '02', name: 'LIGHT GRAY (02)', hex: '#D3D3D3', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_02_465185_3x4.jpg' },
      { id: '11', name: 'PINK (11)', hex: '#F4ACB7', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_11_465185_3x4.jpg' },
      { id: '69', name: 'NAVY (69)', hex: '#1B263B', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/465185/item/jpgoods_69_465185_3x4.jpg' }
    ],
    sizes: [
      { size: 'XS', available: true, availableStockCount: 1006 },
      { size: 'S', available: true, availableStockCount: 603 },
      { size: 'M', available: true, availableStockCount: 1475 },
      { size: 'L', available: true, availableStockCount: 1795 },
      { size: 'XL', available: true, availableStockCount: 1293 },
      { size: 'XXL', available: true, availableStockCount: 450 },
      { size: '3XL', available: false, availableStockCount: 0 }
    ],
    skus: {
      '00_XS': { statusCode: 'IN_STOCK', quantity: 1006, inStock: true },
      '00_S': { statusCode: 'IN_STOCK', quantity: 603, inStock: true },
      '00_M': { statusCode: 'IN_STOCK', quantity: 1475, inStock: true },
      '00_L': { statusCode: 'IN_STOCK', quantity: 1795, inStock: true },
      '00_XL': { statusCode: 'IN_STOCK', quantity: 1293, inStock: true },
      '00_XXL': { statusCode: 'IN_STOCK', quantity: 450, inStock: true },
      '00_3XL': { statusCode: 'STOCK_OUT', quantity: 0, inStock: false },
      '09_M': { statusCode: 'IN_STOCK', quantity: 980, inStock: true },
      '09_L': { statusCode: 'IN_STOCK', quantity: 1120, inStock: true },
      '09_3XL': { statusCode: 'STOCK_OUT', quantity: 0, inStock: false }
    },
    stylingIdeas: [
      { height: '175cm · L', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
      { height: '168cm · M', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }
    ],
    description: 'Cotton look on the outside, smooth AIRism on the inside. Oversized boxy silhouette, dropped shoulders and 5-sleeve length.',
    material: '53% Cotton, 47% Polyester (Compounded with AIRism tech)'
  },
  {
    id: 'uniqlo-e460311-000',
    uniqloId: 'E460311-000',
    sourceUrl: 'https://www.uniqlo.com/jp/ja/products/E460311-000/00',
    titleJp: 'タックワイドパンツ (丈標準69～71cm)',
    titleEn: 'Tuck Wide Pants (Pleated Trousers)',
    titleKh: 'ខោជើងធំ Tuck Wide Pants Uniqlo ជប៉ុន',
    priceUsd: 26,
    priceJpy: 2990,
    category: 'pants',
    gender: 'WOMEN',
    badge: 'NEW',
    isUniqloSynced: true,
    lastSynced: new Date().toISOString(),
    images: [
      'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/460311/item/jpgoods_09_460311_3x4.jpg',
      'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/460311/item/jpgoods_06_460311_3x4.jpg',
      'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/460311/item/jpgoods_32_460311_3x4.jpg'
    ],
    colors: [
      { id: '09', name: 'BLACK (09)', hex: '#111111', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/460311/item/jpgoods_09_460311_3x4.jpg' },
      { id: '06', name: 'GRAY (06)', hex: '#808080', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/460311/item/jpgoods_06_460311_3x4.jpg' },
      { id: '32', name: 'BEIGE (32)', hex: '#D2B48C', image: 'https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/460311/item/jpgoods_32_460311_3x4.jpg' }
    ],
    sizes: [
      { size: 'XS', available: false, availableStockCount: 0 },
      { size: 'S', available: true, availableStockCount: 15 },
      { size: 'M', available: true, availableStockCount: 38 },
      { size: 'L', available: true, availableStockCount: 20 },
      { size: 'XL', available: false, availableStockCount: 0 }
    ],
    skus: {
      '09_XS': { statusCode: 'STOCK_OUT', quantity: 0, inStock: false },
      '09_S': { statusCode: 'IN_STOCK', quantity: 15, inStock: true },
      '09_M': { statusCode: 'IN_STOCK', quantity: 38, inStock: true },
      '09_L': { statusCode: 'IN_STOCK', quantity: 20, inStock: true },
      '09_XL': { statusCode: 'STOCK_OUT', quantity: 0, inStock: false }
    },
    stylingIdeas: [
      { height: '161cm · S', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' }
    ],
    description: 'Clean tuck pleated front with elegant drape. Elastic back waistband for all-day comfort and sharp styling.',
    material: '66% Polyester, 28% Rayon, 6% Polyurethane'
  }
];

const DEFAULT_SCROLLING_NEWS = [
  'GU & UNIQLO JAPAN មកពីជប៉ុនផ្ទាល់ 🇯🇵 - Free Delivery ដឹកជូនដល់ផ្ទះ',
  'ធានាទំនិញសុទ្ធ 100% នាំចូលផ្ទាល់ពីរោងចក្រ Fast Retailing ប្រទេសជប៉ុន ✨',
  'ទទួលកុម្ម៉ង់រៀងរាល់ថ្ងៃ ដឹកជញ្ជូនរហ័សទាន់ចិត្តទូទាំង ២៥ ខេត្ត-ក្រុង 🚚',
  'ពិនិត្យស្តុកទំនិញជាក់ស្តែងពីជប៉ុន Real-Time Live Stock Tracking ⚡'
];

const DEFAULT_HERO_SLIDES = [
  {
    id: 'slide-categories',
    type: 'categories',
    active: true,
    badge: 'MEN',
    titleKh: 'ចុចទីនេះដើម្បី មើលម៉ូតតាមផ្នែក',
    subtitleEn: 'Click here to select category',
    bgColor: '#F4EFEA',
  },
  {
    id: 'slide-promo-1',
    type: 'promo',
    active: true,
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
    active: true,
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

// Store Settings state
export default function App() {
  const [activeGender, setActiveGender] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFeaturedTag, setSelectedFeaturedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isUniqloFilterOnly, setIsUniqloFilterOnly] = useState(false);

  // Admin View State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('tevy_admin_logged_in') === 'true';
  });
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Listen to hash e.g. #admin
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        if (isAdminLoggedIn) {
          setShowAdminDashboard(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [isAdminLoggedIn]);

  // Store Settings state
  const [settings, setSettings] = useState(() => {
    const initialDefault = {
      announcementText: 'GU & UNIQLO JAPAN មកពីជប៉ុនផ្ទាល់ - Free Delivery ដឹកជូនដល់ផ្ទះ',
      exchangeRate: 155,
      markupPercent: 20,
      telegramAdmin: '@tevy_shopping_admin',
      scrollingNews: DEFAULT_SCROLLING_NEWS,
      heroSlides: DEFAULT_HERO_SLIDES
    };
    try {
      const saved = localStorage.getItem('tevy_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialDefault,
          ...parsed,
          scrollingNews: (parsed.scrollingNews && parsed.scrollingNews.length > 0) ? parsed.scrollingNews : DEFAULT_SCROLLING_NEWS,
          heroSlides: (parsed.heroSlides && parsed.heroSlides.length > 0) ? parsed.heroSlides : DEFAULT_HERO_SLIDES
        };
      }
      return initialDefault;
    } catch {
      return initialDefault;
    }
  });

  const handleUpdateSettings = (newSet) => {
    setSettings(newSet);
    try {
      localStorage.setItem('tevy_settings', JSON.stringify(newSet));
    } catch (e) {
      console.error(e);
    }
  };

  // Orders state persisted to localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('tevy_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleUpdateOrders = (newOrders) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('tevy_orders', JSON.stringify(newOrders));
    } catch (e) {
      console.error(e);
    }
  };

  // Products state with localStorage persistence
  const [productsList, setProductsList] = useState(() => {
    const fullInitial = [...INITIAL_UNIQLO_PRODUCTS, ...INITIAL_PRODUCTS];
    try {
      const saved = localStorage.getItem('tevy_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(p => p.id));
          const missingDefaults = fullInitial.filter(p => !existingIds.has(p.id));
          return [...parsed, ...missingDefaults];
        }
      }
    } catch {
      // fallback
    }
    return fullInitial;
  });

  const handleUpdateProducts = (newList) => {
    setProductsList(newList);
    try {
      localStorage.setItem('tevy_products', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // User state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tevy_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tevy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tevy_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('tevy_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tevy_user');
    } catch (e) {
      console.error(e);
    }
  };

  // Admin login success
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('tevy_admin_logged_in', 'true');
    setShowAdminDashboard(true);
    setShowAdminLogin(false);
    window.location.hash = '#admin';
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('tevy_admin_logged_in');
    setShowAdminDashboard(false);
    window.location.hash = '';
  };

  // Currency formatter
  const formatPrice = (usd, jpy) => {
    if (currency === 'JPY') {
      return `¥${(jpy || usd * 155).toLocaleString()}`;
    }
    if (currency === 'KHR') {
      return `៛${(usd * 4100).toLocaleString()}`;
    }
    return `$${usd}`;
  };

  // Sync real-time stock for a single product
  const handleSyncProductStock = async (prod) => {
    if (!prod.uniqloId) return;

    try {
      const syncResult = await syncUniqloStock(prod.uniqloId);
      if (syncResult && syncResult.skus) {
        const updatedSkus = { ...prod.skus, ...syncResult.skus };
        const updatedSizes = (prod.sizes || []).map((s) => {
          let anyColorInStock = false;
          let totalStock = 0;
          for (const [key, val] of Object.entries(updatedSkus)) {
            if (key.endsWith(`_${s.size}`)) {
              totalStock += val.quantity || 0;
              if (val.inStock) anyColorInStock = true;
            }
          }
          return {
            ...s,
            available: anyColorInStock,
            availableStockCount: totalStock
          };
        });

        const updatedProd = {
          ...prod,
          skus: updatedSkus,
          sizes: updatedSizes,
          lastSynced: syncResult.lastSynced
        };

        handleUpdateProducts(productsList.map(p => p.id === prod.id ? updatedProd : p));

        if (activeProduct && activeProduct.id === prod.id) {
          setActiveProduct(updatedProd);
        }
      }
    } catch (err) {
      console.error('Failed to sync stock:', err);
    }
  };

  // Add to cart handler
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (c) =>
          c.product.id === item.product.id &&
          c.size === item.size &&
          c.color?.id === item.color?.id
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });

    setActiveProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveItem = (index) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (isUniqloFilterOnly && !p.isUniqloSynced) return false;

      if (activeGender !== 'ALL' && activeGender !== 'mini_app') {
        if (p.gender && p.gender !== activeGender) return false;
      }

      if (selectedCategory) {
        if (p.category !== selectedCategory) return false;
      }

      if (selectedFeaturedTag === 'sale' && p.badge !== 'SALE') return false;
      if (selectedFeaturedTag === 'limited' && p.badge !== 'LIMITED') return false;
      if (selectedFeaturedTag === 'new' && p.badge !== 'NEW') return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          p.titleEn.toLowerCase().includes(q) ||
          p.titleJp.toLowerCase().includes(q) ||
          p.titleKh.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matchTitle) return false;
      }

      return true;
    });
  }, [productsList, activeGender, selectedCategory, selectedFeaturedTag, searchQuery, isUniqloFilterOnly]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Comprehensive Go Home handler that resets all states to default storefront
  const handleGoHome = () => {
    // 1. Close all active overlays, drawers, and modals
    setActiveProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsCategoryModalOpen(false);
    setIsSearchOpen(false);
    setIsSizeGuideOpen(false);
    setIsLoginOpen(false);
    setShowAdminLogin(false);
    setShowAdminDashboard(false);

    // 2. Reset all filters to default home page (All tab active)
    setActiveGender('ALL');
    setSelectedCategory(null);
    setSelectedFeaturedTag(null);
    setSearchQuery('');
    setIsUniqloFilterOnly(false);

    // 3. Clear any hash in URL
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    // 4. Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Mode, render the Admin Backend
  if (showAdminDashboard && isAdminLoggedIn) {
    return (
      <AdminDashboard
        onExitAdmin={() => {
          setShowAdminDashboard(false);
          window.location.hash = '';
        }}
        onLogout={handleAdminLogout}
        products={productsList}
        onUpdateProducts={handleUpdateProducts}
        orders={orders}
        onUpdateOrders={handleUpdateOrders}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1C1E] flex flex-col font-sans pb-24">
      {/* 1. Customer Storefront Header (Clean & authentic, no admin buttons) */}
      <Header
        activeGender={activeGender}
        setActiveGender={(g) => {
          setActiveGender(g);
          setSelectedCategory(null);
        }}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        currentUser={currentUser}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) {
            setShowAdminDashboard(true);
          } else {
            setShowAdminLogin(true);
          }
        }}
        announcementText={settings.announcementText}
        scrollingNews={settings.scrollingNews}
        onGoHome={handleGoHome}
      />

      {/* 2. Hero Category Selector Banner */}
      <HeroCategoryBanner
        activeGender={activeGender}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
        slides={settings.heroSlides}
        onSelectFeaturedTag={(tag) => setSelectedFeaturedTag(tag)}
      />

      {/* 3. Main Product Grid & Filters */}
      <main className="flex-1">
        <ProductGrid
          products={filteredProducts}
          currency={currency}
          activeGender={activeGender}
          setActiveGender={(g) => {
            setActiveGender(g);
            setSelectedCategory(null);
          }}
          selectedCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory(null)}
          selectedFeaturedTag={selectedFeaturedTag}
          onSelectFeaturedTag={(tag) => setSelectedFeaturedTag(tag)}
          onOpenProduct={(prod) => setActiveProduct(prod)}
          formatPrice={formatPrice}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          isUniqloFilterOnly={isUniqloFilterOnly}
          onToggleUniqloFilter={() => setIsUniqloFilterOnly((prev) => !prev)}
        />
      </main>

      {/* 4. Bottom Floating Dock Navigation */}
      <FloatingDock
        onGoHome={handleGoHome}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartTotalCount}
      />

      {/* 5. Category Modal / Fullscreen Drawer */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        activeGender={activeGender}
        setActiveGender={setActiveGender}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
        selectedFeaturedTag={selectedFeaturedTag}
        onSelectFeaturedTag={(tag) => setSelectedFeaturedTag(tag)}
      />

      {/* 6. Product Detail View Modal */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        currency={currency}
        formatPrice={formatPrice}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onSyncProductStock={handleSyncProductStock}
      />

      {/* 7. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        currency={currency}
        formatPrice={formatPrice}
      />

      {/* 8. Checkout Order Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={(placedOrder) => {
          if (placedOrder) {
            handleUpdateOrders([placedOrder, ...orders]);
          }
          setCart([]);
        }}
        currency={currency}
        formatPrice={formatPrice}
      />

      {/* 9. Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 10. Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPerformSearch={(query) => setSearchQuery(query)}
      />

      {/* 11. Customer Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* 12. Admin Login Modal */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
