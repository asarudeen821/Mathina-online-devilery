import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiDollarSign, FiCheck, FiTag, FiX, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, couponAPI } from '../utils/api';
import toast from 'react-hot-toast';
import UPIPaymentModal from '../components/UPIPaymentModal';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  // Ref guard: prevents concurrent/duplicate coupon API calls
  const couponInFlight = useRef(false);
  const [formData, setFormData] = useState({
    deliveryAddress: {
      street: user?.address?.street || '',
      area: user?.address?.area || '',
      city: user?.address?.city || 'Chennai',
      state: user?.address?.state || 'Tamil Nadu',
      pincode: user?.address?.pincode || '',
      landmark: user?.address?.landmark || '',
      phone: user?.phone || '',
    },
    deliveryTime: 'morning',
    deliveryInstructions: '',
    paymentMethod: 'cod',
  });

  const deliveryFee = getCartTotal() >= 500 ? 0 : 40;
  const discount = couponData?.discount || 0;
  const total = getCartTotal() + deliveryFee - discount;

  // useCallback so the function reference is stable across renders
  const validateCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    // Guard: if a call is already in-flight, do nothing
    if (couponInFlight.current) return;

    couponInFlight.current = true;
    setCouponLoading(true);
    try {
      const { data } = await couponAPI.validate({
        code: couponCode.trim(),
        cartItems,
        orderAmount: getCartTotal(),
      });

      if (data.success) {
        setCouponData({
          code: data.coupon.code,
          description: data.coupon.description,
          discount: data.discount,
          finalAmount: data.finalAmount,
        });
        toast.success(`✅ Coupon applied! ₹${data.discount} off`);
      } else {
        toast.error(data.message || 'Invalid coupon code');
        setCouponData(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired coupon');
      setCouponData(null);
    } finally {
      setCouponLoading(false);
      couponInFlight.current = false;
    }
  }, [couponCode, cartItems, getCartTotal]);

  const removeCoupon = () => {
    setCouponCode('');
    setCouponData(null);
    couponInFlight.current = false;
    toast.success('Coupon removed');
  };

  // Handle Enter key in coupon input — fires once, no loop
  const handleCouponKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateCoupon();
    }
  };

  // Redirect if cart is empty (use effect to avoid render-time navigation)
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const placeOrder = async (extraPaymentInfo = {}) => {
    setLoading(true);
    try {
      // Check if user is logged in
      if (!user) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }

      // Handle virtual products (like Chicken Lollipop showcase)
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        weight: item.weight?.weight,
        price: item.price,
        name: item.name,
        isVirtual: item.isVirtual || false,
      }));

      const orderData = {
        items: orderItems,
        deliveryAddress: formData.deliveryAddress,
        deliveryTime: formData.deliveryTime,
        deliveryInstructions: formData.deliveryInstructions,
        paymentMethod: formData.paymentMethod,
        discount: discount,
        coupon: couponData ? {
          code: couponData.code,
          discount: couponData.discount,
          description: couponData.description,
        } : undefined,
        ...extraPaymentInfo,
      };

      const { data } = await orderAPI.create(orderData);

      // Clear cart and redirect
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders', { state: { order: data.data } });
    } catch (error) {
      let errorMessage = 'Failed to place order';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please login to place an order';
        navigate('/login');
      } else if (error.response?.status === 404) {
        errorMessage = 'Some products are not available';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'upi') {
      setShowUPIModal(true);
    } else {
      placeOrder();
    }
  };

  const handleUPISuccess = (upiId) => {
    setShowUPIModal(false);
    placeOrder({ upiId, paymentStatus: 'paid' });
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.street"
                      value={formData.deliveryAddress.street}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.area"
                      value={formData.deliveryAddress.area}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Cuddalore OT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.pincode"
                      value={formData.deliveryAddress.pincode}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      className="input-field"
                      placeholder="607001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.landmark"
                      value={formData.deliveryAddress.landmark}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Near City Center Mall"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="deliveryAddress.phone"
                      value={formData.deliveryAddress.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="input-field"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Time Slot</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'morning', label: 'Morning', time: '6 AM - 12 PM' },
                    { value: 'afternoon', label: 'Afternoon', time: '12 PM - 5 PM' },
                    { value: 'evening', label: 'Evening', time: '5 PM - 10 PM' },
                  ].map((slot) => (
                    <label
                      key={slot.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.deliveryTime === slot.value
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryTime"
                        value={slot.value}
                        checked={formData.deliveryTime === slot.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="font-semibold">{slot.label}</div>
                      <div className="text-sm text-gray-600">{slot.time}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: FiDollarSign },
                    { value: 'upi', label: 'UPI Payment', icon: FiCreditCard },
                    { value: 'card', label: 'Credit/Debit Card', icon: FiCreditCard },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex items-center ${
                        formData.paymentMethod === method.value
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <method.icon className="w-6 h-6 mr-3" />
                      <span className="font-medium">{method.label}</span>
                      {formData.paymentMethod === method.value && (
                        <FiCheck className="w-5 h-5 ml-auto text-primary-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Instructions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Instructions</h2>
                <textarea
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm group py-1">
                      <div className="flex flex-col flex-1">
                        <span className="text-gray-700">
                          {item.name} <span className="text-gray-400">x {item.quantity}</span>
                        </span>
                        {item.weight?.weight && (
                          <span className="text-gray-400 text-xs">
                            {item.weight.weight}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id, item.weight)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                          title="Remove item"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
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

                  {/* Coupon Section */}
                  {couponData ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiTag className="text-green-600" />
                          <span className="text-sm font-semibold text-green-800">{couponData.code}</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-700"
                          title="Remove coupon"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-green-700 mb-2">{couponData.description}</p>
                      <p className="text-sm font-bold text-green-800">- ₹{couponData.discount}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={handleCouponKeyDown}
                        placeholder="Enter coupon code"
                        className="flex-1 border-2 border-gray-200 focus:border-primary-400 rounded-lg px-3 py-2 text-sm outline-none transition-colors uppercase"
                        disabled={couponLoading}
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={validateCoupon}
                        disabled={couponLoading || !couponCode.trim() || couponInFlight.current}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          couponLoading || !couponCode.trim()
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {couponLoading ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary-600">₹{total}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary mt-6"
                  >
                    {loading ? (
                      <div className="spinner w-6 h-6 border-2 border-white border-t-transparent"></div>
                    ) : (
                      `Place Order - ₹${total}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>

      <UPIPaymentModal
        isOpen={showUPIModal}
        amount={total}
        onSuccess={handleUPISuccess}
        onClose={() => setShowUPIModal(false)}
      />
    </div>
  );
};

export default Checkout;
