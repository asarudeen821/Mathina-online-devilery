# 🤖 Ollama AI Chatbot Integration Guide

## ✅ Implementation Complete

An AI-powered chatbot using Ollama (local AI models) has been integrated into CluckFresh Hub for customer assistance.

## 🎯 Chatbot Purpose

The AI chatbot is designed to:
- ✅ Help users choose chicken products
- ✅ Suggest recipes based on available products
- ✅ Answer FAQs about delivery, freshness, and quality
- ✅ Provide product and service information
- ✅ Be friendly, helpful, and concise

## 🚫 What AI Does NOT Do

- ❌ Handle payments or pricing decisions
- ❌ Modify orders or process transactions
- ❌ Make autonomous business decisions
- ❌ Access sensitive customer data

## 📦 Installation

### Backend
Ollama SDK is already installed:
```bash
cd backend
npm install ollama
```

### Ollama Setup (Required)

1. **Install Ollama** from https://ollama.ai

2. **Pull a model** (e.g., Llama 3.2):
```bash
ollama pull llama3.2
```

3. **Start Ollama server**:
```bash
ollama serve
```

4. **Verify installation**:
```bash
ollama list
```

## 🔧 Configuration

### Environment Variables
Add to `backend/.env`:

```env
# Ollama AI Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Available Models
You can use any Ollama model:
- `llama3.2` - Lightweight, fast (Recommended)
- `llama3.1` - More capable
- `mistral` - Good balance
- `gemma2` - Google's model

## 📡 API Endpoints

### 1. Chat with AI ✅
**Endpoint:** `POST /api/chat/chat`

**Request:**
```json
{
  "message": "What chicken cuts are best for grilling?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "For grilling, chicken breast and thighs work best...",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### 2. Get Product Recommendations ✅
**Endpoint:** `POST /api/chat/recommend`

**Request:**
```json
{
  "preference": "low-fat high-protein",
  "category": "chicken-cuts"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "preference": "low-fat high-protein"
  }
}
```

### 3. Get Quick Suggestions ✅
**Endpoint:** `GET /api/chat/suggestions`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "label": "Suggest recipes",
      "query": "What recipes can I make with chicken breast?",
      "icon": "🍳"
    },
    {
      "label": "Best chicken cuts",
      "query": "What are the best chicken cuts for grilling?",
      "icon": "🍗"
    }
  ]
}
```

### 4. Test Connection ✅
**Endpoint:** `GET /api/chat/test` (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "models": ["llama3.2", "mistral"],
    "currentModel": "llama3.2",
    "host": "http://localhost:11434"
  }
}
```

## 💬 Frontend Chat Widget

### Features
- 🎨 Modern, rounded UI design
- 💬 Real-time messaging
- ⚡ Quick suggestion buttons
- 📱 Mobile responsive
- 🎯 Auto-scroll to latest message
- ⏳ Loading indicators

### Usage
The chat widget is already integrated into `App.jsx` and appears on all pages.

### Customization
Edit `frontend/src/components/ChatWidget.jsx`:

```jsx
// Change colors
className="bg-primary-600" // Button color
className="from-primary-600 to-primary-700" // Header gradient

// Modify welcome message
<p className="text-4xl mb-2">🐔</p>

// Add more suggestions
const suggestions = [
  {
    label: 'Your suggestion',
    query: 'Your query here',
    icon: '🎯',
  },
];
```

## 🧠 How It Works

### 1. Context-Aware Responses
The chatbot builds context from:
- Available products (20 items)
- Product categories
- User's order history (if authenticated)

### 2. System Prompt
```
You are an AI assistant for CluckFresh Hub...
- Help users choose chicken products
- Suggest recipes based on available products
- Answer FAQs about delivery, freshness, and quality
- Keep responses short and helpful (2-3 sentences max)
```

### 3. Fallback Responses
If Ollama is unavailable, the chatbot uses intelligent fallback responses based on keywords:
- Product queries → Product info
- Delivery queries → Delivery info
- Recipe queries → AI Recipe Generator
- etc.

## 🎯 Conversation Examples

### Example 1: Product Inquiry
**User:** "What chicken cuts are good for curry?"
**AI:** "For curry, I recommend our Fresh Chicken Breast or Boneless Chicken Curry Cut. Both absorb flavors well and cook quickly. Would you like to see these products?"

