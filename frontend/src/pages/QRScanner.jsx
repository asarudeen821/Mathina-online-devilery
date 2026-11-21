import { useState, useRef } from 'react';
import { 
  FiCheck, FiAlertCircle, FiImage, FiShoppingCart, 
  FiCopy, FiExternalLink, FiPrinter, FiShield, FiZap, 
  FiDownload, FiCreditCard, FiSmartphone 
} from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';
import QRCode from 'react-qr-code';

import { qrAPI } from '../utils/api';
import toast from 'react-hot-toast';
import OrderQRGenerator from '../components/OrderQRGenerator';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanMode, setScanMode] = useState('payment'); // 'payment' | 'generate' | 'result'
  
  // Marketing Standee & Smart QR States
  const [qrDisplayType, setQrDisplayType] = useState('smart'); // 'smart' | 'standee'
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const standeePrintRef = useRef(null);

  const PAYMENT_QR_DATA = {
    upi: 'CF05100492@indianbk',
    name: 'Mathina Chicken Center',
    bank: 'Indian Bank',
    merchantId: 'CF05100492',
    address: 'Erusappan Pallivasal Street, Cuddalore OT - 607003',
    phone: '+91 77080 32726',
    note: 'Payment for fresh chicken products',
    standeeImage: '/images/payment-qr.jpg',
  };

  const effectiveAmount = selectedAmount ? Number(selectedAmount) : (customAmount ? Number(customAmount) : null);
  const upiPayUrl = effectiveAmount && effectiveAmount > 0
    ? `upi://pay?pa=${PAYMENT_QR_DATA.upi}&pn=${encodeURIComponent(PAYMENT_QR_DATA.name)}&am=${effectiveAmount}&cu=INR`
    : `upi://pay?pa=${PAYMENT_QR_DATA.upi}&pn=${encodeURIComponent(PAYMENT_QR_DATA.name)}&cu=INR`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(PAYMENT_QR_DATA.upi);
    setCopied(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintStandee = () => {
    window.print();
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






        {/* Payment QR Code Section - Marketing Standee & Smart UPI */}
        {scanMode === 'payment' && (
          <div className="space-y-6 mb-8">
            
            {/* Top Marketing Banner */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <div className="text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                    <FiShield className="w-3.5 h-3.5 text-amber-300" />
                    Indian Bank Official Merchant UPI
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Mathina Chicken Center
                  </h2>
                  <p className="text-rose-100 text-sm mt-1 max-w-md">
                    Scan with any UPI app to pay directly at our shop counter or online. 100% instant settlement.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQrDisplayType(qrDisplayType === 'smart' ? 'standee' : 'smart')}
                    className="bg-white text-slate-900 hover:bg-slate-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    {qrDisplayType === 'smart' ? '🏪 View Counter Standee Photo' : '⚡ Switch to Smart Digital QR'}
                  </button>
                  <button
                    onClick={handlePrintStandee}
                    className="bg-white/20 hover:bg-white/30 text-white font-medium text-xs px-3 py-2.5 rounded-xl backdrop-blur-sm transition-all flex items-center gap-1.5"
                    title="Print Standee for Shop Counter"
                  >
                    <FiPrinter className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Standee & Controls Layout */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              
              {/* ── Left Column: Standee Mockup Card ── */}
              <div className="lg:col-span-7 flex justify-center">
                <div 
                  ref={standeePrintRef}
                  className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-slate-900 overflow-hidden relative"
                >
                  {/* Standee Top Clip / Hanger Simulation */}
                  <div className="bg-slate-900 text-white py-2 px-4 flex items-center justify-between text-[11px] font-semibold tracking-wider">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <GiChickenOven className="w-4 h-4" />
                      OFFICIAL MERCHANT STAND
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
                      ● ACCEPTED HERE
                    </span>
                  </div>

                  {/* Standee Blue / Indian Bank Header */}
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-5 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-blue-400/10 via-transparent to-transparent pointer-events-none"></div>
                    
                    <div className="inline-flex items-center gap-1.5 bg-blue-800/80 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 mb-2">
                      <FiShield className="w-3.5 h-3.5 text-blue-300" />
                      <span>INDIAN BANK MERCHANT UPI</span>
                    </div>

                    <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
                      {PAYMENT_QR_DATA.name}
                    </h3>
                    <p className="text-xs text-blue-200 font-medium mt-0.5">
                      {PAYMENT_QR_DATA.address}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] text-amber-300 font-semibold border border-white/15">
                      <span>🍗 100% Halal Verified</span>
                      <span>•</span>
                      <span>Farm Fresh Daily</span>
                    </div>
                  </div>

                  {/* QR Core Area */}
                  <div className="p-6 bg-gradient-to-b from-slate-50 to-white flex flex-col items-center">
                    
                    {qrDisplayType === 'smart' ? (
                      /* Mode A: Crisp Vector SVG QR (100% Instant Scan Guaranteed) */
                      <div className="relative p-4 bg-white rounded-2xl shadow-xl border-2 border-indigo-100 flex items-center justify-center group">
                        
                        {/* React Bits-inspired Targeting Corners */}
                        <div className="absolute top-2 left-2 w-5 h-5 border-t-3 border-l-3 border-red-600 rounded-tl-md"></div>
                        <div className="absolute top-2 right-2 w-5 h-5 border-t-3 border-r-3 border-red-600 rounded-tr-md"></div>
                        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-3 border-l-3 border-red-600 rounded-bl-md"></div>
                        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-3 border-r-3 border-red-600 rounded-br-md"></div>

                        {/* Scanner Laser Sweep */}
                        <div className="scanner-line"></div>

                        {/* High Precision SVG QR code */}
                        <div className="p-2">
                          <QRCode
                            value={upiPayUrl}
                            size={210}
                            level="H"
                            fgColor="#0f172a"
                            bgColor="#ffffff"
                          />
                        </div>

                        {/* Center Emblem */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-white rounded-lg p-1.5 shadow-md border-2 border-red-500 flex items-center justify-center">
                            <GiChickenOven className="w-6 h-6 text-red-600" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Mode B: Physical Counter Standee Photo */
                      <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-slate-300 max-w-[240px]">
                        <img
                          src={PAYMENT_QR_DATA.standeeImage}
                          alt="Physical Shop Counter Standee"
                          className="w-full h-auto object-cover rounded-xl"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] py-1 text-center font-medium">
                          Original Shop Counter Standee
                        </div>
                      </div>
                    )}

                    {/* Pre-filled Amount Indicator (if active) */}
                    {effectiveAmount && effectiveAmount > 0 && (
                      <div className="mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs animate-bounce-slow">
                        <span>✓ Amount Pre-Set: ₹{effectiveAmount}</span>
                        <button
                          onClick={() => { setSelectedAmount(null); setCustomAmount(''); }}
                          className="text-emerald-700 hover:text-emerald-900 text-xs font-normal underline ml-1"
                        >
                          Clear
                        </button>
                      </div>
                    )}

                    {/* Scannable instruction */}
                    <p className="text-xs text-slate-500 font-medium text-center mt-3">
                      Scan with Google Pay, PhonePe, Paytm, or any UPI App
                    </p>

                    {/* UPI ID Box with 1-click Copy */}
                    <div className="mt-3 w-full bg-slate-100 rounded-xl p-3 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">UPI ID / VPA</div>
                        <div className="font-mono font-bold text-slate-800 text-sm tracking-wide">
                          {PAYMENT_QR_DATA.upi}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          copied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                        }`}
                      >
                        {copied ? (
                          <>
                            <FiCheck className="w-3.5 h-3.5" /> Copied!
                          </>
                        ) : (
                          <>
                            <FiCopy className="w-3.5 h-3.5" /> Copy ID
                          </>
                        )}
                      </button>
                    </div>

                    {/* Direct Pay via Mobile Link */}
                    <a
                      href={upiPayUrl}
                      className="w-full mt-3 btn-shimmer py-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                    >
                      <FiSmartphone className="w-4 h-4" />
                      <span>Tap to Pay Directly (Mobile Users)</span>
                    </a>
                  </div>

                  {/* Standee Bottom Bar with All UPI App Logos */}
                  <div className="bg-slate-100 px-4 py-3 border-t border-slate-200">
                    <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-600 flex-wrap">
                      <span className="bg-white px-2.5 py-1 rounded-md shadow-2xs border border-slate-200">GPay</span>
                      <span className="bg-white px-2.5 py-1 rounded-md shadow-2xs border border-slate-200">PhonePe</span>
                      <span className="bg-white px-2.5 py-1 rounded-md shadow-2xs border border-slate-200">Paytm</span>
                      <span className="bg-white px-2.5 py-1 rounded-md shadow-2xs border border-slate-200">BHIM</span>
                      <span className="bg-white px-2.5 py-1 rounded-md shadow-2xs border border-slate-200">CRED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right Column: Interactive Marketing Controls & Trust ── */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* 1. Quick Amount Preset Chips (Marketing Feature) */}
                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <FiZap className="w-4 h-4 text-amber-500" />
                      Quick Amount Selector
                    </h3>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                      Live QR Updates
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Click a preset amount to pre-fill it in the QR code. When customer scans, their UPI app auto-fills the amount!
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Any', value: null },
                      { label: '₹150', value: 150 },
                      { label: '₹250', value: 250 },
                      { label: '₹500', value: 500 },
                      { label: '₹750', value: 750 },
                      { label: '₹1000', value: 1000 },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(chip.value);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedAmount === chip.value && !customAmount
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="w-full pl-7 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    {customAmount && (
                      <button
                        type="button"
                        onClick={() => setCustomAmount('')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Marketing Shop Special Offers */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/80 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎁</span>
                    <h4 className="font-bold text-amber-950 text-sm">
                      Counter UPI Payment Special
                    </h4>
                  </div>
                  <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
                    <li>Zero transaction charges for all customers</li>
                    <li>Instant SMS & payment proof directly to your phone</li>
                    <li>Points automatically linked to your registered mobile number</li>
                    <li>Farm-fresh halal cuts prepped while you pay</li>
                  </ul>
                </div>

                {/* 3. Four Trust Pillars */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1.5 text-sm font-bold">
                      ⚡
                    </div>
                    <div className="text-xs font-bold text-slate-900">Instant Pay</div>
                    <div className="text-[10px] text-slate-500">Real-time confirmation</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1.5 text-sm font-bold">
                      🛡️
                    </div>
                    <div className="text-xs font-bold text-slate-900">100% Safe</div>
                    <div className="text-[10px] text-slate-500">NPCI Encrypted UPI</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-1.5 text-sm font-bold">
                      🏛️
                    </div>
                    <div className="text-xs font-bold text-slate-900">Indian Bank</div>
                    <div className="text-[10px] text-slate-500">Direct Merchant VPA</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-1.5 text-sm font-bold">
                      🍗
                    </div>
                    <div className="text-xs font-bold text-slate-900">100% Halal</div>
                    <div className="text-[10px] text-slate-500">Fresh Daily Cuts</div>
                  </div>
                </div>

                {/* 4. How to Pay Guide */}
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4 text-indigo-600" />
                    How to Pay in 3 Simple Steps
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-800">Open your favorite UPI app</strong> (Google Pay, PhonePe, Paytm, or BHIM).
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-800">Scan this QR Code</strong>. The shop name <em>Mathina Chicken Center</em> will appear.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">3</span>
                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-800">Enter UPI PIN</strong> to complete payment safely. Show the success screen at counter.
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

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
