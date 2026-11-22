import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 6 Supported Mother Languages:
 * 1. English (en)
 * 2. Tamil (ta) - தமிழ்
 * 3. Malayalam (ml) - മലയാളം
 * 4. Hindi (hi) - हिन्दी
 * 5. Urdu (ur) - اردو (RTL)
 * 6. Arabic (ar) - العربية (RTL)
 */
export const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    region: 'Standard',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    dir: 'ltr',
    region: 'தமிழ்நாடு (Tamil Nadu)',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    dir: 'ltr',
    region: 'കേരളം (Kerala)',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr',
    region: 'भारत (India)',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇮🇳',
    dir: 'rtl',
    region: 'ہندوستان (Urdu)',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    region: 'الشرق الأوسط (Middle East)',
  },
];

// Comprehensive Multi-Language Dictionary for Instant UI Translation
export const TRANSLATIONS = {
  // Navigation
  nav_home: {
    en: 'Home',
    ta: 'முகப்பு',
    ml: 'ഹോം',
    hi: 'होम',
    ur: 'ہوم',
    ar: 'الرئيسية',
  },
  nav_products: {
    en: 'Products',
    ta: 'பொருட்கள்',
    ml: 'ഉൽപ്പന്നങ്ങൾ',
    hi: 'उत्पाद',
    ur: 'مصنوعات',
    ar: 'المنتجات',
  },
  nav_plans: {
    en: 'Plans',
    ta: 'திட்டங்கள்',
    ml: 'പ്ലാനുകൾ',
    hi: 'योजनाएं',
    ur: 'منصوبے',
    ar: 'الخطط',
  },
  nav_qr_scan: {
    en: 'QR Scan',
    ta: 'QR ஸ்கேன்',
    ml: 'ക്യുആർ സ്കാൻ',
    hi: 'क्यूआर स्कैन',
    ur: 'کیو آر اسکین',
    ar: 'مسح QR',
  },
  nav_ai_chef: {
    en: 'AI Chef 👨‍🍳',
    ta: 'AI செஃப் 👨‍🍳',
    ml: 'AI ഷെഫ് 👨‍🍳',
    hi: 'एआई शेफ 👨‍🍳',
    ur: 'اے آئی شیف 👨‍🍳',
    ar: 'شيف الذكاء الاصطناعي 👨‍🍳',
  },
  nav_cart: {
    en: 'Cart',
    ta: 'கூடை',
    ml: 'കാർട്ട്',
    hi: 'कार्ट',
    ur: 'ٹوکری',
    ar: 'عربة التسوق',
  },
  nav_orders: {
    en: 'My Orders',
    ta: 'என் ஆர்டர்கள்',
    ml: 'എന്റെ ഓർഡറുകൾ',
    hi: 'मेरे ऑर्डर',
    ur: 'میرے آرڈرز',
    ar: 'طلباتي',
  },
  nav_profile: {
    en: 'Profile',
    ta: 'சுயவிவரம்',
    ml: 'പ്രൊഫൈൽ',
    hi: 'प्रोफाइल',
    ur: 'پروفائل',
    ar: 'الملف الشخصي',
  },
  nav_login: {
    en: 'Login',
    ta: 'உள்நுழைக',
    ml: 'ലോഗിൻ',
    hi: 'लॉग इन',
    ur: 'لاگ ان',
    ar: 'تسجيل الدخول',
  },
  nav_register: {
    en: 'Register',
    ta: 'பதிவு செய்க',
    ml: 'രജിസ്റ്റർ',
    hi: 'रजिस्टर',
    ur: 'رجسٹر کریں',
    ar: 'التسجيل',
  },
  nav_logout: {
    en: 'Logout',
    ta: 'வெளியேறு',
    ml: 'ലോഗ്ഔട്ട്',
    hi: 'लॉग आउट',
    ur: 'لاگ آؤٹ',
    ar: 'تسجيل الخروج',
  },

  // Language Selector UI
  lang_select_title: {
    en: 'Select Language',
    ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    hi: 'भाषा चुनें',
    ur: 'زبان منتخب کریں',
    ar: 'اختر اللغة',
  },
  lang_select_subtitle: {
    en: 'Choose your preferred mother tongue',
    ta: 'உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும்',
    ml: 'നിങ്ങളുടെ മാതൃഭാഷ തിരഞ്ഞെടുക്കുക',
    hi: 'अपनी पसंदीदा मातृभाषा चुनें',
    ur: 'اپنی پسندیدہ مادری زبان منتخب کریں',
    ar: 'اختر لغتك الأم المفضلة',
  },

  // Quick Actions Hub
  quick_hub_title: {
    en: 'Mathina Quick Hub',
    ta: 'மதினா விரைவு மையம்',
    ml: 'മദീന ക്വിക്ക് ഹബ്',
    hi: 'मदीना क्विक हब',
    ur: 'مدینہ کوئیک ہب',
    ar: 'مركز مدينا السريع',
  },
  quick_help_order: {
    en: 'Quick Help & Order',
    ta: 'விரைவு உதவி & ஆர்டர்',
    ml: 'ദ്രുത സഹായവും ഓർഡറും',
    hi: 'त्वरित सहायता और ऑर्डर',
    ur: 'فوری مدد اور آرڈر',
    ar: 'مساعدة سريعة وطلب',
  },
  quick_order: {
    en: 'Quick Order',
    ta: 'விரைவு ஆர்டர்',
    ml: 'ദ്രുത ഓർഡർ',
    hi: 'त्वरित ऑर्डर',
    ur: 'فوری آرڈر',
    ar: 'طلب سريع',
  },
  call_directly: {
    en: 'Call Directly',
    ta: 'நேரடியாக அழைக்கவும்',
    ml: 'നേരിട്ട് വിളിക്കുക',
    hi: 'सीधे कॉल करें',
    ur: 'براہ راست کال کریں',
    ar: 'اتصل مباشرة',
  },
  ai_chef_subtitle: {
    en: 'Recipes, cuts, cooking temps & orders',
    ta: 'சமையல் குறிப்புகள், வெட்டுகள் & ஆர்டர்கள்',
    ml: 'പാചകക്കുറിപ്പുകൾ, കട്ടുകൾ, ഓർഡറുകൾ',
    hi: 'व्यंजन विधियाँ, कट्स और ऑर्डर सहायता',
    ur: 'ترکیبیں، کٹس اور آرڈر کی معلومات',
    ar: 'وصفات، قطع اللحم، ومعلومات الطلب',
  },
  quick_order_subtitle: {
    en: 'Pick custom cuts & weights in 10s',
    ta: '10 வினாடிகளில் கட் & எடையைத் தேர்ந்தெடுக்கவும்',
    ml: '10 സെക്കൻഡിൽ കട്ടുകളും തൂക്കവും തിരഞ്ഞെടുക്കുക',
    hi: '10 सेकंड में कट्स और वजन चुनें',
    ur: '10 سیکنڈ میں کٹس اور وزن منتخب کریں',
    ar: 'اختر القطع والأوزان في 10 ثوانٍ',
  },

  // General & Shopping
  fresh_halal_certified: {
    en: '100% Fresh & Halal Certified',
    ta: '100% புதிய மற்றும் ஹலால் சான்றளிக்கப்பட்டது',
    ml: '100% പുതിയതും ഹലാൽ സാക്ഷ്യപ്പെടുത്തിയതും',
    hi: '100% ताजा और हलाल प्रमाणित',
    ur: '100% تازہ اور حلال تصدیق شدہ',
    ar: 'طازج وحلال معتمد 100%',
  },
  instant_access: {
    en: 'Instant Access',
    ta: 'உடனடி அணுகல்',
    ml: 'തൽക്ഷണ പ്രവേശനം',
    hi: 'तुरंत पहुंच',
    ur: 'فوری رسائی',
    ar: 'وصول فوري',
  },
  close: {
    en: 'Close',
    ta: 'மூடுக',
    ml: 'അടയ്ക്കുക',
    hi: 'बंद करें',
    ur: 'بند کریں',
    ar: 'إغلاق',
  },
  buy_now: {
    en: 'Buy Now',
    ta: 'இப்போதே வாங்கவும்',
    ml: 'ഇപ്പോൾ വാങ്ങുക',
    hi: 'अभी खरीदें',
    ur: 'ابھی خریدیں',
    ar: 'اشتري الآن',
  },
  add_to_cart: {
    en: 'Add to Cart',
    ta: 'கூடையில் சேர்க்கவும்',
    ml: 'കാർട്ടിലേക്ക് ചേർക്കുക',
    hi: 'कार्ट में जोड़ें',
    ur: 'ٹوکری میں شامل کریں',
    ar: 'أضف إلى السلة',
  },
  view_cart: {
    en: 'View Cart',
    ta: 'கூடையைக் காண்க',
    ml: 'കാർട്ട് കാണുക',
    hi: 'कार्ट देखें',
    ur: 'ٹوکری دیکھیں',
    ar: 'عرض السلة',
  },
  total: {
    en: 'Total',
    ta: 'மொத்தம்',
    ml: 'ആകെ',
    hi: 'कुल',
    ur: 'کل رقم',
    ar: 'المجموع',
  },
  price: {
    en: 'Price',
    ta: 'விலை',
    ml: 'വില',
    hi: 'मूल्य',
    ur: 'قیمت',
    ar: 'السعر',
  },

  // Footer & Info
  footer_quick_links: {
    en: 'Quick Links',
    ta: 'விரைவு இணைப்புகள்',
    ml: 'ദ്രുത ലിങ്കുകൾ',
    hi: 'महत्वपूर्ण लिंक',
    ur: 'اہم لنکس',
    ar: 'روابط سريعة',
  },
  footer_customer_service: {
    en: 'Customer Service',
    ta: 'வாடிக்கையாளர் சேவை',
    ml: 'ഉപഭോക്തൃ സേവനം',
    hi: 'ग्राहक सेवा',
    ur: 'کسٹمر سروس',
    ar: 'خدمة العملاء',
  },
  footer_contact_us: {
    en: 'Contact Us',
    ta: 'தொடர்பு கொள்ள',
    ml: 'ഞങ്ങളെ ബന്ധപ്പെടുക',
    hi: 'संपर्क करें',
    ur: 'ہم سے رابطہ کریں',
    ar: 'اتصل بنا',
  },
  footer_delivery_hours: {
    en: 'Delivery Hours',
    ta: 'டெலிவரி நேரம்',
    ml: 'ഡെലിവറി സമയം',
    hi: 'डिलीवरी का समय',
    ur: 'ڈیلیوری کے اوقات',
    ar: 'ساعات التوصيل',
  },
  footer_all_products: {
    en: 'All Products',
    ta: 'அனைத்து பொருட்கள்',
    ml: 'എല്ലാ ഉൽപ്പന്നങ്ങളും',
    hi: 'सभी उत्पाद',
    ur: 'تمام مصنوعات',
    ar: 'جميع المنتجات',
  },
  footer_subscriptions: {
    en: 'Subscriptions',
    ta: 'சந்தாக்கள்',
    ml: 'വരിസംഖ്യകൾ',
    hi: 'सदस्यता',
    ur: 'سبسکرپشنز',
    ar: 'الاشتراكات',
  },
  footer_ai_recipes: {
    en: 'AI Chef & Recipes',
    ta: 'AI செஃப் & சமையல் குறிப்புகள்',
    ml: 'AI ഷെഫും പാചകക്കുറിപ്പുകളും',
    hi: 'एआई शेफ और रेसिपी',
    ur: 'اے آئی شیف اور ترکیبیں',
    ar: 'شيف الذكاء الاصطناعي والوصفات',
  },
  footer_traceability: {
    en: 'QR Traceability',
    ta: 'QR தடமறிதல்',
    ml: 'ക്യുആർ കണ്ടെത്തൽ',
    hi: 'क्यूआर ट्रैसेबिलिटी',
    ur: 'کیو آر ٹریسیبلٹی',
    ar: 'تتبع رمز الاستجابة السريعة',
  },
  footer_track_order: {
    en: 'Track Order',
    ta: 'ஆர்டரைக் கண்காணிக்க',
    ml: 'ഓർഡർ ട്രാക്ക് ചെയ്യുക',
    hi: 'ऑर्डर ट्रैक करें',
    ur: 'آرڈر ٹریک کریں',
    ar: 'تتبع الطلب',
  },
  footer_my_account: {
    en: 'My Account',
    ta: 'என் கணக்கு',
    ml: 'എന്റെ അക്കൗണ്ട്',
    hi: 'मेरा खाता',
    ur: 'میرا اکاؤنٹ',
    ar: 'حسابي',
  },
  footer_rights_reserved: {
    en: 'All rights reserved.',
    ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    ml: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
    hi: 'सर्वाधिकार सुरक्षित।',
    ur: 'جملہ حقوق محفوظ ہیں۔',
    ar: 'جميع الحقوق محفوظة.',
  },
  footer_fresh_chicken_desc: {
    en: 'Fresh 100% Halal chicken cuts delivered directly to your doorstep in Cuddalore.',
    ta: 'கடலூரில் உங்கள் வீட்டிற்கே நேரடியாக வழங்கப்படும் 100% புதிய மற்றும் ஹலால் சிக்கன் வெட்டுகள்.',
    ml: 'കൂഡല്ലൂരിൽ നിങ്ങളുടെ വീട്ടുപടിക്കൽ നേരിട്ടെത്തിക്കുന്ന 100% പുതിയ ഹലാൽ ചിക്കൻ കട്ടുകൾ.',
    hi: 'कुड्डालور में सीधे आपके दरवाजे पर 100% ताजा और हलाल चिकन कट्स की डिलीवरी।',
    ur: 'کڈالور میں آپ کی دہلیز تک براہ راست ڈیلیور کیے جانے والے 100% تازہ اور حلال چکن کٹس۔',
    ar: 'قطع دجاج طازجة وحلال 100% تُسلم مباشرة إلى باب منزلك في كودالور.',
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('mathina_selected_language') || 'en';
  });

  // Apply RTL/LTR and HTML lang tag smoothly
  const applyDirectionAndLang = useCallback((langCode) => {
    const langObj = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];
    document.documentElement.setAttribute('lang', langCode);
    document.documentElement.setAttribute('dir', langObj.dir);
    if (langObj.dir === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, []);

  // Set standard googtrans cookie safely across local & production domains
  const setGoogleTransCookie = useCallback((langCode) => {
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    if (domain && domain !== 'localhost' && domain !== '127.0.0.1') {
      document.cookie = `googtrans=/en/${langCode}; domain=.${domain}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; domain=${domain}; path=/;`;
    }
  }, []);

  // Comprehensive Cookie Clearing for Google Translate
  const clearAllGoogleTranslateCookies = useCallback(() => {
    const domain = window.location.hostname;
    const domains = ['', domain, `.${domain}`];
    if (domain && domain !== 'localhost' && domain !== '127.0.0.1' && domain.includes('.')) {
      const parts = domain.split('.');
      if (parts.length > 2) {
        domains.push(`.${parts.slice(-2).join('.')}`);
      }
    }
    const paths = ['/', '', window.location.pathname];

    domains.forEach((d) => {
      paths.forEach((p) => {
        const domainStr = (d && d !== 'localhost' && d !== '.localhost') ? ` domain=${d};` : '';
        const pathStr = p ? ` path=${p};` : ' path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;${pathStr}${domainStr}`;
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC;${pathStr}${domainStr}`;
      });
    });
  }, []);

  // Trigger Google Translate Show Original action
  const triggerRestoreOriginal = useCallback(() => {
    try {
      const iframe = document.querySelector('iframe.goog-te-banner-frame');
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const restoreBtn =
            iframeDoc.getElementById(':1.restore') ||
            iframeDoc.getElementById(':2.restore') ||
            iframeDoc.querySelector('button[id*="restore"]') ||
            iframeDoc.querySelector('.goog-te-button button');
          if (restoreBtn) {
            restoreBtn.click();
          }
        }
      }
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      console.debug('Restore original trigger', e);
    }
  }, []);

  // Universal Google Translate DOM trigger with automatic retry polling
  const triggerGoogleTranslation = useCallback((langCode) => {
    try {
      if (langCode === 'en') {
        clearAllGoogleTranslateCookies();
        triggerRestoreOriginal();
        return;
      }

      // 1. Write the standard googtrans cookie safely
      setGoogleTransCookie(langCode);

      // 2. Poll for the .goog-te-combo dropdown and trigger change event
      let attempts = 0;
      const pollAndTrigger = () => {
        attempts++;
        const select = document.querySelector('.goog-te-combo');
        if (select && select.options && select.options.length > 1) {
          select.value = langCode;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          if (typeof select.onchange === 'function') {
            try { select.onchange(); } catch(e) {}
          }
        } else if (attempts < 25) {
          setTimeout(pollAndTrigger, 80);
        } else {
          // Fallback reload if Google Translate script was delayed
          window.location.reload();
        }
      };
      pollAndTrigger();
    } catch (e) {
      console.warn('Google translation trigger notice:', e);
    }
  }, [clearAllGoogleTranslateCookies, setGoogleTransCookie, triggerRestoreOriginal]);

  // Initialize and synchronise Google Translate on first mount
  useEffect(() => {
    // If not already defined by index.html, safeguard-attach init
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (window.__googleTranslateInitialized) return;
        try {
          if (window.google && window.google.translate && window.google.translate.TranslateElement) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'ta,ml,hi,ur,ar,en',
                autoDisplay: false,
              },
              'google_translate_element'
            );
            window.__googleTranslateInitialized = true;
          }
        } catch (err) {
          console.warn('Translate init safeguard:', err);
        }
      };
    }

    if (!document.getElementById('google-translate-script') && !window.__googleTranslateInitialized) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    // Apply saved language on first mount
    applyDirectionAndLang(currentLanguage);
    if (currentLanguage !== 'en') {
      let attempts = 0;
      const initialApply = () => {
        attempts++;
        const select = document.querySelector('.goog-te-combo');
        if (select && select.options && select.options.length > 1) {
          if (select.value !== currentLanguage) {
            select.value = currentLanguage;
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } else if (attempts < 30) {
          setTimeout(initialApply, 100);
        }
      };
      initialApply();
    }
  }, [applyDirectionAndLang, currentLanguage]);

  // Main Language Switcher Function - Instant In-Place Translation & React Sync
  const setLanguage = (langCode) => {
    const targetLang = LANGUAGES.find((l) => l.code === langCode);
    if (!targetLang) return;

    // 1. Instantly update React context state so all UI dictionary keys update
    setCurrentLanguage(langCode);
    localStorage.setItem('mathina_selected_language', langCode);
    applyDirectionAndLang(langCode);

    // 2. Dispatch custom event for real-time listeners across components
    window.dispatchEvent(
      new CustomEvent('mathina-language-changed', {
        detail: { lang: langCode, name: targetLang.nativeName },
      })
    );

    // 3. If switching back to English ("Show Original")
    if (langCode === 'en') {
      clearAllGoogleTranslateCookies();
      triggerRestoreOriginal();
      // Reload cleanly to purge any <font> wrappers injected by Google Translate
      setTimeout(() => {
        window.location.reload();
      }, 60);
      return;
    }

    // 4. Switching to a foreign language (ta, ml, hi, ur, ar)
    // Write cookie so page refreshes and SPA transitions persist
    setGoogleTransCookie(langCode);

    // 5. Trigger in-place DOM translation without requiring user to refresh
    triggerGoogleTranslation(langCode);
  };

  // Translation helper: t('nav_home')
  const t = (key, fallback = '') => {
    if (!TRANSLATIONS[key]) return fallback || key;
    return TRANSLATIONS[key][currentLanguage] || TRANSLATIONS[key]['en'] || fallback || key;
  };

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        activeLangObj,
        languages: LANGUAGES,
        t,
        isRTL: activeLangObj.dir === 'rtl',
      }}
    >
      {/* 
        Stealth container for Google Translate element:
        Kept in layout with absolute offset so Google Translate's JS initializes cleanly
        without throwing layout errors, but remaining 100% invisible to users.
      */}
      <div
        id="google_translate_element"
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * RouteLanguageSync:
 * Automatically synchronizes full-page translation across SPA route transitions.
 * When navigating between /products, /cart, /checkout, etc., this component
 * ensures the user's active mother tongue is consistently maintained on newly mounted views.
 */
export const RouteLanguageSync = () => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (currentLanguage && currentLanguage !== 'en') {
      const syncOnRoute = () => {
        try {
          const select = document.querySelector('.goog-te-combo');
          if (select && select.options && select.options.length > 1) {
            if (select.value !== currentLanguage) {
              select.value = currentLanguage;
            }
            select.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof select.onchange === 'function') {
              try { select.onchange(); } catch(e) {}
            }
          }
        } catch (e) {
          console.debug('Language route sync notice', e);
        }
      };

      // Staggered triggers to account for React component mounting and async data loads
      const timer1 = setTimeout(syncOnRoute, 120);
      const timer2 = setTimeout(syncOnRoute, 450);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [location.pathname, currentLanguage]);

  return null;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
