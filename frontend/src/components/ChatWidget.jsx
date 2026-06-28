import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiX, FiSend, FiTrash2 } from 'react-icons/fi';
import api, { aiAPI } from '../utils/api';
import { detectNavigation } from '../utils/slmEngine';

/**
 * Upgraded AI Chatbot Widget
 * Features:
 * - Auto-scroll to bottom
 * - Typing indicator
 * - Quick action suggestions
 * - Conversation history
 * - Clear history option
 * - Error handling with fallback messages
 */
const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! 👋 Welcome to Mathina FreshHub! I\'m your AI assistant. Ask me about products, recipes, or delivery!\n\n💡 *Tip:* You can also ask me to:\n• "Open products" - Browse all products\n• "Open QR scanner" - Scan QR codes\n• "View my cart" - Check your cart\n• "Show my orders" - Track orders',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for navbar button click
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-mathina-chat', handleOpenChat);
    return () => window.removeEventListener('open-mathina-chat', handleOpenChat);
  }, []);

  // Enhanced quick actions for hybrid AI features
  const quickActions = [
    { label: '📦 Track Order', query: 'Track my order', icon: '📦' },
    { label: '🛒 View Cart', query: 'What is in my cart?', icon: '🛒' },
    { label: '🍗 Chicken Recipes', query: 'What chicken recipes do you have?', icon: '🍗' },
    { label: '🍳 Biryani Recipe', query: 'How to make chicken biryani?', icon: '🍳' },
    { label: '🔥 Grill Recipes', query: 'Best recipes for grilling chicken', icon: '🔥' },
    { label: '📅 My Orders', query: 'Show my recent orders', icon: '📅' },
    { label: '🎯 Recommendations', query: 'What do you recommend for me?', icon: '🎯' },
    { label: '🚚 Delivery Info', query: 'How long does delivery take?', icon: '🚚' },
  ];

  // Load suggestions on mount
  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const loadSuggestions = async () => {
    try {
      const { data } = await aiAPI.getSuggestions();
      setSuggestions(data.data);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      // Set default suggestions as fallback
      setSuggestions([
        { label: 'Suggest recipes', query: 'What recipes can I make with chicken breast?', icon: '🍳' },
        { label: 'Best chicken cuts', query: 'What are the best chicken cuts for grilling?', icon: '🍗' },
        { label: "Today's offers", query: 'What are today\'s special offers?', icon: '🎉' },
        { label: 'Delivery info', query: 'How long does delivery take?', icon: '🚚' },
      ]);
    }
  };

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText || !messageText.trim()) return;

    const trimmedMessage = messageText.trim();

    // Check for navigation commands FIRST
    const navigation = detectNavigation(trimmedMessage);
    if (navigation) {
      // Add user message
      const userMsg = {
        role: 'user',
        text: trimmedMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      // Show navigation message
      const navMsg = {
        role: 'bot',
        text: `${navigation.message}\n\n🔗 Opening: ${navigation.label}`,
        timestamp: new Date().toISOString(),
        isNavigation: true,
      };
      setMessages((prev) => [...prev, navMsg]);

      // Navigate after short delay
      setTimeout(() => {
        navigate(navigation.route);
      }, 1000);

      return;
    }

    // Add user message
    const userMsg = {
      role: 'user',
      text: trimmedMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const { data } = await aiAPI.chat(trimmedMessage);

      // Simulate typing delay for better UX
      setTimeout(() => {
        // Add bot response
        const botMsg = {
          role: 'bot',
          text: data.data.reply,
          timestamp: data.data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        setIsTyping(false);
      }, 800);
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback error message
      setTimeout(() => {
        const errorMsg = {
          role: 'bot',
          text: "I'm sorry, I'm having trouble connecting right now. Please try again! 🙏\n\nFor immediate assistance, contact us at:\n📞 +91 77080 32726",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsLoading(false);
        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'bot', 
        text: 'Chat cleared! 🧹 How can I help you today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 animate-bounce-slow"
          aria-label="Open chat"
        >
          <FiMessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-dark-100 overflow-hidden flex flex-col" style={{ maxHeight: '600px', height: 'calc(100vh - 100px)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                <FiMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Mathina AI Assistant</h3>
                <p className="text-xs text-primary-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors mr-1"
                aria-label="Clear chat"
                title="Clear chat history"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background-light to-white">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <p className="text-4xl mb-2">🐔</p>
                  <p className="text-dark-700 font-semibold">Welcome to Mathina FreshHub!</p>
                  <p className="text-dark-500 text-sm mt-1">
                    Ask me about products, recipes, track orders, or add to cart!
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.slice(0, 6).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action.query)}
                      className="text-left bg-white hover:bg-primary-50 border border-dark-200 hover:border-primary-300 p-3 rounded-xl transition-all text-xs flex items-center"
                    >
                      <span className="mr-2 text-lg">{action.icon}</span>
                      <span className="text-dark-700 font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Load More Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-dark-400 mb-2">More suggestions:</p>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(suggestion.query)}
                        className="w-full text-left bg-white hover:bg-primary-50 border border-dark-200 hover:border-primary-300 p-3 rounded-xl transition-all text-sm flex items-center"
                      >
                        <span className="mr-2 text-lg">{suggestion.icon}</span>
                        <span className="text-dark-700">{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className="max-w-[80%]">
                      <div
                        className={`p-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-none shadow-md'
                            : 'bg-white border border-dark-100 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                      <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-right text-dark-400' : 'text-left text-dark-400'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white border border-dark-100 p-3 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick Actions (shown when there are messages) */}
          {messages.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-dark-100 flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.slice(0, 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(action.query)}
                    className="flex-shrink-0 text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full border border-primary-200 transition-all whitespace-nowrap"
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-dark-100 p-4 bg-white flex-shrink-0">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products, recipes..."
                className="flex-1 border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-dark-300 disabled:to-dark-300 text-white p-2.5 rounded-xl transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                aria-label="Send message"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-dark-400 mt-2 text-center">
              🤖 AI-powered assistant • For human support, contact customer care
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
