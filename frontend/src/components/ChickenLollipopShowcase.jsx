import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiStar, FiShoppingCart, FiZap } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ChickenLollipopShowcase = () => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(500);

  const product = {
    name: 'Chicken Lollipop',
    tamilName: 'சிக்கன் லாலிபாப்',
    description: 'Frenched drumettes shaped like lollipops. Restaurant-quality cut perfect for appetizers and special occasions.',
    longDescription: 'Our Chicken Lollipop is a premium cut where the meat from the wingette is pushed to one end of the drumette, creating an elegant lollipop shape. This restaurant-quality cut is perfect for parties, appetizers, and impressing your guests. Each piece is carefully prepared to ensure uniform cooking and beautiful presentation.',
    image: '/images/products/chicken-lollipop-drumstick.png',
    additionalImages: [
      '/images/products/chicken-lollipop-drumette.png',
      '/images/products/chicken-lollipop-main.jpg',
      '/images/products/chicken-lollipop-1.jpg',
    ],
    // Fallback local images if primary images fail
    fallbackImages: {
      main: '/images/products/chicken-lollipop-main.jpg',
      thumb1: '/images/products/chicken-lollipop-1.jpg',
      thumb2: '/images/products/chicken-lollipop-2.jpg',
      thumb3: '/images/products/chicken-lollipop-3.jpg',
    },
    prices: {
      250: 78,
      500: 155,
      1000: 310,
    },
    cookingTime: '18-20 mins',
    servings: {
      250: '2-3 pieces',
      500: '4-6 pieces',
      1000: '8-12 pieces',
    },
    ratings: { average: 4.8, count: 112 },
    features: [
      { icon: '🍗', title: 'Premium Cut', desc: 'Restaurant-quality presentation' },
      { icon: '👨‍🍳', title: 'Chef Prepared', desc: 'Carefully frenched for perfect shape' },
      { icon: '🎉', title: 'Party Perfect', desc: 'Ideal for appetizers & gatherings' },
      { icon: '👶', title: 'Kids Favorite', desc: 'Easy to eat, fun presentation' },
    ],
    bestFor: ['Appetizers', 'Party Snacks', 'Kids Meals', 'Frying', 'Grilling', 'Special Occasions'],
    cookingMethods: [
      { method: 'Deep Fry', time: '15-18 mins', temp: '180°C', image: '/images/cooking-methods/deep-fry.png' },
      { method: 'Air Fry', time: '18-20 mins', temp: '200°C', image: '/images/cooking-methods/air-fry.png' },
      { method: 'Oven Bake', time: '25-30 mins', temp: '200°C', image: '/images/cooking-methods/oven-bake.png' },
      { method: 'Pan Fry', time: '20-25 mins', temp: 'Medium-High', image: '/images/cooking-methods/pan-fry.png' },
    ],
    marinadeTips: [
      'Marinate for at least 2 hours for best flavor',
      'Use yogurt-based marinades for tenderness',
      'Try tandoori, peri-peri, or honey garlic flavors',
      'Apply oil before cooking for crispy skin',
    ],
  };

  const weightOptions = [
    { weight: 250, label: '250g', servings: '2-3 pieces' },
    { weight: 500, label: '500g', servings: '4-6 pieces' },
    { weight: 1000, label: '1 kg', servings: '8-12 pieces' },
  ];

  const handleAddToCart = () => {
    const cartProduct = {
      _id: `lollipop-temp-${selectedWeight}`,
      name: product.name,
      description: product.description,
      category: 'chicken-cuts',
      subCategory: 'lollipop',
      price: product.prices[selectedWeight],
      images: [{ url: product.image }],
      weightOptions: weightOptions.map(opt => ({
        weight: opt.weight,
        price: product.prices[opt.weight],
      })),
      ratings: product.ratings,
      freshnessTag: 'fresh',
      halalCertified: true,
      isVirtual: true, // Mark as virtual product (not in database)
    };
    
    const selectedOption = weightOptions.find(opt => opt.weight === selectedWeight);
    addToCart(cartProduct, 1, {
      weight: selectedWeight,
      price: product.prices[selectedWeight],
    });
    toast.success(`Added ${product.name} (${selectedOption.label}) to cart!`);
  };

  const handleBuyNow = () => {
    const cartProduct = {
      _id: `lollipop-temp-${selectedWeight}`,
      name: product.name,
      description: product.description,
      category: 'chicken-cuts',
      subCategory: 'lollipop',
      price: product.prices[selectedWeight],
      images: [{ url: product.image }],
      weightOptions: weightOptions.map(opt => ({
        weight: opt.weight,
        price: product.prices[opt.weight],
      })),
      ratings: product.ratings,
      freshnessTag: 'fresh',
      halalCertified: true,
      isVirtual: true, // Mark as virtual product (not in database)
    };
    
    const selectedOption = weightOptions.find(opt => opt.weight === selectedWeight);
    buyNow(cartProduct, 1, {
      weight: selectedWeight,
      price: product.prices[selectedWeight],
    }, navigate);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
            🍗 Premium Restaurant-Quality Cut
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {product.name}
          </h2>
          <p className="text-lg text-gray-500 mb-2">{product.tamilName}</p>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">{product.description}</p>
          
          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.ratings.average)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill={star <= Math.round(product.ratings.average) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-gray-600 font-medium">
              {product.ratings.average} ({product.ratings.count} reviews)
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = product.fallbackImages.main;
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.additionalImages.map((img, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      const fallbacks = [product.fallbackImages.thumb1, product.fallbackImages.thumb2, product.fallbackImages.thumb3];
                      e.target.src = fallbacks[idx] || product.fallbackImages.main;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info & Order */}
          <div className="space-y-6">
            
            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">About This Cut</h3>
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100 text-center"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h4>
                  <p className="text-gray-500 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Weight Selector */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Weight</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {weightOptions.map((opt) => (
                  <button
                    key={opt.weight}
                    onClick={() => setSelectedWeight(opt.weight)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedWeight === opt.weight
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        selectedWeight === opt.weight ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{opt.servings}</div>
                      <div className={`text-base font-bold mt-2 ${
                        selectedWeight === opt.weight ? 'text-orange-600' : 'text-gray-700'
                      }`}>
                        ₹{product.prices[opt.weight]}
                      </div>
                    </div>
                    {selectedWeight === opt.weight && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price</span>
                  <span className="text-2xl font-bold text-orange-600">₹{product.prices[selectedWeight]}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Per kg rate</span>
                  <span>₹{product.prices[1000]}/kg</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Buy Now Button - Primary */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <FiZap className="w-5 h-5" />
                  Buy Now — ₹{product.prices[selectedWeight]}
                </button>

                {/* Add to Cart Button - Secondary */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart — ₹{product.prices[selectedWeight]}
                </button>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <FiClock className="w-4 h-4" />
                <span>Cooks in {product.cookingTime}</span>
              </div>
            </div>

            {/* Best For Tags */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Perfect For</h3>
              <div className="flex flex-wrap gap-2">
                {product.bestFor.map((use, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cooking Methods */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cooking Methods & Times</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.cookingMethods.map((method, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Image Container */}
                <div className="relative h-40 overflow-hidden bg-gray-50">
                  <img
                    src={method.image}
                    alt={method.method}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Floating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md border border-orange-100">
                    {method.method === 'Deep Fry' && '🍳'}
                    {method.method === 'Air Fry' && '💨'}
                    {method.method === 'Oven Bake' && '🔥'}
                    {method.method === 'Pan Fry' && '🥘'}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between text-center bg-gradient-to-b from-white to-orange-50/20">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary-600 transition-colors">
                      {method.method}
                    </h4>
                  </div>
                  <div className="flex justify-center items-center gap-2.5 text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1 bg-white border border-gray-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                      ⏱️ {method.time}
                    </span>
                    <span className="flex items-center gap-1 bg-white border border-gray-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                      🌡️ {method.temp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marinade Tips */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">💡 Chef's Marinade Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {product.marinadeTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <div className="text-orange-500 text-xl font-bold">✓</div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/products?category=chicken-cuts&cut=lollipop"
            className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-800 transition-colors shadow-lg"
          >
            View All Chicken Cuts <FiArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChickenLollipopShowcase;
