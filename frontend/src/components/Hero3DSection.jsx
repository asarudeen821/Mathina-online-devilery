import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, FiShield, FiStar, FiZap, 
  FiShoppingBag, FiCheck, FiClock, FiActivity
} from 'react-icons/fi';
import { GiChickenOven, GiMeatCleaver, GiCookingPot, GiFireBowl, GiKnifeFork } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

/**
 * 4 Signature Cuts with both RAW BUTCHER CUT and CHEF COOKED DISH views
 */
const SIGNATURE_CUTS = [
  {
    id: 'biryani-cut',
    name: 'Big Curry / Biryani Cut',
    tamil: 'பிரியாணி / பெரிய கறி வெட்டு',
    tag: 'Dum Biryani Master',
    idealDish: 'Ambur & Dindigul Dum Biryani',
    cookTime: '25-30 mins',
    texture: 'Marrow-Juicy Bone-in',
    rawImage: '/images/products/chicken-breast-boneless.png',
    cookedImage: '/images/products/whole-chicken-seasoned.png',
    dishName: 'Authentic Dum Biryani Feast',
    dishDesc: 'Slow-cooked with aged seeraga samba rice, saffron, and aromatic Chettinad spices.',
    rates: { '500g': 120, '1 kg': 240, '2 kg': 480 },
    servings: { '500g': 'Serves 2', '1 kg': 'Serves 4–5 Family', '2 kg': 'Serves 8–10 Party' },
    rating: 4.9,
    ordersToday: '180+ sold',
    protein: '32g protein / 200g',
    link: '/products?category=chicken-cuts&cut=biryani-cut',
    flavorMood: 'from-amber-400/25 via-orange-400/20 to-red-500/10',
  },
  {
    id: 'butterfly-cut',
    name: 'Butterfly Cut / Breast Fillet',
    tamil: 'பட்டாம்பூச்சி கட் (ஜிம் டயட்)',
    tag: 'Gym & Lean Fitness',
    idealDish: 'Lemon Herb Grilled Chicken',
    cookTime: '10-12 mins',
    texture: 'Zero-Fat Pure Muscle',
    rawImage: '/images/products/chicken-breast-butterfly.png',
    cookedImage: '/images/cooking-methods/pan-fry.png',
    dishName: 'Sizzling Lemon Herb Grill',
    dishDesc: 'Pan-seared in cold-pressed olive oil, cracked peppercorns, and fresh garden rosemary.',
    rates: { '500g': 160, '1 kg': 320, '2 kg': 640 },
    servings: { '500g': '2 Healthy Portions', '1 kg': '4–5 Meal Prep Packs', '2 kg': '8–10 Fitness Meals' },
    rating: 5.0,
    ordersToday: '120+ sold',
    protein: '48g protein / 200g',
    link: '/products?category=chicken-cuts&cut=butterfly-cut',
    flavorMood: 'from-emerald-400/25 via-teal-400/20 to-amber-500/10',
  },
  {
    id: 'dragon-cut',
    name: 'Dragon Cut Strips',
    tamil: 'டிராகன் கட் ஸ்ட்ரிப்ஸ்',
    tag: 'Indo-Chinese Special',
    idealDish: 'Spicy Wok Dragon Chicken',
    cookTime: '12-15 mins',
    texture: 'Flash-Marinade Strips',
    rawImage: '/images/products/chicken-breast-strips.png',
    cookedImage: '/images/products/chicken-leg-marinated.png',
    dishName: 'Fiery Wok-Glazed Dragon Chicken',
    dishDesc: 'Tossed in hot garlic sauce, roasted cashews, bell peppers, and scallions over high flame.',
    rates: { '500g': 165, '1 kg': 330, '2 kg': 660 },
    servings: { '500g': 'Appetizer for 2', '1 kg': 'Party Platter for 5', '2 kg': 'Feast for 10' },
    rating: 4.8,
    ordersToday: '95+ sold',
    protein: '38g protein / 200g',
    link: '/products?category=chicken-cuts&cut=dragon-cut',
    flavorMood: 'from-rose-500/25 via-red-500/20 to-amber-500/10',
  },
  {
    id: 'lollipop',
    name: 'Chicken Lollipop (Frenched)',
    tamil: 'சிக்கன் லாலிபாப்',
    tag: 'Crispy Starter Fav',
    idealDish: 'Crispy 65 & Party Starters',
    cookTime: '12-15 mins',
    texture: 'Crisp Frenched Drumette',
    rawImage: '/images/products/chicken-lollipop-drumstick.png',
    cookedImage: '/images/products/chicken-lollipop-main.jpg',
    dishName: 'Crunchy Chicken 65 Lollipops',
    dishDesc: 'Frenched drumettes dipped in spiced batter, fried till blistered golden, served with mint dip.',
    rates: { '500g': 140, '1 kg': 280, '2 kg': 560 },
    servings: { '500g': '6–7 Pieces', '1 kg': '12–14 Pieces', '2 kg': '24–28 Party Pieces' },
    rating: 4.9,
    ordersToday: '140+ sold',
    protein: '30g protein / 200g',
    link: '/products?category=chicken-cuts&cut=lollipop',
    flavorMood: 'from-amber-500/30 via-orange-400/20 to-red-400/10',
  },
];

