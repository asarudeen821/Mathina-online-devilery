import { useState } from 'react';
import { FiCheck, FiAlertCircle, FiImage, FiShoppingCart } from 'react-icons/fi';

import { qrAPI } from '../utils/api';
import toast from 'react-hot-toast';
import OrderQRGenerator from '../components/OrderQRGenerator';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  // QR scanning modes (removed camera + manual entry options per request)
  const [scanMode, setScanMode] = useState('payment'); // 'payment' | 'generate' | 'result'


  const PAYMENT_QR_DATA = {
    upi: 'paytm.s151bx7@pty',
    name: 'Mathina FreshHub',
    note: 'Payment for chicken products',
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=paytm.s151bx7@pty&pn=Mathina FreshHub&cu=INR')}`,
  };

  const SAMPLE_QR_CODES = [
    { code: 'CLUCKFRESH-CHK001-20240115', label: 'Chicken Biryani Cut' },
    { code: 'CLUCKFRESH-CHK002-20240116', label: 'Chicken Lollipop' },
    { code: 'CLUCKFRESH-CHK003-20240117', label: 'Chicken Cube Cut' },
  ];

  const handleScan = async () => {
    if (!manualCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }

    // Check if it's an order QR code
    if (manualCode.startsWith('CLUCKFRESH-ORDER-')) {
      // Parse order QR code
      const parts = manualCode.split('-');
      if (parts.length >= 4) {
        const orderId = parts[2];
        const totalPart = parts[3];
        const totalAmount = totalPart.replace('TOTAL', '');
        
        setScanResult({
          type: 'order',
          orderId: `MATHINA-${orderId}`,
          totalAmount: parseFloat(totalAmount) || 0,
          status: 'Customer Order - Pending Confirmation',
          scannedAt: new Date().toLocaleString('en-IN'),
        });
        toast.success('Order QR code scanned!');
        setScanMode('result');
        return;
      }
    }

    setLoading(true);
    try {
      const { data } = await qrAPI.scan(manualCode);
      setScanResult({ type: 'product', ...data.data });
      toast.success('QR code scanned successfully!');
      setScanMode('result');
    } catch (error) {
      toast.error('Invalid QR code or product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleScan = (code) => {
    setManualCode(code);
    toast.success(`Selected: ${code}`);
  };

  // Payment QR mode
  const handlePaymentQR = () => {
    setScanMode('payment');
  };


  const resetScan = () => {
    setScanResult(null);
    setManualCode('');
    setScanMode('payment');

  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Product Traceability</h1>
        <p className="text-center text-gray-600 mb-8">
          Scan QR Code from your product packaging to view its journey from farm to table
        </p>

        {/* Mode Selection Tabs */}
        <div className="flex bg-white rounded-xl shadow-md p-1 mb-6 overflow-x-auto">
          <button
            onClick={() => setScanMode('payment')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              scanMode === 'payment' || scanMode === 'result'
                ? 'bg-purple-100 text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiImage className="w-4 h-4" />
            Payment QR
          </button>

          <button
            onClick={() => setScanMode('generate')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              scanMode === 'generate'
                ? 'bg-green-100 text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiShoppingCart className="w-4 h-4" />
            Generate Order
          </button>
        </div>






        {/* Payment QR Code Section */}
        {scanMode === 'payment' && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                <FiImage className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Mathina FreshHub Payment</h2>
              <p className="text-gray-600">Scan to pay via UPI - Quick, Safe & Secure</p>
            </div>

            {/* Payment QR Code */}
            <div className="max-w-sm mx-auto mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-3xl shadow-xl">
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <img
                    src={PAYMENT_QR_DATA.qrCode}
                    alt="Payment QR Code"
                    className="w-full h-auto rounded-xl shadow-inner border border-gray-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('upi://pay?pa=paytm.s151bx7@pty&pn=Mathina FreshHub&cu=INR')}`;
                    }}
                  />
                </div>
                <div className="text-center text-white">
                  <div className="text-sm opacity-90 mb-1">Pay to</div>
                  <div className="text-xl font-bold mb-2">{PAYMENT_QR_DATA.name}</div>
                  <div className="text-sm opacity-75 font-mono">{PAYMENT_QR_DATA.upi}</div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">💳</div>
                <div className="font-semibold text-purple-900">UPI Payment</div>
                <div className="text-sm text-purple-700">Any UPI App</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-purple-900">Instant</div>
                <div className="text-sm text-purple-700">Real-time</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="font-semibold text-purple-900">Secure</div>
                <div className="text-sm text-purple-700">100% Safe</div>
              </div>
            </div>

            {/* How to Pay */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5" />
                How to Pay using QR Code
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: 1, icon: '📱', title: 'Open UPI App', desc: 'GPay, PhonePe, Paytm, etc.' },
                  { step: 2, icon: '📷', title: 'Scan QR Code', desc: 'Point camera at QR code' },
                  { step: 3, icon: '💰', title: 'Enter Amount', desc: 'Type payment amount' },
                  { step: 4, icon: '✅', title: 'Confirm Payment', desc: 'Enter UPI PIN' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                      {item.icon}
                    </div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Apps */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Supported UPI Apps:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'WhatsApp Pay'].map((app) => (
                  <span key={app} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-xs font-medium">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <button onClick={() => setScanMode('payment')} className="w-full mt-6 btn-outline">
              Back to Scanner
            </button>

          </div>
        )}

        {/* Generate Order QR Section */}
        {scanMode === 'generate' && (
          <div className="mb-8">
            <OrderQRGenerator />
          </div>
        )}

        {/* Scan Result View */}
        {scanResult && scanMode === 'result' && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="space-y-6">
              {/* Success Header */}
              <div className="text-center">
                <FiCheck className="w-16 h-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {scanResult.type === 'order' ? 'Order Scanned!' : 'Product Verified!'}
                </h3>
              </div>

              {/* Order Info */}
              {scanResult.type === 'order' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
                    <div className="text-sm opacity-90 mb-1">Order ID</div>
                    <div className="font-mono font-bold text-xl break-all">{scanResult.orderId}</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4">Order Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-orange-600">{scanResult.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-2xl text-primary-600">₹{scanResult.totalAmount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Scanned At:</span>
                        <span className="text-gray-700">{scanResult.scannedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Next Steps</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Review the order details</li>
                      <li>Confirm items availability</li>
                      <li>Process payment</li>
                      <li>Prepare for delivery/pickup</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        toast.success('Order confirmed!');
                        setScanResult(null);
                      }}
                      className="py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
                    >
                      Confirm Order
                    </button>
                    <button
                      onClick={() => {
                        toast.error('Order cancelled');
                        setScanResult(null);
                      }}
                      className="py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Product Info */}
              {scanResult.product && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-4">Product Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Name:</span>
                      <span className="font-medium">{scanResult.product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{scanResult.product.category}</span>
                    </div>
                    {scanResult.product.price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">₹{scanResult.product.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Traceability Info */}
              {scanResult.traceabilityData && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">Farm to Table Journey</h4>

                  {scanResult.traceabilityData.farmName && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-semibold text-green-900 mb-2">Farm Origin</h5>
                      <p className="text-green-800">{scanResult.traceabilityData.farmName}</p>
                      <p className="text-green-700 text-sm">{scanResult.traceabilityData.farmLocation}</p>
                    </div>
                  )}

                  {scanResult.traceabilityData.processingDate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 mb-2">Processing Date</h5>
                      <p className="text-blue-800">
                        {new Date(scanResult.traceabilityData.processingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {scanResult.traceabilityData.halalCertified && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">☪️</div>
                        <div className="text-sm font-semibold text-amber-900">Halal Certified</div>
                      </div>
                    )}
                    {scanResult.traceabilityData.organicCertified && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">🌿</div>
                        <div className="text-sm font-semibold text-green-900">Organic</div>
                      </div>
                    )}
                    {scanResult.traceabilityData.antibioticFree && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">💉</div>
                        <div className="text-sm font-semibold text-blue-900">Antibiotic-Free</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                <p>This QR code has been scanned {scanResult.scanCount} times</p>
              </div>

              <button onClick={resetScan} className="w-full btn-outline">
                Scan Another Product
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-md p-8 text-white">
          <h3 className="text-xl font-bold mb-4">Why Scan QR Codes?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🏡</div>
              <h4 className="font-semibold mb-1">Farm Transparency</h4>
              <p className="text-sm text-primary-100">Know exactly which farm your chicken came from</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-semibold mb-1">Quality Assured</h4>
              <p className="text-sm text-primary-100">Verify quality checks and certifications</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📅</div>
              <h4 className="font-semibold mb-1">Freshness Guarantee</h4>
              <p className="text-sm text-primary-100">Check processing date for maximum freshness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
