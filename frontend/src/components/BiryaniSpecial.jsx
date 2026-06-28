import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';

const BiryaniSpecial = () => {
  const product = {
    id: 'biryani-cut',
    name: 'Chicken Biryani Cut',
    tamilName: 'சிக்கன் பிரியாணி கட்',
    description: 'Large bone-in pieces specially cut for biryani and pulao. Restaurant-style cut that gives rich flavor to every grain of rice.',
    price: 240,
    originalPrice: 280,
    discount: 14,
    image: 'https://images.pexels.com/photos/616367/pexels-photo-616367.jpeg?w=800&h=600&fit=crop',
    cookingTime: '25-30 mins',
    servings: '3-4 people',
    bestFor: ['Biryani', 'Pulao', 'Kabsa', 'Mandi'],
    features: [
      'Large bone-in pieces',
      'Restaurant-style cut',
      'Rich flavor enhancement',
      'Perfect for special occasions',
      'Fresh daily cut',
    ],
  };

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-4">
            <FiStar className="w-4 h-4" />
            Biryani Special
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            🍛 Perfect Biryani Starts Here
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Authentic biryani requires the perfect cut. Our special biryani cut ensures every grain absorbs the rich flavors.
          </p>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative h-80 md:h-auto">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <FiStar className="w-4 h-4" />
                  Biryani Favourite
                </span>
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Fresh Daily
                </span>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 right-4 bg-white px-5 py-3 rounded-2xl shadow-xl">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500">/kg</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-xs font-bold text-green-600">Save {product.discount}%</span>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              {/* Name */}
              <div className="mb-4">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.tamilName}</p>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">⏱️ Cooking Time</p>
                  <p className="font-semibold text-gray-900">{product.cookingTime}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">🍽️ Servings</p>
                  <p className="font-semibold text-gray-900">{product.servings}</p>
                </div>
              </div>

              {/* Best For */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Perfect For:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.bestFor.map((item, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Why This Cut?</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/products?category=chicken-cuts&subCategory=big-curry-cut`}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Order Biryani Cut
                </Link>
                <Link
                  to="/products"
                  className="px-6 py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors"
                >
                  View All
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-green-600">✓</span> Halal Certified
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-green-600">✓</span> Fresh Daily
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-green-600">✓</span> Premium Quality
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Suggestion */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🍛 Pro Tip for Perfect Biryani</h3>
            <p className="text-gray-600">Use our special biryani cut for authentic flavor</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">🥘</div>
              <h4 className="font-bold text-gray-900 mb-2">Step 1: Marinate</h4>
              <p className="text-sm text-gray-700">Marinate chicken with yogurt, biryani masala, ginger-garlic paste for 2 hours</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">🍚</div>
              <h4 className="font-bold text-gray-900 mb-2">Step 2: Layer</h4>
              <p className="text-sm text-gray-700">Layer marinated chicken with partially cooked basmati rice, saffron milk, and fried onions</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">🔥</div>
              <h4 className="font-bold text-gray-900 mb-2">Step 3: Dum Cook</h4>
              <p className="text-sm text-gray-700">Seal with dough and cook on dum (slow fire) for 20-25 minutes for aromatic biryani</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl p-8 text-center shadow-xl">
          <h3 className="text-3xl font-bold mb-3">🎉 Special Offer!</h3>
          <p className="text-orange-100 text-lg mb-6">
            Order biryani cut above 2kg and get free biryani masala packet
          </p>
          <Link
            to={`/products?category=chicken-cuts&subCategory=big-curry-cut`}
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg"
          >
            <FiShoppingCart className="w-5 h-5" />
            Order Now - Get Free Masala
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BiryaniSpecial;
