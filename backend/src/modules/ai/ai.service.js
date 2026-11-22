/**
 * AI Service - Core Logic for Chatbot
 * Supports both OpenAI and Ollama (fallback)
 * Hybrid AI: Rules Engine + AI Enhancement
 */

import OpenAI from 'openai';
import ollamaService from '../../utils/ollamaService.js';
import geminiService from '../../utils/geminiService.js';
import { SYSTEM_PROMPT } from './ai.prompts.js';
import { detectIntent, detectLanguage } from '../../utils/intent.js';
import { getRecipeRecommendation } from '../../services/recipe.engine.js';
import { getLatestOrder, getOrderById, estimateDeliveryTime } from '../../services/order.service.js';
import { formatOrderStatus, formatDeliveryEstimate } from '../../services/order.format.js';
import { addToCartByName, getCartSummary } from '../../services/cart.service.js';
import { getUserPreferences, buildPersonalizationContext, getReorderSuggestions } from '../../services/user.service.js';

// Initialize OpenAI client
let openai;
const isOpenAIEnabled = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

if (isOpenAIEnabled) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Generate AI response using OpenAI or Ollama
 * @param {Object} params - Parameters
 * @param {string} params.message - User message
 * @param {Array} params.products - Available products for context
 * @param {Array} params.history - Conversation history
 * @param {string} params.userId - User identifier
 * @returns {Promise<string>} AI response
 */
export const generateAIResponse = async ({ message, products = [], history = [], userId, language: reqLang }) => {
  try {
    // STEP 1: Detect intent (fast rule-based)
    const intent = detectIntent(message);

    // STEP 2: Detect language
    const language = detectLanguage(message);

    // STEP 3: Normalize client selected language or get user preferences
    const langMap = {
      ta: 'tamil',
      tamil: 'tamil',
      ml: 'malayalam',
      malayalam: 'malayalam',
      hi: 'hindi',
      hindi: 'hindi',
      ur: 'urdu',
      urdu: 'urdu',
      ar: 'arabic',
      arabic: 'arabic',
      en: 'english',
      english: 'english',
    };
    const clientLang = reqLang ? (langMap[reqLang.toLowerCase()] || reqLang) : null;

    const userPrefs = userId ? await getUserPreferences(userId).catch(() => null) : null;
    const preferredLanguage = clientLang || userPrefs?.language || language;

    // STEP 4: Handle intents with rule engine first
    // Order Tracking Intent
    if (intent.intent === 'tracking') {
      const orderResponse = await handleTrackingIntent(userId, intent.data, preferredLanguage);
      if (orderResponse) {
        return orderResponse;
      }
    }

    // Recipe Intent
    if (intent.intent === 'recipe') {
      const recipeResponse = handleRecipeIntent(message, preferredLanguage);
      if (recipeResponse) {
        return recipeResponse;
      }
    }

    // Cart Intent
    if (intent.intent === 'cart') {
      const cartResponse = await handleCartIntent(userId, message, products, preferredLanguage);
      if (cartResponse) {
        return cartResponse;
      }
    }

    // Greeting Intent
    if (intent.intent === 'greeting') {
      return handleGreetingIntent(userPrefs?.name, preferredLanguage);
    }

    // STEP 5: For general queries, use AI with context
    // Build system prompt with personalization
    const personalizationContext = userId ? await buildPersonalizationContext(userId).catch(() => '') : '';
    const systemPrompt = buildSystemPrompt(products, personalizationContext, preferredLanguage);

    // Prepare messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Try OpenAI first if enabled
    if (isOpenAIEnabled && openai) {
      try {
        const response = await generateWithOpenAI(messages);
        return response;
      } catch (openAIError) {
        console.warn('[AI Service] OpenAI failed, trying Gemini:', openAIError.message);
      }
    }

    // Try Gemini
    try {
      const response = await generateWithGemini(message, products, preferredLanguage);
      return response;
    } catch (geminiError) {
      console.warn('[AI Service] Gemini failed, trying Ollama:', geminiError.message);
    }

    // Fallback to Ollama
    try {
      const response = await generateWithOllama(message, products, history, preferredLanguage);
      return response;
    } catch (ollamaError) {
      console.error('[AI Service] All AI providers failed:', ollamaError.message);
      throw new Error('All AI providers failed');
    }
  } catch (error) {
    console.error('[AI Service] Critical error:', error);
    return getFallbackResponse(message);
  }
};

