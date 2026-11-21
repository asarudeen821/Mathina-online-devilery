import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const OWNER_EMAIL = 'mathinachicken@gmail.com';

// Step 1 — Email entry
const StepEmail = ({ email, setEmail, onNext, onFillOwnerDemo }) => (
  <div className="space-y-5">
    <div className="text-center mb-6">
      <p className="text-gray-500 text-sm">Enter your Gmail to get started</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Gmail / Email Address</label>
      <div className="relative">
        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && email.trim() && onNext()}
          className="input-field pl-10"
          placeholder="yourname@gmail.com"
          autoFocus
        />
      </div>
    </div>

    <button
      onClick={onNext}
      disabled={!email.trim()}
      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
    >
      Continue <FiArrowRight className="w-4 h-4" />
    </button>

    <div className="pt-2 border-t border-gray-100 flex justify-center">
      <button
        type="button"
        onClick={onFillOwnerDemo}
        className="text-xs text-accent-700 bg-accent-50 border border-accent-200 hover:bg-accent-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
      >
        <FiShield className="w-3.5 h-3.5" /> Quick Fill Shop Owner Account
      </button>
    </div>
  </div>
);

// Step 2 — Role selection
const StepRole = ({ email, role, setRole, onNext, onBack }) => (
  <div className="space-y-5">
    <div className="text-center mb-2">
      <p className="text-sm text-gray-500">Signed in as</p>
      <p className="font-semibold text-gray-800 text-sm mt-0.5 bg-gray-100 px-3 py-1.5 rounded-lg inline-block">{email}</p>
    </div>
    <p className="text-center text-gray-700 font-medium">Who are you?</p>

    <div className="grid grid-cols-2 gap-4">
      {/* Customer */}
      <button
        onClick={() => setRole('customer')}
        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
          role === 'customer'
            ? 'border-primary-500 bg-primary-50 shadow-md'
            : 'border-gray-200 hover:border-primary-300 bg-white'
        }`}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === 'customer' ? 'bg-primary-600' : 'bg-gray-100'}`}>
          <FiUser className={`w-7 h-7 ${role === 'customer' ? 'text-white' : 'text-gray-500'}`} />
        </div>
        <div className="text-center">
          <p className={`font-bold text-sm ${role === 'customer' ? 'text-primary-700' : 'text-gray-700'}`}>Customer</p>
          <p className="text-xs text-gray-400 mt-0.5">Buy fresh chicken</p>
        </div>
        {role === 'customer' && (
          <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">Selected ✓</span>
        )}
      </button>

      {/* Shop Owner */}
      <button
        onClick={() => setRole('admin')}
        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
          role === 'admin'
            ? 'border-accent-500 bg-accent-50 shadow-md'
            : 'border-gray-200 hover:border-accent-300 bg-white'
        }`}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === 'admin' ? 'bg-accent-600' : 'bg-gray-100'}`}>
          <FiShield className={`w-7 h-7 ${role === 'admin' ? 'text-white' : 'text-gray-500'}`} />
        </div>
        <div className="text-center">
          <p className={`font-bold text-sm ${role === 'admin' ? 'text-accent-700' : 'text-gray-700'}`}>Shop Owner</p>
          <p className="text-xs text-gray-400 mt-0.5">Manage the shop</p>
        </div>
        {role === 'admin' && (
          <span className="text-xs bg-accent-600 text-white px-2 py-0.5 rounded-full">Selected ✓</span>
        )}
      </button>
    </div>

    {role === 'admin' && (
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <FiShield className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Shop Owner access is restricted to <strong>mathinachicken@gmail.com</strong>.</span>
      </div>
    )}

    <button
      onClick={onNext}
      disabled={!role}
      className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
        role === 'admin'
          ? 'bg-accent-600 hover:bg-accent-700'
          : 'bg-primary-600 hover:bg-primary-700'
      } disabled:bg-gray-200 disabled:text-gray-400`}
    >
      Continue as {role === 'admin' ? 'Shop Owner' : role === 'customer' ? 'Customer' : '...'} <FiArrowRight className="w-4 h-4" />
    </button>

    <button onClick={onBack} className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mt-1">
      <FiArrowLeft className="w-3 h-3" /> Change email
    </button>
  </div>
);

// Step 3 — Password entry
const StepPassword = ({ email, role, onBack, onSubmit, loading, initialPassword = '' }) => {
  const [password, setPassword] = useState(initialPassword);
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    onSubmit(password);
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${role === 'admin' ? 'bg-accent-50 text-accent-700' : 'bg-primary-50 text-primary-700'}`}>
          {role === 'admin' ? <FiShield className="w-4 h-4" /> : <FiUser className="w-4 h-4" />}
          {role === 'admin' ? 'Shop Owner' : 'Customer'}
        </div>
        <p className="text-xs text-gray-400 mt-1">{email}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={show ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="input-field pl-10 pr-10"
            placeholder="••••••••"
            autoFocus
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {show ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {role === 'admin' && (
        <div className="text-right">
          <button
            type="button"
            onClick={() => setPassword('mathina65')}
            className="text-xs text-accent-600 hover:text-accent-700 font-medium underline"
          >
            Auto-fill Owner Password
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !password}
        className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
          role === 'admin'
            ? 'bg-accent-600 hover:bg-accent-700'
            : 'bg-primary-600 hover:bg-primary-700'
        } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In as {role === 'admin' ? 'Shop Owner' : 'Customer'} <FiArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <button onClick={onBack} className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mt-1">
        <FiArrowLeft className="w-3 h-3" /> Change email
      </button>
    </div>
  );
};

