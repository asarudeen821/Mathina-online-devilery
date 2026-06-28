import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      area: user?.address?.area || '',
      city: user?.address?.city || 'Chennai',
      state: user?.address?.state || 'Tamil Nadu',
      pincode: user?.address?.pincode || '',
      landmark: user?.address?.landmark || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authAPI.updateProfile(formData);
      updateUser(data.data.user);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 text-sm"
            >
              <FiPackage />
              <span>My Orders</span>
            </Link>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 btn-outline"
              >
                <FiEdit2 />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="badge bg-primary-100 text-primary-800 mt-1 capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="input-field disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiPhone className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="input-field disabled:bg-gray-100"
                />
              </div>

              {/* Address */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">
                  <FiMapPin className="inline mr-2" />
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <input
                      type="text"
                      name="address.area"
                      value={formData.address.area}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="address.landmark"
                      value={formData.address.landmark}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FiSave />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user?.name || '',
                        phone: user?.phone || '',
                        address: {
                          street: user?.address?.street || '',
                          area: user?.address?.area || '',
                          city: user?.address?.city || 'Chennai',
                          state: user?.address?.state || 'Tamil Nadu',
                          pincode: user?.address?.pincode || '',
                          landmark: user?.address?.landmark || '',
                        },
                      });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
