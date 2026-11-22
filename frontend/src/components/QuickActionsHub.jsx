import { useState, useEffect, useRef } from 'react';
import { FiPhone, FiShoppingBag, FiX, FiChevronRight } from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';
import ChatWidget from './ChatWidget';
import QuickOrderButton from './QuickOrderButton';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

const CALL_NUMBER = '7708032726';

/**
 * QuickActionsHub - Unified Floating Action Center
 * Combines 3 core features into one non-overlapping, accessible floating hub:
 * 1. 👨‍🍳 Mathina AI Chef (Culinary recipes, cut advice, cooking temps & order help)
 * 2. 🛍️ Quick Order (Custom cut selector with instant WhatsApp & phone builder)
 * 3. 📞 Call Directly (Instant direct phone call to store owner Shajan)
 */
const QuickActionsHub = () => {
  const { t, isRTL } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const hubRef = useRef(null);

  // Listen for open-mathina-chat (e.g. from top Navbar or links)
  useEffect(() => {
    const handleOpenChat = () => {
      setMenuOpen(false);
      setOrderModalOpen(false);
      setChatOpen(true);
    };
    window.addEventListener('open-mathina-chat', handleOpenChat);
    return () => window.removeEventListener('open-mathina-chat', handleOpenChat);
  }, []);

  // Listen for open-quick-order
  useEffect(() => {
    const handleOpenOrder = () => {
      setMenuOpen(false);
      setChatOpen(false);
      setOrderModalOpen(true);
    };
    window.addEventListener('open-quick-order', handleOpenOrder);
    return () => window.removeEventListener('open-quick-order', handleOpenOrder);
  }, []);

  // Dismiss menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hubRef.current && !hubRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleOpenChef = () => {
    setMenuOpen(false);
    setOrderModalOpen(false);
    setChatOpen(true);
  };

  const handleOpenOrder = () => {
    setMenuOpen(false);
    setChatOpen(false);
    setOrderModalOpen(true);
  };

  const handleCallDirectly = () => {
    setMenuOpen(false);
    window.location.href = `tel:+91${CALL_NUMBER}`;
  };

  return (
    <>
      {/* ── Mathina AI Chef Chat Window ── */}
      <ChatWidget
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        hideFloatingButton={true}
      />

      {/* ── Quick Order Modal (WhatsApp / Phone Builder) ── */}
      <QuickOrderButton
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        hideFloatingButton={true}
      />

      {/* ── Unified Floating Action Button & Speed Dial ── */}
      {/* Only show when AI Chef chat window is closed to maintain 100% clean view */}
      {!chatOpen && (
        <div ref={hubRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
          
          {/* Backdrop blur overlay for mobile focus */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-black/25 backdrop-blur-xs z-40 sm:hidden"
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Speed Dial Popup Menu */}
          {menuOpen && (
            <div
              dir={isRTL ? 'rtl' : 'ltr'}
              className="relative z-50 mb-3 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-3 sm:p-3.5 space-y-2 sm:space-y-2.5 transition-all duration-200 ease-out animate-fade-in"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {t('quick_hub_title', 'Mathina Quick Hub')}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {t('instant_access', 'Instant Access')}
                </span>
              </div>

              {/* 1. 👨‍🍳 Mathina AI Chef */}
              <button
                type="button"
                onClick={handleOpenChef}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 hover:from-rose-100 hover:to-orange-100 border border-rose-200/80 transition-all text-left group shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-108 transition-transform">
                  <GiChickenOven className="w-6 h-6 text-amber-100" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors flex items-center gap-1">
                      Mathina AI Chef
                    </span>
                    <span className="text-[10px] font-extrabold bg-gradient-to-r from-red-600 to-amber-600 text-white px-1.5 py-0.5 rounded-full">
                      AI 👨‍🍳
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    {t('ai_chef_subtitle', 'Recipes, cuts, cooking temps & orders')}
                  </p>
                </div>
                <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 2. 🛍️ Quick Order */}
              <button
                type="button"
                onClick={handleOpenOrder}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/80 transition-all text-left group shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-600 to-teal-700 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-108 transition-transform">
                  <FiShoppingBag className="w-5 h-5 text-emerald-100" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors">
                      {t('quick_order', 'Quick Order')}
                    </span>
                    <span className="text-[10px] font-bold bg-green-600 text-white px-1.5 py-0.5 rounded-full">
                      WhatsApp ⚡
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    {t('quick_order_subtitle', 'Pick custom cuts & weights in 10s')}
                  </p>
                </div>
                <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 3. 📞 Call Directly */}
              <a
                href={`tel:+91${CALL_NUMBER}`}
                onClick={handleCallDirectly}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 transition-all text-left group shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-white text-emerald-700 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-108 transition-transform">
                  <FiPhone className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {t('call_directly', 'Call Directly')}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      6 AM – 10 PM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    +91 {CALL_NUMBER} · Owner: Shajan
                  </p>
                </div>
                <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* Language Switcher in Quick Hub */}
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50/90 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  🌐 {t('lang_select_title', 'Language / மொழி')}:
                </span>
                <LanguageSelector compact={false} />
              </div>

              {/* Footer info */}
              <div className="pt-1 text-center">
                <p className="text-[10px] text-slate-400">
                  🐔 Mathina Chicken Center · {t('fresh_halal_certified', '100% Fresh & Halal Certified')}
                </p>
              </div>
            </div>
          )}

          {/* Master Trigger FAB Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className={`relative z-50 flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 font-bold border-2 border-white/80 ring-4 cursor-pointer select-none ${
              menuOpen
                ? 'bg-slate-900 text-white ring-slate-400/40 scale-95 shadow-lg'
                : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white ring-emerald-400/30 hover:scale-105 shadow-emerald-600/40'
            }`}
            aria-label="Toggle Mathina Quick Actions Hub"
            title="Mathina Quick Actions Hub"
          >
            {menuOpen ? (
              <>
                <FiX className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
                <span className="text-xs sm:text-sm tracking-wide font-bold">Close</span>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  <GiChickenOven className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-800 animate-pulse"></span>
                </div>
                <span className="text-xs sm:text-sm tracking-wide font-extrabold flex items-center gap-1.5">
                  Quick Help & Order
                </span>
                <span className="hidden sm:inline-flex text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">
                  3 in 1
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default QuickActionsHub;
