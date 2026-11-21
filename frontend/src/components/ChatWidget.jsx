import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiX, FiSend, FiTrash2, FiExternalLink } from 'react-icons/fi';
import api, { aiAPI } from '../utils/api';
import { detectNavigation, slmRespond, QUICK_SUGGESTIONS } from '../utils/slmEngine';

/**
 * Mathina AI Assistant
 * - Trained on complete project knowledge & documentation
 * - Dual Engine: Smart backend AI with instant offline SLM fallback (0% connection failure)
 * - Claude / ChatGPT formatted markdown rendering with links & tables
 * - Step-by-step guidance on ordering, tracking, QR traceability, cuts, recipes & payments
 */

const renderMarkdown = (text, navigate) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.trim() === '') return <div key={i} className="h-1.5" />;

    // Table rows
    if (line.startsWith('|') && line.includes('|')) {
      const cells = line.split('|').filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => c.match(/^[-:\s]+$/))) return null;
      return (
        <div key={i} className="grid grid-cols-2 gap-2 text-xs py-1 px-2 my-0.5 bg-slate-50 rounded border border-slate-100">
          {cells.map((c, j) => (
            <span key={j} className={j === 0 ? 'font-medium text-slate-800' : 'font-bold text-red-600'}>
              {c}
            </span>
          ))}
        </div>
      );
    }

    // Headers
    if (line.startsWith('### ')) {
      return <h4 key={i} className="font-bold text-sm text-slate-900 mt-2 mb-1">{line.replace('### ', '')}</h4>;
    }
    if (line.startsWith('## ') || line.startsWith('# ')) {
      return <h3 key={i} className="font-bold text-sm text-slate-900 mt-2 mb-1">{line.replace(/^#+\s*/, '')}</h3>;
    }

    // Bullet points
    const isBullet = line.startsWith('• ') || line.startsWith('- ') || /^\d+\.\s/.test(line);
    const cleanLine = isBullet ? line.replace(/^[•\-\d+\.]\s*/, '') : line;

    // Parse links: [label](path)
    const parts = [];
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    let match;
    let lastIndex = 0;
    let keyIdx = 0;

    while ((match = linkRegex.exec(cleanLine)) !== null) {
      const before = cleanLine.substring(lastIndex, match.index);
      if (before) parts.push({ type: 'text', content: before, key: keyIdx++ });
      parts.push({ type: 'link', label: match[1], path: match[2], key: keyIdx++ });
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < cleanLine.length) {
      parts.push({ type: 'text', content: cleanLine.substring(lastIndex), key: keyIdx++ });
    }

    const rendered = parts.map((part) => {
      if (part.type === 'link') {
        return (
          <button
            key={part.key}
            onClick={() => navigate(part.path)}
            className="text-red-600 hover:text-red-700 font-semibold underline underline-offset-2 mx-0.5 inline-flex items-center"
          >
            {part.label}
          </button>
        );
      }
      const subParts = part.content.split(/\*\*(.*?)\*\*/g);
      return subParts.map((sub, j) =>
        j % 2 === 1 ? <strong key={`${part.key}-${j}`} className="font-bold text-slate-900">{sub}</strong> : sub
      );
    });

    if (isBullet) {
      return (
        <div key={i} className="flex items-start gap-1.5 my-0.5 text-xs text-slate-700 leading-relaxed">
          <span className="text-red-500 font-bold mt-0.5">•</span>
          <div className="flex-1">{rendered}</div>
        </div>
      );
    }

    return (
      <p key={i} className="text-xs text-slate-700 leading-relaxed my-0.5">
        {rendered}
      </p>
    );
  });
};

