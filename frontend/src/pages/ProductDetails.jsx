import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await productAPI.getById(id);
      setProduct(data.data);
      if (data.data.weightOptions?.length > 0) {
        setSelectedWeight(data.data.weightOptions[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  // KG-based ordering: kgQty is how many KGs the customer wants
  const [kgQty, setKgQty] = useState(1);
  const pricePerKg = product ? (selectedWeight ? (selectedWeight.price / (selectedWeight.weight / 1000)) : product.price) : 0;

  const handleAddToCart = () => {
    // Build a synthetic weight option representing the chosen KG amount
    const kgWeight = { weight: kgQty * 1000, price: Math.round(pricePerKg * kgQty) };
    addToCart(product, 1, kgWeight);
    toast.success(`Added ${kgQty}kg for ₹${kgWeight.price}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = selectedWeight ? selectedWeight.price : product.price;
  const finalPrice = displayPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li onClick={() => navigate('/')} className="hover:text-primary-600 cursor-pointer">
              Home
            </li>
            <li>/</li>
            <li onClick={() => navigate('/products')} className="hover:text-primary-600 cursor-pointer">
              Products
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={product.images?.[0]?.url || '/images/products/chicken-breast-boneless.png'}
              alt={product.name}
              className="w-full h-96 object-cover"
              onError={(e) => { e.target.src = '/images/products/chicken-breast-boneless.png'; }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                {product.ratings?.count > 0 && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.ratings.average)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">({product.ratings.count} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.freshnessTag === 'fresh' && (
                <span className="badge badge-fresh">Fresh</span>
              )}
              {product.freshnessTag === 'frozen' && (
                <span className="badge badge-frozen">Frozen</span>
              )}
              {product.organic && (
                <span className="badge badge-organic">Organic</span>
              )}
              {product.halalCertified && (
                <span className="badge badge-halal">Halal Certified</span>
              )}
              {product.antibioticFree && (
                <span className="badge bg-blue-100 text-blue-800">Antibiotic-Free</span>
              )}
            </div>

            {/* Price */}
            <div>
              {product.discountPrice ? (
                <div>
                  <span className="text-4xl font-bold text-primary-600">₹{displayPrice}</span>
                  <span className="text-xl text-gray-500 line-through ml-3">₹{product.price}</span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-gray-900">₹{displayPrice}</span>
              )}
              {selectedWeight && <span className="text-gray-600 ml-2">/ {selectedWeight.weight}g</span>}
            </div>

            {/* Description */}
            <p className="text-gray-700">{product.description}</p>

            {/* KG Selector with live price */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-primary-800 mb-3">
                🔪 How many KG do you want?
              </label>
              <div className="flex items-center space-x-4 mb-3">
                <button
                  onClick={() => setKgQty(Math.max(0.5, kgQty - 0.5))}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-primary-300 flex items-center justify-center hover:bg-primary-100 font-bold text-primary-700"
                >
                  <FiMinus />
                </button>
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary-700">{kgQty} kg</span>
                </div>
                <button
                  onClick={() => setKgQty(kgQty + 0.5)}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-primary-300 flex items-center justify-center hover:bg-primary-100 font-bold text-primary-700"
                >
                  <FiPlus />
                </button>
              </div>
              {/* Live price breakdown */}
              <div className="bg-white rounded-lg p-3 border border-primary-200">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Price per kg</span>
                  <span className="font-semibold">₹{Math.round(pricePerKg)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Quantity</span>
                  <span className="font-semibold">{kgQty} kg</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-primary-700">
                  <span>Total</span>
                  <span>₹{Math.round(pricePerKg * kgQty)}</span>
                </div>
              </div>
              {/* Quick KG presets */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[0.5, 1, 1.5, 2, 3].map((kg) => (
                  <button
                    key={kg}
                    onClick={() => setKgQty(kg)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                      kgQty === kg
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-primary-700 border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {kg}kg = ₹{Math.round(pricePerKg * kg)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-red-600 font-medium">
                Only {product.stock} items left in stock!
              </p>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 ${
                product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiShoppingCart className="w-6 h-6" />
              <span>{product.stock === 0 ? 'Out of Stock' : `Add ${kgQty}kg to Cart – ₹${Math.round(pricePerKg * kgQty)}`}</span>
            </button>

            {/* Additional Info */}
            {product.farmOrigin && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Farm Origin</h3>
                <p className="text-gray-700">{product.farmOrigin.name}</p>
                <p className="text-gray-600 text-sm">{product.farmOrigin.location}</p>
              </div>
            )}

            {product.nutritionInfo && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Nutritional Information (per 100g)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Protein:</span>
                    <span className="ml-2 font-medium">{product.nutritionInfo.protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Calories:</span>
                    <span className="ml-2 font-medium">{product.nutritionInfo.calories} kcal</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fat:</span>
                    <span className="ml-2 font-medium">{product.nutritionInfo.fat}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbs:</span>
                    <span className="ml-2 font-medium">{product.nutritionInfo.carbohydrates}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