// ── Main Login Component ─────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [step, setStep] = useState(1); // 1=email, 2=role, 3=password
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialPassword, setInitialPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleFillOwnerDemo = () => {
    setEmail(OWNER_EMAIL);
    setRole('admin');
    setInitialPassword('mathina65');
    setStep(3);
  };

  const handleEmailNext = () => {
    if (!email.trim()) return;
    const lower = email.trim().toLowerCase();
    // Auto-detect owner email
    if (lower === OWNER_EMAIL) {
      setRole('admin');
    } else {
      setRole('customer');
    }
    setStep(2);
  };

  const handleRoleNext = () => {
    if (!role) return;
    const lower = email.trim().toLowerCase();
    // Block non-owner from selecting admin
    if (role === 'admin' && lower !== OWNER_EMAIL) {
      toast.error('Shop Owner access is strictly restricted to mathinachicken@gmail.com');
      return;
    }
    setStep(3);
  };

  const handleLogin = async (password) => {
    setLoading(true);
    try {
      if (role === 'admin') {
        const user = await login(OWNER_EMAIL, password);

        if (user?.role !== 'admin') {
          toast.error('Access denied. Not an admin account.');
          setLoading(false);
          return;
        }

        toast.success(`Welcome back, ${user.name}! 🏪`);
        setTimeout(() => navigate('/admin', { replace: true }), 300);
      } else {
        const user = await login(email.trim(), password);
        if (!user) {
          toast.error('Login failed - no user data returned');
          setLoading(false);
          return;
        }
        toast.success(`Welcome back, ${user.name}! 🍗`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      let errorMessage = 'Invalid credentials. Please try again.';
      if (err.response?.status === 401) {
        errorMessage = 'Incorrect email or password';
      } else if (err.response?.status === 404) {
        errorMessage = 'Account not found. Please register first.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Enter your email', 'Select your role', 'Enter your password'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <GiChickenOven className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mathina Chicken Center</h1>
          <p className="text-gray-400 text-sm mt-1">Fresh Chicken · Cuddalore</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s < step ? 'bg-green-500 text-white' :
                s === step ? 'bg-primary-600 text-white shadow-md' :
                'bg-gray-200 text-gray-400'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">{stepTitles[step - 1]}</h2>

          {step === 1 && (
            <StepEmail email={email} setEmail={setEmail} onNext={handleEmailNext} onFillOwnerDemo={handleFillOwnerDemo} />
          )}
          {step === 2 && (
            <StepRole email={email} role={role} setRole={setRole} onNext={handleRoleNext} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <StepPassword email={email} role={role} onBack={() => setStep(2)} onSubmit={handleLogin} loading={loading} initialPassword={initialPassword} />
          )}

          {/* Register link — only on step 1 or when customer */}
          {(step === 1 || (step === 2 && role === 'customer') || (step === 3 && role === 'customer')) && (
            <p className="text-center text-sm text-gray-500 mt-6">
              New customer?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Create account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