const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `👋 Hi! Welcome to **Mathina AI Assistant** — your personal butchery concierge and chef! 🍗

I'm trained on everything at **Mathina Chicken Center** to give you instant, reliable answers:

• 📦 **How to Order:** Step-by-step cut selection, weights & express checkout
• 🚚 **Track Orders:** Check live cutting, packaging & rider updates on [/orders](/orders)
• 🔍 **Farm-to-Table QR:** Verify 100% Halal certification, farm batch & freshness
• 💳 **Payment & UPI:** Indian Bank QR standee (\`CF05100492@indianbk\`) & Cash on Delivery
• 🍗 **11+ Cuts Guide:** Dragon Chicken, Biryani Cut, Butterfly, Lollipop, 65 & Julienne
• 🏷️ **Festival Coupon:** Use \`MATHINA2024\` for 15% off Biryani & Big Curry Cut
• 👨‍🍳 **Master Recipes:** Cooking steps, temperatures & times for ANY dish

💡 *Tip:* Ask me any question below or tap a quick topic!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const quickActions = [
    { label: '📦 How to Order', query: 'How to order chicken online?', icon: '📦' },
    { label: '🚚 Track Order', query: 'How to track my order?', icon: '🚚' },
    { label: '🔍 QR Traceability', query: 'How does QR code traceability work?', icon: '🔍' },
    { label: '💳 Payment & UPI', query: 'What payment methods are available?', icon: '💳' },
    { label: '🍗 11+ Cuts Guide', query: 'Tell me about all chicken cuts', icon: '🍗' },
    { label: '🏷️ Promo Coupon', query: 'What is the festival discount coupon?', icon: '🏷️' },
    { label: '📅 Weekly Plans', query: 'How do subscriptions work?', icon: '📅' },
    { label: '🍳 Biryani Recipe', query: 'How to make chicken biryani?', icon: '🍳' },
    { label: '🐉 Dragon Chicken', query: 'How to cook dragon chicken?', icon: '🐉' },
    { label: '💰 Today Prices', query: 'What are today chicken prices?', icon: '💰' },
    { label: '🏪 Shop & Owner', query: 'Where is Mathina Chicken Center located?', icon: '🏪' },
  ];

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

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText || !messageText.trim()) return;

    const trimmedMessage = messageText.trim();

    // Check for explicit navigation commands FIRST
    const navigation = detectNavigation(trimmedMessage);
    if (navigation) {
      const userMsg = {
        role: 'user',
        text: trimmedMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      const navMsg = {
        role: 'bot',
        text: `${navigation.message}\n\n🔗 Opening: **${navigation.label}**`,
        timestamp: new Date().toISOString(),
        isNavigation: true,
      };
      setMessages((prev) => [...prev, navMsg]);

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

    // Try backend AI first with a fast timeout; if unavailable or throws error, gracefully fall back to SLM engine
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Backend timeout')), 3000)
      );

      const res = await Promise.race([
        aiAPI.chat(trimmedMessage),
        timeoutPromise,
      ]);

      const reply = res?.data?.data?.reply || res?.data?.reply;
      if (!reply) throw new Error('Empty backend reply');

      setTimeout(() => {
        const botMsg = {
          role: 'bot',
          text: reply,
          timestamp: res?.data?.data?.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        setIsTyping(false);
      }, 400);
    } catch (err) {
      // Offline / Local Knowledge Base Fallback - 100% resilient, trained on all md files
      const localReply = slmRespond(trimmedMessage);

      setTimeout(() => {
        const botMsg = {
          role: 'bot',
          text: localReply,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        setIsTyping(false);
      }, 400);
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
        text: '🧹 Chat cleared! How can **Mathina AI Assistant** help you today? Ask about cuts, how to order, tracking, or cooking recipes! 🍗',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center justify-center border-2 border-white/20 shadow-red-500/30"
          aria-label="Open Mathina AI Assistant"
          title="Open Mathina AI Assistant"
        >
          <FiMessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-5 right-5 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 border border-slate-200 overflow-hidden flex flex-col transition-all duration-300"
          style={{ maxHeight: '620px', height: 'calc(100vh - 90px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white p-4 flex items-center justify-between flex-shrink-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white/15 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <FiMessageSquare className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Mathina AI Assistant
                </h3>
                <p className="text-[11px] text-amber-100 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online • Knowledge Trained
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors text-white/90"
                aria-label="Clear chat"
                title="Clear conversation"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors text-white/90"
                aria-label="Close chat"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className="max-w-[85%]">
                  <div
                    className={`p-3.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-br-none shadow-md'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-xs whitespace-pre-wrap break-words">{msg.text}</p>
                    ) : (
                      <div className="text-xs break-words">{renderMarkdown(msg.text, navigate)}</div>
                    )}
                  </div>
                  <p
                    className={`text-[10px] mt-1 text-slate-400 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-200 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(action.query)}
                  className="flex-shrink-0 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full border border-rose-200 transition-all whitespace-nowrap shadow-xs"
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="border-t border-slate-200 p-3 bg-white flex-shrink-0">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Mathina AI Assistant..."
                className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all disabled:cursor-not-allowed shadow-md"
                aria-label="Send message"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              🍗 Mathina AI Assistant • Trained on store cuts, tracking & butchery recipes
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
