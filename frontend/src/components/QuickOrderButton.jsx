import { useState, useEffect } from 'react';
import { FiPhone, FiX, FiMessageCircle, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

const CALL_NUMBER = '7708032726';
const WA_NUMBER = '918056694908'; // WhatsApp number
const OWNER_NAME = 'Shajan';
const OWNER_PHONE = '8056694908';

const CUTS = [
  { name: 'Cube Cut',        prices: { '250g': 68,  '500g': 135, '1 kg': 270 } },
  { name: 'Dragon Cut',      prices: { '500g': 145, '1 kg': 290, '2 kg': 580 } },
  { name: 'Butterfly Cut',   prices: { '250g': 80,  '500g': 160, '1 kg': 320 } },
  { name: 'Chicken 65',      prices: { '250g': 75,  '500g': 150, '1 kg': 300 } },
  { name: 'Finger Cut',      prices: { '250g': 70,  '500g': 140, '1 kg': 280 } },
  { name: 'Julienne Cut',    prices: { '250g': 73,  '500g': 145, '1 kg': 290 } },
  { name: 'Lollipop',        prices: { '250g': 78,  '500g': 155, '1 kg': 310 } },
  { name: 'Small Curry Cut', prices: { '250g': 60,  '500g': 120, '1 kg': 240 } },
  { name: 'Big Curry Cut',   prices: { '500g': 120, '1 kg': 240, '1.5 kg': 360 } },
  { name: 'Chicken Wings',   prices: { '250g': 55,  '500g': 110, '1 kg': 220 } },
  { name: 'Whole Chicken',   prices: { '1 kg': 200, '1.5 kg': 300, '2 kg': 400 } },
];

// ── Order Item Row ──────────────────────────────────────────────
const OrderItem = ({ item, onChange, onRemove }) => {
  const weights = Object.keys(item.cut.prices);
  return (
    <div className="bg-gray-50 rounded-xl p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800 text-sm">{item.cut.name}</span>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600">
          <FiX className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {weights.map((w) => (
          <button
            key={w}
            onClick={() => onChange({ ...item, weight: w })}
            className={`text-xs px-2 py-1 rounded-lg border font-medium transition-all ${
              item.weight === w
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
            }`}
          >
            {w} — ₹{item.cut.prices[w]}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => item.qty > 1 && onChange({ ...item, qty: item.qty - 1 })}
            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
          >
            <FiMinus className="w-3 h-3" />
          </button>
          <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
          <button
            onClick={() => onChange({ ...item, qty: item.qty + 1 })}
            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
          >
            <FiPlus className="w-3 h-3" />
          </button>
        </div>
        <span className="font-bold text-green-700 text-sm">
          ₹{item.cut.prices[item.weight] * item.qty}
        </span>
      </div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────
const QuickOrderButton = () => {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState('build'); // 'build' | 'confirm'
  const [orderItems, setOrderItems] = useState([]);
  const [selectedCut, setSelectedCut] = useState(CUTS[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const addItem = () => {
    const weights = Object.keys(selectedCut.prices);
    const defaultWeight = weights[1] || weights[0];
    setOrderItems((prev) => [
      ...prev,
      { id: Date.now(), cut: selectedCut, weight: defaultWeight, qty: 1 },
    ]);
  };

  const updateItem = (id, updated) =>
    setOrderItems((prev) => prev.map((i) => (i.id === id ? updated : i)));

  const removeItem = (id) =>
    setOrderItems((prev) => prev.filter((i) => i.id !== id));

  const total = orderItems.reduce(
    (sum, i) => sum + i.cut.prices[i.weight] * i.qty,
    0
  );

  const buildMessage = () => {
    if (orderItems.length === 0) return '';
    const lines = orderItems.map(
      (i) => `• ${i.cut.name} — ${i.weight} x${i.qty} = ₹${i.cut.prices[i.weight] * i.qty}`
    );
    return [
      `🐔 *Order from Mathina FreshHub*`,
      ``,
      `👤 Name: ${customerName || 'Not provided'}`,
      `📞 Phone: ${customerPhone || 'Not provided'}`,
      `📍 Address: ${address || 'Not provided'}`,
      ``,
      `🛒 *Order Details:*`,
      ...lines,
      ``,
      `💰 *Total: ₹${total}*`,
      ``,
      `📞 Shop Owner: ${OWNER_NAME} — +91 ${OWNER_PHONE}`,
      `_Please confirm my order. Thank you!_`,
    ].join('\n');
  };

  const handleWhatsApp = () => {
    const msg = buildMessage();
    if (!msg) return;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:+91${CALL_NUMBER}`;
  };

  const openModal = () => {
    setShowModal(true);
    setStep('build');
    setOrderItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
  };

  if (!visible) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Quick direct call */}
        <a
          href={`tel:+91${CALL_NUMBER}`}
          className="flex items-center gap-2 bg-white text-green-700 border-2 border-green-500 px-4 py-2 rounded-full shadow-lg hover:bg-green-50 transition-all text-sm font-semibold"
          title="Call to Order"
        >
          <FiPhone className="w-4 h-4" />
          Call Now
        </a>

        {/* Order via WhatsApp/Call modal */}
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-full shadow-2xl hover:from-green-700 hover:to-green-800 transition-all font-bold animate-bounce"
          title="Order via Call / WhatsApp"
        >
          <FiShoppingBag className="w-5 h-5" />
          Order by Call
        </button>
      </div>

      {/* Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-green-600 rounded-t-3xl sm:rounded-t-2xl">
              <div>
                <h2 className="text-white font-bold text-lg">📞 Order by Call / WhatsApp</h2>
                <p className="text-green-100 text-xs mt-0.5">Build your order, then call or WhatsApp us</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-green-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4">

              {step === 'build' && (
                <>
                  {/* Add item */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Add Chicken Cut</p>
                    <div className="flex gap-2">
                      <select
                        value={selectedCut.name}
                        onChange={(e) => setSelectedCut(CUTS.find((c) => c.name === e.target.value))}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                      >
                        {CUTS.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={addItem}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-700 flex items-center gap-1"
                      >
                        <FiPlus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Order items */}
                  {orderItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FiShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No items added yet.<br />Select a cut and tap Add.</p>
                    </div>
                  ) : (
                    <>
                      {orderItems.map((item) => (
                        <OrderItem
                          key={item.id}
                          item={item}
                          onChange={(updated) => updateItem(item.id, updated)}
                          onRemove={() => removeItem(item.id)}
                        />
                      ))}
                      <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3 mt-2 mb-4">
                        <span className="font-semibold text-gray-700">Total</span>
                        <span className="text-xl font-bold text-green-700">₹{total}</span>
                      </div>
                    </>
                  )}

                  {/* Customer details */}
                  {orderItems.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your Details (for WhatsApp)</p>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                      />
                      <input
                        type="tel"
                        placeholder="Your Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                      />
                      <input
                        type="text"
                        placeholder="Delivery Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-4 border-t bg-gray-50 rounded-b-3xl sm:rounded-b-2xl space-y-2">

              {orderItems.length > 0 && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors shadow"
                >
                  <FiMessageCircle className="w-5 h-5" />
                  Send Order on WhatsApp
                  <span className="text-xs opacity-80 ml-1">+91 80566 94908</span>
                </button>
              )}

              <button
                onClick={handleCall}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-700 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
              >
                <FiPhone className="w-5 h-5" />
                Call to Order Directly
                <span className="text-xs text-green-500 ml-1">+91 77080 32726</span>
              </button>

              <p className="text-center text-xs text-gray-400 pt-1">
                🕐 Available 6 AM – 10 PM · Owner: {OWNER_NAME} · 📞 +91 {OWNER_PHONE}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickOrderButton;