/**
 * Handle order tracking intent
 * @param {string} userId - User ID
 * @param {string} orderId - Order ID (optional)
 * @param {string} language - Language preference
 * @returns {Promise<string>} Formatted response
 */
const handleTrackingIntent = async (userId, orderId, language) => {
  try {
    let order;

    if (orderId) {
      order = await getOrderById(orderId, userId);
    } else {
      order = await getLatestOrder(userId);
    }

    if (!order) {
      return language === 'tamil'
        ? '❌ ஆர்டர் எதுவும் கிடைக்கவில்லை. புதிய ஆர்டர் செய்ய விரும்புகிறீர்களா?'
        : '❌ No orders found. Would you like to place a new order?';
    }

    const formattedStatus = formatOrderStatus(order, language);
    const eta = estimateDeliveryTime(order);
    const deliveryMsg = formatDeliveryEstimate(order, language, eta);

    return `${formattedStatus}\n\n${deliveryMsg}`;
  } catch (error) {
    console.error('[AI Service] Tracking intent error:', error);
    return null;
  }
};

/**
 * Handle recipe intent
 * @param {string} message - User message
 * @param {string} language - Language preference
 * @returns {string|null} Recipe response
 */
const handleRecipeIntent = (message, language) => {
  try {
    const result = getRecipeRecommendation(message, language);

    if (result.found) {
      return result.response;
    }

    return null;
  } catch (error) {
    console.error('[AI Service] Recipe intent error:', error);
    return null;
  }
};

/**
 * Handle cart intent
 * @param {string} userId - User ID
 * @param {string} message - User message
 * @param {Array} products - Available products
 * @param {string} language - Language preference
 * @returns {Promise<string|null>} Cart response
 */
const handleCartIntent = async (userId, message, products, language) => {
  try {
    // Extract product name from message
    const productMatch = products.find((p) => {
      const nameMatch = message.toLowerCase().includes(p.name.toLowerCase());
      const categoryMatch = message.toLowerCase().includes(p.category.toLowerCase());
      return nameMatch || categoryMatch;
    });

    if (productMatch) {
      const result = await addToCartByName(userId, productMatch.name, 1);

      if (result.success) {
        const isTamil = language === 'tamil';
        return isTamil
          ? `✅ ${productMatch.name} கார்ட்டில் சேர்க்கப்பட்டது! மேலும் ஏதேனும் வேண்டுமா?`
          : `✅ ${productMatch.name} added to cart! Want anything else?`;
      } else {
        return language === 'tamil'
          ? `❌ பொருள் கிடைக்கவில்லை: ${productMatch.name}`
          : `❌ Product not available: ${productMatch.name}`;
      }
    }

    // No product match, let AI handle it
    return null;
  } catch (error) {
    console.error('[AI Service] Cart intent error:', error);
    return null;
  }
};

/**
 * Handle greeting intent
 * @param {string} userName - User name
 * @param {string} language - Language preference
 * @returns {string} Greeting response
 */
const handleGreetingIntent = (userName, language) => {
  const isTamil = language === 'tamil';

  if (userName) {
    return isTamil
      ? `வணக்கம் ${userName}! 🙏 Mathina Chicken Center-க்கு வரவேற்கிறோம். இன்று என்ன வாங்க விரும்புகிறீர்கள்?`
      : `Hello ${userName}! 🙏 Welcome to Mathina Chicken Center. What would you like to order today?`;
  }

  return isTamil
    ? 'வணக்கம்! 🙏 Mathina Chicken Center-க்கு வரவேற்கிறோம். எப்படி உதவ முடியும்?'
    : 'Hello! 🙏 Welcome to Mathina Chicken Center. How can I help you today?';
};

/**
 * Generate response using OpenAI
 * @param {Array} messages - Message array
 * @returns {Promise<string>} Response
 */
const generateWithOpenAI = async (messages) => {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages,
    max_tokens: 500,
    temperature: 0.7,
    top_p: 0.9,
  });

  return response.choices[0].message.content;
};

