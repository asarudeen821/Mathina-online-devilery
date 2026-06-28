import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiX, FiTrash2, FiChevronDown, FiRefreshCw, FiCpu, FiWifi, FiExternalLink } from 'react-icons/fi';
import { GiChickenOven } from 'react-icons/gi';
import { slmRespond, QUICK_SUGGESTIONS, detectNavigation } from '../utils/slmEngine';

// Simple markdown-like renderer for bot responses
const renderText = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-bold text-gray-900 mt-2">{line.replace(/\*\*/g, '')}</p>;
    }
    if (line.startsWith('• ')) {
      return <li key={i} className="ml-3 text-gray-700 text-sm list-disc">{line.replace('• ', '')}</li>;
    }
    if (line.startsWith('|') && line.includes('|')) {
      // Simple table row
      const cells = line.split('|').filter(Boolean).map(c => c.trim());
      if (cells.every(c => c.match(/^[-\s]+$/))) return null; // separator row
      return (
        <div key={i} className="flex gap-2 text-xs border-b border-gray-100 py-0.5">
          {cells.map((c, j) => <span key={j} className={`flex-1 ${j === 0 ? 'font-medium' : 'text-primary-700 font-bold'}`}>{c}</span>)}
        </div>
      );
    }
    if (line.startsWith('#')) {
      return <p key={i} className="font-bold text-base text-gray-900 mt-1">{line.replace(/^#+\s*/, '').replace(/\*/g, '')}</p>;
    }
    if (line.trim() === '') return <br key={i} />;
    // Bold inline
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="text-sm text-gray-700 leading-relaxed">
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </p>
    );
  });
};

const RecipeChatBot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `👋 *Welcome to Mathina FreshHub AI!*\n\nI'm your chicken recipe assistant 🍗\n\nAsk me anything:\n• "How to cook dragon chicken?"\n• "Biryani recipe"\n• "Chicken tikka recipe"\n• "Today's prices"\n\n💡 *Navigation Commands:*\n• "Open products" - Browse products\n• "Open QR scanner" - Scan codes\n• "View my cart" - Check cart\n• "Show my orders" - Track orders\n\nOr tap a suggestion below! 👇`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for navbar button click (alternate open)
  useEffect(() => {
    const handleOpenChat = () => {
      setOpen(true);
      setMinimized(false);
    };
    window.addEventListener('open-mathina-chat', handleOpenChat);
    return () => window.removeEventListener('open-mathina-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    // Check for navigation commands FIRST
    const navigation = detectNavigation(msg);
    if (navigation) {
      const userMsg = {
        role: 'user',
        text: msg,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((p) => [...p, userMsg]);
      setInput('');
      setTyping(true);
      setShowSuggestions(false);

      // Show navigation message with link
      setTimeout(() => {
        const navMsg = {
          role: 'bot',
          text: `${navigation.message}\n\n🔗 Opening: ${navigation.label}`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isNavigation: true,
          route: navigation.route,
        };
        setMessages((p) => [...p, navMsg]);
        setTyping(false);

        // Navigate after delay
        setTimeout(() => {
          navigate(navigation.route);
        }, 800);
      }, 500);

      return;
    }

    const userMsg = {
      role: 'user',
      text: msg,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setShowSuggestions(false);

    // Simulate SLM thinking delay (300-800ms)
    const delay = 300 + Math.random() * 500;
    setTimeout(() => {
      const reply = slmRespond(msg);
      setMessages((p) => [
        ...p,
        {
          role: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTyping(false);
    }, delay);
  };

  const clearChat = () => {
    setMessages([{
      role: 'bot',
      text: 'Chat cleared! Ask me any chicken recipe or price question!',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setShowSuggestions(true);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-6 z-50 bg-gradient-to-br from-primary-600 to-primary-700 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all"
        title="AI Recipe Assistant"
      >
        <GiChickenOven className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-24 left-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 ${
        minimized ? 'h-14' : 'h-[520px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <GiChickenOven className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm flex items-center gap-1">
              Mathina AI Chef
              <GiChickenOven className="w-3.5 h-3.5 text-yellow-300" />
            </p>
            <p className="text-primary-100 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
              <FiWifi className="w-3 h-3" />
              Recipe & Price Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearChat} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors" title="Clear chat">
            <FiRefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setMinimized(!minimized)} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors" title={minimized ? 'Expand' : 'Minimize'}>
            <FiChevronDown className={`w-4 h-4 transition-transform ${minimized ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setOpen(false)} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors" title="Close">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'flex items-start gap-2'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <GiChickenOven className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-3 py-2.5 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : msg.isNavigation
                          ? 'bg-gradient-to-br from-blue-50 to-primary-50 border-2 border-primary-300 shadow-md rounded-bl-none'
                          : 'bg-white border border-gray-100 shadow-sm rounded-bl-none'
                      }`}
                    >
                      {msg.role === 'bot' ? (
                        <div className="space-y-0.5">
                          {msg.isNavigation && (
                            <div className="flex items-center gap-2 mb-2 text-primary-700">
                              <FiExternalLink className="w-4 h-4" />
                              <span className="font-bold text-xs uppercase tracking-wide">Navigation</span>
                            </div>
                          )}
                          {renderText(msg.text)}
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                    <p className={`text-xs text-gray-400 mt-0.5 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <GiChickenOven className="w-4 h-4 text-primary-600" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            {showSuggestions && messages.length <= 1 && (
              <div className="pt-1">
                <p className="text-xs text-gray-400 mb-2 text-center">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s.query)}
                      className="text-xs bg-white border border-primary-200 text-primary-700 px-2.5 py-1.5 rounded-full hover:bg-primary-50 hover:border-primary-400 transition-all font-medium"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white rounded-b-2xl flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask a recipe or price..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 transition-colors"
                disabled={typing}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white p-2.5 rounded-xl transition-colors"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-1.5 flex items-center justify-center gap-1">
              <FiCpu className="w-3 h-3" />
              Offline AI · No internet needed for recipes
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeChatBot;
