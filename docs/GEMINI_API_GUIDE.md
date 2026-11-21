# 🤖 Gemini API Integration Guide

## API Key Configuration

Your Gemini API key has been configured:
```
GEMINI_API_KEY=AIzaSyBXAvLwsWZ7m8Mt-KYEjuanx62WsF6X6ik
```

## Features Enabled

### 1. AI Recipe Generation ✅
**Endpoint:** `POST /api/ai/recipe`

Generates personalized recipes based on user's order history.

**Request:**
```json
{
  "dishType": "Biryani",
  "preferences": "Spicy, Low-fat"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipe": "# Chicken Biryani\n\n## Description...\n...",
    "basedOn": "Fresh Chicken Breast, Whole Chicken, Chicken Wings"
  }
}
```

### 2. Nutrition Information ✅
**Endpoint:** `POST /api/utils/nutrition`

Get detailed nutritional information for any dish.

**Request:**
```json
{
  "dishName": "Chicken Biryani"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "calories": "450 kcal",
    "protein": "28g",
    "carbohydrates": "52g",
    "fat": "14g",
    "fiber": "3g",
    "vitamins": "B6, B12, Niacin",
    "minerals": "Iron, Zinc, Selenium"
  }
}
```

### 3. Shopping List Generator ✅
**Endpoint:** `POST /api/utils/shopping-list`

Extract ingredients from a recipe to create a shopping list.

**Request:**
```json
{
  "recipe": "# Chicken Curry\n\n## Ingredients\n- 500g Chicken\n- 2 Onions\n..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    "500g Chicken",
    "2 Onions",
    "3 Tomatoes",
    "2 tbsp Ginger-Garlic paste",
    "1 tsp Turmeric",
    "..."
  ]
}
```

### 4. API Connection Test ✅
**Endpoint:** `GET /api/utils/test-gemini` (Admin only)

Test if Gemini API is properly configured.

**Response:**
```json
{
  "success": true,
  "message": "Gemini API connection successful",
  "data": {
    "apiKeyConfigured": true,
    "apiKeyStart": "AIzaSyBXAv..."
  }
}
```

## Testing the Integration

### 1. Test API Connection
```bash
curl -X GET http://localhost:5000/api/utils/test-gemini \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2. Generate Recipe
```bash
curl -X POST http://localhost:5000/api/ai/recipe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "dishType": "Curry",
    "preferences": "Spicy"
  }'
```

### 3. Get Nutrition Info
```bash
curl -X POST http://localhost:5000/api/utils/nutrition \
  -H "Content-Type: application/json" \
  -d '{
    "dishName": "Chicken Tikka Masala"
  }'
```

### 4. Generate Shopping List
```bash
curl -X POST http://localhost:5000/api/utils/shopping-list \
  -H "Content-Type: application/json" \
  -d '{
    "recipe": "Full recipe text here..."
  }'
```

## Frontend Usage

### React Component Example

```jsx
import { aiAPI } from './utils/api';

function RecipeGenerator() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await aiAPI.generateRecipe({
        dishType: 'Biryani',
        preferences: 'Spicy'
      });
      setRecipe(data.data.recipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Recipe'}
      </button>
      {recipe && <div className="recipe">{recipe}</div>}
    </div>
  );
}
```

## Gemini API Service

The `geminiService.js` provides these methods:

```javascript
import geminiService from './utils/geminiService.js';

// Generate recipe
const recipe = await geminiService.generateRecipe(
  'Chicken, Eggs, Rice',
  'Biryani',
  'Spicy'
);

// Get nutrition info
const nutrition = await geminiService.getNutritionInfo('Chicken Biryani');

// Generate shopping list
const shoppingList = await geminiService.generateShoppingList(recipeText);

// Test connection
const isConnected = await geminiService.testConnection();
```

## Rate Limits & Quotas

Gemini API Free Tier:
- **Requests per minute:** 60
- **Requests per day:** 1,000
- **Tokens per request:** 8,192 input, 8,192 output

For higher limits, upgrade to Gemini API paid tier.

## Error Handling

The service handles errors gracefully:

1. **API Key Not Configured:** Returns fallback recipe
2. **Rate Limit Exceeded:** Shows error message
3. **Invalid Response:** Uses fallback data
4. **Network Errors:** Cached responses when available

## Security Notes

✅ API key stored in `.env` (never commit to git)  
✅ HTTPS required for production  
✅ Rate limiting on endpoints  
✅ Input validation on all requests  
❌ Never expose API key in frontend code  

## Troubleshooting

### Issue: "Gemini API key not configured"
**Solution:** Check `.env` file has correct key:
```
GEMINI_API_KEY=AIzaSyBXAvLwsWZ7m8Mt-KYEjuanx62WsF6X6ik
```

### Issue: "Rate limit exceeded"
**Solution:** Wait 1 minute or upgrade API tier

### Issue: "Invalid response"
**Solution:** Check Gemini API status at https://status.googlecloud.com

### Issue: Recipes not generating
**Solution:** 
1. Test connection: `GET /api/utils/test-gemini`
2. Check server logs for errors
3. Verify API key is valid

## Future Enhancements

- [ ] Multi-language recipe support (Tamil, Hindi)
- [ ] Image-based recipe generation
- [ ] Meal planning suggestions
- [ ] Calorie-based recipe filtering
- [ ] Video tutorial links
- [ ] Ingredient substitution suggestions

## Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Gemini API Key Setup](https://makersuite.google.com/app/apikey)

---

**Integration Complete! 🎉**

Your Gemini API is now fully integrated for AI-powered recipe generation, nutrition information, and shopping list creation.
