import { useState, useEffect } from 'react';
import { FiEye, FiX, FiBell, FiCheck, FiTruck, FiPackage, FiClock, FiPhone, FiStar, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { orderAPI, notificationAPI, feedbackAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

// ── Order Status Pipeline ─────────────────────────────────────
const PIPELINE = [
  { step: 1, status: 'pending',          label: 'Pending',          icon: FiClock,   color: 'yellow',  msg: null },
  { step: 2, status: 'confirmed',        label: 'Confirmed',        icon: FiCheck,   color: 'blue',    msg: '✅ Your order has been confirmed! We are preparing your fresh chicken. 🐔' },
  { step: 3, status: 'processing',       label: 'Processing',       icon: FiPackage, color: 'purple',  msg: '🔪 Your chicken is being freshly cut and packed right now!' },
  { step: 4, status: 'out-for-delivery', label: 'Out for Delivery', icon: FiTruck,   color: 'indigo',  msg: '🚚 Your order is on the way! Our delivery person is heading to your address.' },
  { step: 5, status: 'delivered',        label: 'Delivered',        icon: FiCheck,   color: 'green',   msg: '🎉 Your order has been delivered! Enjoy your fresh chicken from Mathina Chicken Center. Thank you! 🍗' },
];

const STEP_COLORS = {
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400', btn: 'bg-yellow-500 hover:bg-yellow-600', badge: 'bg-yellow-100 text-yellow-800' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-400',   btn: 'bg-blue-600 hover:bg-blue-700',     badge: 'bg-blue-100 text-blue-800' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400', btn: 'bg-purple-600 hover:bg-purple-700', badge: 'bg-purple-100 text-purple-800' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-700', badge: 'bg-indigo-100 text-indigo-800' },
  green:  { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-400',  btn: 'bg-green-600 hover:bg-green-700',   badge: 'bg-green-100 text-green-800' },
  red:    { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-400',    btn: 'bg-red-600 hover:bg-red-700',       badge: 'bg-red-100 text-red-800' },
};

const getCurrentStep = (status) => PIPELINE.find(p => p.status === status) || PIPELINE[0];
const getNextStep = (status) => {
  const idx = PIPELINE.findIndex(p => p.status === status);
  return idx >= 0 && idx < PIPELINE.length - 1 ? PIPELINE[idx + 1] : null;
};

// ── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const step = getCurrentStep(status);
  const color = status === 'cancelled' ? STEP_COLORS.red : STEP_COLORS[step.color];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color.badge}`}>
      <step.icon className="w-3 h-3" />
      {step.label}
    </span>
  );
};

// ── Order Progress Bar ────────────────────────────────────────
const OrderProgress = ({ status }) => {
  const currentIdx = PIPELINE.findIndex(p => p.status === status);
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <FiX className="text-red-500 w-5 h-5" />
      <span className="text-red-700 font-semibold text-sm">Order Cancelled</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1">
      {PIPELINE.map((p, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const color = STEP_COLORS[p.color];
        return (
          <div key={p.step} className="flex items-center flex-1">
            <div className={`flex flex-col items-center flex-1`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? `${color.bg} ${color.border}` : 'bg-gray-100 border-gray-200'
              } ${active ? 'ring-2 ring-offset-1 ring-current shadow-md' : ''}`}>
                <p.icon className={`w-4 h-4 ${done ? color.text : 'text-gray-400'}`} />
              </div>
              <span className={`text-xs mt-1 font-medium text-center leading-tight ${done ? color.text : 'text-gray-400'}`}>
                {p.step}. {p.label}
              </span>
            </div>
            {i < PIPELINE.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-5 ${i < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [showCustomMsg, setShowCustomMsg] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    fetchOrders();

    // Listen for order updates from the notification bell
    const handleOrderUpdate = () => {
      fetchOrders();
    };
    window.addEventListener('admin-order-update', handleOrderUpdate);
    return () => window.removeEventListener('admin-order-update', handleOrderUpdate);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAll({ limit: 100 });
      setOrders(data.data || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const fetchFeedback = async (orderId) => {
    try {
      setFeedbackLoading(true);
      const { data } = await feedbackAPI.getAll();
      const orderFeedback = data.data?.find(f => f.order?._id === orderId);
      setFeedback(orderFeedback || null);
    } catch {
      setFeedback(null);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Move order to next step + auto-notify customer
  const handleNextStep = async (order) => {
    const next = getNextStep(order.orderStatus);
    if (!next) return;
    setUpdating(true);
    try {
      await orderAPI.updateStatus(order._id, { orderStatus: next.status });

      // Send notification to customer
      if (next.msg && order.user?._id) {
        try {
          await notificationAPI.send({
            orderId: order._id,
            userId: order.user._id,
            type: next.status,
            title: `Order ${next.label} — Mathina Chicken Center`,
            message: next.msg,
          });
        } catch {}
      }

      toast.success(`✅ Order moved to "${next.label}" — Customer notified!`);

      // Update local state
      setOrders(prev => prev.map(o => o._id === order._id ? { ...o, orderStatus: next.status } : o));
      if (selectedOrder?._id === order._id) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: next.status }));
      }
    } catch { toast.error('Failed to update order status'); }
    finally { setUpdating(false); }
  };

  // Cancel order
  const handleCancel = async (order) => {
    if (!window.confirm('Cancel this order? Customer will be notified.')) return;
    setUpdating(true);
    try {
      await orderAPI.updateStatus(order._id, { orderStatus: 'cancelled' });
      if (order.user?._id) {
        try {
          await notificationAPI.send({
            orderId: order._id,
            userId: order.user._id,
            type: 'cancelled',
            title: 'Order Cancelled — Mathina Chicken Center',
            message: '❌ Your order has been cancelled. Please contact us at +91 77080 32726 for help.',
          });
        } catch {}
      }
      toast.success('Order cancelled — Customer notified');
      setOrders(prev => prev.map(o => o._id === order._id ? { ...o, orderStatus: 'cancelled' } : o));
      if (selectedOrder?._id === order._id) setSelectedOrder(prev => ({ ...prev, orderStatus: 'cancelled' }));
      setShowModal(false);
    } catch { toast.error('Failed to cancel order'); }
    finally { setUpdating(false); }
  };

  // Send custom message
  const handleCustomNotify = async () => {
    if (!customMsg.trim() || !selectedOrder?.user?._id) return;
    try {
      await notificationAPI.send({
        orderId: selectedOrder._id,
        userId: selectedOrder.user._id,
        type: 'update',
        title: 'Message from Mathina Chicken Center 🐔',
        message: customMsg.trim(),
      });
      toast.success('Message sent to customer!');
      setCustomMsg('');
      setShowCustomMsg(false);
    } catch { toast.error('Failed to send message'); }
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.orderStatus === filterStatus);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage orders through the 5-step delivery pipeline</p>
          </div>
          <button onClick={fetchOrders} className="text-sm text-primary-600 hover:text-primary-700 border border-primary-200 px-4 py-2 rounded-lg">
            🔄 Refresh
          </button>
        </div>

        {/* Pipeline Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[{ label: 'All', value: 'all', count: orders.length, color: 'gray' },
            ...PIPELINE.map(p => ({ label: p.label, value: p.status, count: orders.filter(o => o.orderStatus === p.status).length, color: p.color })),
            { label: 'Cancelled', value: 'cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length, color: 'red' }
          ].map(f => (
            <button key={f.value} onClick={() => setFilterStatus(f.value)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${filterStatus === f.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <p className="text-2xl font-bold text-gray-900">{f.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.label}</p>
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Next Action', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td></tr>
                ) : filtered.map((order) => {
                  const next = getNextStep(order.orderStatus);
                  const nextColor = next ? STEP_COLORS[next.color] : null;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono font-bold text-gray-700">#{order._id.slice(-8)}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                        <p className="text-xs text-gray-400">{order.user?.phone || ''}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.items?.length || 0} items</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-gray-900">₹{order.finalAmount}</p>
                        {order.paymentInfo?.method === 'upi' && (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold mt-0.5">
                            UPI {order.paymentInfo?.status === 'paid' ? '✓' : '⏳'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={order.orderStatus} /></td>
                      <td className="px-4 py-3">
                        {next && order.orderStatus !== 'cancelled' ? (
                          <button
                            onClick={() => handleNextStep(order)}
                            disabled={updating}
                            className={`text-xs text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all ${nextColor.btn} disabled:opacity-50`}
                          >
                            <next.icon className="w-3 h-3" />
                            → {next.label}
                          </button>
                        ) : order.orderStatus === 'delivered' ? (
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <FiCheck className="w-3 h-3" /> Completed
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={async () => { 
                            setSelectedOrder(order); 
                            setShowModal(true); 
                            setShowCustomMsg(false); 
                            setCustomMsg('');
                            // Fetch feedback if delivered
                            if (order.orderStatus === 'delivered') {
                              try {
                                const { data } = await feedbackAPI.getAll();
                                const orderFeedback = data.data?.find(f => f.order?._id === order._id);
                                setFeedback(orderFeedback || null);
                              } catch { setFeedback(null); }
                            } else {
                              setFeedback(null);
                            }
                          }}
                          className="text-primary-600 hover:text-primary-800 flex items-center gap-1 text-sm font-medium">
                          <FiEye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Order Detail Modal ── */}
        {showModal && selectedOrder && (() => {
          const next = getNextStep(selectedOrder.orderStatus);
          const nextColor = next ? STEP_COLORS[next.color] : null;
          return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
                <div className="p-6">

                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder._id.slice(-8)}</h2>
                      <p className="text-sm text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Order Progress</p>
                    <OrderProgress status={selectedOrder.orderStatus} />
                  </div>

                  {/* Cancellation Reason Alert */}
                  {selectedOrder.orderStatus === 'cancelled' && selectedOrder.cancellationReason && (
                    <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiX className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-red-900 mb-1">🚫 Order Cancelled by Customer</p>
                          <p className="text-xs text-red-700 mb-2">This order was cancelled by the customer. Please review the reason below:</p>
                          <div className="bg-white border border-red-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Customer's Reason:</p>
                            <p className="text-sm text-gray-700 italic">"{selectedOrder.cancellationReason}"</p>
                          </div>
                          <p className="text-xs text-red-600 mt-2">
                            📅 Cancelled at: {new Date(selectedOrder.updatedAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs text-blue-500 font-semibold uppercase mb-1">Customer</p>
                      <p className="font-bold text-gray-900">{selectedOrder.user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 break-all">{selectedOrder.user?.email}</p>
                      <a href={`tel:${selectedOrder.user?.phone}`} className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                        <FiPhone className="w-3 h-3" />{selectedOrder.user?.phone}
                      </a>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.area}<br />
                        {selectedOrder.deliveryAddress?.city || 'Cuddalore'} - {selectedOrder.deliveryAddress?.pincode}
                      </p>
                    </div>
                  </div>

                  {/* UPI Payment Info */}
                  {selectedOrder.paymentInfo?.method === 'upi' && (
                    <div className="mb-5 bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-xs text-purple-600 font-semibold uppercase mb-2">UPI Payment Details</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.paymentInfo?.upiId || 'N/A'}</p>
                          <p className="text-xs text-gray-500 mt-0.5">UPI ID used for payment</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedOrder.paymentInfo?.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedOrder.paymentInfo?.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </span>
                      </div>
                      {selectedOrder.paymentInfo?.paidAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Paid at: {new Date(selectedOrder.paymentInfo.paidAt).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="mb-5">
                    <p className="text-sm font-bold text-gray-700 mb-2">Order Items</p>
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className={`flex justify-between items-center px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <span className="text-gray-800 font-medium">{item.name}
                            {item.weight && <span className="text-gray-400 font-normal ml-1">({item.weight >= 1000 ? `${item.weight/1000}kg` : `${item.weight}g`})</span>}
                          </span>
                          <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center px-4 py-3 bg-primary-50 border-t border-primary-100">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="text-xl font-bold text-primary-700">₹{selectedOrder.finalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Customer Feedback/Review ── */}
                  {selectedOrder.orderStatus === 'delivered' && (
                    <div className="mb-5">
                      <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FiStar className="w-4 h-4 text-yellow-500" />
                        Customer Feedback
                      </p>

                      {feedbackLoading ? (
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                          <div className="spinner inline-block" />
                          <p className="text-sm text-gray-500 mt-2">Loading feedback...</p>
                        </div>
                      ) : feedback ? (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-5 space-y-4">
                          {/* Overall Rating */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <FiStar key={s} className={`w-5 h-5 ${s <= feedback.overall ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={s <= feedback.overall ? 'currentColor' : 'none'} />
                                ))}
                              </div>
                              <span className="text-lg font-bold text-gray-900">{feedback.overall}/5</span>
                            </div>
                            {feedback.wouldRecommend !== undefined && (
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${
                                feedback.wouldRecommend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {feedback.wouldRecommend ? <FiThumbsUp className="w-3 h-3" /> : <FiThumbsDown className="w-3 h-3" />}
                                {feedback.wouldRecommend ? 'Would Recommend' : 'Would Not Recommend'}
                              </span>
                            )}
                          </div>

                          {/* Aspect Ratings */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(feedback.ratings || {}).filter(([_, val]) => val > 0).map(([key, val]) => (
                              <div key={key} className="bg-white rounded-lg p-3 text-center border border-yellow-200">
                                <p className="text-xs text-gray-500 capitalize mb-1.5">{key}</p>
                                <div className="flex justify-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <FiStar key={s} className={`w-3 h-3 ${s <= val ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} fill={s <= val ? 'currentColor' : 'none'} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Comment */}
                          {feedback.comment && (
                            <div className="bg-white rounded-xl p-4 border border-yellow-200">
                              <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
                            </div>
                          )}

                          {/* Timestamp */}
                          <p className="text-xs text-gray-400 text-center">
                            Submitted {new Date(feedback.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                          <FiStar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                          <p className="text-sm font-semibold text-gray-600">No feedback yet</p>
                          <p className="text-xs text-gray-400 mt-1">Customer hasn't submitted a review for this order</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Action Buttons ── */}
                  {selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'delivered' && (
                    <div className="mb-4">
                      <p className="text-sm font-bold text-gray-700 mb-3">Update Order Status</p>

                      {/* Next Step Button — Primary Action */}
                      {next && (
                        <button
                          onClick={() => handleNextStep(selectedOrder)}
                          disabled={updating}
                          className={`w-full py-3.5 rounded-xl text-white font-bold text-base flex items-center justify-center gap-3 mb-3 transition-all shadow-md ${nextColor.btn} disabled:opacity-60`}
                        >
                          {updating ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <next.icon className="w-5 h-5" />
                              Move to Step {next.step}: {next.label}
                              {next.status === 'delivered' && ' 🎉'}
                            </>
                          )}
                        </button>
                      )}

                      {/* Delivered special message */}
                      {next?.status === 'delivered' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 text-sm text-green-700">
                          <p className="font-semibold mb-1">📱 Customer will receive this notification:</p>
                          <p className="text-xs italic">"{next.msg}"</p>
                        </div>
                      )}

                      {/* Cancel Button */}
                      <button
                        onClick={() => handleCancel(selectedOrder)}
                        disabled={updating}
                        className="w-full py-2.5 rounded-xl border-2 border-red-300 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
                      >
                        ✕ Cancel Order
                      </button>
                    </div>
                  )}

                  {/* Delivered confirmation */}
                  {selectedOrder.orderStatus === 'delivered' && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-4 text-center">
                      <p className="text-2xl mb-1">🎉</p>
                      <p className="font-bold text-green-800">Order Successfully Delivered!</p>
                      <p className="text-sm text-green-600 mt-1">Customer has been notified. Order complete.</p>
                    </div>
                  )}

                  {/* Custom Message Section */}
                  <div className="border-t pt-4">
                    <button
                      onClick={() => setShowCustomMsg(!showCustomMsg)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-3"
                    >
                      <FiBell className="w-4 h-4" />
                      {showCustomMsg ? 'Hide' : 'Send Custom Message to Customer'}
                    </button>

                    {showCustomMsg && (
                      <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                        <p className="text-xs text-blue-600 font-semibold">Message will be sent as a notification to the customer</p>
                        <textarea
                          value={customMsg}
                          onChange={(e) => setCustomMsg(e.target.value)}
                          rows={3}
                          placeholder="e.g., Your order will arrive in 30 minutes. Please be available."
                          className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                        />
                        <div className="flex gap-2">
                          {/* Quick message templates */}
                          {[
                            'Arriving in 30 mins 🚚',
                            'Please be available at door 🏠',
                            'Call us: +91 77080 32726 📞',
                          ].map(t => (
                            <button key={t} onClick={() => setCustomMsg(t)}
                              className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                              {t}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={handleCustomNotify}
                          disabled={!customMsg.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <FiBell className="w-4 h-4" /> Send Notification
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default AdminOrders;
