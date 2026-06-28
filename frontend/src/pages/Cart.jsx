import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const deliveryFee = getCartTotal() >= 500 ? 0 : 40;
  const total = getCartTotal() + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <FiShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some fresh products to get started!</p>
          <Link to="/products" className="btn-primary inline-flex items-center">
            Start Shopping <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item._id}-${index}`} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.images?.[0]?.url || 'https://via.placeholder.com/100?text=Chicken'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    
                    {item.weight && (
                      <span className="badge bg-gray-100 text-gray-700">
                        {item.weight.weight >= 1000 ? `${item.weight.weight / 1000} kg` : `${item.weight.weight}g`}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1, item.weight)}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1, item.weight)}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{item.price * item.quantity}</div>
                        <div className="text-sm text-gray-600">
                          {item.weight
                            ? `₹${item.weight.price} / ${item.weight.weight >= 1000 ? `${item.weight.weight / 1000} kg` : `${item.weight.weight}g`}`
                            : `₹${item.price} / 100g`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id, item.weight)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>₹{getCartTotal()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>

                {deliveryFee > 0 && (
                  <p className="text-sm text-primary-600 bg-primary-50 p-3 rounded-lg">
                    Add ₹{500 - getCartTotal()} more for FREE delivery!
                  </p>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary mt-6"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
