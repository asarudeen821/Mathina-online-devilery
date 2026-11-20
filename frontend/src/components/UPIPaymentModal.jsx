import { useState, useEffect, useRef } from 'react';
import { FiX, FiCheck, FiSmartphone, FiLoader } from 'react-icons/fi';

// UPI ID validation regex
const UPI_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

const STEPS = { INPUT: 'input', PROCESSING: 'processing', SUCCESS: 'success' };

const playSuccessSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.05);
      gain.gain.linearRampToValueAtTime(0, start + 0.25);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch (_) {
    // Audio not supported — silent fallback
  }
};

const UPIPaymentModal = ({ isOpen, amount, onSuccess, onClose }) => {
  const [step, setStep] = useState(STEPS.INPUT);
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setStep(STEPS.INPUT);
      setUpiId('');
      setError('');
      setProgress(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => clearTimeout(timerRef.current);
  }, [isOpen]);

  const validate = () => {
    if (!upiId.trim()) { setError('Please enter your UPI ID'); return false; }
    if (!UPI_REGEX.test(upiId.trim())) { setError('Invalid UPI ID. Format: yourname@upi'); return false; }
    setError('');
    return true;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep(STEPS.PROCESSING);
    setProgress(0);

    // Simulate payment processing with progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        timerRef.current = setTimeout(() => {
          setStep(STEPS.SUCCESS);
          playSuccessSound();
          timerRef.current = setTimeout(() => onSuccess(upiId.trim()), 2000);
        }, 400);
      }
      setProgress(Math.min(p, 100));
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step === STEPS.INPUT) handlePay();
    if (e.key === 'Escape' && step === STEPS.INPUT) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === STEPS.INPUT ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <FiSmartphone className="w-5 h-5" />
            <span className="font-bold text-lg">UPI Payment</span>
          </div>
          {step === STEPS.INPUT && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-6 py-6">
          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-900">₹{amount}</p>
          </div>

          {/* STEP: INPUT */}
          {step === STEPS.INPUT && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl border border-purple-100 mb-2">
                <p className="text-xs text-purple-700 font-semibold mb-2">Scan to Pay using any UPI app</p>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <img
                    src="/images/payment-qr.jpg"
                    alt="Scan to pay via UPI"
                    className="w-36 h-36 object-contain rounded"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2 font-mono">CF05100492@indianbk</p>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR enter your UPI ID</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter UPI ID
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={upiId}
                  onChange={(e) => { setUpiId(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="yourname@paytm / @gpay / @upi"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
                    error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  Supported: @paytm, @gpay, @ybl, @okaxis, @upi, @ibl, etc.
                </p>
              </div>

              {/* Popular UPI apps hint */}
              <div className="flex gap-2 flex-wrap">
                {['@paytm', '@gpay', '@ybl', '@okaxis'].map((suffix) => (
                  <button
                    key={suffix}
                    type="button"
                    onClick={() => {
                      const base = upiId.split('@')[0] || '';
                      setUpiId(base + suffix);
                      setError('');
                    }}
                    className="text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-3 py-1 hover:bg-purple-100 transition-colors"
                  >
                    {suffix}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePay}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95"
              >
                Pay ₹{amount}
              </button>

              <button
                onClick={onClose}
                className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* STEP: PROCESSING */}
          {step === STEPS.PROCESSING && (
            <div className="text-center space-y-5 py-2">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiLoader className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Processing Payment</p>
                <p className="text-sm text-gray-500 mt-1">Sending to <span className="font-medium text-purple-700">{upiId}</span></p>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">Please do not close this window...</p>
            </div>
          )}

          {/* STEP: SUCCESS */}
          {step === STEPS.SUCCESS && (
            <div className="text-center space-y-4 py-2">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                  <FiCheck className="w-10 h-10 text-green-600" strokeWidth={3} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">Payment Successful!</p>
                <p className="text-sm text-gray-500 mt-1">₹{amount} paid via {upiId}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <p className="text-green-700 text-sm font-medium">🎉 Your order is being placed...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