const WEIGHT_OPTIONS = ['500g', '1 kg', '2 kg'];

const Hero3DSection = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedCutIndex, setSelectedCutIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('1 kg');
  const [viewMode, setViewMode] = useState('cooked'); // 'raw' or 'cooked'

  const activeCut = SIGNATURE_CUTS[selectedCutIndex];
  const activePrice = activeCut.rates[selectedWeight] || activeCut.rates['1 kg'];
  const activeServing = activeCut.servings[selectedWeight] || 'Serves 4–5';

  const handleAddToCart = () => {
    const item = {
      _id: `hero-${activeCut.id}`,
      name: `${activeCut.name} (${selectedWeight})`,
      category: 'chicken-cuts',
      price: activePrice,
      image: activeCut.rawImage,
      stock: 50,
    };
    addToCart(item, 1, { weight: selectedWeight, price: activePrice });
    toast.success(`🛒 Added ${activeCut.name} (${selectedWeight}) to cart!`, {
      icon: '🍗',
      duration: 2500,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const openAIChef = () => {
    window.dispatchEvent(new CustomEvent('open-mathina-chat'));
  };

  const openQuickOrder = () => {
    window.dispatchEvent(new CustomEvent('open-quick-order'));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-rose-50/40 text-slate-900 py-10 lg:py-16 border-b border-amber-100/70">
      {/* ══════ Ambient Radiant Lighting Orbs ══════ */}
      <div 
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-300/25 via-orange-400/15 to-transparent blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-rose-400/15 via-red-500/10 to-transparent blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Culinary Pattern Grid */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.10] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ════════════ LEFT COLUMN: Brand Story & Conversion Tools (col-span-7) ════════════ */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Counter & Freshness Trust Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-800 font-extrabold uppercase tracking-wide text-[11px]">
                100% Halal Certified
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-slate-700 flex items-center gap-1 font-medium">
                <FiClock className="w-3.5 h-3.5 text-amber-600" />
                Fresh Cut Today at 6:00 AM
              </span>
              <span className="hidden sm:inline text-emerald-300">•</span>
              <span className="hidden sm:inline text-emerald-700 font-bold">
                Cuddalore OT Counter Open
              </span>
            </div>

            {/* Headline with Culinary Typography */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] sm:leading-[1.08] text-slate-900">
                Mathina Chicken Center
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                Cuddalore's Trusted Farm-Fresh Poultry & Butchery
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Experience the pinnacle of fresh butchery. 11+ chef-crafted precision cuts processed directly from healthy, antibiotic-free farms. Cold-chain chilled at 0°C–4°C and delivered directly to your doorstep in 30 minutes.
            </p>

            {/* 3 Gourmet Trust Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 max-w-xl">
              <div className="bg-white/95 backdrop-blur-md border border-amber-200/70 shadow-xs hover:shadow-md rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center sm:text-left transition-all duration-200">
                <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 text-red-600 font-bold text-xs sm:text-sm mb-0.5">
                  <GiMeatCleaver className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                  <span>11+ Cuts</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-tight">
                  Biryani, Butterfly & more
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-emerald-200/70 shadow-xs hover:shadow-md rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center sm:text-left transition-all duration-200">
                <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 text-emerald-600 font-bold text-xs sm:text-sm mb-0.5">
                  <FiShield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  <span>100% Halal</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-tight">
                  Certified farm batch traceability
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-orange-200/70 shadow-xs hover:shadow-md rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center sm:text-left transition-all duration-200">
                <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 text-amber-600 font-bold text-xs sm:text-sm mb-0.5">
                  <FiZap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  <span>Fast Express</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-tight">
                  Direct dispatch from shop counter
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2">
              <Link
                to="/products"
                className="btn-shimmer px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-red-500/25 hover:shadow-red-500/45 transition-all duration-300 hover:scale-102 cursor-pointer"
              >
                <span>Browse 11+ Fresh Cuts</span>
                <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={openAIChef}
                className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-amber-400 flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group"
                title="Ask Mathina AI Chef"
              >
                <GiChickenOven className="w-4 h-4 text-red-500 group-hover:scale-115 transition-transform" />
                <span>AI Chef Assistant 👨‍🍳</span>
              </button>

              <button
                type="button"
                onClick={openQuickOrder}
                className="px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-transparent hover:border-emerald-200"
                title="Quick Order Builder"
              >
                <FiShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Quick Order (3 in 1)</span>
              </button>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <div className="flex text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-slate-900 text-sm">4.9 / 5.0</span>
              <span className="text-slate-300">|</span>
              <span className="font-medium text-slate-600">Trusted by 1,200+ families & chefs in Cuddalore</span>
            </div>

          </div>


          {/* ════════════ RIGHT COLUMN: Fluid Culinary Showcase (No 3D Tilt) ════════════ */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            
            {/* Seamless Artisan Showcase Container */}
            <div className="relative w-full max-w-lg mx-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-amber-200/80 p-4 sm:p-6 shadow-xl shadow-amber-900/10 transition-all duration-300">
              
              {/* ── Top Header: Dual State Switcher & Cold-Chain Badge ── */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 border-b border-slate-100">
                {/* 100% Halal Verified Pill */}
                <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-2xs">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <FiShield className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                  <span>Halal Batch Verified</span>
                </div>

                {/* Cold Chain Pill */}
                <div className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 border border-cyan-200/80 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold">
                  <span>❄️ 2.4°C Chilled</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium">Never Frozen</span>
                </div>
              </div>

              {/* ── Interactive Kitchen Slider (Raw Cut ⟷ Cooked Dish) ── */}
              <div className="my-3 sm:my-3.5 bg-slate-100/90 p-1 rounded-2xl flex items-center relative">
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer ${
                    viewMode === 'raw'
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <GiMeatCleaver className={`w-3.5 h-3.5 ${viewMode === 'raw' ? 'text-red-600' : 'text-slate-400'}`} />
                  <span><span className="hidden xs:inline">Fresh </span>Raw Cut</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('cooked')}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer ${
                    viewMode === 'cooked'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <GiCookingPot className={`w-3.5 h-3.5 ${viewMode === 'cooked' ? 'text-amber-200' : 'text-slate-400'}`} />
                  <span><span className="hidden xs:inline">Chef </span>Cooked Dish</span>
                </button>
              </div>

              {/* ── Fluid Center Stage with Pulsating Ambient Savor Aura ── */}
              <div className="relative h-60 sm:h-64 w-full flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-white border border-amber-100">
                
                {/* Dynamic Radial Aura Pulse */}
                <div 
                  className={`absolute w-52 h-52 rounded-full bg-gradient-to-tr ${activeCut.flavorMood} blur-2xl animate-culinary-aura pointer-events-none`}
                  aria-hidden="true"
                />

                {/* Sizzle Steam Indicator (When Cooked) */}
                {viewMode === 'cooked' && (
                  <div className="absolute top-2.5 right-3 inline-flex items-center gap-1 bg-amber-500/10 border border-amber-300 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold animate-steam-wisp pointer-events-none">
                    <GiFireBowl className="w-3 h-3 text-amber-600" />
                    <span>Aromatic Sizzle</span>
                  </div>
                )}

                {/* Center Image with Fluid Organic Floating Animation */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-3 animate-float-gentle">
                  <img
                    key={`${activeCut.id}-${viewMode}`}
                    src={viewMode === 'cooked' ? activeCut.cookedImage : activeCut.rawImage}
                    alt={activeCut.name}
                    className="max-h-52 sm:max-h-56 w-auto object-contain culinary-plate-shadow rounded-2xl transition-all duration-300 transform hover:scale-105"
                  />
                </div>

                {/* Macro Badge (Bottom-Left) */}
                <div className="absolute bottom-2.5 left-3 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                  <FiActivity className="w-3 h-3 text-emerald-600" />
                  <span>{activeCut.protein}</span>
                </div>

                {/* Live Sold Volume (Bottom-Right) */}
                <div className="absolute bottom-2.5 right-3 bg-white/95 backdrop-blur-md border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-bold text-amber-800 shadow-sm flex items-center gap-1">
                  <FiZap className="w-3 h-3 text-amber-500" />
                  <span>{activeCut.ordersToday}</span>
                </div>
              </div>

              {/* ── Cut Information & Price Banner ── */}
              <div className="pt-3 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      {activeCut.name}
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold flex items-center gap-1 mt-0.5">
                      <GiCookingPot className="w-3.5 h-3.5 text-amber-600" />
                      <span>{viewMode === 'cooked' ? activeCut.dishName : `Best For: ${activeCut.idealDish}`}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-red-600 block leading-tight">
                      ₹{activePrice}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      for {selectedWeight}
                    </span>
                  </div>
                </div>

                {/* Culinary Note */}
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {viewMode === 'cooked' ? activeCut.dishDesc : `${activeCut.texture} · Freshly hand-cut on your order.`}
                </p>
              </div>

              {/* ── Weight Selector with Live Servings ── */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Select Quantity:</span>
                  <span className="text-[10px] text-emerald-700 font-bold">{activeServing}</span>
                </div>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl gap-1">
                  {WEIGHT_OPTIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                        selectedWeight === w
                          ? 'bg-red-600 text-white shadow-xs scale-102'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 4 Signature Cuts Switcher Dock ── */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 text-left">
                  Preview 11+ Fresh Cuts:
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {SIGNATURE_CUTS.map((cut, idx) => {
                    const isSelected = selectedCutIndex === idx;
                    return (
                      <button
                        key={cut.id}
                        type="button"
                        onClick={() => setSelectedCutIndex(idx)}
                        className={`p-1.5 rounded-xl text-center transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? 'bg-gradient-to-b from-red-600 to-rose-700 text-white border-red-500 shadow-md ring-2 ring-red-400/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-[11px] font-bold truncate">
                          {cut.name.split(' ')[0]}
                        </span>
                        <span className={`block text-[10px] ${isSelected ? 'text-amber-200' : 'text-slate-500'} font-semibold`}>
                          ₹{cut.rates['1 kg']}/kg
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── 1-Click Direct Order Actions ── */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer group hover:scale-101 active:scale-98"
                >
                  <FiShoppingBag className="w-3.5 h-3.5 text-amber-300 group-hover:scale-115 transition-transform" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-2.5 px-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-red-500/25 transition-all duration-200 cursor-pointer group hover:scale-101 active:scale-98"
                >
                  <span>Buy Now (₹{activePrice})</span>
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero3DSection;
