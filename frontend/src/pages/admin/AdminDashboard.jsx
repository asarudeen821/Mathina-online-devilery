import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiStar, FiTag, FiBell, FiUserCheck, FiUserPlus, FiXOctagon } from 'react-icons/fi';
import { dashboardAPI, orderAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdminNotificationBell from '../../components/AdminNotificationBell';
import AIInsights from '../../components/AIInsights';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerStats, setCustomerStats] = useState(null);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [cancelledLoading, setCancelledLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchCustomerStats();
    fetchCancelledOrders();

    // Listen for order updates from the notification bell
    const handleOrderUpdate = () => {
      fetchStats();
      fetchCustomerStats();
      fetchCancelledOrders();
    };
    window.addEventListener('admin-order-update', handleOrderUpdate);
    return () => window.removeEventListener('admin-order-update', handleOrderUpdate);
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await dashboardAPI.getStats({ period: '7days' });
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerStats = async () => {
    try {
      const { data } = await dashboardAPI.getCustomers({ period: '30days' });
      setCustomerStats(data.data);
    } catch (error) {
      console.error('Failed to fetch customer stats:', error);
    }
  };

  const fetchCancelledOrders = async () => {
    try {
      const { data } = await orderAPI.getAll({ status: 'cancelled', limit: 5 });
      setCancelledOrders(data.data || []);
    } catch (error) {
      console.error('Failed to fetch cancelled orders:', error);
    } finally {
      setCancelledLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.overview?.totalRevenue ?? 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: stats?.overview?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+8.2%',
    },
    {
      title: 'Total Customers',
      value: customerStats?.totalCustomers || stats?.overview?.totalUsers || 0,
      icon: FiUsers,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtext: customerStats ? `${customerStats.newCustomers} new this month` : '',
      trend: customerStats ? `+${customerStats.newCustomers}` : '',
    },
    {
      title: 'Total Products',
      value: stats?.overview?.totalProducts || 0,
      icon: FiPackage,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'Active',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage orders, products, and track sales</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <AdminNotificationBell />
            
            <Link
              to="/admin/orders"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-250 text-sm"
            >
              <FiShoppingBag className="w-4 h-4" />
              Manage Orders
            </Link>

            <Link
              to="/admin/products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-250 text-sm"
            >
              <FiPackage className="w-4 h-4" />
              Manage Products
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Analytics Section */}
        {customerStats && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Customer Analytics</h2>
              <Link to="/admin/analytics" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Total Customers */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <FiUsers className="w-8 h-8 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                    All Time
                  </span>
                </div>
                <p className="text-3xl font-bold text-orange-900 mb-1">
                  {customerStats.totalCustomers}
                </p>
                <p className="text-sm text-orange-700">Total Registered Customers</p>
              </div>

              {/* New Customers */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <FiUserPlus className="w-8 h-8 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full">
                    This Month
                  </span>
                </div>
                <p className="text-3xl font-bold text-green-900 mb-1">
                  {customerStats.newCustomers}
                </p>
                <p className="text-sm text-green-700">New Customer Signups</p>
              </div>

              {/* Repeat Customers */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <FiUserCheck className="w-8 h-8 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                    Loyal
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-900 mb-1">
                  {customerStats.repeatCustomers}
                </p>
                <p className="text-sm text-blue-700">Repeat Customers</p>
              </div>

              {/* Retention Rate */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <FiTrendingUp className="w-8 h-8 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
                    Engagement
                  </span>
                </div>
                <p className="text-3xl font-bold text-purple-900 mb-1">
                  {customerStats.retentionRate}%
                </p>
                <p className="text-sm text-purple-700">Customer Retention Rate</p>
              </div>
            </div>

            {/* Top Customers */}
            {customerStats.topCustomers && customerStats.topCustomers.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiStar className="w-5 h-5 text-yellow-500" />
                  Top Customers (This Month)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rank</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerStats.topCustomers.slice(0, 5).map((customer, index) => (
                        <tr key={customer._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm">
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.email}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-600">{customer.phone || 'N/A'}</p>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {customer.orderCount} orders
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <p className="text-lg font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Insights Section */}
        <div className="mb-8">
          <AIInsights />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            {stats?.recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name} - {order.items?.length || 0} items
                      </p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.finalAmount}</p>
                      {order.paymentInfo?.method === 'upi' && (
                        <span className="inline-flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold mb-1">
                          UPI {order.paymentInfo?.status === 'paid' ? '✓' : '⏳'}
                        </span>
                      )}
                      <span className="block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recent orders</p>
            )}
          </div>

          {/* Cancelled Orders Alert */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiXOctagon className="w-5 h-5 text-red-600" />
                Recent Cancellations
              </h2>
              <Link to="/admin/orders" className="text-sm text-red-600 hover:text-red-700 font-medium">
                View All →
              </Link>
            </div>
            {cancelledLoading ? (
              <div className="text-center py-8">
                <div className="spinner inline-block" />
              </div>
            ) : cancelledOrders.length === 0 ? (
              <div className="text-center py-8">
                <FiXOctagon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600">No cancelled orders</p>
                <p className="text-xs text-gray-400 mt-1">Great! No cancellations recently</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cancelledOrders.map((order) => (
                  <div key={order._id} className="border-2 border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">#{order._id.slice(-8)}</p>
                        <p className="text-xs text-gray-600">{order.user?.name || 'Customer'}</p>
                      </div>
                      <span className="text-sm font-bold text-red-700">₹{order.finalAmount}</span>
                    </div>
                    {order.cancellationReason && (
                      <div className="bg-white border border-red-200 rounded px-2 py-1.5 mt-2">
                        <p className="text-xs text-gray-700 italic line-clamp-2">
                          "{order.cancellationReason}"
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Low Stock Alert</h2>
            {stats?.lowStockProducts?.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div key={product._id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{product.stock} left</p>
                      <Link to="/admin/products" className="text-xs text-primary-600">
                        Restock →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">All products well stocked</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/products" className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-600 transition-colors">
              <FiPackage className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium">Products</p>
            </Link>
            <Link to="/admin/orders" className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-600 transition-colors">
              <FiShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Orders</p>
            </Link>
            <Link to="/admin/analytics" className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-600 transition-colors">
              <FiTrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Analytics</p>
            </Link>
            <Link to="/admin/prices" className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-600 transition-colors">
              <FiTag className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium">Set Prices</p>
            </Link>
            <Link to="/admin/feedback" className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-600 transition-colors">
              <FiStar className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium">Feedback</p>
            </Link>
            <Link to="/products" target="_blank" className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-600 transition-colors">
              <FiDollarSign className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="font-medium">View Store</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
