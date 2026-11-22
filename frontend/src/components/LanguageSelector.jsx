import { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiChevronDown, FiCheck } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

/**
 * LanguageSelector Component
 * Multi-Language option button and dropdown menu supporting:
 * - 🇬🇧 English
 * - 🇮🇳 தமிழ் (Tamil)
 * - 🇮🇳 മലയാളം (Malayalam)
 * - 🇮🇳 हिन्दी (Hindi)
 * - 🇵🇰/🇮🇳 اردو (Urdu - RTL)
 * - 🇸🇦 العربية (Arabic - RTL)
 */
const LanguageSelector = ({ compact = false, className = '', dropUp = false }) => {
  const { currentLanguage, setLanguage, activeLangObj, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelectLanguage = (lang) => {
    if (lang.code === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setLanguage(lang.code);
    setIsOpen(false);
    toast.success(`🌐 Language changed to ${lang.nativeName} (${lang.name})`, {
      id: 'mathina-lang-toast',
      duration: 2500,
      icon: lang.flag,
    });
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left notranslate ${className}`}>
      {/* ── Multi-Language Option Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
          isOpen
            ? 'bg-slate-100 text-slate-900 border-indigo-400 ring-2 ring-indigo-200/50'
            : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Website Language / மொழியை மாற்றவும்"
      >
        <FiGlobe className="w-4 h-4 text-indigo-600 flex-shrink-0 animate-spin-slow" />
        <span className="text-sm">{activeLangObj.flag}</span>
        {!compact && (
          <span className="hidden sm:inline font-bold tracking-tight text-slate-800">
            {activeLangObj.nativeName}
          </span>
        )}
        <FiChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* ── Multi-Language Dropdown Menu ── */}
      {isOpen && (
        <div
          className={`absolute right-0 ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } w-72 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 px-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100 mb-1.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FiGlobe className="w-3.5 h-3.5 text-indigo-600" />
                Select Language
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Choose your mother tongue
              </p>
            </div>
            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
              6 Languages
            </span>
          </div>

          {/* Language Options List */}
          <div className="space-y-1">
            {languages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 font-bold border border-indigo-200/80 shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{lang.flag}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                        {lang.nativeName}
                        {lang.dir === 'rtl' && (
                          <span className="text-[9px] font-medium bg-amber-50 text-amber-700 px-1 rounded">
                            RTL
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {lang.name} • {lang.region}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <FiCheck className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-transparent group-hover:bg-slate-200 transition-colors"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subtext info */}
          <div className="pt-2 mt-1.5 border-t border-slate-100 px-3">
            <p className="text-[10px] text-slate-400 text-center">
              🇮🇳 Mathina Multi-Language Engine • Smooth Instant Switch
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
