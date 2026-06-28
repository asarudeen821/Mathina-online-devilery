import { useState } from 'react';
import { FiShoppingCart, FiDownload, FiCopy, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OrderQRGenerator = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [generatedOrder, setGeneratedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // Generate unique order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MATHINA-${timestamp}-${random}`;
  };

  // Generate QR code data
  const generateQRData = (orderId, orderDetails) => {
    return {
      orderId,
      customerName: user?.name || 'Guest Customer',
      customerPhone: user?.phone || 'Not provided',
      items: orderDetails.items,
      totalAmount: orderDetails.totalAmount,
      createdAt: new Date().toISOString(),
      status: 'Pending Confirmation',
    };
  };

  // Convert order data to QR code string
  const orderToQRString = (orderData) => {
    return `CLUCKFRESH-ORDER-${orderData.orderId}-TOTAL${orderData.totalAmount}`;
  };

  // Generate Order QR Code
  const handleGenerateOrderQR = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty! Add items first.');
      return;
    }

    if (!user) {
      toast.error('Please login to generate order QR code');
      return;
    }

    const orderId = generateOrderId();
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      weight: item.weight?.weight || null,
      price: item.price,
    }));

    const orderDetails = {
      items: orderItems,
      totalAmount: getCartTotal(),
    };

    const qrData = generateQRData(orderId, orderDetails);
    const qrString = orderToQRString(qrData);

    setGeneratedOrder({
      orderId,
      qrData,
      qrString,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}`,
      items: orderItems,
      totalAmount: getCartTotal(),
    });

    toast.success('Order QR code generated successfully!');
  };

  // Copy order ID to clipboard
  const handleCopyOrderId = () => {
    if (generatedOrder?.orderId) {
      navigator.clipboard.writeText(generatedOrder.orderId);
      setCopied(true);
      toast.success('Order ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download QR code
  const handleDownloadQR = () => {
    if (generatedOrder?.qrCodeUrl) {
      const link = document.createElement('a');
      link.href = generatedOrder.qrCodeUrl;
      link.download = `order-${generatedOrder.orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    }
  };

  // Clear generated order
  const handleNewOrder = () => {
    setGeneratedOrder(null);
    clearCart();
    toast.success('Ready for new order');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FiShoppingCart className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Order QR Code</h2>
        <p className="text-gray-600">
          Create a unique QR code for your order to share with the shop
        </p>
      </div>

      {!generatedOrder ? (
        <>
          {/* Cart Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Cart Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">Your cart is empty</p>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {item.weight && (
                        <span className="text-gray-500 ml-2">
                          ({item.weight.weight}g)
                        </span>
                      )}
                      <span className="text-gray-500"> × {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-primary-600">₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateOrderQR}
            disabled={cartItems.length === 0 || !user}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              cartItems.length === 0 || !user
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg'
            }`}
          >
            <FiShoppingCart className="w-5 h-5" />
            {cartItems.length === 0
              ? 'Add Items to Cart'
              : !user
              ? 'Please Login'
              : 'Generate Order QR Code'}
          </button>

          {/* Info */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">ℹ️ How it works</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Add items to your cart</li>
              <li>Click "Generate Order QR Code"</li>
              <li>Show QR code to shop owner or download it</li>
              <li>Shop owner scans to process your order</li>
            </ol>
          </div>
        </>
      ) : (
        <>
          {/* Generated Order QR Code */}
          <div className="space-y-6">
            {/* Success Message */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Order QR Generated!</h3>
            </div>

            {/* QR Code Display */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-2xl shadow-lg">
              <div className="bg-white rounded-xl p-4 mb-4">
                <img
                  src={generatedOrder.qrCodeUrl}
                  alt="Order QR Code"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generatedOrder.qrString)}`;
                  }}
                />
              </div>
              <div className="text-center text-white">
                <div className="text-sm opacity-90 mb-1">Order ID</div>
                <div className="font-mono font-bold text-lg break-all">
                  {generatedOrder.orderId}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
              <div className="space-y-2 text-sm">
                {generatedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <span className="text-gray-900">{item.name}</span>
                      {item.weight && (
                        <span className="text-gray-500"> ({item.weight}g)</span>
                      )}
                      <span className="text-gray-500"> × {item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary-600">₹{generatedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyOrderId}
                className="py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy ID'}
              </button>
              <button
                onClick={handleDownloadQR}
                className="py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* New Order Button */}
            <button
              onClick={handleNewOrder}
              className="w-full py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Create New Order
            </button>

            {/* Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 text-sm">✅ Next Steps</h4>
              <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                <li>Show this QR code at the shop</li>
                <li>Or download and send via WhatsApp</li>
                <li>Shop owner will scan and confirm</li>
                <li>Receive order confirmation</li>
              </ol>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderQRGenerator;