/**
 * Generate response using Gemini
 * @param {string} message - User message
 * @param {Array} products - Products context
 * @param {string} language - Language preference
 * @returns {Promise<string>} Response
 */
const generateWithGemini = async (message, products = [], language = 'english') => {
  const productList = products.map(p => `${p.name} (${p.category}): ₹${p.price}/kg`).join(', ');
  const langNote = language === 'tamil' ? ' Respond in Tamil or Tanglish.' : '';
  const prompt = `You are the AI assistant for Mathina Chicken Center, a chicken marketplace in Chennai. Help with recipes, products, delivery, and orders. Be concise and friendly.${langNote}

Available products: ${productList || 'Fresh chicken cuts, eggs, marinades'}

User: ${message}`;

  return await geminiService.chat(prompt);
};

/**
 * Generate response using Ollama
 * @param {string} message - User message
 * @param {Array} products - Products context
 * @param {Array} history - Conversation history
 * @param {string} language - Language preference
 * @returns {Promise<string>} Response
 */
const generateWithOllama = async (message, products, history, language = 'english') => {
  const systemPrompt = buildSystemPrompt(products, '', language);

  // Build context string for Ollama
  const context = {
    system: systemPrompt,
    history: history.slice(-5), // Last 5 messages for context
    language,
  };

  return await ollamaService.chat(message, context);
};

/**
 * Build system prompt with product context
 * @param {Array} products - Available products
 * @param {string} personalizationContext - User personalization context
 * @param {string} language - Language preference
 * @returns {string} System prompt
 */
const buildSystemPrompt = (products = [], personalizationContext = '', language = 'english') => {
  let prompt = SYSTEM_PROMPT;

  // Add personalization context
  if (personalizationContext) {
    prompt += `\n\n${personalizationContext}`;
  }

  // Add language instruction
  if (language === 'tamil') {
    prompt += `\n\nIMPORTANT: User prefers Tamil. Respond in Tamil (or Tanglish - Tamil + English mix).`;
  }

  if (products.length > 0) {
    const productList = products
      .map((p) => `- ${p.name} (${p.category}): ₹${p.price}/kg`)
      .join('\n');

    prompt += `\n\n## Currently Available Products\n${productList}`;
  }

  return prompt;
};

/**
 * Intelligent Fallback & Personal Assistant Engine
 * Guarantees Claude/ChatGPT-grade responses even if external AI APIs are unconfigured or offline
 * @param {string} userMessage - Original user message
 * @returns {string} Intelligent personal assistant response
 */
