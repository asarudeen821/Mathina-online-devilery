import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiClock, FiStar, FiCheck, FiZap } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import ChickenCutsShowcase from '../components/ChickenCutsShowcase';
import ChickenLollipopShowcase from '../components/ChickenLollipopShowcase';
import Hero3DSection from '../components/Hero3DSection';
import { productAPI } from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [featRes, allRes] = await Promise.allSettled([
        productAPI.getFeatured(),
        productAPI.getAll({ limit: 12, sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);

      if (featRes.status === 'fulfilled' && featRes.value?.data?.data) {
        setFeaturedProducts(featRes.value.data.data);
      }
      if (allRes.status === 'fulfilled' && allRes.value?.data?.data) {
        setLatestProducts(allRes.value.data.data);
        setTotalCount(allRes.value.data.count || allRes.value.data.data.length);
      }
    } catch (error) {
      console.error('Failed to fetch home products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Real-time synchronization when shop owner creates or updates a product
    const handleShopUpdate = () => {
      fetchAllData();
    };

    window.addEventListener('shop-products-updated', handleShopUpdate);
    window.addEventListener('storage', handleShopUpdate);

    return () => {
      window.removeEventListener('shop-products-updated', handleShopUpdate);
      window.removeEventListener('storage', handleShopUpdate);
    };
  }, []);

  const features = [
    {
      icon: FiTruck,
      title: 'Free Delivery',
      description: 'Free delivery on orders above ₹500',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: FiShield,
      title: '100% Fresh',
      description: 'Farm-fresh, processed daily',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      icon: FiClock,
      title: 'Same Day',
      description: 'Order before 2 PM for delivery',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      icon: FiStar,
      title: 'Premium Quality',
      description: 'Organic, halal-certified',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const categories = [
    {
      name: 'Curry Cut',
      desc: 'Classic bone-in pieces',
      img: '/images/products/chicken-drumsticks-raw.png',
      link: '/products?category=chicken-cuts&cut=curry-cut',
      badge: 'Popular',
      badgeColor: 'badge badge-warning',
    },
    {
      name: 'Cube Cut',
      desc: 'Small diced pieces',
      img: '/images/products/chicken-breast-diced.png',
      link: '/products?category=chicken-cuts&cut=cube-cut',
      badge: 'Stir Fry',
      badgeColor: 'badge badge-info',
    },
    {
      name: 'Dragon Cut',
      desc: 'Long drumstick-style',
      img: '/images/products/chicken-leg-marinated.png',
      link: '/products?category=chicken-cuts&cut=dragon-cut',
      badge: 'Chef Special',
      badgeColor: 'badge badge-error',
    },
    {
      name: 'Butterfly Cut',
      desc: 'Boneless breast split',
      img: '/images/products/chicken-breast-butterfly.png',
      link: '/products?category=chicken-cuts&cut=butterfly-cut',
      badge: 'Premium',
      badgeColor: 'badge badge-primary',
    },
    {
      name: 'Julienne Cut',
      desc: 'Ultra-thin strips',
      img: '/images/products/chicken-breast-strips.png',
      link: '/products?category=chicken-cuts&cut=julienne-cut',
      badge: 'Quick Cook',
      badgeColor: 'badge badge-success',
    },
    {
      name: 'Lollipop',
      desc: 'Frenched drumettes',
      img: '/images/products/chicken-lollipop-drumstick.png',
      link: '/products?category=chicken-cuts&cut=lollipop',
      badge: 'Kids Fav',
      badgeColor: 'badge badge-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ═══════ Interactive 3D Hero Section ═══════ */}
      <Hero3DSection />

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`${feature.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <FiCheck className="w-4 h-4" />
              <span>11+ Premium Cuts Available</span>
            </div>
            <h2 className="section-title">Shop by Cut</h2>
            <p className="section-subtitle">Choose your preferred chicken cut — freshly processed daily</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={cat.link}
                className="group card card-hover overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-32 overflow-hidden bg-slate-100">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge */}
                  <span className={`absolute top-2 left-2 ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>
                {/* Label */}
                <div className="p-3">
                  <h3 className="font-semibold text-slate-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Shop Owner Live Updates & Fresh Arrivals Section ═══════ */}
      {latestProducts && latestProducts.length > 0 && (
        <section className="py-14 bg-gradient-to-b from-slate-50 via-rose-50/20 to-white border-y border-slate-200/80 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-emerald-300 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Shop Owner Live Counter Updates</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  🔥 Today's Fresh Shop Updates & New Cuts
                </h2>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                  Real-time stock, live counter additions, and custom chicken cuts updated directly by Mathina Chicken Center butchery.
                </p>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 px-4 py-2 rounded-xl shadow-sm hover:shadow group transition-all"
              >
                <span>View All In Store ({totalCount || latestProducts.length}+ Items)</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="relative group">
                  <div className="absolute -top-2.5 right-3 z-10 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>New Arrival</span>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chicken Lollipop Showcase Section */}
      <ChickenLollipopShowcase />

      {/* Chicken Cuts Showcase Section */}
      <ChickenCutsShowcase />

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Festival Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-accent-500 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">🎉 Festival Special Offer!</h2>
          <p className="text-xl mb-8">
            Get 15% off on Biryani Cut & Big Curry Cut. Use code: MATHINA2024
          </p>
          <Link to="/products?category=chicken-cuts" className="bg-white text-accent-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-block">
            Shop Now
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Browse', desc: 'Choose from fresh chicken products' },
              { step: 2, title: 'Order', desc: 'Add to cart and checkout securely' },
              { step: 3, title: 'We Prepare', desc: 'Freshly processed and packed' },
              { step: 4, title: 'Delivery', desc: 'Delivered to your doorstep' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Farm-Fresh Chicken?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join happy customers in Cuddalore. Order now!
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-block">
            Get Started
          </Link>
        </div>
      </section>

      {/* Brand Logo Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Brand Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <img
                src="/brand-logo.svg"
                alt="Mathina Chicken Center Logo"
                className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Brand Name */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Mathina Chicken Center
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                Fresh Chicken · Quality Assured · Halal Certified
              </p>
            </div>

            {/* Tagline */}
            <div className="max-w-2xl text-center">
              <p className="text-gray-600 leading-relaxed">
                Your trusted source for fresh, organic, and halal-certified chicken in Cuddalore. 
                Farm-to-table freshness with custom cuts made on demand.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                <span className="text-lg">🌿</span>
                <span>Fresh Daily</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                <span className="text-lg">✅</span>
                <span>Halal Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                <span className="text-lg">🔬</span>
                <span>Quality Tested</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                <span className="text-lg">🚚</span>
                <span>Home Delivery</span>
              </div>
            </div>

            {/* Owner Info */}
            <div className="text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">
                Owned & Operated by Shajan A.J.
              </p>
              <p>
                📍 Erusappan Pallivasal Street, Cuddalore OT - 607003
              </p>
              <p>
                📞 +91 77080 32726 | ✉️ mathinachickencenter@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
