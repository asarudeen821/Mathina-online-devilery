import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FiShoppingCart, FiUser, FiMenu, FiX, FiHome, FiPackage, 
  FiAward, FiGrid, FiMessageCircle, FiChevronDown, FiBell, 
  FiSettings, FiLogOut 
} from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';
import { useState } from 'react';
import NotificationBell from './NotificationBell';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const openChat = () => {
    const chatEvent = new CustomEvent('open-mathina-chat');
    window.dispatchEvent(chatEvent);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('nav_home', 'Home'), icon: FiHome },
    { to: '/products', label: t('nav_products', 'Products'), icon: FiPackage },
    { to: '/subscriptions', label: t('nav_plans', 'Plans'), icon: FiAward },
    { to: '/qr-scan', label: t('nav_qr_scan', 'QR Scan'), icon: FiGrid },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/prices', label: 'Pricing' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-[99999] shadow-sm pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* ═══════ LEFT: Logo & Primary Nav ═══════ */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 p-2.5 rounded-xl shadow-md group-hover:shadow-red-500/25 group-hover:scale-105 transition-all duration-300 ring-2 ring-red-100">
                <GiChickenOven className="w-5 h-5 text-white transform group-hover:rotate-6 transition-transform" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 bg-clip-text text-transparent block leading-tight tracking-tight">
                  Mathina Chicken Center
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Halal & Fresh Daily
                </span>
              </div>
            </Link>

            {/* Desktop & Tablet Navigation: Visible on all screens >= 768px */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ═══════ RIGHT: Actions ═══════ */}
          <div className="flex items-center gap-3">
            
            {/* Mathina AI Chef Button */}
            <button
              onClick={openChat}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              title="Open Mathina AI Chef"
            >
              <GiChickenOven className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
              <span>AI Chef 👨‍🍳</span>
            </button>

            {/* Multi-Language Option Button */}
            <LanguageSelector />

            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                {!isAdmin && (
                  <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <FiShoppingCart className="w-5 h-5" />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>
                )}

                {/* Notifications */}
                <div className="hidden md:block">
                  <NotificationBell />
                </div>

                {/* Admin Quick Links */}
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <FiSettings className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block max-w-[120px] truncate">{user?.name}</span>
                    <FiChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                        <div className="px-3 py-2 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>

                        {!isAdmin ? (
                          <>
                            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                              <FiUser className="w-4 h-4" /> Profile
                            </Link>
                            <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                              <FiPackage className="w-4 h-4" /> My Orders
                            </Link>
                            <Link to="/ai-recipes" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                              <GiChickenOven className="w-4 h-4" /> AI Recipes
                            </Link>
                          </>
                        ) : (
                          <>
                            {adminLinks.map((link) => (
                              <Link key={link.to} to={link.to} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                                {link.label}
                              </Link>
                            ))}
                          </>
                        )}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FiLogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary btn-sm whitespace-nowrap">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════ MOBILE MENU ═══════ */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay for mobile menu */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 md:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
              {/* Multi-Language Selector for Mobile */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg mb-2 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-700">Language / மொழி:</span>
                <LanguageSelector compact={false} />
              </div>

              {/* Mathina AI Chef */}
              <button
                onClick={openChat}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <GiChickenOven className="w-5 h-5 text-red-600" />
                Mathina AI Chef 👨‍🍳
              </button>

              {/* Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <link.icon className="w-5 h-5 text-slate-400" />
                  {link.label}
                </Link>
              ))}

              {/* Auth Links */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    {isAdmin ? (
                      adminLinks.map((link) => (
                        <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                          {link.label}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                          <FiShoppingCart className="w-5 h-5 text-slate-400" /> Cart ({getCartCount()})
                        </Link>
                        <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                          <FiPackage className="w-5 h-5 text-slate-400" /> Orders
                        </Link>
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                          <FiUser className="w-5 h-5 text-slate-400" /> Profile
                        </Link>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                  >
                    <FiLogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-3 py-3 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center btn-primary btn-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