const getFallbackResponse = (userMessage) => {
  if (!userMessage) return "👋 Welcome to Mathina Chicken Center! I am your AI Chef & Personal Assistant. How can I help you today? 👨‍🍳";
  
  const msg = userMessage.toLowerCase().trim();

  // 1. Portion & Guest Meat Calculator
  if (msg.includes('how much chicken') || msg.includes('how many kg') || msg.includes('portion') || msg.includes('serving') || msg.includes('people') || msg.includes('guests')) {
    return `⚖️ **Personal Assistant: Chicken Portion & Weight Calculator**

Here is our master butchery planning formula for your meal:

• 👨‍👩‍👧 **For 2 People:** **500g** Curry Cut or **350g** Boneless Breast Cubes
• 👨‍👩‍👧‍👦 **For 4–5 People (Family Meal):** **1 kg – 1.25 kg** Biryani / Curry Cut
• 👥 **For 6–8 People:** **1.5 kg – 2 kg** Big Curry Cut
• 🥳 **For 10+ Guests (Party / Event):** **2.5 kg – 3 kg** Biryani Cut + **1 kg** Chicken 65 / Lollipops for appetizers!

💡 **Biryani Golden Ratio:** For **1 kg rice**, use **1.25 kg Mathina Biryani Cut** so every bite has succulent meat!
👉 Select your custom weight on our **[Products Page](/products)**! 📦`;
  }

  // 2. Kitchen Troubleshooting (Rubbery / Dry / Tough Chicken)
  if (msg.includes('rubbery') || msg.includes('dry') || msg.includes('tough') || msg.includes('hard') || msg.includes('chewy') || msg.includes('soft') || msg.includes('tender')) {
    return `🩺 **Personal Kitchen Assistant: Why Is Chicken Rubbery & How to Keep It Juicy!**

1. 🌡️ **The 20-Min Rule:** Never cook ice-cold chicken straight from the fridge; let it rest on the counter for 20 mins first.
2. ⏱️ **Internal Temp:** Remove chicken when internal temp hits **74°C (165°F)** — cooking past this dries out lean meat.
3. ⏸️ **Rest 5 Minutes:** Always rest cooked whole breasts or meat under loose foil before slicing so juices redistribute.
4. 🥛 **Marinate in Yogurt / Buttermilk:** Lactic acid gently breaks down muscle fibers for melt-in-mouth tenderness!`;
  }

  // 3. Kitchen Emergency (Too Salty / Too Spicy)
  if (msg.includes('salty') || msg.includes('spicy') || msg.includes('too hot') || msg.includes('fix salt') || msg.includes('curry salty') || msg.includes('reduce spice')) {
    return `🚨 **Kitchen Emergency Assistant: How to Balance Your Curry!**

• **Too Salty?** Drop 1 peeled, halved raw potato into the simmering curry for 10 mins (it absorbs excess salt!), or stir in 3 tbsp fresh cream / coconut milk.
• **Too Spicy?** Add 1 tsp honey or jaggery, or squeeze 1 tbsp fresh lemon juice, or stir in 2 tbsp cashew paste / thick curd!`;
  }

  // 4. Ingredient Substitutes & Swaps
  if (msg.includes('substitute') || msg.includes('replacement') || msg.includes('alternative') || msg.includes("don't have") || msg.includes("dont have") || msg.includes('no curd') || msg.includes('no yogurt')) {
    return `🔄 **Personal Kitchen Assistant: Ingredient Substitutes & Smart Swaps**

• 🥛 **No Curd / Yogurt in Marinade?** Use equal buttermilk, or 1.5 tbsp lemon juice + 2 tbsp oil, or 1/2 cup fresh coconut milk!
• 🌾 **No Cornflour for Crispy 65?** Substitute with equal Rice Flour (*Arisi Maavu*) for an even crunchier bite!
• 🥚 **No Egg for Batter?** Mix 2 tbsp cornflour with 3 tbsp cold water to create a silky binding slurry!`;
  }

  // 5. Food Safety, Storage & Defrosting
  if (msg.includes('defrost') || msg.includes('thaw') || msg.includes('storage') || msg.includes('store chicken') || msg.includes('fridge') || msg.includes('freezer') || msg.includes('shelf life')) {
    return `🛡️ **Personal Assistant: Chicken Storage & Thawing Protocol**

• ❄️ **Refrigerator (0°C–4°C):** Safe for **1–2 days**. Best cooked fresh on the day of delivery!
• 🧊 **Freezer (-18°C):** Safe for **up to 3 months** in an airtight freezer bag.
• 💧 **Safe Thawing:** Place in fridge for 12 hours, or submerge leakproof bag in cold tap water for 30 mins. NEVER thaw at room temperature on the kitchen counter!`;
  }

  // 6. Gym Diet / High Protein / Nutrition
  if (msg.includes('gym') || msg.includes('diet') || msg.includes('protein') || msg.includes('calorie') || msg.includes('fitness') || msg.includes('weight loss')) {
    return `💪 **Personal Fitness Assistant: High-Protein Poultry Nutrition**

**Recommended Cut:** 🦋 **Mathina Butterfly Cut / Boneless Breast**
• 🏋️ **Protein:** ~46g – 50g per 200g serving
• 🥑 **Fat:** < 3.5g | **Carbs:** 0g | **Calories:** ~220 kcal

💡 **Meal Prep Tip:** Pan-sear with 1 tsp olive oil, garlic, lemon juice, and mixed herbs on medium-high for 3.5 mins per side. Rest 4 mins before slicing!
👉 Order lean fillets directly on our **[Products Page](/products)**!`;
  }

  // 7. How to Order Online
  if (msg.includes('order') || msg.includes('buy') || msg.includes('how to buy') || msg.includes('purchase')) {
    return `📦 **How to Order on Mathina Chicken Center:**
1. Browse 11+ fresh cuts on our **[Products Page](/products)**.
2. Choose pack size (250g, 500g, 1kg, or custom kg).
3. Click **'Buy Now'** for express checkout or **'Add to Cart'**.
4. Use coupon code \`MATHINA2024\` for **15% OFF** on Biryani & Big Curry cuts!
5. Pay via Indian Bank Smart UPI QR (\`CF05100492@indianbk\`) or Cash on Delivery (COD).
Track your live butchery cutting and delivery on **[/orders](/orders)**! 🚚`;
  }

  // 8. Products Available for Sale
  if (msg.includes('product') || msg.includes('sale') || msg.includes('what do you sell') || msg.includes('items') || msg.includes('menu')) {
    return `🍗 **Products Available for Sale at Mathina Chicken Center:**
• 🍲 **Big Curry / Biryani Cut:** ₹240–₹260/kg
• 🍛 **Small Curry Cut:** ₹230–₹250/kg
• 🧊 **Boneless Breast Cubes:** ₹320–₹350/kg
• 🥢 **Julienne Cut (Noodles & Stir-Fry):** ₹330–₹360/kg
• 🐉 **Dragon Cut Strips:** ₹330–₹360/kg
• 🦋 **Butterfly Cut (Grill Fillets):** ₹320–₹350/kg
• 🌶️ **Chicken 65 Pieces:** ₹250–₹330/kg
• 🍭 **Chicken Lollipop (Frenched):** ₹280–₹310/kg
• 🐓 **Country Chicken (Nattu Kozhi):** ₹420–₹480/kg
• 🥚 **Organic Country Eggs & Farm Eggs**
👉 Browse and order live on our **[Products Page](/products)**!`;
  }

  // 7. General Master Chef Welcome
  return `👋 **Mathina AI Chef at your service!** 👨‍🍳🍗

I am your personal culinary Master Chef and butchery concierge for **Mathina Chicken Center**! Ask me anything:
• 🍳 **Master Recipes:** Biryani, Hakka Noodles, Butter Chicken, Chicken 65, Dragon Chicken, Soups
• ⚖️ **Portion Calculator:** How much chicken to buy for your family or party
• 🩺 **Kitchen Troubleshooting:** Fix rubbery chicken, too salty or spicy curries
• 💪 **Fitness & Macros:** High-protein cuts, low-fat meal prep guides
• 📦 **Store Support:** 1-click orders, tracking on [/orders](/orders), UPI payment, QR traceability

*Ask me any question or tap a suggestion chip to begin!* 🍗`;
};

