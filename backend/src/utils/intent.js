/**
 * Intent Detection Utility
 * Detects user intent from chat messages for hybrid AI system
 */

/**
 * Intent types
 */
export const INTENT_TYPES = {
  RECIPE: 'recipe',
  CART: 'cart',
  TRACKING: 'tracking',
  PRODUCT: 'product',
  GREETING: 'greeting',
  GENERAL: 'general',
};

/**
 * Detect if user wants recipe recommendations
 * @param {string} message - User message
 * @returns {boolean} True if recipe intent
 */
export const isRecipeIntent = (message) => {
  if (!message) return false;
  const text = message.toLowerCase();

  // If message is a troubleshooting or emergency question, it is NOT a basic recipe intent
  if (
    text.includes('rubbery') ||
    text.includes('salty') ||
    text.includes('too hot') ||
    text.includes('too spicy') ||
    text.includes('tough') ||
    text.includes('dry') ||
    text.includes('substitute') ||
    text.includes('how much chicken') ||
    text.includes('how many kg') ||
    text.includes('guest') ||
    text.includes('gym')
  ) {
    return false;
  }

  const recipeKeywords = [
    'recipe', 'ரெசிபி', 'vidhai', 'cook', 'சமைக்க', 'make', 'prepare',
    'curry', 'குழம்பு', 'fry', 'வறுவல்', 'grill', 'கிரில்',
    'biryani', 'பிரியாணி', 'tandoori', 'தந்தூரி', 'kebab', 'கபாப்',
    'how to make', 'way to make', 'எப்படி செய்வது', 'எப்படி சமைக்க',
  ];

  return recipeKeywords.some((kw) => text.includes(kw));
};

/**
 * Detect if user wants to add to cart / buy
 * @param {string} message - User message
 * @returns {boolean} True if cart intent
 */
export const isCartIntent = (message) => {
  if (!message) return false;
  const text = message.toLowerCase();

  const cartKeywords = [
    'add to cart', 'add cart', 'put in cart',
    'buy now', 'purchase now',
    'சேர்', 'கார்ட்',
    'want to buy', 'add 1kg', 'add 500g',
  ];

  return cartKeywords.some((kw) => text.includes(kw));
};

/**
 * Detect if user wants to track order
 * @param {string} message - User message
 * @returns {boolean} True if tracking intent
 */
export const isTrackingIntent = (message) => {
  if (!message) return false;
  const text = message.toLowerCase();

  const trackingKeywords = [
    'track order', 'order tracking', 'order status', 'track my',
    'டிராக்', 'ஆர்டர் நிலை',
    'my order', 'order #', 'order number',
    'delivery status', 'where is my order', 'where is order',
  ];

  return trackingKeywords.some((kw) => text.includes(kw));
};

/**
 * Detect if user is asking about products
 * @param {string} message - User message
 * @returns {boolean} True if product intent
 */
export const isProductIntent = (message) => {
  if (!message) return false;
  const text = message.toLowerCase();

  const productKeywords = [
    'price', 'cost', 'rate', 'விலை', 'கட்டணம்',
    'products for sale', 'what products', 'what do you sell', 'items for sale',
  ];

  return productKeywords.some((kw) => text.includes(kw));
};

/**
 * Detect if user is greeting
 * @param {string} message - User message
 * @returns {boolean} True if greeting
 */
export const isGreeting = (message) => {
  if (!message) return false;
  const text = message.toLowerCase().trim();

  // If message has more than 4 words, it's a substantive query, not a greeting
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 4) return false;

  const greetingRegex = /\b(hi|hello|hey|vanakkam|namaste|start|begin)\b|good (morning|evening|afternoon)|வணக்கம்|நமஸ்தே/;
  return greetingRegex.test(text);
};

/**
 * Main intent detection function
 * @param {string} message - User message
 * @returns {Object} Intent detection result
 */
export const detectIntent = (message) => {
  if (!message) {
    return {
      intent: INTENT_TYPES.GENERAL,
      confidence: 'low',
      data: null,
    };
  }

  // Check for specific intents in priority order
  if (isGreeting(message)) {
    return {
      intent: INTENT_TYPES.GREETING,
      confidence: 'high',
      data: null,
    };
  }

  if (isTrackingIntent(message)) {
    return {
      intent: INTENT_TYPES.TRACKING,
      confidence: 'high',
      data: extractOrderId(message),
    };
  }

  if (isCartIntent(message)) {
    return {
      intent: INTENT_TYPES.CART,
      confidence: 'medium',
      data: extractProductFromMessage(message),
    };
  }

  if (isRecipeIntent(message)) {
    return {
      intent: INTENT_TYPES.RECIPE,
      confidence: 'medium',
      data: extractRecipeType(message),
    };
  }

  if (isProductIntent(message)) {
    return {
      intent: INTENT_TYPES.PRODUCT,
      confidence: 'medium',
      data: extractProductFromMessage(message),
    };
  }

  // Default to general
  return {
    intent: INTENT_TYPES.GENERAL,
    confidence: 'low',
    data: null,
  };
};

/**
 * Extract order ID from message
 * @param {string} message - User message
 * @returns {string|null} Order ID or null
 */
export const extractOrderId = (message) => {
  if (!message) return null;
  // Look for patterns like #123, order 123, 12345
  const match = message.match(/#?(\d{4,})/);
  return match ? match[1] : null;
};

/**
 * Extract product name from message
 * @param {string} message - User message
 * @returns {string|null} Product name or null
 */
export const extractProductFromMessage = (message) => {
  if (!message) return null;
  const text = message.toLowerCase();

  // Common product patterns
  const products = [
    'chicken breast', 'chicken legs', 'chicken wings', 'chicken thighs',
    'curry cut', 'fry cut', 'whole chicken', 'boneless chicken',
    'eggs', 'boiled eggs', 'organic eggs',
    'chicken 65', 'biryani', 'tandoori',
    'சிக்கன்', 'முட்டை', 'கறி வெட்டு',
  ];

  for (const product of products) {
    if (text.includes(product)) {
      return product;
    }
  }

  // Try to extract after common verbs
  const patterns = [
    /(?:add|buy|want|need|வேண்டும்)\s+(?:to\s+)?(?:cart\s+)?(.{3,30})/i,
    /(?:want|need)\s+(.{3,30})/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
};

/**
 * Extract recipe type from message
 * @param {string} message - User message
 * @returns {string|null} Recipe type or null
 */
export const extractRecipeType = (message) => {
  if (!message) return null;
  const text = message.toLowerCase();

  const recipeTypes = [
    'curry', 'fry', 'grill', 'biryani', 'tandoori',
    'kebab', 'soup', '65', 'roast',
    'குழம்பு', 'வறுவல்', 'பிரியாணி', 'தந்தூரி',
  ];

  for (const type of recipeTypes) {
    if (text.includes(type)) {
      return type;
    }
  }

  return null;
};

/**
 * Detect language from message
 * @param {string} text - User message
 * @returns {'tamil' | 'english'} Detected language
 */
export const detectLanguage = (text) => {
  if (!text) return 'english';

  // Tamil Unicode range
  const tamilPattern = /[\u0B80-\u0BFF]/;

  return tamilPattern.test(text) ? 'tamil' : 'english';
};

export default {
  INTENT_TYPES,
  isRecipeIntent,
  isCartIntent,
  isTrackingIntent,
  isProductIntent,
  isGreeting,
  detectIntent,
  extractOrderId,
  extractProductFromMessage,
  extractRecipeType,
  detectLanguage,
};
