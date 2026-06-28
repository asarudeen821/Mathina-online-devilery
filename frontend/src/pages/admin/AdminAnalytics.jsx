import { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiPieChart,
  FiActivity,
} from 'react-icons/fi';
import { dashboardAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  BarChartComponent,
  LineChartComponent,
  AreaChartComponent,
  PieChartComponent,
  StackedBarChartComponent,
  PercentStackedBarChartComponent,
} from '../../components/charts';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');
  const [chartView, setChartView] = useState({
    revenue: 'line',
    customer: 'bar',
    category: 'pie',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [revenueRes, customersRes, productsRes] = await Promise.all([
        dashboardAPI.getRevenue({ period }),
        dashboardAPI.getCustomers({ period }),
        dashboardAPI.getProducts(),
      ]);

      setAnalytics({
        revenue: revenueRes.data.data,
        customers: customersRes.data.data,
        products: productsRes.data.data,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    const labels = {
      '7days': 'Last 7 Days',
      '30days': 'Last 30 Days',
      '90days': 'Last 90 Days',
      '1year': 'Last Year',
    };
    return labels[period] || period;
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights for {getPeriodLabel()}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input-field w-auto"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'revenue'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            💰 Revenue Analytics
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'customer'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👥 Customer Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🛍️ Product Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiUsers className="w-8 h-8 text-blue-600" />
                  <span className="text-3xl font-bold">{analytics?.customers?.newCustomers || 0}</span>
                </div>
                <p className="text-gray-600">New Customers</p>
                <p className="text-sm text-green-600 mt-2">
                  +{analytics?.customers?.dailyCustomerTrend?.reduce((sum, d) => sum + d.count, 0) || 0} this period
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiDollarSign className="w-8 h-8 text-green-600" />
                  <span className="text-3xl font-bold">
                    ₹{analytics?.revenue?.dailyRevenue?.reduce((sum, d) => sum + d.revenue, 0)?.toLocaleString() || 0}
                  </span>
                </div>
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-sm text-gray-500 mt-2">From {analytics?.revenue?.dailyRevenue?.length || 0} days</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiShoppingBag className="w-8 h-8 text-purple-600" />
                  <span className="text-3xl font-bold">{analytics?.revenue?.dailyRevenue?.reduce((sum, d) => sum + d.orders, 0) || 0}</span>
                </div>
                <p className="text-gray-600">Total Orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <FiTrendingUp className="w-8 h-8 text-orange-600" />
                  <span className="text-3xl font-bold">{analytics?.customers?.retentionRate || 0}%</span>
                </div>
                <p className="text-gray-600">Retention Rate</p>
                <p className="text-sm text-gray-500 mt-2">
                  {analytics?.customers?.repeatCustomers || 0} repeat customers
                </p>
              </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Trend - Line Chart */}
              {analytics?.revenue?.dailyRevenue && (
                <LineChartComponent
                  data={analytics.revenue.dailyRevenue}
                  nameKey="date"
                  dataKey="revenue"
                  title="Daily Revenue Trend"
                  color="#10b981"
                />
              )}

              {/* Customer Growth - Area Chart */}
              {analytics?.customers?.dailyCustomerTrend && (
                <AreaChartComponent
                  data={analytics.customers.dailyCustomerTrend}
                  nameKey="date"
                  dataKey="count"
                  title="Customer Acquisition Trend"
                  color="#8b5cf6"
                />
              )}
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Order Status - Pie Chart */}
              {analytics?.revenue?.orderStatusDistribution && (
                <PieChartComponent
                  data={analytics.revenue.orderStatusDistribution}
                  nameKey="_id"
                  dataKey="count"
                  title="Order Status Distribution"
                  isDonut={true}
                />
              )}

              {/* Category Revenue - Bar Chart */}
              {analytics?.revenue?.categoryRevenue && (
                <BarChartComponent
                  data={analytics.revenue.categoryRevenue}
                  nameKey="_id"
                  dataKey="revenue"
                  title="Revenue by Category"
                  color="#3b82f6"
                />
              )}
            </div>
          </>
        )}

        {/* Revenue Analytics Tab */}
        {activeTab === 'revenue' && (
          <>
            {/* Chart Type Selector */}
            <div className="flex items-center gap-2 mb-6 bg-white p-3 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-700">Chart View:</span>
              <button
                onClick={() => setChartView({ ...chartView, revenue: 'line' })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  chartView.revenue === 'line'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiActivity className="inline mr-1" /> Line
              </button>
              <button
                onClick={() => setChartView({ ...chartView, revenue: 'area' })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  chartView.revenue === 'area'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBarChart2 className="inline mr-1" /> Area
              </button>
              <button
                onClick={() => setChartView({ ...chartView, revenue: 'bar' })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  chartView.revenue === 'bar'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBarChart2 className="inline mr-1" /> Bar
              </button>
            </div>

            {/* Revenue Trend Chart */}
            {analytics?.revenue?.dailyRevenue && (
              <div className="mb-8">
                {chartView.revenue === 'line' && (
                  <LineChartComponent
                    data={analytics.revenue.dailyRevenue}
                    nameKey="date"
                    dataKey="revenue"
                    title="Daily Revenue Trend (Line Chart)"
                    color="#10b981"
                    height={350}
                  />
                )}
                {chartView.revenue === 'area' && (
                  <AreaChartComponent
                    data={analytics.revenue.dailyRevenue}
                    nameKey="date"
                    dataKey="revenue"
                    title="Daily Revenue Trend (Area Chart)"
                    color="#10b981"
                    height={350}
                  />
                )}
                {chartView.revenue === 'bar' && (
                  <BarChartComponent
                    data={analytics.revenue.dailyRevenue}
                    nameKey="date"
                    dataKey="revenue"
                    title="Daily Revenue (Bar Chart)"
                    color="#10b981"
                    height={350}
                  />
                )}
              </div>
            )}

            {/* Monthly Revenue */}
            {analytics?.revenue?.monthlyRevenue && (
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <LineChartComponent
                  data={analytics.revenue.monthlyRevenue}
                  nameKey="month"
                  dataKey="revenue"
                  title="Monthly Revenue Trend"
                  color="#06b6d4"
                />
                <AreaChartComponent
                  data={analytics.revenue.monthlyRevenue}
                  nameKey="month"
                  dataKey="revenue"
                  title="Cumulative Revenue"
                  color="#06b6d4"
                />
              </div>
            )}

            {/* Payment Method Distribution */}
            {analytics?.revenue?.revenueByPayment && (
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <PieChartComponent
                  data={analytics.revenue.revenueByPayment}
                  nameKey="_id"
                  dataKey="revenue"
                  title="Revenue by Payment Method"
                  isDonut={true}
                />
                <BarChartComponent
                  data={analytics.revenue.revenueByPayment}
                  nameKey="_id"
                  dataKey="count"
                  title="Orders by Payment Method"
                  color="#f59e0b"
                />
              </div>
            )}

            {/* Stacked Category Revenue Over Time */}
            {analytics?.revenue?.stackedCategoryRevenue && (
              <div className="mb-8">
                <StackedBarChartComponent
                  data={analytics.revenue.stackedCategoryRevenue}
                  title="Category Revenue Over Time (Stacked Bar)"
                  height={400}
                />
              </div>
            )}

            {/* 100% Stacked Bar */}
            {analytics?.revenue?.stackedCategoryRevenue && (
              <div className="mb-8">
                <PercentStackedBarChartComponent
                  data={analytics.revenue.stackedCategoryRevenue}
                  title="Category Revenue Distribution (100% Stacked)"
                  height={400}
                />
              </div>
            )}

            {/* Order Status Distribution */}
            {analytics?.revenue?.orderStatusDistribution && (
              <div className="grid lg:grid-cols-2 gap-8">
                <PieChartComponent
                  data={analytics.revenue.orderStatusDistribution}
                  nameKey="_id"
                  dataKey="count"
                  title="Orders by Status"
                  isDonut={false}
                />
                <PieChartComponent
                  data={analytics.revenue.orderStatusDistribution}
                  nameKey="_id"
                  dataKey="revenue"
                  title="Revenue by Order Status"
                  isDonut={true}
                />
              </div>
            )}
          </>
        )}

        {/* Customer Analytics Tab */}
        {activeTab === 'customer' && (
          <>
            {/* Customer Stats */}
            {analytics?.customers && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FiUsers className="w-8 h-8 text-blue-600" />
                    <span className="text-3xl font-bold">{analytics.customers.newCustomers}</span>
                  </div>
                  <p className="text-gray-600">New Customers</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FiUsers className="w-8 h-8 text-green-600" />
                    <span className="text-3xl font-bold">{analytics.customers.repeatCustomers}</span>
                  </div>
                  <p className="text-gray-600">Repeat Customers</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FiTrendingUp className="w-8 h-8 text-purple-600" />
                    <span className="text-3xl font-bold">{analytics.customers.retentionRate}%</span>
                  </div>
                  <p className="text-gray-600">Retention Rate</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FiUsers className="w-8 h-8 text-orange-600" />
                    <span className="text-3xl font-bold">{analytics.customers.totalCustomers}</span>
                  </div>
                  <p className="text-gray-600">Total Customers</p>
                </div>
              </div>
            )}

            {/* Chart View Selector */}
            <div className="flex items-center gap-2 mb-6 bg-white p-3 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-700">Customer Chart View:</span>
              <button
                onClick={() => setChartView({ ...chartView, customer: 'bar' })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  chartView.customer === 'bar'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBarChart2 className="inline mr-1" /> Bar
              </button>
              <button
                onClick={() => setChartView({ ...chartView, customer: 'line' })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  chartView.customer === 'line'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiActivity className="inline mr-1" /> Line
              </button>
            </div>

            {/* Customer Growth Charts */}
            {analytics?.customers?.dailyCustomerTrend && (
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {chartView.customer === 'bar' ? (
                  <BarChartComponent
                    data={analytics.customers.dailyCustomerTrend}
                    nameKey="date"
                    dataKey="count"
                    title="Daily Customer Registration (Bar Chart)"
                    color="#3b82f6"
                  />
                ) : (
                  <LineChartComponent
                    data={analytics.customers.dailyCustomerTrend}
                    nameKey="date"
                    dataKey="count"
                    title="Daily Customer Registration (Line Chart)"
                    color="#3b82f6"
                  />
                )}
                <AreaChartComponent
                  data={analytics.customers.dailyCustomerTrend}
                  nameKey="date"
                  dataKey="count"
                  title="Cumulative Customer Growth"
                  color="#8b5cf6"
                />
              </div>
            )}

            {/* Monthly Customer Growth */}
            {analytics?.customers?.monthlyCustomerGrowth && (
              <div className="mb-8">
                <LineChartComponent
                  data={analytics.customers.monthlyCustomerGrowth}
                  nameKey="month"
                  dataKey="count"
                  title="Monthly Customer Growth Trend"
                  color="#10b981"
                  height={350}
                />
              </div>
            )}

            {/* Customer Segments - Pie Chart */}
            {analytics?.customers?.customerSegments && (
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <PieChartComponent
                  data={analytics.customers.customerSegments}
                  nameKey="_id"
                  dataKey="count"
                  title="Customer Segments Distribution"
                  isDonut={true}
                />
                <BarChartComponent
                  data={analytics.customers.customerSegments}
                  nameKey="_id"
                  dataKey="avgSpent"
                  title="Average Spending by Segment"
                  color="#f59e0b"
                />
              </div>
            )}

            {/* Customer Location - Bar Chart */}
            {analytics?.customers?.customerLocation && (
              <div className="mb-8">
                <BarChartComponent
                  data={analytics.customers.customerLocation}
                  nameKey="_id"
                  dataKey="count"
                  title="Orders by Location"
                  color="#06b6d4"
                  height={350}
                />
              </div>
            )}

            {/* Customer Order Status - Pie Chart */}
            {analytics?.customers?.customerOrderStatus && (
              <div className="mb-8">
                <PieChartComponent
                  data={analytics.customers.customerOrderStatus}
                  nameKey="_id"
                  dataKey="count"
                  title="Customer Orders by Status"
                  isDonut={false}
                />
              </div>
            )}

            {/* Top Customers Table */}
            {analytics?.customers?.topCustomers && analytics.customers.topCustomers.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FiDollarSign className="w-6 h-6 mr-2 text-green-600" />
                  Top Customers by Revenue
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Orders
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Spent
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.customers.topCustomers.map((customer, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                                {customer.name.charAt(0)}
                              </div>
                              <span className="font-medium">{customer.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {customer.email}
                            <br />
                            {customer.phone}
                          </td>
                          <td className="px-4 py-3 font-medium">{customer.orderCount}</td>
                          <td className="px-4 py-3 font-bold text-green-600">
                            ₹{customer.totalSpent.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Product Analytics Tab */}
        {activeTab === 'products' && (
          <>
            {/* Category Distribution - Pie Chart */}
            {analytics?.products?.categoryDistribution && (
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <PieChartComponent
                  data={analytics.products.categoryDistribution}
                  nameKey="_id"
                  dataKey="count"
                  title="Product Category Distribution"
                  isDonut={true}
                />
                <BarChartComponent
                  data={analytics.products.categoryDistribution}
                  nameKey="_id"
                  dataKey="count"
                  title="Products per Category"
                  color="#8b5cf6"
                />
              </div>
            )}

            {/* Best Selling Products - Bar Chart */}
            {analytics?.products?.bestSelling && (
              <div className="mb-8">
                <BarChartComponent
                  data={analytics.products.bestSelling.slice(0, 10)}
                  nameKey="name"
                  dataKey="quantitySold"
                  title="Top 10 Best Selling Products"
                  color="#10b981"
                  height={400}
                />
              </div>
            )}

            {/* Revenue by Category - Stacked Bar */}
            {analytics?.revenue?.categoryRevenue && (
              <div className="mb-8">
                <PieChartComponent
                  data={analytics.revenue.categoryRevenue}
                  nameKey="_id"
                  dataKey="revenue"
                  title="Revenue Share by Category"
                  isDonut={true}
                />
              </div>
            )}

            {/* Low Stock Alert */}
            {analytics?.products?.lowStock && analytics.products.lowStock.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Low Stock Alert</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Category
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Current Stock
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.products.lowStock.map((product) => (
                        <tr key={product._id} className="border-t">
                          <td className="px-4 py-2 font-medium">{product.name}</td>
                          <td className="px-4 py-2 capitalize">{product.category}</td>
                          <td className="px-4 py-2">
                            <span className={`font-bold ${product.stock < 5 ? 'text-red-600' : 'text-orange-600'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-2">₹{product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Out of Stock */}
            {analytics?.products?.outOfStock && analytics.products.outOfStock.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-red-600">❌ Out of Stock</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {analytics.products.outOfStock.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 bg-red-50">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                      <p className="text-sm text-red-600 font-bold mt-2">₹{product.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
