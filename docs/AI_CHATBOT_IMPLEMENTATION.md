# 🤖 AI Chatbot Implementation Guide
## Mathina FreshHub - Production-Ready AI Assistant

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Setup & Configuration](#setup--configuration)
5. [API Endpoints](#api-endpoints)
6. [Frontend Integration](#frontend-integration)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Mathina FreshHub AI Chatbot is a production-ready, intelligent assistant that helps customers with:
- Product recommendations
- Recipe suggestions
- Delivery information
- General queries about the store

**Tech Stack:**
- **Backend:** Node.js + Express.js
- **AI Providers:** OpenAI (GPT-4o-mini) + Ollama (fallback)
- **Frontend:** React + Tailwind CSS
- **Memory:** In-memory conversation history with TTL

---

## Architecture

### Folder Structure

```
backend/
├── modules/
│   └── ai/
│       ├── ai.controller.js    # Request handlers
│       ├── ai.service.js       # Core AI logic
│       ├── ai.routes.js        # API routes
│       ├── ai.prompts.js       # System prompts
│       └── ai.memory.js        # Conversation memory
├── utils/
│   └── ollamaService.js        # Ollama integration
└── src/
    └── server.js               # Main server file

frontend/
├── src/
│   ├── components/
│   │   └── ChatWidget.jsx      # Chat UI component
│   └── index.css               # Custom styles
```

### Data Flow

```
User Message → ChatWidget → /api/ai/chat → ai.controller.js
                                              ↓
                                         ai.service.js
                                              ↓
                                    OpenAI (primary) or Ollama (fallback)
                                              ↓
                                         ai.memory.js (save history)
                                              ↓
                                         Response to User
```

---

## Features

### ✅ Implemented Features

1. **Smart AI Responses**
   - Context-aware conversations
   - Product-aware recommendations
   - Recipe suggestions
   - Multilingual support (English + Tamil)

2. **Conversation Memory**
   - Stores last 10 messages per session
   - 30-minute session TTL
   - Auto-cleanup of expired sessions

3. **Dual AI Provider Support**
   - **Primary:** OpenAI GPT-4o-mini
   - **Fallback:** Ollama (llama3.2)
   - Automatic failover

4. **Advanced Chat UI**
   - Auto-scroll to bottom
   - Typing indicator
   - Quick action suggestions
   - Clear chat history
   - Timestamp display
   - Responsive design

5. **Error Handling**
   - Graceful fallbacks
   - User-friendly error messages
   - Context-aware fallbacks (price, recipe, delivery)

6. **Security & Rate Limiting**
   - Optional authentication for context
   - Session-based isolation
   - Protected admin endpoints

---

## Setup & Configuration

### 1. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install openai
```

#### Configure Environment Variables

Edit `backend/.env`:

```env
# OpenAI (Primary AI Provider)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Ollama (Fallback AI Provider)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Get OpenAI API Key

1. Visit: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy and paste to `.env`

#### Start Backend Server

```bash
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║   🐔 CluckFresh Hub API Server                            ║
║   🚀 Server running on port 5000                          ║
║   🤖 AI Chatbot: OpenAI + Ollama (fallback)               ║
╚═══════════════════════════════════════════════════════════╝
```

### 2. Frontend Setup

The ChatWidget is already integrated in `App.jsx`. No additional setup needed!

To customize, edit `frontend/src/components/ChatWidget.jsx`

---

## API Endpoints

### Chat Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/chat` | Optional | Send message to AI |
| GET | `/api/ai/suggestions` | Public | Get quick suggestions |
| POST | `/api/ai/recommend` | Public | Get product recommendations |
| GET | `/api/ai/chat/history` | Private | Get conversation history |
| DELETE | `/api/ai/chat/history` | Private | Clear conversation history |
| GET | `/api/ai/test` | Admin | Test AI configuration |

### Request/Response Examples

#### POST /api/ai/chat

**Request:**
```json
{
  "message": "What's the best chicken cut for biryani?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "For biryani, I recommend our whole chicken (1kg) - it's perfect for dum cooking. The meat stays tender and absorbs the spices beautifully! 🍗 Would you like me to add some biryani masala from our marinades section?",
    "timestamp": "2024-03-31T12:00:00.000Z",
    "session": {
      "startedAt": 1711886400000,
      "messageCount": 5
    }
  }
}
```

#### GET /api/ai/suggestions

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

---

## Frontend Integration

### Basic Usage

The ChatWidget is already included in `App.jsx`:

```jsx
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <>
      {/* ... other components */}
      <ChatWidget />
    </>
  );
}
```

### Props (Optional Customization)

```jsx
<ChatWidget 
  apiUrl="/api/ai/chat"
  theme="green"
  position="bottom-right"
/>
```

---

## Customization

### 1. Customize AI Personality

Edit `backend/src/modules/ai/ai.prompts.js`:

```javascript
export const SYSTEM_PROMPT = `
You are the AI assistant for Mathina FreshHub...

[Modify tone, style, and rules here]
`;
```

### 2. Change Quick Suggestions

Edit the `suggestionsHandler` in `ai.controller.js` or the frontend component:

```jsx
// In ChatWidget.jsx
const suggestions = [
  { label: 'Your suggestion', query: 'User query', icon: '🎯' },
];
```

### 3. Styling

Edit `ChatWidget.jsx` Tailwind classes or add custom CSS to `index.css`.

### 4. Memory Settings

Edit `backend/src/modules/ai/ai.memory.js`:

```javascript
const MAX_HISTORY_LENGTH = 10;  // Messages to keep
const SESSION_TTL = 30 * 60 * 1000;  // 30 minutes
```

---

## Troubleshooting

### Issue: "OPENAI_API_KEY is not defined"

**Solution:** Add your API key to `.env`:
```env
OPENAI_API_KEY=sk-your-key-here
```

### Issue: "Both AI providers failed"

**Solutions:**
1. Check OpenAI API key is valid
2. Ensure Ollama is running: `ollama serve`
3. Check network connectivity

### Issue: Chat not appearing

**Solutions:**
1. Verify `ChatWidget` is imported in `App.jsx`
2. Check browser console for errors
3. Ensure Tailwind CSS is configured

### Issue: Slow responses

**Solutions:**
1. Use `gpt-4o-mini` (faster than GPT-4)
2. Reduce product context limit in `ai.service.js`
3. Enable caching for products

### Test AI Connection

```bash
# Test endpoint (admin auth required)
curl http://localhost:5000/api/ai/test \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "openai": {
      "configured": true,
      "model": "gpt-4o-mini"
    },
    "ollama": {
      "configured": true,
      "model": "llama3.2"
    },
    "activeProvider": "openai"
  }
}
```

---

## Production Checklist

- [ ] Set valid `OPENAI_API_KEY`
- [ ] Configure rate limiting (express-rate-limit)
- [ ] Enable HTTPS
- [ ] Set up logging (Winston/Morgan)
- [ ] Monitor API usage and costs
- [ ] Add conversation analytics
- [ ] Implement human handoff for complex queries
- [ ] Add feedback mechanism (thumbs up/down)

---

## Cost Estimation

**OpenAI Pricing (GPT-4o-mini):**
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

**Average conversation:**
- ~500 tokens per exchange
- ~100 conversations = $0.05 - $0.10

**Monthly estimate (1000 conversations/day):**
- ~$1.50 - $3.00 / month

---

## Support

For issues or questions:
- Check logs: `backend/logs/`
- Enable debug mode: `NODE_ENV=development`
- Contact: support@mathinafreshhub.com

---

**Version:** 1.0.0  
**Last Updated:** March 31, 2024
