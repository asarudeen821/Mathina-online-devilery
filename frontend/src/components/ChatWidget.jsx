import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiX, FiSend, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';
import api, { aiAPI } from '../utils/api';
import { detectNavigation, slmRespond, QUICK_SUGGESTIONS } from '../utils/slmEngine';
import { useLanguage } from '../context/LanguageContext';

/**
 * Mathina AI Chef
 * - Trained on complete project knowledge, butchery cuts, cooking temps & master recipes
 * - Dual Engine: Smart backend AI with instant offline culinary SLM fallback (0% connection failure)
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

const ChatWidget = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  hideFloatingButton = false,
}) => {
  const navigate = useNavigate();
  const { currentLanguage, activeLangObj, isRTL, t } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(false);
    }
  };

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `👋 Vanakkam! Welcome to **Mathina AI Chef** — your master culinary and fresh butchery guide! 👨‍🍳🍗

I'm here to give you expert cooking advice, cut recommendations, and store assistance:

• 👨‍🍳 **Master Recipes:** Biryani, Dragon Chicken, Chicken 65, Lollipop, Tikka & Gravies
• 🍗 **11+ Cuts Guide:** Which cut works best for your recipe (Biryani Cut, Boneless, Wings...)
• 🔥 **Cooking Temps & Time:** Get juicy, tender chicken every single time
• 📦 **Express Ordering:** How to select weights & checkout in seconds
• 🚚 **Track Orders:** Live status from cutting to delivery on [/orders](/orders)
• 🔍 **100% Halal & Fresh:** Verify farm batch and QR traceability

💡 *Ask me any recipe or butchery question, or tap a quick chip below!*`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for navbar button click or custom event
  useEffect(() => {
    const handleOpenChat = () => {
      setInternalOpen(true);
    };
    window.addEventListener('open-mathina-chat', handleOpenChat);
    return () => window.removeEventListener('open-mathina-chat', handleOpenChat);
  }, []);

  const quickActions = [
    { label: '📦 How to Order', query: 'How to order chicken online step by step?', icon: '📦' },
    { label: '🍗 Products for Sale', query: 'What are those products for sale?', icon: '🍗' },
    { label: '👨‍🍳 Biryani Recipe', query: 'How to cook biryani step by step?', icon: '👨‍🍳' },
    { label: '🍜 Chicken Noodles', query: 'How to cook chicken noodles?', icon: '🍜' },
    { label: '🥘 Butter Chicken', query: 'How to cook butter chicken recipe?', icon: '🥘' },
    { label: '🐉 Dragon Chicken', query: 'How to cook dragon chicken recipe?', icon: '🐉' },
    { label: '🌶️ Chicken 65', query: 'How to make crispy chicken 65 at home?', icon: '🌶️' },
    { label: '🔪 11+ Cuts Guide', query: 'Tell me about all chicken cuts and best cooking methods', icon: '🔪' },
    { label: '🚚 Track Order', query: 'How to track my order status?', icon: '🚚' },
    { label: '🔍 QR & Halal', query: 'How does QR code traceability and Halal verification work?', icon: '🔍' },
    { label: '💰 Today Prices', query: 'What are today chicken prices per kg?', icon: '💰' },
    { label: '💳 Payment & UPI', query: 'What payment methods are available?', icon: '💳' },
    { label: '🏪 Shop & Owner', query: 'Where is Mathina Chicken Center located and owner contact?', icon: '🏪' },
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
        aiAPI.chat(trimmedMessage, currentLanguage),
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
        text: '🧹 Chat cleared! How can **Mathina AI Chef** help you today? Ask about master recipes, ideal cuts, cooking temps, or order tracking! 👨‍🍳🍗',
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
      {!hideFloatingButton && !isOpen && (
        <button
          onClick={() => {
            if (controlledIsOpen !== undefined) {
              // controlled
            } else {
              setInternalOpen(true);
            }
          }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center justify-center border-2 border-white/20 shadow-red-500/30"
          aria-label="Open Mathina AI Chef"
          title="Open Mathina AI Chef"
        >
          <GiChickenOven className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-5 sm:right-5 w-full sm:w-96 max-w-full sm:max-w-[calc(100vw-2rem)] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 border border-slate-200 overflow-hidden flex flex-col transition-all duration-300"
          style={{ maxHeight: '620px', height: 'calc(100vh - 65px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white p-4 flex items-center justify-between flex-shrink-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white/15 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <GiChickenOven className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Mathina AI Chef 👨‍🍳
                  {activeLangObj && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium ml-1">
                      {activeLangObj.flag} {activeLangObj.nativeName}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-amber-100 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online • Master Culinary & Butchery AI
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
                onClick={handleClose}
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
                placeholder="Ask Mathina AI Chef for recipes, cuts or order help..."
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
              👨‍🍳 Mathina AI Chef • Dual Engine: Smart AI + 100% Offline Culinary Knowledge
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
