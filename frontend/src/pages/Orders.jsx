import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheckCircle, FiClock, FiXCircle, FiStar, FiCreditCard, FiDollarSign, FiXOctagon } from 'react-icons/fi';
import { orderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getMyOrders();
      setOrders(data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
    setCancelReason('');
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      await orderAPI.cancel(selectedOrder._id, cancelReason);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancelReason('');
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="text-green-600" />;
      case 'pending':
      case 'confirmed':
        return <FiClock className="text-yellow-600" />;
      case 'cancelled':
        return <FiXCircle className="text-red-600" />;
      default:
        return <FiPackage className="text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'upi':
        return <FiCreditCard className="text-purple-600" />;
      case 'card':
        return <FiCreditCard className="text-blue-600" />;
      case 'netbanking':
        return <FiCreditCard className="text-green-600" />;
      case 'wallet':
        return <FiCreditCard className="text-orange-600" />;
      case 'cod':
      default:
        return <FiDollarSign className="text-green-600" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'upi':
        return 'UPI';
      case 'card':
        return 'Card';
      case 'netbanking':
        return 'Net Banking';
      case 'wallet':
        return 'Wallet';
      case 'cod':
      default:
        return 'Cash on Delivery';
    }
  };

  const getPaymentBadgeColor = (method) => {
    switch (method) {
      case 'upi':
        return 'bg-purple-100 text-purple-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'netbanking':
        return 'bg-green-100 text-green-800';
      case 'wallet':
        return 'bg-orange-100 text-orange-800';
      case 'cod':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order._id.slice(-8)}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="font-medium capitalize">{order.orderStatus.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-b py-4 my-4 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">
                        {item.name} x {item.quantity}
                        {item.weight && ` (${item.weight >= 1000 ? `${item.weight / 1000} kg` : `${item.weight}g`})`}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-2 mb-3">
                  {getPaymentMethodIcon(order.paymentInfo?.method)}
                  <span className="text-sm text-gray-600">Payment:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadgeColor(order.paymentInfo?.method)}`}>
                    {getPaymentMethodLabel(order.paymentInfo?.method)}
                  </span>
                  {order.paymentInfo?.status === 'paid' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      ✓ Paid
                    </span>
                  )}
                  {order.paymentInfo?.status === 'pending' && order.paymentInfo?.method !== 'cod' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      ⏳ Pending
                    </span>
                  )}
                </div>

                {/* Total */}
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="ml-2 text-xl font-bold">₹{order.finalAmount}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Details →
                    </Link>
                    {order.orderStatus === 'delivered' && (
                      <Link
                        to={`/feedback/${order._id}`}
                        className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                      >
                        <FiStar className="w-4 h-4" /> Rate Order
                      </Link>
                    )}
                    {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                      <button
                        onClick={() => handleCancelClick(order)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        <FiXOctagon className="w-4 h-4" /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
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
                  <p className="text-sm text-gray-500">Order #{selectedOrder._id.slice(-8)}</p>
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
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-lg font-bold text-gray-900">₹{selectedOrder.finalAmount}</span>
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
                {selectedOrder.paymentInfo?.status === 'paid' && ' Refund will be processed within 5-7 business days.'}
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

export default Orders;
