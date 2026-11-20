import { useState, useEffect } from 'react';
import { FiCalendar, FiSave, FiTrash2, FiClock, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiEdit3 } from 'react-icons/fi';
import { productAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AdminPriceScheduler = () => {
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('market-rate');
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('schedule'); // 'schedule' or 'calendar'
  const [filterDate, setFilterDate] = useState('');

  // Check admin authentication
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast.error('Access denied. Admin privileges required.');
      window.location.href = '/login';
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, schedulesRes] = await Promise.all([
        productAPI.getAll({ limit: 200 }),
        axios.get(`${API_URL}/price-schedules`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      setProducts(productsRes.data.data || []);
      setSchedules(schedulesRes.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !selectedDate || !pricePerKg) {
      toast.error('Please fill all required fields');
      return;
    }

    if (parseFloat(pricePerKg) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post(
        `${API_URL}/price-schedules`,
        {
          productId: selectedProduct,
          effectiveDate: selectedDate,
          pricePerKg: parseFloat(pricePerKg),
          notes,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      toast.success('✅ Price schedule created successfully!');
      
      // Reset form
      setSelectedProduct(null);
      setSelectedDate('');
      setPricePerKg('');
      setNotes('');
      setReason('market-rate');

      // Refresh schedules
      await fetchData();
    } catch (error) {
      console.error('Create schedule error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create schedule';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await axios.delete(`${API_URL}/price-schedules/${scheduleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      toast.success('Schedule deleted successfully');
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete schedule');
    }
  };

  const handleApplySchedules = async () => {
    if (!confirm('Apply all scheduled prices for today?')) return;

    try {
      const response = await axios.post(
        `${API_URL}/price-schedules/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      toast.success(`✅ ${response.data.message}`);
      await fetchData();
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Failed to apply schedules');
    }
  };

  const getSchedulesForDate = (date) => {
    return schedules.filter((s) => {
      const scheduleDate = new Date(s.effectiveDate).toISOString().split('T')[0];
      return scheduleDate === date;
    });
  };

  const getUpcomingSchedules = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return schedules
      .filter((s) => new Date(s.effectiveDate) >= today && s.status === 'scheduled')
      .sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate));
  };

  const getTodaySchedules = () => {
    const today = new Date().toISOString().split('T')[0];
    return getSchedulesForDate(today);
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const selectedProductData = products.find((p) => p._id === selectedProduct);
  const upcomingSchedules = getUpcomingSchedules();
  const todaySchedules = getTodaySchedules();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiCalendar className="text-primary-600" />
              Price Scheduler
            </h1>
            <p className="text-gray-500 mt-1">Schedule prices for future dates</p>
          </div>
          <button
            onClick={handleApplySchedules}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiClock className="w-4 h-4" />
            Apply Today's Schedules
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>How it works:</strong> Schedule prices for specific dates. Prices will automatically apply on the scheduled date.
            You can set different prices for different days (e.g., Today: ₹200/kg, Tomorrow: ₹300/kg, Next Week: ₹250/kg).
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Create Schedule Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiEdit3 className="text-primary-600" />
                Create Price Schedule
              </h2>

              <form onSubmit={handleCreateSchedule} className="space-y-4">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product *
                  </label>
                  <select
                    value={selectedProduct || ''}
                    onChange={(e) => {
                      setSelectedProduct(e.target.value);
                      const product = products.find((p) => p._id === e.target.value);
                      if (product) setPricePerKg(product.price.toString());
                    }}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 outline-none"
                  >
                    <option value="">Choose a product...</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} (Current: ₹{product.price}/kg)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 outline-none"
                  />
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per KG (₹) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(e.target.value)}
                      min="1"
                      step="1"
                      required
                      className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 outline-none"
                      placeholder="Enter price"
                    />
                    <span className="text-gray-500">/kg</span>
                  </div>
                  {selectedProductData && pricePerKg && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: ₹{selectedProductData.price}/kg
                      {parseFloat(pricePerKg) !== selectedProductData.price && (
                        <span className={parseFloat(pricePerKg) > selectedProductData.price ? 'text-red-600' : 'text-green-600'}>
                          {' '}({parseFloat(pricePerKg) > selectedProductData.price ? '+' : ''}
                          {((parseFloat(pricePerKg) - selectedProductData.price) / selectedProductData.price * 100).toFixed(1)}%)
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 outline-none"
                  >
                    <option value="market-rate">Market Rate Change</option>
                    <option value="festival-demand">Festival Demand</option>
                    <option value="supply-shortage">Supply Shortage</option>
                    <option value="seasonal">Seasonal Change</option>
                    <option value="promotion">Promotion/Discount</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    maxLength={500}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-400 outline-none resize-none"
                    placeholder="Add any notes..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      Create Schedule
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Schedules List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedules */}
            {todaySchedules.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCheckCircle className="text-green-600" />
                  Today's Prices
                </h2>
                <div className="space-y-3">
                  {todaySchedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule._id}
                      schedule={schedule}
                      onDelete={handleDeleteSchedule}
                      isToday
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Schedules */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-primary-600" />
                Upcoming Schedules ({upcomingSchedules.length})
              </h2>

              {upcomingSchedules.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming price schedules</p>
                  <p className="text-sm">Create one using the form on the left</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSchedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule._id}
                      schedule={schedule}
                      onDelete={handleDeleteSchedule}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Schedule Card Component
const ScheduleCard = ({ schedule, onDelete, isToday = false }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateStr = d.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    
    return d.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-4 transition-all ${
      isToday ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:border-primary-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={schedule.product?.images?.[0]?.url || 'https://via.placeholder.com/48?text=🍗'}
              alt={schedule.product?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{schedule.product?.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusColor(schedule.status)}`}>
                {schedule.status}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(schedule.effectiveDate)}
              </span>
            </div>
            {schedule.notes && (
              <p className="text-xs text-gray-500 mt-1 truncate">{schedule.notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-700">₹{schedule.pricePerKg}</p>
            <p className="text-xs text-gray-500">/kg</p>
          </div>
          {schedule.status === 'scheduled' && (
            <button
              onClick={() => onDelete(schedule._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete schedule"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPriceScheduler;
