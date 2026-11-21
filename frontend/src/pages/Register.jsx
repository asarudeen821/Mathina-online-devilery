import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiShield, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OWNER_EMAIL = 'mathinachicken@gmail.com';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1); // 1=role select, 2=form
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    address: { street: '', area: '', city: 'Cuddalore', state: 'Tamil Nadu', pincode: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      toast('Shop Owner? Please use the login page with your credentials.', { icon: '🏪' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.email.trim().toLowerCase() === OWNER_EMAIL) {
      setError('This email is reserved for the shop owner.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Account created! Welcome to Mathina Chicken Center 🍗');
      navigate('/');
    } catch {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-10 px-4">
      <div className="max-w-lg mx-auto">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-3 shadow-lg">
            <GiChickenOven className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mathina Chicken Center</h1>
          <p className="text-gray-400 text-sm mt-1">Create your account</p>
        </div>

        {/* Step 1 — Role Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Who are you?</h2>
            <p className="text-gray-500 text-sm text-center mb-8">Select your account type to get started</p>

            <div className="grid grid-cols-2 gap-5 mb-6">
              {/* Customer */}
              <button
                onClick={() => handleRoleSelect('customer')}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all group"
              >
                <div className="w-16 h-16 bg-primary-100 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all">
                  <FiUser className="w-8 h-8 text-primary-600 group-hover:text-white transition-all" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800 group-hover:text-primary-700">Customer</p>
                  <p className="text-xs text-gray-400 mt-1">Order fresh chicken online</p>
                </div>
                <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                  Register here
                </span>
              </button>

              {/* Shop Owner */}
              <button
                onClick={() => handleRoleSelect('admin')}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-gray-200 hover:border-accent-400 hover:bg-accent-50 transition-all group"
              >
                <div className="w-16 h-16 bg-accent-100 group-hover:bg-accent-600 rounded-full flex items-center justify-center transition-all">
                  <FiShield className="w-8 h-8 text-accent-600 group-hover:text-white transition-all" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800 group-hover:text-accent-700">Shop Owner</p>
                  <p className="text-xs text-gray-400 mt-1">Manage Mathina Chicken Center</p>
                </div>
                <span className="text-xs bg-accent-100 text-accent-700 px-3 py-1 rounded-full font-medium">
                  Go to Login
                </span>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 text-center">
              ℹ️ Shop Owner accounts are pre-configured. Only customers can register here.
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
            </p>
          </div>
        )}

        {/* Step 2 — Customer Registration Form */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600">
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Customer Registration</h2>
                <p className="text-xs text-gray-400">Join Mathina Chicken Center · Cuddalore</p>
              </div>
              <div className="ml-auto bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <FiUser className="w-3 h-3" /> Customer
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="name" type="text" required value={formData.name} onChange={handleChange}
                    className="input-field pl-9" placeholder="Your full name" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gmail / Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="email" type="email" required value={formData.email} onChange={handleChange}
                    className="input-field pl-9" placeholder="yourname@gmail.com" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                    className="input-field pl-9" placeholder="10-digit mobile number" pattern="[0-9]{10}" />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input name="password" type={showPassword ? 'text' : 'password'} required
                      value={formData.password} onChange={handleChange}
                      className="input-field pl-9 pr-9" placeholder="Min 6 chars" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} required
                      value={formData.confirmPassword} onChange={handleChange}
                      className="input-field pl-9 pr-9" placeholder="Repeat" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">📍 Delivery Address</p>
                <div className="space-y-3">
                  <input name="address.street" type="text" required value={formData.address.street}
                    onChange={handleChange} className="input-field" placeholder="Street address" />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="address.area" type="text" required value={formData.address.area}
                      onChange={handleChange} className="input-field" placeholder="Area / Locality" />
                    <input name="address.pincode" type="text" required value={formData.address.pincode}
                      onChange={handleChange} className="input-field" placeholder="Pincode" pattern="[0-9]{6}" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mt-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><FiArrowRight className="w-4 h-4" /> Create Account</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
