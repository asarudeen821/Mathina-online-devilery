import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiShoppingCart, FiZap } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../utils/api';
import toast from 'react-hot-toast';

const chickenCuts = [
  {
    id: 1,
    name: 'Cube Cut',
    subCategory: 'cube-cut',
    tamilName: 'க்யூப் கட்',
    description: 'Small diced pieces perfect for stir-fry, fried rice, and noodles',
    bestFor: ['Stir Fry', 'Fried Rice', 'Noodles'],
    image: '/images/products/chicken-breast-diced.png',
    prices: { '250g': 68, '500g': 135, '1 kg': 270 },
    cookingTime: '8-10 mins',
    popular: true,
  },
  {
    id: 2,
    name: 'Dragon Cut',
    subCategory: 'dragon-cut',
    tamilName: 'டிராகன் கட்',
    description: 'Special long drumstick-like pieces for impressive presentation',
    bestFor: ['Dragon Chicken', 'Chettinad', 'Gravy'],
    image: '/images/products/chicken-drumsticks-raw.png',
    prices: { '500g': 145, '1 kg': 290, '2 kg': 580 },
    cookingTime: '20-25 mins',
    popular: true,
  },
  {
    id: 3,
    name: 'Butterfly Cut',
    subCategory: 'butterfly-cut',
    tamilName: 'பட்டர்ஃப்ளை கட்',
    description: 'Boneless breast split open like butterfly wings for grilling',
    bestFor: ['Grilling', 'Stuffing', 'Restaurant Style'],
    image: '/images/products/chicken-breast-butterfly.png',
    prices: { '250g': 80, '500g': 160, '1 kg': 320 },
    cookingTime: '12-15 mins',
    premium: true,
  },
  {
    id: 4,
    name: 'Chicken 65 Pieces',
    subCategory: '65-piece',
    tamilName: 'சிக்கன் 65 துண்டுகள்',
    description: 'Signature small boneless pieces for Chicken 65 preparation',
    bestFor: ['Chicken 65', 'Crispy Fry', 'Appetizers'],
    image: '/images/products/chicken-breast-diced.png',
    prices: { '250g': 75, '500g': 150, '1 kg': 300 },
    cookingTime: '15-18 mins',
    popular: true,
  },
  {
    id: 5,
    name: 'Finger Cut',
    subCategory: 'finger-cut',
    tamilName: 'ஃபிங்கர் கட்',
    description: 'Long thin strips perfect for chicken fingers and wraps',
    bestFor: ['Chicken Fingers', 'Wraps', 'Stir Fry'],
    image: '/images/products/chicken-breast-strips.png',
    prices: { '250g': 70, '500g': 140, '1 kg': 280 },
    cookingTime: '10-12 mins',
  },
  {
    id: 6,
    name: 'Julienne Cut',
    subCategory: 'julienne-cut',
    tamilName: 'ஜூலியன் கட்',
    description: 'Ultra-thin matchstick-sized strips, perfect for quick stir-fry, noodles, and Asian dishes. Cooks in minutes!',
    bestFor: ['Noodles', 'Fried Rice', 'Asian Dishes', 'Quick Stir Fry'],
    image: '/images/products/chicken-breast-strips.png',
    prices: { '250g': 73, '500g': 145, '1 kg': 290 },
    cookingTime: '5-7 mins',
    popular: true,
  },
  {
    id: 7,
    name: 'Lollipop',
    subCategory: 'lollipop',
    tamilName: 'லாலிபாப்',
    description: 'Frenched drumettes shaped like lollipops, perfect for parties',
    bestFor: ['Appetizers', 'Kids', 'Party Snacks'],
    image: '/images/products/chicken-lollipop-drumstick.png',
    prices: { '250g': 78, '500g': 155, '1 kg': 310 },
    cookingTime: '18-20 mins',
    premium: true,
  },
  {
    id: 8,
    name: 'Small Curry Cut',
    subCategory: 'small-curry-cut',
    tamilName: 'சிறிய கறி கட்',
    description: 'Traditional small pieces with bone for authentic curry flavor',
    bestFor: ['Curry', 'Gravy', 'Traditional Dishes'],
    image: '/images/products/chicken-drumsticks-raw.png',
    prices: { '250g': 60, '500g': 120, '1 kg': 240 },
    cookingTime: '20-25 mins',
    popular: true,
  },
  {
    id: 9,
    name: 'Big Curry Cut',
    subCategory: 'big-curry-cut',
    tamilName: 'பெரிய கறி கட்',
    description: 'Large bone-in pieces, perfect for biryani and restaurant-style gravies',
    bestFor: ['Biryani', 'Pulao', 'Restaurant Style'],
    image: '/images/products/chicken-leg-marinated.png',
    prices: { '500g': 120, '1 kg': 240, '1.5 kg': 360 },
    cookingTime: '25-30 mins',
    popular: true,
  },
];

