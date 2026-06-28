import { useState, useEffect, useRef } from 'react';
import { FiBell, FiX, FiCheck, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { notificationAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const LOCAL_KEY = 'mathina_notifications';
const getLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; } };
const saveLocal = (items) => localStorage.setItem(LOCAL_KEY, JSON.stringify(items));

// Icon & color per notification type
const TYPE_CONFIG = {
  confirmed:        { icon: FiCheck,        bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Confirmed' },
  processing:       { icon: FiPackage,      bg: 'bg-purple-100', text: 'text-purple-700', label: 'Processing' },
  'out-for-delivery':{ icon: FiTruck,       bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Out for Delivery' },
  delivered:        { icon: FiCheckCircle,  bg: 'bg-green-100',  text: 'text-green-700',  label: 'Delivered 🎉' },
  cancelled:        { icon: FiX,            bg: 'bg-red-100',    text: 'text-red-700',    label: 'Cancelled' },
  update:           { icon: FiBell,         bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'Update' },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.update;

const NotificationBell = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(getLocal);
  const [deliveryPopup, setDeliveryPopup] = useState(null); // shows delivery confirmation
  const ref = useRef(null);
  const prevIds = useRef(new Set(getLocal().map(n => n._id)));

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getMyNotifications();
      const items = data.data || [];

      // Check for NEW delivered notification
      const newDelivered = items.find(n =>
        n.type === 'delivered' && !n.isRead && !prevIds.current.has(n._id)
      );
      if (newDelivered) setDeliveryPopup(newDelivered);

      // Update prev IDs
      prevIds.current = new Set(items.map(n => n._id));
      setNotifications(items);
      saveLocal(items);
    } catch {
      setNotifications(getLocal());
    }
  };

  useEffect(() => {
    if (!isAuthenticated || isAdmin) return;
    fetchNotifications();
    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, isAdmin]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (id) => {
    try { await notificationAPI.markRead(id); } catch {}
    const updated = notifications.map(n => n._id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    saveLocal(updated);
  };

  const markAll = async () => {
    try { await notificationAPI.markAllRead(); } catch {}
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveLocal(updated);
  };

  const dismissDelivery = () => {
    if (deliveryPopup) markRead(deliveryPopup._id);
    setDeliveryPopup(null);
  };

  // Don't show for admin
  if (!isAuthenticated || isAdmin) return null;

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* ── Delivery Confirmation Popup ── */}
      {deliveryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-bounce-once">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Delivered!</h2>
            <p className="text-gray-600 mb-2 text-sm">{deliveryPopup.message}</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
              <p className="text-green-700 text-sm font-medium">
                ✅ Your fresh chicken from Mathina FreshHub has arrived!
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={dismissDelivery}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-base transition-colors"
              >
                ✓ Confirm Received
              </button>
              <p className="text-xs text-gray-400">
                Tap to confirm you received your order
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Bell Icon ── */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
          aria-label="Notifications"
        >
          <FiBell className={`w-6 h-6 ${unread > 0 ? 'text-primary-600' : ''}`} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* ── Dropdown ── */}
        {open && (
          <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden" style={{ width: '340px' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-2">
                <FiBell className="w-4 h-4 text-white" />
                <h3 className="font-bold text-white text-sm">Order Notifications</h3>
                {unread > 0 && (
                  <span className="bg-white text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{unread} new</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAll} className="text-xs text-primary-100 hover:text-white flex items-center gap-1">
                    <FiCheck className="w-3 h-3" /> All read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-primary-200 hover:text-white">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <FiBell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs mt-1">Order updates will appear here</p>
                </div>
              ) : (
                notifications.slice(0, 20).map((n) => {
                  const cfg = getConfig(n.type);
                  return (
                    <div
                      key={n._id}
                      onClick={() => markRead(n._id)}
                      className={`px-4 py-3.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-primary-50 border-l-4 border-l-primary-400' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          <cfg.icon className={`w-4 h-4 ${cfg.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">{n.title}</p>
                            {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t text-center">
              <p className="text-xs text-gray-400">
                🔄 Updates every 10 seconds · Mathina FreshHub
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;
