import { useState, useEffect } from 'react';
import { FiTrendingUp, FiAlertCircle, FiZap, FiRefreshCw, FiBarChart2 } from 'react-icons/fi';
import { dashboardAPI } from '../utils/api';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('7days');

  useEffect(() => {
    fetchInsights();
  }, [period]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data } = await dashboardAPI.getAIInsights({ period });
      setInsights(data.data);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInsightText = (text) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => {
      // Bold text
      const boldParts = line.split(/\*\*(.*?)\*\*/);
      
      return (
        <p key={index} className="mb-2">
          {boldParts.map((part, i) => {
            if (i % 2 === 1) {
              return <strong key={i} className="font-bold text-gray-900">{part}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FiZap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Business Insights</h2>
            <p className="text-sm text-gray-500">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border-2 border-gray-200 focus:border-purple-400 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh insights"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">AI is analyzing your data...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
          </div>
        </div>
      ) : insights ? (
        <div className="space-y-6">
          {/* Dashboard Data Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-600 font-semibold mb-1">Revenue</p>
              <p className="text-xl font-bold text-green-900">₹{insights.dashboardData.metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-semibold mb-1">Orders</p>
              <p className="text-xl font-bold text-blue-900">{insights.dashboardData.metrics.ordersInPeriod}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <p className="text-xs text-orange-600 font-semibold mb-1">Customers</p>
              <p className="text-xl font-bold text-orange-900">{insights.dashboardData.metrics.totalCustomers}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <p className="text-xs text-purple-600 font-semibold mb-1">Products</p>
              <p className="text-xl font-bold text-purple-900">{insights.dashboardData.metrics.totalProducts}</p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <FiBarChart2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-lg text-purple-900">AI Analysis & Recommendations</h3>
            </div>
            <div className="text-sm text-purple-800 leading-relaxed">
              {renderInsightText(insights.aiInsights)}
            </div>
          </div>

          {/* Top Products */}
          {insights.dashboardData.topProducts.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-green-600" />
                Top Performing Products
              </h3>
              <div className="space-y-2">
                {insights.dashboardData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.orders} orders</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Alerts */}
          {insights.dashboardData.lowStockProducts.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-600" />
                Low Stock Alerts
              </h3>
              <div className="space-y-2">
                {insights.dashboardData.lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FiAlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-900">{product.name}</p>
                        <p className="text-xs text-red-600">Only {product.stock} units left</p>
                      </div>
                    </div>
                    <button className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated At */}
          <p className="text-xs text-gray-400 text-center pt-4 border-t">
            AI Insights generated on {new Date(insights.generatedAt).toLocaleString('en-IN')}
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <FiZap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">No insights available</p>
          <p className="text-sm text-gray-500 mt-1">Click refresh to generate AI insights</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