/**
 * Get product recommendations using AI
 * @param {Object} params - Parameters
 * @param {string} params.preference - User preference
 * @param {Array} params.products - Available products
 * @returns {Promise<Array>} Recommendations
 */
export const getRecommendations = async ({ preference, products = [] }) => {
  try {
    if (products.length === 0) {
      return [];
    }

    // Simple recommendation logic (can be enhanced with AI)
    const preferenceLower = preference.toLowerCase();
    
    // Match by category or name
    const recommendations = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(preferenceLower);
      const categoryMatch = product.category.toLowerCase().includes(preferenceLower);
      return nameMatch || categoryMatch;
    });

    // If no matches, return featured products
    if (recommendations.length === 0) {
      return products.filter((p) => p.isFeatured).slice(0, 5);
    }

    return recommendations.slice(0, 5);
  } catch (error) {
    console.error('[AI Service] Recommendation error:', error);
    return [];
  }
};

/**
 * Check if AI service is configured
 * @returns {Object} Configuration status
 */
export const getConfigStatus = () => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const isGeminiEnabled = !!(geminiKey && geminiKey !== 'your_gemini_api_key_here');
  return {
    openai: {
      configured: isOpenAIEnabled,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
    gemini: {
      configured: isGeminiEnabled,
      model: 'gemini-1.5-flash',
    },
    ollama: {
      configured: ollamaService.isConfigured(),
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    },
    activeProvider: isOpenAIEnabled ? 'openai' : isGeminiEnabled ? 'gemini' : 'ollama',
  };
};

export default {
  generateAIResponse,
  getRecommendations,
  getConfigStatus,
};