// Single card with interactive weight selector & direct order buttons
const CutCard = ({ cut, dbProduct }) => {
  const { user } = useAuth();
  const { addToCart, buyNow } = useCart();
  const navigate = useNavigate();

  // Build unified weight options
  const weightOptions = dbProduct?.weightOptions?.length > 0 
    ? dbProduct.weightOptions 
    : Object.entries(cut.prices).map(([wt, pr]) => ({
        weight: wt.includes('kg') ? parseFloat(wt) * 1000 : parseFloat(wt),
        price: pr,
      }));

  const [selectedWeight, setSelectedWeight] = useState(weightOptions[1] || weightOptions[0]);

  // Keep selected weight in sync if dbProduct updates
  useEffect(() => {
    if (weightOptions.length > 0) {
      setSelectedWeight(weightOptions[1] || weightOptions[0]);
    }
  }, [dbProduct]);

  const fmtWeight = (w) => w >= 1000 ? `${w / 1000} kg` : `${w}g`;

  const getProductObject = () => {
    if (dbProduct) return dbProduct;
    
    // Create virtual fallback product
    return {
      _id: `${cut.subCategory}-temp-${selectedWeight.weight}`,
      name: cut.name,
      description: cut.description,
      category: 'chicken-cuts',
      subCategory: cut.subCategory,
      price: selectedWeight.price,
      images: [{ url: cut.image }],
      weightOptions: weightOptions.map(opt => ({
        weight: opt.weight,
        price: opt.price
      })),
      ratings: { average: 4.8, count: 112 },
      freshnessTag: 'fresh',
      halalCertified: true,
      isVirtual: true,
    };
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to order products');
      navigate('/login');
      return;
    }
    const targetProduct = getProductObject();
    addToCart(targetProduct, 1, selectedWeight);
    toast.success(`Added ${fmtWeight(selectedWeight.weight)} ${cut.name} to cart!`);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to order products');
      navigate('/login');
      return;
    }
    const targetProduct = getProductObject();
    buyNow(targetProduct, 1, selectedWeight, navigate);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {cut.image ? (
          <img
            src={cut.image}
            alt={cut.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = '/images/products/chicken-breast-boneless.png'; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex flex-col items-center justify-center">
            <span className="text-5xl mb-2">🔪</span>
            <span className="text-primary-700 font-semibold text-sm">{cut.name}</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {cut.popular && (
            <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold shadow">
              ⭐ Popular
            </span>
          )}
          {cut.premium && (
            <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">
              👑 Premium
            </span>
          )}
        </div>
        {/* Price tag */}
        <div className="absolute bottom-2 right-2 bg-white rounded-lg px-2.5 py-1 shadow-lg">
          <span className="text-base font-bold text-primary-600">₹{selectedWeight?.price}</span>
          <span className="text-xs text-gray-400 ml-0.5">/{fmtWeight(selectedWeight?.weight)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-0.5">{cut.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{cut.tamilName}</p>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{cut.description}</p>

        {/* Best For */}
        <div className="flex flex-wrap gap-1 mb-3">
          {cut.bestFor.map((use, i) => (
            <span key={i} className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-xs font-medium">
              {use}
            </span>
          ))}
        </div>

        {/* Cooking time */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <FiClock className="w-3 h-3" />
          <span>Cooks in {cut.cookingTime}</span>
        </div>

        {/* Weight Selector */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Select Weight</p>
          <div className="flex flex-wrap gap-1.5">
            {weightOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedWeight(opt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedWeight?.weight === opt.weight
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-400'
                }`}
              >
                {fmtWeight(opt.weight)} — ₹{opt.price}
              </button>
            ))}
          </div>
        </div>

        {/* Price summary row */}
        <div className="flex items-center justify-between bg-primary-50 rounded-lg px-3 py-2 mb-4">
          <span className="text-xs text-gray-600">You pay</span>
          <span className="text-lg font-bold text-primary-700">₹{selectedWeight?.price}</span>
          <span className="text-xs text-gray-500">for {fmtWeight(selectedWeight?.weight)}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto">
          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
          >
            <FiZap className="w-4 h-4 animate-pulse" /> Buy Now
          </button>
          
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
          >
            <FiShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ChickenCutsShowcase = () => {
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const { data } = await productAPI.getAll({ category: 'chicken-cuts' });
        setDbProducts(data.data || []);
      } catch (err) {
        console.error('Showcase: Failed to fetch chicken cuts from MongoDB', err);
      }
    };
    fetchDbProducts();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            🔪 Premium Cuts Available
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Cut</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From traditional curry cuts to specialty restaurant-style cuts — select your weight and order directly below!
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {chickenCuts.map((cut) => {
            const matchedProduct = dbProducts.find(
              (p) => p.subCategory === cut.subCategory
            );
            return (
              <CutCard key={cut.id} cut={cut} dbProduct={matchedProduct} />
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mb-16">
          <Link
            to="/products?category=chicken-cuts"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
          >
            View All Chicken Cuts <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '✅',
              bg: 'bg-primary-100',
              title: 'Hygienic Processing',
              desc: 'All cuts processed in a clean facility with strict quality control.',
            },
            {
              icon: '🌿',
              bg: 'bg-accent-100',
              title: 'Fresh Daily',
              desc: 'Processed fresh every morning. Never frozen, delivered within 24 hours.',
            },
            {
              icon: '🔪',
              bg: 'bg-yellow-100',
              title: 'Custom Cuts Available',
              desc: 'Need a specific cut? Call us at +91 77080 32726 for custom orders.',
            },
          ].map((info, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-start gap-4">
              <div className={`${info.bg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                {info.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-gray-500 text-sm">{info.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChickenCutsShowcase;
