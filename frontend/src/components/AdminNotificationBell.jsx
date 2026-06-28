import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiShoppingBag, FiCheck, FiX } from 'react-icons/fi';
import { orderAPI, notificationAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LOCAL_KEY = 'mathina_admin_notifications';
const getLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; } };
const saveLocal = (items) => localStorage.setItem(LOCAL_KEY, JSON.stringify(items));

const AdminNotificationBell = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(getLocal);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const prevIds = useRef(new Set(getLocal().map(n => n._id)));

  const fetchNotifications = async () => {
    if (!isAuthenticated || !isAdmin) return;
    
    try {
      const { data } = await notificationAPI.getMyNotifications();
      const items = data.data || [];
      
      // Check for NEW notifications
      const currentIds = new Set(items.map(n => n._id));
      const trulyNew = items.filter(n => !n.isRead && !prevIds.current.has(n._id));
      
      if (trulyNew.length > 0) {
        playNotificationSound();
        
        trulyNew.forEach(n => {
          if (n.type === 'cancelled') {
            toast.error(`❌ ${n.title}\n${n.message}`, {
              duration: 8000,
              position: 'top-right',
            });
          } else {
            toast.success(`🛍️ ${n.title}\n${n.message}`, {
              duration: 5000,
              position: 'top-right',
            });
          }
        });

        // Dispatch custom event to notify other admin pages
        window.dispatchEvent(new CustomEvent('admin-order-update'));
      }
      
      setNotifications(items);
      prevIds.current = currentIds;
      saveLocal(items);
    } catch (error) {
      console.error('Failed to fetch admin notifications:', error);
      setNotifications(getLocal());
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    
    fetchNotifications();
    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, isAdmin]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      const updated = notifications.map(n => n._id === id ? { ...n, isRead: true } : n);
      setNotifications(updated);
      saveLocal(updated);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllRead();
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      saveLocal(updated);
      toast.success('All alerts reviewed');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  if (!isAuthenticated || !isAdmin) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* ── Bell Icon ── */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 text-gray-600 hover:text-accent-600 transition-colors bg-white rounded-lg shadow-sm hover:shadow-md"
          aria-label="Admin Notifications"
          title="Admin Notifications"
        >
          <FiBell className={`w-5 h-5 ${unreadCount > 0 ? 'text-accent-600 animate-pulse' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* ── Dropdown ── */}
        {open && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent-600 to-accent-700">
              <div className="flex items-center gap-2">
                <FiBell className="w-4 h-4 text-white" />
                <h3 className="font-bold text-white text-sm">Admin Alerts</h3>
                {unreadCount > 0 && (
                  <span className="bg-white text-accent-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead} 
                    className="text-xs text-accent-100 hover:text-white flex items-center gap-1"
                  >
                    <FiCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button 
                  onClick={() => setOpen(false)} 
                  className="text-accent-200 hover:text-white"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <FiBell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No alerts yet</p>
                  <p className="text-xs mt-1">New orders and cancellations will appear here</p>
                </div>
              ) : (
                notifications.slice(0, 20).map((n) => (
                  <div
                    key={n._id}
                    className={`px-4 py-3.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !n.isRead ? 'bg-accent-50/70 border-l-4 border-l-accent-600' : ''
                    }`}
                    onClick={() => markAsRead(n._id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        n.type === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-accent-100 text-accent-700'
                      }`}>
                        {n.type === 'cancelled' ? <FiX className="w-4 h-4" /> : <FiShoppingBag className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                              New
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed whitespace-pre-wrap">
                          {n.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          {n.order && (
                            <Link
                              to={`/admin/orders`}
                              onClick={() => setOpen(false)}
                              className="text-xs text-accent-600 hover:underline font-semibold"
                            >
                              View Orders →
                            </Link>
                          )}
                          <p className="text-[10px] text-gray-400 font-medium ml-auto">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t text-center">
              <p className="text-xs text-gray-400">
                🔄 Updates every 10 seconds · Mathina FreshHub Admin
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminNotificationBell;
