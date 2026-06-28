import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiXOctagon, FiXCircle } from 'react-icons/fi';
import { orderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'out-for-delivery', 'delivered'];

const statusColor = (s) => ({
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  'out-for-delivery': 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}[s] || 'bg-gray-100 text-gray-800');

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getById(id)
      .then(({ data }) => setOrder(data.data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      await orderAPI.cancel(order._id, cancelReason);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      // Refresh order details
      const { data } = await orderAPI.getById(id);
      setOrder(data.data);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
          <FiArrowLeft /> Back to Orders
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(order.orderStatus)}`}>
            {order.orderStatus.replace('-', ' ')}
          </span>
        </div>

        {/* Progress Tracker */}
        {order.orderStatus !== 'cancelled' && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="font-semibold mb-4">Order Progress</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
                <div
                  className="h-full bg-primary-500 transition-all"
                  style={{ width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                />
              </div>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    i <= currentStep ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 capitalize hidden sm:block">{step.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-semibold mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                    {item.weight && ` · ${item.weight >= 1000 ? `${item.weight / 1000} kg` : `${item.weight}g`}`}
                  </p>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">₹{order.finalAmount}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-semibold mb-3">Delivery Address</h2>
          <p className="text-gray-700">
            {order.deliveryAddress?.street}, {order.deliveryAddress?.area}<br />
            {order.deliveryAddress?.city || 'Cuddalore'} - {order.deliveryAddress?.pincode}<br />
            📞 {order.deliveryAddress?.phone}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-semibold mb-3">Payment</h2>
          <p className="text-gray-700 capitalize">{order.paymentMethod || 'Cash on Delivery'}</p>
          <p className={`text-sm mt-1 font-medium ${order.paymentInfo?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
            {order.paymentInfo?.status === 'paid' ? '✅ Paid' : '⏳ Payment Pending'}
          </p>
        </div>

        {/* Rate Order */}
        {order.orderStatus === 'delivered' && (
          <Link
            to={`/feedback/${order._id}`}
            className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition-colors mb-6"
          >
            <FiStar /> Rate This Order
          </Link>
        )}

        {/* Cancel Order Button */}
        {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors mb-6"
          >
            <FiXOctagon className="w-5 h-5" /> Cancel This Order
          </button>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiXOctagon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                  <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Order Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.orderStatus)}`}>
                  {order.orderStatus.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-lg font-bold text-gray-900">₹{order.finalAmount}</span>
              </div>
            </div>

            {/* Reason Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're cancelling this order..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Your feedback helps us improve our service
              </p>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Note:</strong> Once cancelled, this action cannot be undone.
                {order.paymentInfo?.status === 'paid' && ' Refund will be processed within 5-7 business days.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <FiXOctagon className="w-4 h-4" />
                    Cancel Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
