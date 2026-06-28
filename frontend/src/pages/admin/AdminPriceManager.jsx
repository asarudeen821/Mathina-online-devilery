import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiEdit2, FiCalendar, FiClock, FiTrash2, FiPlus, FiX, FiSettings, FiSliders, FiLayers, FiDollarSign, FiActivity } from 'react-icons/fi';
import api, { productAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Standard KG options every chicken product should have
const KG_OPTIONS = [0.5, 1, 1.5, 2, 3];

const AdminPriceManager = () => {
  const { user, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [prices, setPrices] = useState({}); // { productId: { pricePerKg, weightOptions } }
  const [editingId, setEditingId] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mathina_price_history') || '[]'); } catch { return []; }
  });
  
  // Price scheduling states
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleMode, setScheduleMode] = useState('daily'); // 'daily' or 'weekly'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledPrices, setScheduledPrices] = useState({});
  const [scheduleReason, setScheduleReason] = useState('market-rate');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  // Hierarchical Pricing states
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'hierarchical'
  const [globalPrice, setGlobalPrice] = useState(200);
  const [globalNotes, setGlobalNotes] = useState('');
  const [cutConfigs, setCutConfigs] = useState([]);
  const [liveCuts, setLiveCuts] = useState({}); // { [cutName]: { rule, value, notes } }
  const [pricingHistory, setPricingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [updatingGlobal, setUpdatingGlobal] = useState(false);
  const [updatingCuts, setUpdatingCuts] = useState({});

  // Check admin authentication
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast.error('Access denied. Admin privileges required.');
      window.location.href = '/login';
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    fetchProducts();
    fetchHierarchicalPricing();
  }, []);

  // Fetch price schedules
  useEffect(() => {
    if (showSchedule) {
      fetchSchedules();
    }
  }, [showSchedule]);

  // Fetch pricing history when hierarchical tab is loaded
  useEffect(() => {
    if (activeTab === 'hierarchical') {
      fetchPricingHistory();
    }
  }, [activeTab]);

  const fetchSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const { data } = await api.get('/price-schedules', {
        params: { status: 'scheduled', limit: 100 }
      });
      setSchedules(data.data || []);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleSchedulePrice = async () => {
    try {
      const productsToSchedule = products.filter(p => scheduledPrices[p._id]);
      
      if (productsToSchedule.length === 0) {
        toast.error('Please select at least one product to schedule');
        return;
      }

      const scheduleDate = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      scheduleDate.setHours(0, 0, 0, 0);

      if (scheduleDate < today) {
        toast.error('Cannot schedule price for past dates');
        return;
      }

      // Create schedules for each product
      const promises = productsToSchedule.map(async (product) => {
        const priceData = scheduledPrices[product._id];
        await api.post('/price-schedules', {
          productId: product._id,
          effectiveDate: selectedDate,
          pricePerKg: priceData.pricePerKg,
          notes: scheduleNotes,
          reason: scheduleReason,
        });
      });

      await Promise.all(promises);
      
      toast.success(`Price scheduled for ${productsToSchedule.length} product(s) on ${new Date(selectedDate).toLocaleDateString('en-IN')}`);
      setShowSchedule(false);
      setScheduledPrices({});
      setScheduleNotes('');
      fetchSchedules();
    } catch (error) {
      console.error('Schedule price error:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule prices');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      if (!confirm('Are you sure you want to delete this scheduled price?')) return;
      
      await api.delete(`/price-schedules/${scheduleId}`);
      toast.success('Schedule deleted successfully');
      fetchSchedules();
    } catch (error) {
      console.error('Delete schedule error:', error);
      toast.error('Failed to delete schedule');
    }
  };

  const fetchHierarchicalPricing = async () => {
    try {
      const { data } = await api.get('/hierarchical-pricing');
      if (data?.success) {
        const globalData = data.data.global;
        const cutsData = data.data.cuts;
        
        setGlobalPrice(globalData.basePrice);
        setCutConfigs(cutsData);
        
        // Initialize live edits state
        const live = {};
        cutsData.forEach((cut) => {
          live[cut.cutName] = {
            rule: cut.rule,
            value: cut.value,
            notes: '',
          };
        });
        setLiveCuts(live);
      }
    } catch (error) {
      console.error('Failed to fetch hierarchical pricing structure:', error);
      toast.error('Failed to load hierarchical pricing config');
    }
  };

  const fetchPricingHistory = async () => {
    try {
      setLoadingHistory(true);
      const { data } = await api.get('/hierarchical-pricing/history');
      if (data?.success) {
        setPricingHistory(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch pricing audit history:', error);
      toast.error('Failed to load pricing history logs');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleUpdateGlobalPrice = async () => {
    if (globalPrice === undefined || globalPrice < 0) {
      toast.error('Please enter a valid positive base price');
      return;
    }
    
    try {
      setUpdatingGlobal(true);
      const { data } = await api.put('/hierarchical-pricing/global', {
        basePrice: Number(globalPrice),
        notes: globalNotes || 'Updated via Admin Price Dashboard',
      });
      
      if (data?.success) {
        toast.success(`Global price successfully set to ₹${globalPrice}/kg`);
        setGlobalNotes('');
        
        // Refresh products and hierarchical config to get updated cascades
        await fetchProducts();
        await fetchHierarchicalPricing();
        await fetchPricingHistory();
      }
    } catch (error) {
      console.error('Failed to update global price:', error);
      toast.error(error.response?.data?.message || 'Failed to update global base price');
    } finally {
      setUpdatingGlobal(false);
    }
  };

  const handleUpdateCutConfig = async (cutName, displayName) => {
    const config = liveCuts[cutName];
    if (!config || config.value === undefined) {
      toast.error('Please provide a valid pricing rule and value');
      return;
    }

    try {
      setUpdatingCuts((prev) => ({ ...prev, [cutName]: true }));
      const { data } = await api.put(`/hierarchical-pricing/cut/${cutName}`, {
        rule: config.rule,
        value: Number(config.value),
        notes: config.notes || `Updated configuration for ${displayName}`,
      });

      if (data?.success) {
        toast.success(`Updated ${displayName} pricing rules successfully`);
        
        // Clear notes for this cut
        setLiveCuts((prev) => ({
          ...prev,
          [cutName]: {
            ...prev[cutName],
            notes: '',
          },
        }));

        // Refresh products and hierarchical config
        await fetchProducts();
        await fetchHierarchicalPricing();
        await fetchPricingHistory();
      }
    } catch (error) {
      console.error(`Failed to update pricing for cut ${cutName}:`, error);
      toast.error(error.response?.data?.message || `Failed to update pricing for ${displayName}`);
    } finally {
      setUpdatingCuts((prev) => ({ ...prev, [cutName]: false }));
    }
  };

  const getLiveCalculatedPrice = (cutName) => {
    const config = liveCuts[cutName];
    if (!config) return 0;
    
    const { rule, value } = config;
    const base = Number(globalPrice) || 0;
    const val = Number(value) || 0;

    if (rule === 'independent') {
      return Math.max(0, Math.round(val));
    } else if (rule === 'percentage') {
      return Math.max(0, Math.round(base * (1 + val / 100)));
    } else if (rule === 'fixed') {
      return Math.max(0, Math.round(base + val));
    }
    return base;
  };

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll({ limit: 200 });
      const items = data.data || [];
      setProducts(items);

      // Init prices state from existing product data
      const init = {};
      items.forEach((p) => {
        // Derive pricePerKg from existing price (price is per kg in the DB)
        const perKg = p.price || 0;
        init[p._id] = {
          pricePerKg: perKg,
          weightOptions: KG_OPTIONS.map((kg) => ({
            weight: kg * 1000,
            price: Math.round(perKg * kg),
          })),
        };
      });
      setPrices(init);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (productId, newPricePerKg) => {
    const val = parseFloat(newPricePerKg) || 0;
    setPrices((prev) => ({
      ...prev,
      [productId]: {
        pricePerKg: val,
        weightOptions: KG_OPTIONS.map((kg) => ({
          weight: kg * 1000,
          price: Math.round(val * kg),
        })),
      },
    }));
  };

  const handleSave = async (product) => {
    const pid = product._id;
    const { pricePerKg, weightOptions } = prices[pid];

    if (!pricePerKg || pricePerKg <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setSaving((s) => ({ ...s, [pid]: true }));
    try {
      console.log('Updating price for product:', pid, 'New price:', pricePerKg);
      
      const response = await productAPI.update(pid, {
        price: pricePerKg,
        weightOptions,
      });
      
      console.log('Update response:', response);

      // Save to local history
      const entry = {
        id: Date.now(),
        productName: product.name,
        oldPrice: product.price,
        newPrice: pricePerKg,
        date: new Date().toLocaleString('en-IN'),
      };
      const updated = [entry, ...history].slice(0, 30);
      setHistory(updated);
      localStorage.setItem('mathina_price_history', JSON.stringify(updated));

      // Update local product list
      setProducts((prev) =>
        prev.map((p) => (p._id === pid ? { ...p, price: pricePerKg, weightOptions } : p))
      );

      toast.success(`✅ ${product.name} price updated to ₹${pricePerKg}/kg`);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update price:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update price';
      toast.error(`❌ ${errorMsg}`);
      
      // If 401, redirect to login
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    } finally {
      setSaving((s) => ({ ...s, [pid]: false }));
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              🔪 Price Manager
            </h1>
            <p className="text-gray-500 mt-1">Configure individual store prices or set up hierarchical scaling rules</p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'manual' && (
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  showSchedule
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiCalendar className="w-4 h-4" />
                Schedule Prices
              </button>
            )}
            <button
              onClick={async () => {
                await fetchProducts();
                await fetchHierarchicalPricing();
                if (activeTab === 'hierarchical') await fetchPricingHistory();
                toast.success('Prices and settings synced from database');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-1 bg-gray-200/60 p-1 rounded-xl mb-8 max-w-md mx-auto shadow-inner">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'manual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
            }`}
          >
            <FiSliders className="w-4 h-4" />
            Manual & Schedules
          </button>
          <button
            onClick={() => setActiveTab('hierarchical')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'hierarchical'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
            }`}
          >
            <FiLayers className="w-4 h-4" />
            Hierarchical Pricing
          </button>
        </div>

        {activeTab === 'manual' ? (
          <>
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>How it works:</strong> Enter the price per 1 kg. All weight options (0.5kg, 1kg, 1.5kg, 2kg, 3kg)
                will be automatically calculated and saved. Customers will see the updated prices immediately.
              </div>
            </div>

            {/* Price Scheduling Section */}
            {showSchedule && (
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-6 h-6 text-primary-600" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Schedule Future Prices</h2>
                      <p className="text-sm text-gray-600">Set prices for specific dates or weeks in advance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSchedule(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Schedule Mode Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setScheduleMode('daily')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      scheduleMode === 'daily'
                        ? 'border-primary-500 bg-white shadow-md'
                        : 'border-gray-200 bg-white/50 hover:border-primary-300'
                    }`}
                  >
                    <FiCalendar className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Daily</p>
                    <p className="text-xs text-gray-500">Set for specific date</p>
                  </button>
                  <button
                    onClick={() => setScheduleMode('weekly')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      scheduleMode === 'weekly'
                        ? 'border-primary-500 bg-white shadow-md'
                        : 'border-gray-200 bg-white/50 hover:border-primary-300'
                    }`}
                  >
                    <FiClock className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Weekly</p>
                    <p className="text-xs text-gray-500">Set for entire week</p>
                  </button>
                </div>

                {/* Date Selection */}
                <div className="bg-white rounded-xl p-4 mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-lg px-4 py-2 text-lg font-medium outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {/* Reason & Notes */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason for Change
                    </label>
                    <select
                      value={scheduleReason}
                      onChange={(e) => setScheduleReason(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-lg px-3 py-2 outline-none transition-colors"
                    >
                      <option value="market-rate">Market Rate Change</option>
                      <option value="festival-demand">Festival Demand</option>
                      <option value="supply-shortage">Supply Shortage</option>
                      <option value="seasonal">Seasonal Adjustment</option>
                      <option value="promotion">Promotional Pricing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={scheduleNotes}
                      onChange={(e) => setScheduleNotes(e.target.value)}
                      placeholder="e.g., Price increase due to festival season"
                      className="w-full border-2 border-gray-200 focus:border-primary-400 rounded-lg px-3 py-2 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Scheduled Prices Summary */}
                {schedules.length > 0 && (
                  <div className="bg-white rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Upcoming Scheduled Prices ({schedules.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {schedules.map((schedule) => (
                        <div key={schedule._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                              <span className="text-lg">📅</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {schedule.product?.name || 'Product'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(schedule.effectiveDate).toLocaleDateString('en-IN')} • {schedule.reason}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold text-primary-700">₹{schedule.pricePerKg}/kg</p>
                              <p className="text-xs text-gray-500">Scheduled</p>
                            </div>
                            <button
                              onClick={() => handleDeleteSchedule(schedule._id)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete schedule"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Schedule Button */}
                <button
                  onClick={handleSchedulePrice}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  <FiSave className="w-5 h-5" />
                  Schedule Prices for {new Date(selectedDate).toLocaleDateString('en-IN')}
                </button>
              </div>
            )}

            {/* Products Price Grid */}
            <div className="space-y-8 mb-10">
              {['chicken-cuts', 'ready-to-cook', 'marinades', 'eggs', 'organs', 'live-chicken'].map((cat) => {
                const catProducts = products.filter((p) => p.category === cat);
                if (catProducts.length === 0) return null;
                const catLabel = cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <div key={cat}>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="flex-1 border-t border-gray-200" />
                      {catLabel}
                      <span className="flex-1 border-t border-gray-200" />
                    </h2>
                    <div className="space-y-4">
                      {catProducts.map((product) => {
                        const p = prices[product._id] || { pricePerKg: product.price, weightOptions: [] };
                        const isEditing = editingId === product._id;
                        const isSaving = saving[product._id];

                        return (
                          <div
                            key={product._id}
                            className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
                              isEditing ? 'border-primary-400 shadow-md' : 'border-gray-100'
                            }`}
                          >
                            <div className="p-5">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                {/* Product Info */}
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img
                                      src={product.images?.[0]?.url || 'https://via.placeholder.com/48?text=🍗'}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                    <p className="text-xs text-gray-500 capitalize">{product.subCategory || product.category}</p>
                                  </div>
                                </div>

                                {/* Current Price */}
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 mb-0.5">Current Price</p>
                                  <p className="text-xl font-bold text-gray-800">₹{product.price}<span className="text-sm font-normal text-gray-500">/kg</span></p>
                                </div>

                                {/* Price Input */}
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">New Price (₹/kg)</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500 font-medium">₹</span>
                                      <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={p.pricePerKg}
                                        onChange={(e) => {
                                          handlePriceChange(product._id, e.target.value);
                                          setEditingId(product._id);
                                        }}
                                        onFocus={() => setEditingId(product._id)}
                                        className="w-24 border-2 border-gray-200 focus:border-primary-400 rounded-lg px-3 py-2 text-lg font-bold text-primary-700 outline-none transition-colors"
                                      />
                                      <span className="text-gray-500 text-sm">/kg</span>
                                    </div>
                                  </div>

                                  {/* Save Button */}
                                  <button
                                    onClick={() => handleSave(product)}
                                    disabled={isSaving || p.pricePerKg === product.price}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                                      p.pricePerKg !== product.price
                                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    {isSaving ? (
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : p.pricePerKg !== product.price ? (
                                      <><FiSave className="w-4 h-4" /> Save</>
                                    ) : (
                                      <><FiCheckCircle className="w-4 h-4" /> Saved</>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Live Weight Breakdown */}
                              {isEditing && p.pricePerKg > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                    Auto-calculated prices for all weights:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {p.weightOptions.map((opt) => (
                                      <div
                                        key={opt.weight}
                                        className="bg-primary-50 border border-primary-200 rounded-lg px-3 py-1.5 text-center"
                                      >
                                        <p className="text-xs text-primary-600 font-medium">
                                          {opt.weight >= 1000 ? `${opt.weight / 1000} kg` : `${opt.weight}g`}
                                        </p>
                                        <p className="text-sm font-bold text-primary-800">₹{opt.price}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Change History */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiEdit2 className="w-5 h-5 text-primary-600" /> Price Change History
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase border-b">
                        <th className="pb-2 pr-4">Product</th>
                        <th className="pb-2 pr-4">Old Price</th>
                        <th className="pb-2 pr-4">New Price</th>
                        <th className="pb-2">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {history.map((h) => (
                        <tr key={h.id} className="hover:bg-gray-50">
                          <td className="py-2 pr-4 font-medium text-gray-800">{h.productName}</td>
                          <td className="py-2 pr-4 text-gray-500 line-through">₹{h.oldPrice}/kg</td>
                          <td className="py-2 pr-4 font-bold text-primary-700">₹{h.newPrice}/kg</td>
                          <td className="py-2 text-gray-400 text-xs">{h.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            
            {/* Global Pricing Controls */}
            <div className="bg-gradient-to-br from-primary-600 to-emerald-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute left-1/3 bottom-0 -ml-6 -mb-6 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiActivity className="w-5 h-5 text-emerald-300 animate-pulse" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-emerald-100">Global Base Level</span>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Chicken Base Price</h2>
                  <p className="text-emerald-100/90 text-sm max-w-md">
                    Modifying this price will automatically update all cuts using markup/discount rules instantly and save them to the product catalog.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[200px]">
                  <span className="text-xs font-semibold text-emerald-200 mb-1 uppercase tracking-wider">Current Global Price</span>
                  <div className="text-4xl font-extrabold">₹{globalPrice}<span className="text-lg font-medium text-emerald-200">/kg</span></div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20 grid md:grid-cols-3 gap-4 items-end relative z-10">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-100">New Base Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-800 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={globalPrice}
                      onChange={(e) => setGlobalPrice(e.target.value)}
                      className="w-full bg-white text-gray-900 placeholder-gray-400 font-bold rounded-xl pl-8 pr-12 py-2 outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow"
                      placeholder="200"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-medium">/ kg</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-100">Update Reason / Note</label>
                  <input
                    type="text"
                    value={globalNotes}
                    onChange={(e) => setGlobalNotes(e.target.value)}
                    className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow text-sm"
                    placeholder="e.g. Market-wide base chicken price adjustment"
                  />
                </div>
                
                <button
                  onClick={handleUpdateGlobalPrice}
                  disabled={updatingGlobal}
                  className="bg-white hover:bg-emerald-50 text-emerald-800 font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {updatingGlobal ? (
                    <div className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save Base Price
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Cuts Configuration Simulator */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiSettings className="text-primary-600" />
                    Cut Configuration & Simulator
                  </h3>
                  <p className="text-sm text-gray-500">Configure how individual chicken cut prices interact with the global base rate.</p>
                </div>
                <button
                  onClick={fetchHierarchicalPricing}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 py-1.5 px-3 rounded-lg border border-primary-100 transition-colors"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" /> Re-sync
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cutConfigs.map((cut) => {
                  const name = cut.cutName;
                  const live = liveCuts[name] || { rule: cut.rule, value: cut.value, notes: '' };
                  const isUpdating = updatingCuts[name] || false;
                  
                  // Calculate live preview
                  const previewPrice = getLiveCalculatedPrice(name);
                  const hasChanged = live.rule !== cut.rule || Number(live.value) !== cut.value || live.notes !== '';
                  const hasValChanged = live.rule !== cut.rule || Number(live.value) !== cut.value;
                  
                  return (
                    <div
                      key={cut._id}
                      className={`bg-white rounded-2xl shadow-sm border-2 transition-all flex flex-col justify-between overflow-hidden hover:shadow-md hover:-translate-y-0.5 duration-200 ${
                        hasValChanged ? 'border-primary-400' : 'border-gray-100'
                      }`}
                    >
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        {/* Cut Header */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{name}</span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                cut.rule === 'independent'
                                  ? 'bg-amber-100 text-amber-800'
                                  : cut.rule === 'percentage'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {cut.rule === 'independent' ? 'Independent' : cut.rule === 'percentage' ? 'Percentage' : 'Fixed'}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mt-1">{cut.displayName}</h4>
                        </div>

                        {/* Config Form */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Pricing Rule</label>
                            <select
                              value={live.rule}
                              onChange={(e) => {
                                setLiveCuts((prev) => ({
                                  ...prev,
                                  [name]: {
                                    ...prev[name],
                                    rule: e.target.value,
                                    // Reset value to reasonable default if rule changes
                                    value: e.target.value === 'percentage' ? 20 : e.target.value === 'fixed' ? 50 : cut.finalPrice,
                                  },
                                }));
                              }}
                              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-primary-400 bg-gray-50/50"
                            >
                              <option value="independent">Independent (Fixed overrides)</option>
                              <option value="percentage">Percentage Markup / Discount</option>
                              <option value="fixed">Fixed Markup / Discount (₹)</option>
                            </select>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-xs font-semibold text-gray-500">
                                {live.rule === 'independent'
                                  ? 'Custom Price Per Kg'
                                  : live.rule === 'percentage'
                                  ? 'Markup / Discount %'
                                  : 'Markup / Discount Amount (₹)'}
                              </label>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {live.rule === 'percentage' && 'positive = markup, negative = discount'}
                                {live.rule === 'fixed' && 'positive = markup, negative = discount'}
                              </span>
                            </div>
                            <div className="relative">
                              {live.rule !== 'percentage' && <span className="absolute left-3 top-2 text-sm text-gray-400">₹</span>}
                              <input
                                type="number"
                                value={live.value}
                                onChange={(e) => {
                                  setLiveCuts((prev) => ({
                                    ...prev,
                                    [name]: {
                                      ...prev[name],
                                      value: e.target.value,
                                    },
                                  }));
                                }}
                                className={`w-full border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-semibold outline-none focus:border-primary-400 ${
                                  live.rule !== 'percentage' ? 'pl-7' : ''
                                }`}
                                placeholder="0"
                              />
                              {live.rule === 'percentage' && <span className="absolute right-3 top-2 text-sm text-gray-400">%</span>}
                            </div>
                          </div>

                          {/* Notes */}
                          {hasValChanged && (
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Audit Log Note</label>
                              <input
                                type="text"
                                value={live.notes}
                                onChange={(e) => {
                                  setLiveCuts((prev) => ({
                                    ...prev,
                                    [name]: {
                                      ...prev[name],
                                      notes: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full border border-gray-200 rounded-lg py-1.5 px-3 text-xs outline-none focus:border-primary-400"
                                placeholder="Reason for changing cut rule..."
                              />
                            </div>
                          )}
                        </div>

                        {/* Live Recalculated Preview Banner */}
                        <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100 flex items-center justify-between">
                          <div className="text-xs text-primary-700 font-medium">Calculated Price</div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-primary-800">₹{previewPrice}</span>
                            <span className="text-[10px] text-primary-600 font-medium">/kg</span>
                            <div className="text-[9px] text-gray-400 mt-0.5">
                              {hasValChanged ? `Current: ₹${cut.finalPrice}` : 'Unchanged'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Save Card Action */}
                      <button
                        onClick={() => handleUpdateCutConfig(name, cut.displayName)}
                        disabled={isUpdating || !hasValChanged}
                        className={`w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-t transition-all ${
                          hasValChanged
                            ? 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600 font-bold'
                            : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                        }`}
                      >
                        {isUpdating ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : hasValChanged ? (
                          <>
                            <FiSave className="w-4 h-4" /> Save New Configuration
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-4 h-4 text-emerald-500" /> Active Configuration Saved
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Logs History */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FiClock className="w-5 h-5 text-primary-600" /> Dynamic Pricing Audit Timeline
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Secure history log of all pricing modifications and automated cascades.</p>
                </div>
                <button
                  onClick={fetchPricingHistory}
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border transition-colors"
                >
                  <FiRefreshCw className="w-3 h-3" /> Refresh Logs
                </button>
              </div>

              {loadingHistory ? (
                <div className="py-8 flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : pricingHistory.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                  No pricing adjustments recorded in the audit trail.
                </div>
              ) : (
                <div className="relative border-l border-gray-200 ml-4 pl-6 space-y-6">
                  {pricingHistory.map((log) => {
                    const isGlobal = log.changeType === 'global';
                    const dateStr = new Date(log.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div key={log._id} className="relative">
                        {/* Dot Indicator */}
                        <span className={`absolute -left-[31px] top-1.5 flex items-center justify-center w-4 h-4 rounded-full border-2 bg-white ${
                          isGlobal ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-indigo-500 ring-4 ring-indigo-50'
                        }`} />
                        
                        <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  isGlobal
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {isGlobal ? 'Global Update' : `Cut Config: ${log.target}`}
                              </span>
                              <span className="text-xs text-gray-500 font-medium">
                                by {log.changedBy?.name || 'Admin'} ({log.changedBy?.email || 'N/A'})
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 font-semibold">{dateStr}</span>
                          </div>

                          <div className="text-sm font-semibold text-gray-800 mb-2">
                            {isGlobal ? (
                              <div className="flex items-center gap-2">
                                <span>Base Price:</span>
                                <span className="line-through text-gray-400">₹{log.oldValue}</span>
                                <span className="text-emerald-700">➔</span>
                                <span className="text-emerald-700 font-bold">₹{log.newValue}</span>
                                <span className="text-xs text-gray-500">/kg</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500 capitalize">Rule:</span>
                                  <span className="font-semibold text-gray-700 capitalize text-xs">
                                    {log.oldValue?.rule} ({log.oldValue?.value}) ➔ {log.newValue?.rule} ({log.newValue?.value})
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500">Result Price:</span>
                                  <span className="line-through text-gray-400">₹{log.oldValue?.finalPrice}</span>
                                  <span className="text-indigo-700">➔</span>
                                  <span className="text-indigo-700 font-bold">₹{log.newValue?.finalPrice}</span>
                                  <span className="text-xs text-gray-500">/kg</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {log.notes && (
                            <div className="text-xs text-gray-600 bg-white/80 border border-gray-100 p-2 rounded-xl italic">
                              <span className="font-bold text-gray-500 not-italic block text-[9px] uppercase tracking-wider mb-0.5">Notes:</span>
                              "{log.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPriceManager;
