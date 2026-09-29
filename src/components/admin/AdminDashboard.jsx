import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PlusCircle,
  FileEdit,
  Settings,
  Store,
  LogOut,
  RefreshCw,
  Search,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  X,
  Phone,
  MapPin,
  Tag,
  Plus,
  Image as ImageIcon,
  Palette,
  Megaphone,
  Sliders,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { fetchUniqloProduct, POPULAR_UNIQLO_PRESETS, syncUniqloStock } from '../../services/uniqloService';
import { CATEGORIES } from '../../data/mockData';
import confetti from 'canvas-confetti';

export default function AdminDashboard({
  onExitAdmin,
  onLogout,
  products,
  onUpdateProducts,
  orders,
  onUpdateOrders,
  settings,
  onUpdateSettings
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, products, manual_post, uniqlo, settings

  // Uniqlo Importer State
  const [uniqloUrl, setUniqloUrl] = useState('');
  const [isFetchingUniqlo, setIsFetchingUniqlo] = useState(false);
  const [uniqloError, setUniqloError] = useState('');
  const [fetchedUniqloItem, setFetchedUniqloItem] = useState(null);
  const [customPriceUsd, setCustomPriceUsd] = useState(16);
  const [customTitleEn, setCustomTitleEn] = useState('');
  const [customTitleKh, setCustomTitleKh] = useState('');
  const [customCategory, setCustomCategory] = useState('top-tshirts');
  const [customGender, setCustomGender] = useState('MEN');

  // Manual Post State
  const [manualTitleEn, setManualTitleEn] = useState('');
  const [manualTitleJp, setManualTitleJp] = useState('');
  const [manualTitleKh, setManualTitleKh] = useState('');
  const [manualPriceUsd, setManualPriceUsd] = useState(18);
  const [manualPriceJpy, setManualPriceJpy] = useState(2500);
  const [manualCategory, setManualCategory] = useState('top-tshirts');
  const [manualGender, setManualGender] = useState('MEN');
  const [manualBadge, setManualBadge] = useState('NEW');
  const [manualMainImage, setManualMainImage] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80');
  const [manualExtraImage, setManualExtraImage] = useState('');
  const [manualDescription, setManualDescription] = useState('Authentic Japanese relaxed fit. Soft breathable cotton fabric.');
  const [manualMaterial, setManualMaterial] = useState('100% Cotton');
  
  const [manualColors, setManualColors] = useState([
    { id: 'black', name: 'BLACK (09)', hex: '#111111', image: '' },
    { id: 'white', name: 'WHITE (00)', hex: '#FFFFFF', image: '' },
    { id: 'natural', name: 'NATURAL (30)', hex: '#F5EFE6', image: '' }
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1976D2');
  const [newColorImage, setNewColorImage] = useState('');

  const [manualSizes, setManualSizes] = useState([
    { size: 'XS', available: true },
    { size: 'S', available: true },
    { size: 'M', available: true },
    { size: 'L', available: true },
    { size: 'XL', available: true },
    { size: 'XXL', available: false }
  ]);

  // Orders State
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Products State
  const [productSearch, setProductSearch] = useState('');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Banners & Scrolling News State
  const [bannerSubTab, setBannerSubTab] = useState('news'); // 'news' | 'slides'
  const [newNewsText, setNewNewsText] = useState('');
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [slideForm, setSlideForm] = useState({
    id: '',
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
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- Scrolling News Handlers ---
  const handleAddNews = (customText) => {
    const textToAdd = (typeof customText === 'string' ? customText : newNewsText).trim();
    if (!textToAdd) return;
    const currentList = settings.scrollingNews && settings.scrollingNews.length > 0
      ? settings.scrollingNews
      : [
          'GU & UNIQLO JAPAN មកពីជប៉ុនផ្ទាល់ 🇯🇵 - Free Delivery ដឹកជូនដល់ផ្ទះ',
          'ធានាទំនិញសុទ្ធ 100% នាំចូលផ្ទាល់ពីរោងចក្រ Fast Retailing ប្រទេសជប៉ុន ✨',
          'ទទួលកុម្ម៉ង់រៀងរាល់ថ្ងៃ ដឹកជញ្ជូនរហ័សទាន់ចិត្តទូទាំង ២៥ ខេត្ត-ក្រុង 🚚'
        ];
    const updated = [...currentList, textToAdd];
    onUpdateSettings({ ...settings, scrollingNews: updated });
    setNewNewsText('');
    showToast('✓ Added new scrolling ticker message');
  };

  const handleDeleteNews = (index) => {
    const currentList = settings.scrollingNews || [];
    if (currentList.length <= 1) {
      alert('You should keep at least one scrolling news message.');
      return;
    }
    const updated = currentList.filter((_, i) => i !== index);
    onUpdateSettings({ ...settings, scrollingNews: updated });
    showToast('Removed ticker message');
  };

  const handleMoveNews = (index, direction) => {
    const currentList = [...(settings.scrollingNews || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;
    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;
    onUpdateSettings({ ...settings, scrollingNews: currentList });
  };

  // --- Hero Slides Handlers ---
  const handleToggleSlideActive = (slideId) => {
    const currentSlides = settings.heroSlides || [];
    const updated = currentSlides.map(s => s.id === slideId ? { ...s, active: s.active === false ? true : false } : s);
    onUpdateSettings({ ...settings, heroSlides: updated });
    showToast('Slide visibility updated');
  };

  const handleDeleteSlide = (slideId) => {
    const currentSlides = settings.heroSlides || [];
    if (currentSlides.length <= 1) {
      alert('You must have at least one hero slide in the carousel.');
      return;
    }
    const updated = currentSlides.filter(s => s.id !== slideId);
    onUpdateSettings({ ...settings, heroSlides: updated });
    showToast('Slide deleted');
  };

  const handleMoveSlide = (index, direction) => {
    const currentSlides = [...(settings.heroSlides || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentSlides.length) return;
    const temp = currentSlides[index];
    currentSlides[index] = currentSlides[targetIndex];
    currentSlides[targetIndex] = temp;
    onUpdateSettings({ ...settings, heroSlides: currentSlides });
  };

  const handleOpenAddSlide = (presetType = 'promo') => {
    if (presetType === 'categories') {
      setSlideForm({
        id: `slide-cat-${Date.now()}`,
        type: 'categories',
        active: true,
        badge: 'ALL CATEGORIES',
        titleKh: 'ចុចទីនេះដើម្បី មើលម៉ូតតាមផ្នែក',
        subtitleEn: 'Quick Category Selector',
        descriptionKh: 'ជ្រើសរើសម៉ូតតាមប្រភេទអាវ ខោ ស្បែកជើង ឬគ្រឿងតុបតែង',
        image: '',
        bgColor: '#F4EFEA',
        buttonText: 'មើលតាមផ្នែក',
        buttonFilter: 'all'
      });
    } else {
      setSlideForm({
        id: `slide-promo-${Date.now()}`,
        type: 'promo',
        active: true,
        badge: 'NEW COLLECTION 2026',
        titleKh: 'ម៉ូតថ្មីទើបមកដល់ AIRism & GU',
        subtitleEn: 'New Arrivals 2026 Collection Direct from Tokyo',
        descriptionKh: 'សាច់ក្រណាត់ត្រជាក់ស្រួល សាកសមបំផុតសម្រាប់អាកាសធាតុកម្ពុជា',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        bgColor: '#EBE7E0',
        buttonText: 'មើលម៉ូតថ្មីៗ (Shop New)',
        buttonFilter: 'new'
      });
    }
    setIsAddingSlide(true);
    setEditingSlideId(null);
  };

  const handleOpenEditSlide = (slide) => {
    setSlideForm({ ...slide });
    setEditingSlideId(slide.id);
    setIsAddingSlide(false);
  };

  const handleSaveSlide = (e) => {
    e.preventDefault();
    if (!slideForm.titleKh && !slideForm.subtitleEn) {
      alert('Please enter at least a title for the slide.');
      return;
    }
    const currentSlides = settings.heroSlides || [];
    let updated;
    if (editingSlideId) {
      updated = currentSlides.map(s => s.id === editingSlideId ? slideForm : s);
      showToast('✓ Banner slide updated successfully!');
    } else {
      updated = [...currentSlides, slideForm];
      showToast('✓ New banner slide created successfully!');
    }
    onUpdateSettings({ ...settings, heroSlides: updated });
    setIsAddingSlide(false);
    setEditingSlideId(null);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // 1. Uniqlo Importer Handler
  const handleFetchUniqlo = async (code) => {
    const target = code || uniqloUrl;
    if (!target.trim()) {
      setUniqloError('Please enter a valid Uniqlo product link or code');
      return;
    }

    setIsFetchingUniqlo(true);
    setUniqloError('');
    try {
      const prod = await fetchUniqloProduct(target);
      setFetchedUniqloItem(prod);
      setCustomPriceUsd(prod.priceUsd || Math.round((prod.priceJpy || 1990) / (settings.exchangeRate || 155) * (1 + (settings.markupPercent || 20) / 100)));
      setCustomTitleEn(prod.titleEn || prod.titleJp);
      setCustomTitleKh(prod.titleKh || `${prod.titleJp} - នាំចូលពី Uniqlo Japan`);
      setCustomCategory(prod.category || 'top-tshirts');
      setCustomGender(prod.gender || 'MEN');
      showToast('✓ Successfully fetched product from Uniqlo Japan!');
    } catch (err) {
      setUniqloError(err.message || 'Failed to fetch from Uniqlo Japan.');
    } finally {
      setIsFetchingUniqlo(false);
    }
  };

  const handlePublishFromUniqlo = () => {
    if (!fetchedUniqloItem) return;

    const newItem = {
      ...fetchedUniqloItem,
      priceUsd: Number(customPriceUsd),
      titleEn: customTitleEn,
      titleKh: customTitleKh,
      category: customCategory,
      gender: customGender,
      badge: 'NEW',
      isUniqloSynced: true,
      lastSynced: new Date().toISOString()
    };

    onUpdateProducts([newItem, ...products.filter(p => p.id !== newItem.id)]);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    showToast('✓ Product published to storefront!');
    setFetchedUniqloItem(null);
    setUniqloUrl('');
    setActiveTab('products');
  };

  // 2. Manual Post Handler
  const handleAddManualColor = () => {
    if (!newColorName.trim()) return;
    setManualColors([
      ...manualColors,
      {
        id: `col-${Date.now()}`,
        name: newColorName.trim(),
        hex: newColorHex,
        image: newColorImage.trim() || manualMainImage
      }
    ]);
    setNewColorName('');
    setNewColorImage('');
  };

  const handleRemoveManualColor = (id) => {
    setManualColors(manualColors.filter(c => c.id !== id));
  };

  const handleToggleSizeAvailability = (sizeName) => {
    setManualSizes(manualSizes.map(s => s.size === sizeName ? { ...s, available: !s.available } : s));
  };

  const handlePublishManualProduct = (e) => {
    e.preventDefault();
    if (!manualTitleEn.trim()) {
      alert('Please enter a product title in English.');
      return;
    }
    if (!manualMainImage.trim()) {
      alert('Please provide at least one main image URL.');
      return;
    }

    const images = [manualMainImage.trim()];
    if (manualExtraImage.trim()) {
      images.push(manualExtraImage.trim());
    }

    const newProd = {
      id: `custom-${Date.now()}`,
      titleEn: manualTitleEn.trim(),
      titleJp: manualTitleJp.trim() || manualTitleEn.trim(),
      titleKh: manualTitleKh.trim() || `${manualTitleEn.trim()} - ម៉ូតជប៉ុនទាន់សម័យ`,
      priceUsd: Number(manualPriceUsd) || 15,
      priceJpy: Number(manualPriceJpy) || Math.round(Number(manualPriceUsd) * 155),
      category: manualCategory,
      gender: manualGender,
      badge: manualBadge === 'NONE' ? null : manualBadge,
      isUniqloSynced: false,
      images: images,
      colors: manualColors.map(c => ({
        ...c,
        image: c.image || images[0]
      })),
      sizes: manualSizes,
      description: manualDescription,
      material: manualMaterial,
      rating: 4.9,
      reviews: 12
    };

    onUpdateProducts([newProd, ...products]);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast('✓ Custom product published successfully!');
    // Reset form
    setManualTitleEn('');
    setManualTitleJp('');
    setManualTitleKh('');
    setActiveTab('products');
  };

  // 3. Bulk Sync All Uniqlo Stock
  const handleSyncAllUniqloStock = async () => {
    const uniqloItems = products.filter(p => p.uniqloId);
    if (uniqloItems.length === 0) {
      showToast('No Uniqlo-synced items to update.');
      return;
    }

    setIsSyncingAll(true);
    let updatedCount = 0;

    try {
      const updatedList = [...products];

      for (let i = 0; i < updatedList.length; i++) {
        const item = updatedList[i];
        if (item.uniqloId) {
          try {
            const syncResult = await syncUniqloStock(item.uniqloId);
            if (syncResult && syncResult.skus) {
              const updatedSkus = { ...item.skus, ...syncResult.skus };
              const updatedSizes = (item.sizes || []).map(s => {
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

              updatedList[i] = {
                ...item,
                skus: updatedSkus,
                sizes: updatedSizes,
                lastSynced: syncResult.lastSynced
              };
              updatedCount++;
            }
          } catch (e) {
            console.warn(`Sync failed for item ${item.uniqloId}`, e);
          }
        }
      }

      onUpdateProducts(updatedList);
      showToast(`✓ Live stock synced for ${updatedCount} items from Japan!`);
    } finally {
      setIsSyncingAll(false);
    }
  };

  // 4. Delete Product
  const handleDeleteProduct = (prodId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onUpdateProducts(products.filter(p => p.id !== prodId));
      showToast('Product deleted.');
    }
  };

  // 5. Update Order Status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdateOrders(updated);
    showToast(`Order status updated to ${newStatus}`);
  };

  // 6. Delete Order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Delete this order record?')) {
      onUpdateOrders(orders.filter(o => o.id !== orderId));
      showToast('Order removed.');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.titleEn.toLowerCase().includes(q) ||
           p.titleJp.toLowerCase().includes(q) ||
           (p.uniqloId && p.uniqloId.toLowerCase().includes(q));
  });

  // Overview metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalUsd || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const uniqloSyncedCount = products.filter(p => p.isUniqloSynced).length;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1C1C1E] flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="bg-[#1C1C1E] text-white border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-[#EE1D23] text-white font-black text-xs px-2 py-1 rounded">
              ADMIN
            </span>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight">
                Tevy Store Japan Management Backend
              </h1>
              <p className="text-[10px] text-gray-400">
                GU & Uniqlo Japan Real-Time Personal Shopping Engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onExitAdmin}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 transition"
              title="Return to customer store view"
            >
              <Store className="w-4 h-4 text-yellow-400" />
              <span className="hidden sm:inline">View Storefront</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 transition"
              title="Log out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6 min-w-0">
        
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-2xl p-3 shadow-sm border border-gray-200 flex-shrink-0 flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders Management', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
            { id: 'products', label: 'Products & Stock', icon: Package, count: products.length },
            { id: 'banners', label: 'Banners & Scrolling News', icon: Megaphone, highlight: true },
            { id: 'manual_post', label: 'Manual Post Product', icon: FileEdit },
            { id: 'uniqlo', label: 'Post from Uniqlo JP', icon: PlusCircle },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#EE1D23] text-white shadow-sm'
                    : tab.highlight
                    ? 'text-blue-700 hover:bg-blue-50 bg-blue-50/50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>

                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && !tab.badge && (
                  <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Dynamic Admin View */}
        <main className="flex-1 min-w-0 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 min-h-[500px] overflow-hidden">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  Business Overview & Live Inventory
                </h2>
                <p className="text-xs text-gray-500">
                  Summary of incoming orders, catalog synchronization, and revenue
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Total Revenue
                  </span>
                  <p className="text-2xl font-black text-[#EE1D23]">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-green-700 font-bold mt-1 inline-block">
                    ✓ From {orders.length} placed orders
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Pending Orders
                  </span>
                  <p className="text-2xl font-black text-gray-900">
                    {pendingOrdersCount}
                  </p>
                  <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">
                    Needs confirmation / purchasing
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Active Catalog Items
                  </span>
                  <p className="text-2xl font-black text-gray-900">
                    {products.length}
                  </p>
                  <span className="text-[10px] text-gray-500 font-medium mt-1 inline-block">
                    GU & Uniqlo Japan
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Uniqlo Live Synced
                  </span>
                  <p className="text-2xl font-black text-red-600">
                    {uniqloSyncedCount}
                  </p>
                  <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">
                    ✓ Connected to Fast Retailing API
                  </span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-bold text-gray-800">
                    Store Catalog Engine: <span className="text-green-700 font-black">READY</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('manual_post')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow transition"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Manual Post Item</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('uniqlo')}
                    className="px-3 py-1.5 bg-[#ED0006] hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post from Uniqlo</span>
                  </button>
                  <button
                    onClick={handleSyncAllUniqloStock}
                    disabled={isSyncingAll}
                    className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-red-600' : ''}`} />
                    <span>Sync Stock</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">
                    Recent Incoming Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    View All Orders ›
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400 text-xs">
                    No orders placed yet. As customers order from Cambodia, they will show up here.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-700 font-extrabold text-[11px]">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50/80">
                            <td className="p-3 font-mono font-bold text-red-600">{ord.id}</td>
                            <td className="p-3 font-bold">{ord.customerName}</td>
                            <td className="p-3 text-gray-600">{ord.items.length} items</td>
                            <td className="p-3 font-black">${ord.totalUsd}</td>
                            <td className="p-3 uppercase font-bold text-gray-600">{ord.paymentMethod}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                ord.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                ord.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                ord.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900">
                    Orders Management
                  </h2>
                  <p className="text-xs text-gray-500">
                    Review and update Cambodian personal shopper orders
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {['ALL', 'Pending', 'Confirmed', 'In Japan Transit', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        orderFilter === st
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400 text-xs">
                  No orders match this filter.
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-700 font-extrabold text-[11px]">
                      <tr>
                        <th className="p-3">Order Code</th>
                        <th className="p-3">Customer & Phone</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/80">
                          <td className="p-3 font-mono font-bold text-red-600 whitespace-nowrap">
                            {ord.id}
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-gray-900">{ord.customerName}</p>
                            <p className="text-gray-500 text-[11px] flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{ord.phoneNumber}</span>
                            </p>
                          </td>
                          <td className="p-3 max-w-[150px] truncate">
                            <span className="font-medium text-gray-700">{ord.province}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold bg-gray-100 px-2 py-0.5 rounded">
                              {ord.items.length} items
                            </span>
                          </td>
                          <td className="p-3 font-black text-red-600">
                            ${ord.totalUsd}
                          </td>
                          <td className="p-3">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-red-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="In Japan Transit">In Japan Transit</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Order Detail Modal */}
              {selectedOrderDetails && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 animate-fadeIn">
                  <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-red-600">
                          {selectedOrderDetails.id}
                        </span>
                        <h3 className="text-base font-black text-gray-900">
                          Order Details
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrderDetails(null)}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-gray-50 p-3.5 rounded-2xl text-xs space-y-1.5">
                      <p><span className="font-bold text-gray-600">Customer:</span> {selectedOrderDetails.customerName}</p>
                      <p><span className="font-bold text-gray-600">Phone:</span> {selectedOrderDetails.phoneNumber}</p>
                      {selectedOrderDetails.telegramHandle && (
                        <p><span className="font-bold text-gray-600">Telegram:</span> {selectedOrderDetails.telegramHandle}</p>
                      )}
                      <p><span className="font-bold text-gray-600">Address:</span> {selectedOrderDetails.province}, {selectedOrderDetails.address}</p>
                      <p><span className="font-bold text-gray-600">Payment:</span> {selectedOrderDetails.paymentMethod.toUpperCase()}</p>
                      {selectedOrderDetails.notes && (
                        <p><span className="font-bold text-gray-600">Notes:</span> {selectedOrderDetails.notes}</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Purchased Items:</h4>
                      <div className="divide-y divide-gray-100 text-xs">
                        {selectedOrderDetails.items.map((it, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {it.image && (
                                <img src={it.image} alt="" className="w-10 h-12 object-cover rounded border" />
                              )}
                              <div>
                                <p className="font-bold text-gray-900">{it.titleEn}</p>
                                <p className="text-[11px] text-gray-500">Size: {it.size} | Color: {it.color}</p>
                              </div>
                            </div>
                            <span className="font-bold text-red-600">{it.quantity}x ${it.priceUsd}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center font-bold text-sm">
                      <span>Total Amount:</span>
                      <span className="text-red-600 text-lg font-black">${selectedOrderDetails.totalUsd}</span>
                    </div>

                    {selectedOrderDetails.phoneNumber && (
                      <a
                        href={`https://t.me/+855${selectedOrderDetails.phoneNumber.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Chat with Customer on Telegram</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900">
                    Products & Inventory ({products.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Manage store catalog, edit prices, or add new products
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('manual_post')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manual Post Product</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('uniqlo')}
                    className="px-3 py-2 bg-[#ED0006] hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post from Uniqlo</span>
                  </button>

                  <button
                    onClick={handleSyncAllUniqloStock}
                    disabled={isSyncingAll}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-red-600' : ''}`} />
                    <span>Sync Stock</span>
                  </button>
                </div>
              </div>

              {/* Product search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by title or code..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Product List Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-extrabold text-[11px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price USD</th>
                      <th className="p-3">Price JPY</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-12 object-cover rounded-lg border flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{p.titleEn}</p>
                            <p className="text-[11px] text-gray-500 truncate max-w-[200px]">{p.titleJp}</p>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-gray-600">{p.category}</td>
                        <td className="p-3 font-black text-red-600">${p.priceUsd}</td>
                        <td className="p-3 font-bold text-gray-600">¥{p.priceJpy?.toLocaleString()}</td>
                        <td className="p-3">
                          {p.isUniqloSynced ? (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                Uniqlo JP ({p.uniqloId})
                              </span>
                              {p.sourceUrl && (
                                <a
                                  href={p.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold inline-flex items-center gap-1 transition"
                                  title="View on Uniqlo Japan"
                                >
                                  <span>Uniqlo.com/jp</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Manual / GU
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] font-bold text-green-700">
                          {p.sizes ? `${p.sizes.filter(s => s.available !== false).length} sizes available` : 'In Stock'}
                        </td>
                        <td className="p-3 flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit Product Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 animate-fadeIn">
                  <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-5 border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h3 className="text-sm font-black text-gray-900">Edit Product: {editingProduct.titleEn}</h3>
                        {editingProduct.sourceUrl && (
                          <a
                            href={editingProduct.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold inline-flex items-center gap-1 transition"
                          >
                            <span>Uniqlo.com/jp</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price USD ($)</label>
                      <input
                        type="number"
                        value={editingProduct.priceUsd}
                        onChange={(e) => setEditingProduct({ ...editingProduct, priceUsd: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border rounded-xl font-bold text-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">English Title</label>
                      <input
                        type="text"
                        value={editingProduct.titleEn}
                        onChange={(e) => setEditingProduct({ ...editingProduct, titleEn: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Khmer Title</label>
                      <input
                        type="text"
                        value={editingProduct.titleKh || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, titleKh: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border rounded-xl"
                      />
                    </div>

                    <button
                      onClick={() => {
                        onUpdateProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
                        setEditingProduct(null);
                        showToast('✓ Product updated!');
                      }}
                      className="w-full py-2.5 bg-[#EE1D23] hover:bg-red-700 text-white font-bold rounded-xl text-xs transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MANUAL POST PRODUCT */}
          {activeTab === 'manual_post' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-blue-600 text-white font-black text-xs flex items-center justify-center rounded">
                    <FileEdit className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-black text-gray-900">
                    Manual Post Product (ការបង្ហោះទំនិញដោយផ្ទាល់)
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Publish custom products, GU items, or special items directly into your storefront catalog
                </p>
              </div>

              <form onSubmit={handlePublishManualProduct} className="space-y-4">
                
                {/* Titles Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vintage Wash Denim Jacket"
                      value={manualTitleEn}
                      onChange={(e) => setManualTitleEn(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Product Name (Japanese - Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. デニムジャケット"
                      value={manualTitleJp}
                      onChange={(e) => setManualTitleJp(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Khmer Name / Description (ឈ្មោះជាភាសាខ្មែរ)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. អាវខូវប៊យដៃវែងម៉ូតពេញនិយម នាំចូលពីជប៉ុន"
                      value={manualTitleKh}
                      onChange={(e) => setManualTitleKh(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pricing, Category, Gender, Badge */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Selling Price USD ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={manualPriceUsd}
                      onChange={(e) => {
                        const usd = Number(e.target.value);
                        setManualPriceUsd(usd);
                        setManualPriceJpy(Math.round(usd * 155));
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl font-black text-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Price in JPY (¥)
                    </label>
                    <input
                      type="number"
                      value={manualPriceJpy}
                      onChange={(e) => setManualPriceJpy(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl font-bold text-gray-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-white border border-gray-300 rounded-xl font-medium focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Gender *
                    </label>
                    <select
                      value={manualGender}
                      onChange={(e) => setManualGender(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-white border border-gray-300 rounded-xl font-medium focus:outline-none"
                    >
                      <option value="MEN">MEN (បុរស)</option>
                      <option value="WOMEN">WOMEN (នារី)</option>
                      <option value="KIDS">KIDS (កុមារ)</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Badge
                    </label>
                    <select
                      value={manualBadge}
                      onChange={(e) => setManualBadge(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-white border border-gray-300 rounded-xl font-medium focus:outline-none"
                    >
                      <option value="NEW">NEW (ទំនិញថ្មី)</option>
                      <option value="SALE">SALE (បញ្ចុះតម្លៃ)</option>
                      <option value="LIMITED">LIMITED (ម៉ូតមានកំណត់)</option>
                      <option value="NONE">None (គ្មាន Tag)</option>
                    </select>
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700">
                    រូបភាពទំនិញ (Product Image URLs) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="url"
                        required
                        placeholder="Main photo URL (https://...)"
                        value={manualMainImage}
                        onChange={(e) => setManualMainImage(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        placeholder="Additional gallery photo URL (optional)"
                        value={manualExtraImage}
                        onChange={(e) => setManualExtraImage(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {manualMainImage && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                        <img src={manualMainImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-gray-400">Photo preview</span>
                    </div>
                  )}
                </div>

                {/* Color Swatches Builder */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>Color Options (ពណ៌ទំនិញ)</span>
                    </span>
                  </div>

                  {/* Current Colors */}
                  <div className="flex flex-wrap gap-2">
                    {manualColors.map((col) => (
                      <span
                        key={col.id}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveManualColor(col.id)}
                          className="text-gray-400 hover:text-red-600 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add New Color Row */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. OLIVE (57)"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl flex-1 font-medium"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300"
                      title="Choose Color Hex"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualColor}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Color</span>
                    </button>
                  </div>
                </div>

                {/* Available Sizes Toggles */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700">
                    Available Sizes (ទំហំដែលមានស្តុក)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {manualSizes.map((s) => (
                      <button
                        type="button"
                        key={s.size}
                        onClick={() => handleToggleSizeAvailability(s.size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                          s.available
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                        }`}
                      >
                        {s.size} {s.available ? '✓' : '✕'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description & Material */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Material / Composition
                    </label>
                    <textarea
                      rows={2}
                      value={manualMaterial}
                      onChange={(e) => setManualMaterial(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Custom Product to Storefront (ផ្សាយទំនិញទៅកាន់ Website)</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: POST FROM UNIQLO JP */}
          {activeTab === 'uniqlo' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#ED0006] text-white font-black text-xs flex items-center justify-center rounded">
                    UQ
                  </span>
                  <h2 className="text-lg font-black text-gray-900">
                    Post from Uniqlo Japan (Official Source)
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paste any URL from <a href="https://www.uniqlo.com/jp/ja/" target="_blank" rel="noreferrer" className="text-red-600 font-bold underline">https://www.uniqlo.com/jp/ja/</a> to auto-fetch photos, colors, sizes and connect live stock.
                </p>
              </div>

              {/* Input section */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Uniqlo Japan Product Link or Product Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://www.uniqlo.com/jp/ja/products/E465185-000/00 or E465185-000"
                    value={uniqloUrl}
                    onChange={(e) => setUniqloUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                  />
                  <button
                    onClick={() => handleFetchUniqlo()}
                    disabled={isFetchingUniqlo}
                    className="px-5 py-2.5 bg-[#ED0006] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isFetchingUniqlo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Fetch Item</span>
                  </button>
                </div>
                {uniqloError && (
                  <p className="text-xs text-red-600 font-bold mt-1.5">
                    ⚠️ {uniqloError}
                  </p>
                )}
              </div>

              {/* 1-Click Popular Presets */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Quick 1-Click Presets from Uniqlo Japan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_UNIQLO_PRESETS.map((p) => (
                    <button
                      key={p.code}
                      onClick={() => {
                        setUniqloUrl(p.code);
                        handleFetchUniqlo(p.code);
                      }}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-700 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-red-500" />
                      <span>{p.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">({p.code})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fetched Product Preview & Publish */}
              {fetchedUniqloItem && (
                <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-gray-200 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Item retrieved from Uniqlo Japan API</span>
                    </span>
                    <a
                      href={fetchedUniqloItem.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Open on Uniqlo Japan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={fetchedUniqloItem.images[0]}
                      alt=""
                      className="w-24 h-32 object-cover rounded-xl border border-gray-300 flex-shrink-0"
                    />
                    <div className="space-y-1 text-xs">
                      <h3 className="text-sm font-black text-gray-900">{fetchedUniqloItem.titleJp}</h3>
                      <p><span className="text-gray-500 font-bold">Uniqlo Japan Price:</span> <span className="text-red-600 font-extrabold">¥{fetchedUniqloItem.priceJpy?.toLocaleString()} JPY</span></p>
                      <p><span className="text-gray-500 font-bold">Colors:</span> {fetchedUniqloItem.colors.length} colorways</p>
                      <p><span className="text-gray-500 font-bold">Sizes:</span> {fetchedUniqloItem.sizes.map(s => s.size).join(', ')}</p>
                    </div>
                  </div>

                  {/* Customization form before publishing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price USD ($)</label>
                      <input
                        type="number"
                        value={customPriceUsd}
                        onChange={(e) => setCustomPriceUsd(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl font-bold text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                      <select
                        value={customGender}
                        onChange={(e) => setCustomGender(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl font-bold"
                      >
                        <option value="MEN">MEN</option>
                        <option value="WOMEN">WOMEN</option>
                        <option value="KIDS">KIDS</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">English Title</label>
                      <input
                        type="text"
                        value={customTitleEn}
                        onChange={(e) => setCustomTitleEn(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Khmer Title</label>
                      <input
                        type="text"
                        value={customTitleKh}
                        onChange={(e) => setCustomTitleKh(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePublishFromUniqlo}
                    className="w-full py-3.5 bg-[#ED0006] hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Item to Customer Website</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: BANNERS & SCROLLING NEWS */}
          {activeTab === 'banners' && (
            <div className="space-y-4 animate-fadeIn w-full max-w-full min-w-0">
              {/* Header with Sub-Tabs Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span>Banners & Scrolling News Control</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage the top animated scrolling news ticker and the hero carousel banner
                  </p>
                </div>

                {/* Sub-Tabs switcher */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setBannerSubTab('news')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                      bannerSubTab === 'news'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span>Top Scrolling News</span>
                    <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                      {(settings.scrollingNews || []).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBannerSubTab('slides')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                      bannerSubTab === 'slides'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-red-600" />
                    <span>Hero Banner Slides</span>
                    <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                      {(settings.heroSlides || []).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* SUB-TAB 1: TOP SCROLLING NEWS TICKER */}
              {bannerSubTab === 'news' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 shadow-sm w-full min-w-0 max-w-full">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        <span>Top Continuous Scrolling News Ticker (អក្សររត់ខាងលើ)</span>
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Messages rotate continuously in an infinite loop across the storefront header
                      </p>
                    </div>
                    <button
                      onClick={onExitAdmin}
                      className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-700 transition"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview on Store</span>
                    </button>
                  </div>

                  {/* Live Ticker Preview */}
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-gray-200 w-full min-w-0 overflow-hidden">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Live Animation Preview
                    </span>
                    <div className="bg-[#FFF5F5] border border-red-100/70 h-8 text-xs text-red-600 font-medium flex items-center overflow-hidden relative rounded-lg select-none w-full min-w-0">
                      <div className="bg-[#FFF5F5] pl-2.5 pr-2 h-full z-10 flex items-center space-x-1.5 flex-shrink-0 border-r border-red-100">
                        <span className="w-3 h-2 inline-block bg-white border border-gray-300 rounded-[2px] relative overflow-hidden flex-shrink-0">
                          <span className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-red-600"></span>
                        </span>
                        <span className="font-black text-[10px] text-red-700 tracking-tight whitespace-nowrap">
                          NEWS 🇯🇵
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden relative cursor-default h-full flex items-center">
                        <div className="animate-marquee-infinite py-1 flex items-center w-max">
                          {((settings.scrollingNews && settings.scrollingNews.length > 0)
                            ? [...settings.scrollingNews, ...settings.scrollingNews]
                            : ['GU & UNIQLO JAPAN មកពីជប៉ុនផ្ទាល់ 🇯🇵 - Free Delivery']
                          ).map((msg, idx) => (
                            <span key={idx} className="inline-flex items-center mx-4 text-xs font-semibold text-gray-800 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 flex-shrink-0"></span>
                              <span>{msg}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add New Message Bar */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Add New News / Ticker Message
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNewsText}
                        onChange={(e) => setNewNewsText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNews();
                          }
                        }}
                        placeholder="បញ្ចូលអក្សររត់ ឬ ដំណឹងថ្មីៗ (e.g. ទទួលបានការបញ្ចុះតម្លៃពិសេស 20% សប្តាហ៍នេះ...)"
                        className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNews()}
                        className="px-3.5 py-2 bg-[#ED0006] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1 flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Preset chips */}
                    <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                      <span className="text-[10px] font-bold text-gray-400 mr-0.5">Quick Presets:</span>
                      {[
                        '🚚 Free Delivery ដឹកជញ្ជូនរហ័សទូទាំង ២៥ ខេត្ត-ក្រុង',
                        '🇯🇵 ធានាទំនិញសុទ្ធ 100% នាំចូលពីរោងចក្រ Fast Retailing ប្រទេសជប៉ុន',
                        '⚡ AIRism & GU Collection ថ្មីទើបមកដល់',
                        '🔥 Special Weekend Sale បញ្ចុះតម្លៃ 30% លើម៉ូតពេញនិយម'
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddNews(preset)}
                          className="text-[10px] bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 px-2 py-0.5 rounded-lg border border-gray-200 transition"
                        >
                          + {preset.slice(0, 26)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Ticker Messages List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-gray-700 block">
                      Current Ticker Messages ({settings.scrollingNews?.length || 0})
                    </span>

                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white max-h-[300px] overflow-y-auto">
                      {(settings.scrollingNews || []).map((newsItem, index) => (
                        <div
                          key={index}
                          className="p-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-xs font-medium text-gray-800 truncate">
                              {newsItem}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveNews(index, -1)}
                              disabled={index === 0}
                              className={`p-1 rounded-lg border ${
                                index === 0 ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 hover:bg-white'
                              }`}
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveNews(index, 1)}
                              disabled={index === (settings.scrollingNews?.length || 0) - 1}
                              className={`p-1 rounded-lg border ${
                                index === (settings.scrollingNews?.length || 0) - 1
                                  ? 'text-gray-300 border-gray-100'
                                  : 'text-gray-600 border-gray-200 hover:bg-white'
                              }`}
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNews(index)}
                              className="p-1 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition ml-0.5"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: HERO CAROUSEL BANNER SLIDES */}
              {bannerSubTab === 'slides' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 shadow-sm w-full min-w-0 max-w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-gray-100 pb-2.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-red-600" />
                        <span>Hero Banner Carousel Slides (ផ្ទាំងស្លាយធំមុខគេ)</span>
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Auto-rotates every 6s on customer storefront with swipe gestures
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAddSlide('promo')}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Promo Slide</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAddSlide('categories')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                        title="Add category quick cards selector slide"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>+ Category Slide</span>
                      </button>
                    </div>
                  </div>

                  {/* Slides List */}
                  <div className="space-y-2.5">
                    {(settings.heroSlides || []).map((slide, index) => {
                      const isSlideActive = slide.active !== false;
                      return (
                        <div
                          key={slide.id || index}
                          className={`p-3 rounded-xl border transition ${
                            isSlideActive
                              ? 'bg-[#FAF7F2] border-gray-200'
                              : 'bg-gray-50/70 border-gray-200 opacity-60'
                          } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
                        >
                          {/* Slide Left: Preview & Details */}
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-[10px] font-black text-gray-700 flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>

                            {/* Thumbnail */}
                            <div
                              className="w-16 h-12 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0 flex items-center justify-center relative shadow-inner"
                              style={{ backgroundColor: slide.bgColor || '#F4EFEA' }}
                            >
                              {slide.image ? (
                                <img
                                  src={slide.image}
                                  alt={slide.titleKh}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center p-0.5">
                                  <Layers className="w-4 h-4 mx-auto text-gray-500" />
                                  <span className="text-[7px] font-bold text-gray-600 block uppercase">
                                    Cards
                                  </span>
                                </div>
                              )}
                              <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[7px] font-black px-1 rounded">
                                {slide.type === 'categories' ? 'CATEGORIES' : 'PROMO'}
                              </span>
                            </div>

                            {/* Title & Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5">
                                {slide.badge && (
                                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                                    {slide.badge}
                                  </span>
                                )}
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {slide.type === 'categories' ? 'Category Selector' : 'Promo Image'}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-gray-900 truncate mt-0.5">
                                {slide.titleKh || slide.subtitleEn}
                              </h4>
                              <p className="text-[11px] text-gray-500 truncate">
                                {slide.subtitleEn}
                              </p>
                            </div>
                          </div>

                          {/* Slide Right: Controls */}
                          <div className="flex items-center space-x-1.5 self-end sm:self-center flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleSlideActive(slide.id)}
                              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                                isSlideActive
                                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                              }`}
                              title={isSlideActive ? 'Showing on storefront' : 'Disabled from storefront'}
                            >
                              {isSlideActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              <span>{isSlideActive ? 'Active' : 'Off'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleMoveSlide(index, -1)}
                              disabled={index === 0}
                              className={`p-1.5 rounded-lg border ${
                                index === 0 ? 'text-gray-300 border-gray-100' : 'text-gray-600 border-gray-200 hover:bg-white'
                              }`}
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSlide(index, 1)}
                              disabled={index === (settings.heroSlides?.length || 0) - 1}
                              className={`p-1.5 rounded-lg border ${
                                index === (settings.heroSlides?.length || 0) - 1
                                  ? 'text-gray-300 border-gray-100'
                                  : 'text-gray-600 border-gray-200 hover:bg-white'
                              }`}
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditSlide(slide)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                              title="Edit Slide"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSlide(slide.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SLIDE EDIT / ADD MODAL */}
              {(isAddingSlide || editingSlideId) && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 space-y-3.5 my-6 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-red-600" />
                          <span>{editingSlideId ? 'Edit Hero Banner Slide' : 'Create New Hero Banner Slide'}</span>
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          Customize banner appearance, imagery, and filter target
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingSlide(false);
                          setEditingSlideId(null);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveSlide} className="space-y-3">
                      {/* Slide Type Selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Slide Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSlideForm({ ...slideForm, type: 'promo' })}
                            className={`p-2 rounded-xl border text-xs font-bold text-left transition flex items-center space-x-2 ${
                              slideForm.type === 'promo'
                                ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <ImageIcon className="w-4 h-4 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-xs">Promo Image Slide</div>
                              <div className="text-[9px] text-gray-400 font-normal">Campaign image & CTA</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSlideForm({ ...slideForm, type: 'categories' })}
                            className={`p-2 rounded-xl border text-xs font-bold text-left transition flex items-center space-x-2 ${
                              slideForm.type === 'categories'
                                ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Layers className="w-4 h-4 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-xs">Category Quick Cards</div>
                              <div className="text-[9px] text-gray-400 font-normal">6 category icons</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Badge Text */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                          Badge Label (ស្លាកសម្គាល់)
                        </label>
                        <input
                          type="text"
                          value={slideForm.badge || ''}
                          onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                          placeholder="e.g. SPRING / SUMMER 2026, MEN, SALE 30%"
                          className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold"
                        />
                      </div>

                      {/* Khmer Title */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                          Khmer Title (ចំណងជើងភាសាខ្មែរ)
                        </label>
                        <input
                          type="text"
                          value={slideForm.titleKh || ''}
                          onChange={(e) => setSlideForm({ ...slideForm, titleKh: e.target.value })}
                          placeholder="e.g. ម៉ូតថ្មីទើបមកដល់ UNIQLO AIRism & GU"
                          className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-medium"
                          required
                        />
                      </div>

                      {/* English Subtitle */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                          English Subtitle (ចំណងជើងរងអង់គ្លេស)
                        </label>
                        <input
                          type="text"
                          value={slideForm.subtitleEn || ''}
                          onChange={(e) => setSlideForm({ ...slideForm, subtitleEn: e.target.value })}
                          placeholder="e.g. New Arrivals 2026 Collection Direct from Tokyo"
                          className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl"
                        />
                      </div>

                      {/* Image URL & Presets (if promo) */}
                      {slideForm.type === 'promo' && (
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-gray-700">
                            Banner Image URL
                          </label>
                          <input
                            type="url"
                            value={slideForm.image || ''}
                            onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-mono text-[11px]"
                            required
                          />

                          {/* Quick Photo Presets */}
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-[10px] font-bold text-gray-400">Presets:</span>
                            {[
                              { label: 'Tokyo Store', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80' },
                              { label: 'Weekend Sale', url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80' },
                              { label: 'Denim & Pants', url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=80' }
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSlideForm({ ...slideForm, image: preset.url })}
                                className="text-[9px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Background Color Swatches */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Slide Background Tone
                        </label>
                        <div className="flex items-center space-x-1.5">
                          {[
                            { name: 'Warm Cream', hex: '#F4EFEA' },
                            { name: 'Linen Sand', hex: '#EBE7E0' },
                            { name: 'Soft Rose', hex: '#F5EBE6' },
                            { name: 'Cool Sky', hex: '#EBF3FA' },
                            { name: 'Pure White', hex: '#FFFFFF' }
                          ].map((tone, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSlideForm({ ...slideForm, bgColor: tone.hex })}
                              className={`w-6 h-6 rounded-full border-2 transition ${
                                slideForm.bgColor === tone.hex ? 'border-red-600 scale-110 shadow-sm' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: tone.hex }}
                              title={tone.name}
                            />
                          ))}
                          <input
                            type="text"
                            value={slideForm.bgColor || '#F4EFEA'}
                            onChange={(e) => setSlideForm({ ...slideForm, bgColor: e.target.value })}
                            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-lg text-center font-mono ml-1"
                          />
                        </div>
                      </div>

                      {/* CTA Button Settings */}
                      {slideForm.type === 'promo' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                              Button Label (CTA)
                            </label>
                            <input
                              type="text"
                              value={slideForm.buttonText || ''}
                              onChange={(e) => setSlideForm({ ...slideForm, buttonText: e.target.value })}
                              placeholder="e.g. មើលម៉ូតថ្មីៗ (Shop New)"
                              className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                              Button Action Filter
                            </label>
                            <select
                              value={slideForm.buttonFilter || 'all'}
                              onChange={(e) => setSlideForm({ ...slideForm, buttonFilter: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold"
                            >
                              <option value="all">Show All Products</option>
                              <option value="new">Filter "NEW" Badge</option>
                              <option value="sale">Filter "SALE" Badge</option>
                              <option value="popular">Filter "POPULAR"</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Submit Actions */}
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingSlide(false);
                            setEditingSlideId(null);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#ED0006] hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{editingSlideId ? 'Save Changes' : 'Create Slide'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-fadeIn max-w-xl">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  Storefront Settings & Exchange Rates
                </h2>
                <p className="text-xs text-gray-500">
                  Configure announcement banner, currency rates, and personal shopping rules
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Top Announcement Notice (Khmer / English)
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText || ''}
                    onChange={(e) => onUpdateSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl font-medium"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">This text appears at the very top banner of the website.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      JPY / USD Exchange Rate
                    </label>
                    <input
                      type="number"
                      value={settings.exchangeRate || 155}
                      onChange={(e) => onUpdateSettings({ ...settings, exchangeRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">e.g. 155 Yen = $1 USD</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Default Profit Markup (%)
                    </label>
                    <input
                      type="number"
                      value={settings.markupPercent || 20}
                      onChange={(e) => onUpdateSettings({ ...settings, markupPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">e.g. 20% margin on imports</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Telegram Admin Handle for Orders
                  </label>
                  <input
                    type="text"
                    value={settings.telegramAdmin || ''}
                    onChange={(e) => onUpdateSettings({ ...settings, telegramAdmin: e.target.value })}
                    placeholder="@tevy_shopping_admin"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl font-medium"
                  />
                </div>

                <button
                  onClick={() => showToast('✓ Settings saved successfully!')}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
