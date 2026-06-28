import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiRefreshCw, FiPause, FiPlay } from 'react-icons/fi';
import { subscriptionAPI, productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { addToCart } = useCart();

  const [formData, setFormData] = useState({
    planType: 'weekly',
    items: [],
    frequency: 'every-week',
    deliveryDay: 'monday',
    deliveryTime: 'morning',
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchProducts();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data } = await subscriptionAPI.getMySubscriptions();
      setSubscriptions(data.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll({ limit: 50 });
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleAddProduct = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product && !formData.items.find((i) => i.product === productId)) {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          { product: productId, name: product.name, quantity: 1, price: product.price },
        ],
      });
    }
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      items: formData.items.filter((i) => i.product !== productId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscriptionAPI.create(formData);
      toast.success('Subscription created successfully!');
      setShowCreate(false);
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to create subscription');
    }
  };

  const handlePause = async (id) => {
    try {
      await subscriptionAPI.pause(id, 'User requested');
      toast.success('Subscription paused');
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to pause subscription');
    }
  };

  const handleResume = async (id) => {
    try {
      await subscriptionAPI.resume(id);
      toast.success('Subscription resumed');
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to resume subscription');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
            {showCreate ? 'Cancel' : 'Create Subscription'}
          </button>
        </div>

        {/* Create Subscription Form */}
        {showCreate && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Subscription</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Type
                </label>
                <select
                  value={formData.planType}
                  onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                  className="input-field"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Add Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Products
                </label>
                <select
                  onChange={(e) => handleAddProduct(e.target.value)}
                  className="input-field"
                  value=""
                >
                  <option value="">Add a product...</option>
                  {products
                    .filter((p) => !formData.items.find((i) => i.product === p._id))
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ₹{product.price}
                      </option>
                    ))}
                </select>
              </div>

              {/* Selected Products */}
              {formData.items.length > 0 && (
                <div className="space-y-2">
                  {formData.items.map((item) => (
                    <div
                      key={item.product}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded"
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.product)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Day
                </label>
                <select
                  value={formData.deliveryDay}
                  onChange={(e) => setFormData({ ...formData, deliveryDay: e.target.value })}
                  className="input-field"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <select
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  className="input-field"
                >
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 10 PM)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full">
                Create Subscription
              </button>
            </form>
          </div>
        )}

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FiCalendar className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No subscriptions</h2>
            <p className="text-gray-600 mb-6">
              Create a subscription for regular deliveries
            </p>
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              Create Subscription
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg capitalize">{sub.planType} Plan</h3>
                    <p className="text-gray-600 text-sm">{sub.frequency}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sub.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : sub.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                {/* Items */}
                <div className="border-t border-b py-4 my-4 space-y-2">
                  {sub.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Delivery: {sub.deliveryDay} ({sub.deliveryTime})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total: ₹{sub.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Delivery: {new Date(sub.nextDeliveryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {sub.status === 'active' ? (
                    <button
                      onClick={() => handlePause(sub._id)}
                      className="flex-1 btn-outline flex items-center justify-center space-x-2"
                    >
                      <FiPause />
                      <span>Pause</span>
                    </button>
                  ) : sub.status === 'paused' ? (
                    <button
                      onClick={() => handleResume(sub._id)}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2"
                    >
                      <FiPlay />
                      <span>Resume</span>
                    </button>
                  ) : null}
                  <button className="flex-1 btn-outline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
