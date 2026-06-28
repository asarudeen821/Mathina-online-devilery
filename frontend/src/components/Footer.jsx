import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-xl">
                <GiChickenOven className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Mathina FreshHub</span>
            </Link>
            <p className="text-dark-400 text-sm">
              Fresh chicken cuts delivered to your doorstep in Cuddalore.
              Owner: <span className="text-white font-medium">Shajan A.J.</span>
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="text-gray-400 hover:text-white transition-colors">
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/ai-recipes" className="text-gray-400 hover:text-white transition-colors">
                  AI Recipes
                </Link>
              </li>
              <li>
                <Link to="/qr-scan" className="text-gray-400 hover:text-white transition-colors">
                  Traceability
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Erusappan Pallivasal Street,<br />
                  Cuddalore OT, Tamil Nadu - 607003
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary-500" />
                <a href="tel:+917708032726" className="text-gray-400 text-sm hover:text-white transition-colors">+91 77080 32726</a>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary-500" />
                <span className="text-gray-400 text-sm">MathinaFreshHub@gmail.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Delivery Hours:</span><br />
                Mon - Sun: 6:00 AM - 10:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Mathina FreshHub. All rights reserved. | Owner: Shajan A.J. | 📞 +91 77080 32726
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {/* UPI Badge */}
              <div className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16v16H4z" opacity="0.3"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                UPI
              </div>
              {/* Card Badge */}
              <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                Card
              </div>
              {/* COD Badge */}
              <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V11h-2.8v7.09h2.8zM12 5.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
                </svg>
                COD
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