### Example 2: Recipe Help
**User:** "How do I cook chicken biryani?"
**AI:** "For chicken biryani, you'll need our Fresh Whole Chicken or Chicken Legs. Marinate with yogurt, spices, and cook with basmati rice. Try our AI Recipe Generator for a detailed recipe!"

### Example 3: Delivery Question
**User:** "How long does delivery take?"
**AI:** "We offer same-day delivery in Chennai for orders placed before 2 PM! Free delivery on orders above ₹500. We deliver to all major areas in Chennai."

## 🧪 Testing

### 1. Test Ollama Connection
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Should return installed models
```

### 2. Test Chat API
```bash
curl -X POST http://localhost:5000/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What products do you offer?"}'
```

### 3. Test from Frontend
1. Open http://localhost:5173
2. Click the chat icon (bottom-right)
3. Click a suggestion or type a message
4. Verify AI response

## 🔧 Troubleshooting

### Issue: "Ollama connection failed"
**Solution:**
```bash
# Start Ollama server
ollama serve

# Pull the model
ollama pull llama3.2
```

### Issue: "Model not found"
**Solution:**
```bash
# List available models
ollama list

# Pull the required model
ollama pull llama3.2
```

### Issue: Slow responses
**Solution:**
- Use a smaller model: `ollama pull llama3.2:1b`
- Update `.env`: `OLLAMA_MODEL=llama3.2:1b`
- Restart backend server

### Issue: Chat widget not appearing
**Solution:**
- Check browser console for errors
- Verify `ChatWidget` is imported in `App.jsx`
- Clear browser cache

## 📊 Performance

### Response Times
- **Local Ollama:** 1-3 seconds
- **Fallback responses:** < 0.1 seconds
- **With context:** 2-5 seconds

### Resource Usage
- **RAM:** 2-4 GB (depends on model)
- **CPU:** Moderate during inference
- **Disk:** 2-8 GB per model

## 🎨 UI Customization

### Change Chat Position
```jsx
// Top-right instead of bottom-right
className="fixed top-6 right-6"
```

### Change Colors
```jsx
// Different brand colors
className="bg-accent-600" // Red button
className="from-accent-600 to-accent-700" // Red header
```

### Modify Size
```jsx
// Wider chat window
className="w-[450px]"

// Taller chat area
className="h-[500px]"
```

## 🔒 Security & Privacy

### Data Protection
✅ No sensitive data sent to AI  
✅ Local processing (no cloud)  
✅ User authentication respected  
✅ Order history only for authenticated users  

### Rate Limiting
Consider adding rate limiting to prevent abuse:
```javascript
// Add rate limiter to chat routes
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 messages per 15 min
});

router.post('/chat', chatLimiter, chatWithAI);
```

## 🚀 Advanced Features

### 1. Multilingual Support
The chatbot can respond in Tamil or English based on user input.

### 2. Product Recommendations
```javascript
// Get personalized recommendations
const { data } = await axios.post('/api/chat/recommend', {
  preference: 'high-protein low-fat',
  category: 'chicken-cuts',
});
```

### 3. Order Integration
```javascript
// Context includes recent orders for personalized help
context.recentOrders = await Order.find({ user: userId }).limit(5);
```

## 📝 Best Practices

### Do's ✅
- Keep messages concise
- Use fallback responses
- Test with various queries
- Monitor performance
- Provide quick suggestions

### Don'ts ❌
- Don't handle payments via AI
- Don't make autonomous decisions
- Don't share sensitive data
- Don't rely solely on AI for support

## 🎯 Future Enhancements

- [ ] Voice input support
- [ ] Image-based product recognition
- [ ] Order tracking via chat
- [ ] Tamil language optimization
- [ ] Sentiment analysis
- [ ] Proactive suggestions
- [ ] Integration with WhatsApp

## 📞 Support

If you encounter issues:
1. Check Ollama is running: `ollama list`
2. Verify model is installed: `ollama pull llama3.2`
3. Check backend logs for errors
4. Test API endpoints directly

## 🎉 Summary

**Status:** ✅ Fully Implemented  
**AI Model:** Ollama (Llama 3.2)  
**Processing:** Local (privacy-focused)  
**Features:** Chat, Recommendations, Suggestions  
**UI:** Modern, responsive widget  
**Safety:** No payment handling  

---

**The AI chatbot is ready to assist your customers!** 🤖💬
