import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiZap } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Local product images per category/subCategory
const FALLBACK_IMAGES = {
  'breast':          '/images/products/chicken-breast-boneless.png',
  'cube-cut':        '/images/products/chicken-breast-diced.png',
  'dragon-cut':      '/images/products/chicken-drumsticks-raw.png',
  'butterfly-cut':   '/images/products/chicken-breast-butterfly.png',
  'finger-cut':      '/images/products/chicken-breast-strips.png',
  'julienne-cut':    '/images/products/chicken-breast-strips.png',
  'lollipop':        '/images/products/chicken-lollipop-drumstick.png',
  'wings':           '/images/products/chicken-drumsticks-raw.png',
  'legs':            '/images/products/chicken-leg-marinated.png',
  'thighs-boneless': '/images/products/chicken-breast-boneless.png',
  'whole':           '/images/products/whole-chicken-seasoned.png',
  'curry-cut':       '/images/products/chicken-drumsticks-raw.png',
  'small-curry-cut': '/images/products/chicken-breast-diced.png',
  'big-curry-cut':   '/images/products/chicken-drumsticks-raw.png',
  '65-piece':        '/images/products/chicken-breast-diced.png',
  'eggs':            '/images/products/chicken-breast-boneless.png',
  'marinades':       '/images/products/chicken-leg-marinated.png',
  'ready-to-cook':   '/images/products/whole-chicken-seasoned.png',
  'organs':          '/images/products/chicken-drumsticks-raw.png',
  'live-chicken':    '/images/products/whole-chicken-seasoned.png',
  'default':         '/images/products/chicken-breast-boneless.png',
};

const getImage = (product) => {
  const url = product.images?.[0]?.url;
  if (url && !url.includes('placeholder')) return url;
  return FALLBACK_IMAGES[product.subCategory]
    || FALLBACK_IMAGES[product.category]
    || FALLBACK_IMAGES['default'];
};

const fmtWeight = (w) => w >= 1000 ? `${w / 1000} kg` : `${w}g`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions?.[0] || null
  );

  const pricePerKg = selectedWeight
    ? Math.round(selectedWeight.price / (selectedWeight.weight / 1000))
    : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedWeight);
    toast.success(`Added ${selectedWeight ? fmtWeight(selectedWeight.weight) : ''} ${product.name} to cart`);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error('Item is out of stock!');
      return;
    }
    buyNow(product, 1, selectedWeight, navigate);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <Link to={`/products/${product._id}`}>
          <img
            src={getImage(product)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = FALLBACK_IMAGES['default']; }}
          />
        </Link>

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.freshnessTag === 'fresh' && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">🌿 Fresh</span>
          )}
          {product.freshnessTag === 'frozen' && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">❄️ Frozen</span>
          )}
          {product.organic && (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Organic</span>
          )}
          {product.halalCertified && (
            <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Halal</span>
          )}
        </div>

        {/* Festival offer */}
        {product.festivalOffer?.active && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow">
            🎉 {product.festivalOffer.discountPercentage}% OFF
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-lg text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <FiStar
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(product.ratings.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  fill={s <= Math.round(product.ratings.average) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.ratings.count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-primary-600">
            ₹{selectedWeight ? selectedWeight.price : product.price}
          </span>
          <span className="text-xs text-gray-400">
            {selectedWeight ? `/ ${fmtWeight(selectedWeight.weight)}` : '/kg'}
          </span>
          {selectedWeight && selectedWeight.weight >= 1000 && (
            <span className="text-xs text-gray-400">(₹{pricePerKg}/kg)</span>
          )}
        </div>

        {/* Weight selector */}
        {product.weightOptions?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.weightOptions.map((opt, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setSelectedWeight(opt); }}
                className={`text-xs px-2 py-1 rounded-lg border font-medium transition-all ${
                  selectedWeight?.weight === opt.weight
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-400'
                }`}
              >
                {fmtWeight(opt.weight)}
              </button>
            ))}
          </div>
        )}

        {/* Low stock */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-xs text-red-500 font-medium mb-2">⚠️ Only {product.stock} left!</p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Buy Now Button - Primary Action */}
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white shadow-md hover:shadow-lg'
            }`}
          >
            <FiZap className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : `Buy Now — ₹${selectedWeight ? selectedWeight.price : product.price}`}
          </button>

          {/* Add to Cart Button - Secondary Action */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <FiShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : `Add to Cart — ₹${selectedWeight ? selectedWeight.price : product.price}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
