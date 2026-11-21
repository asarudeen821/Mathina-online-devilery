import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiShield, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopAddress: '',
    licenseNumber: '',
    adminCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Validate admin code (for security)
    if (formData.adminCode !== 'MATHINA2024') {
      setError('Invalid Admin Registration Code');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, adminCode, ...registerData } = formData;
      
      // Create admin user
      const adminData = {
        ...registerData,
        role: 'admin',
        shopDetails: {
          shopName: formData.shopName,
          shopAddress: formData.shopAddress,
          licenseNumber: formData.licenseNumber,
        },
      };

      const user = await register(adminData);
      toast.success('Admin account created successfully!');
      navigate('/admin');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
            <FiShield className="w-8 h-8 text-accent-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Shop Owner Registration</h2>
          <p className="mt-2 text-gray-600">Register as admin to manage Mathina Chicken Center</p>
        </div>

        {/* Admin Alert */}
        <div className="bg-accent-50 border-l-4 border-accent-500 p-4 mb-8 rounded-r-lg">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-accent-900 text-sm">Admin Access Only</h3>
              <p className="text-sm text-accent-700 mt-1">
                This registration is only for authorized shop owners. You'll need the admin registration code to proceed.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-accent-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Shop Owner Info Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiShield className="w-5 h-5 text-accent-600" />
                Shop Owner Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shop Name */}
                <div className="md:col-span-2">
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop/ Business Name
                  </label>
                  <div className="relative">
                    <input
                      id="shopName"
                      name="shopName"
                      type="text"
                      required
                      value={formData.shopName}
                      onChange={handleChange}
                      className="input-field pl-4"
                      placeholder="Mathina Chicken Center"
                    />
                  </div>
                </div>

                {/* Owner Name */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="shop@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>

                {/* Shop Address */}
                <div className="md:col-span-2">
                  <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Address
                  </label>
                  <textarea
                    id="shopAddress"
                    name="shopAddress"
                    required
                    value={formData.shopAddress}
                    onChange={handleChange}
                    rows={3}
                    className="input-field"
                    placeholder="Complete shop address"
                  />
                </div>

                {/* License Number */}
                <div className="md:col-span-2">
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Business License Number (Optional)
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="License/Registration number"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiShield className="w-5 h-5 text-accent-600" />
                Security
              </h3>

              {/* Admin Code */}
              <div className="mb-4">
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Registration Code *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiShield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="adminCode"
                    name="adminCode"
                    type="text"
                    required
                    value={formData.adminCode}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter admin code"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Contact system administrator for this code</p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-accent-600 hover:bg-accent-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiShield className="w-5 h-5" />
                  Create Admin Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an admin account?{' '}
              <Link to="/login" className="text-accent-600 hover:text-accent-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Customer Registration Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Want to register as a customer?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Customer Registration
              </Link>
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-900 text-sm">Secure Access</h4>
            <p className="text-xs text-gray-600 mt-1">Admin code protected registration</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-900 text-sm">Full Control</h4>
            <p className="text-xs text-gray-600 mt-1">Manage products, orders & more</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📱</div>
            <h4 className="font-semibold text-gray-900 text-sm">Mobile Ready</h4>
            <p className="text-xs text-gray-600 mt-1">Manage from anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
