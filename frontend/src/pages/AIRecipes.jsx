import { useState } from 'react';
import { FiSend, FiLoader, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import { GiCook } from 'react-icons/gi';
import { aiAPI } from '../utils/api';
import toast from 'react-hot-toast';

const QUICK_RECIPES = [
  { label: '🌶️ Chicken 65', query: 'chicken 65' },
  { label: '🍛 Biryani', query: 'chicken biryani' },
  { label: '🌯 Shawarma', query: 'chicken shawarma' },
  { label: '🐉 Dragon Chicken', query: 'dragon chicken' },
  { label: '🍢 Chicken Tikka', query: 'chicken tikka' },
  { label: '🍭 Lollipop', query: 'chicken lollipop' },
  { label: '🔥 Grilled', query: 'grilled chicken' },
  { label: '🍲 Curry', query: 'chicken curry' },
  { label: '🍗 Wings', query: 'chicken wings' },
  { label: '🥘 Kebab', query: 'chicken kebab' },
];

// Render formatted recipe text
const RecipeText = ({ text }) => {
  if (!text) return null;
  return (
    <div className="space-y-1">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-primary-700 mt-4 mb-2 border-b border-primary-100 pb-1">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-gray-800 mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.match(/^\d+\.\s/)) return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="text-primary-600 font-bold flex-shrink-0">{line.match(/^\d+/)[0]}.</span><span className="text-gray-700 text-sm">{line.replace(/^\d+\.\s/, '')}</span></div>;
        if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="text-primary-500 flex-shrink-0">•</span><span className="text-gray-700 text-sm">{line.replace(/^[-•]\s/, '')}</span></div>;
        if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="font-semibold text-gray-800 text-sm">{line.replace(/\*/g, '')}</p>;
        return <p key={i} className="text-gray-700 text-sm leading-relaxed">{line}</p>;
      })}
    </div>
  );
};

// Recipe card from structured data
const RecipeCard = ({ recipe }) => (
  <div className="space-y-5">
    <div className="flex flex-wrap gap-4 bg-primary-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiClock className="text-primary-600" />
        <span>Prep: <strong>{recipe.prepTime}</strong></span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiClock className="text-primary-600" />
        <span>Cook: <strong>{recipe.cookingTime}</strong></span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiUsers className="text-primary-600" />
        <span>Serves: <strong>{recipe.servings}</strong></span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FiStar className="text-yellow-500" />
        <span>Difficulty: <strong className="capitalize">{recipe.difficulty}</strong></span>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">🧂 Ingredients</h3>
      <ul className="space-y-1.5">
        {recipe.ingredients.map((ing, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-primary-500 mt-0.5 flex-shrink-0">•</span>{ing}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">👨‍🍳 Instructions</h3>
      <ol className="space-y-2">
        {recipe.instructions.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>

    {recipe.tips && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-yellow-800 mb-1">💡 Chef's Tip</p>
        <p className="text-sm text-yellow-700">{recipe.tips}</p>
      </div>
    )}
  </div>
);

const AIRecipes = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { type: 'text'|'recipe'|'multiple', data }
  const [dishType, setDishType] = useState('');
  const [preferences, setPreferences] = useState('');

  const generate = async (query) => {
    const q = query || `${dishType} ${preferences}`.trim();
    if (!q) { toast.error('Please enter what you want to cook'); return; }

    setLoading(true);
    setResult(null);

    try {
      const { data } = await aiAPI.generateRecipe({ query: q, language: 'english' });
      const d = data.data;

      if (d?.recipes?.length > 0) {
        // Structured recipe(s) from backend
        if (d.recipes.length === 1) {
          setResult({ type: 'recipe', recipe: d.recipes[0], title: d.recipes[0].name });
        } else {
          setResult({ type: 'multiple', recipes: d.recipes, reply: d.reply });
        }
      } else if (d?.reply) {
        // Text response (from SLM or fallback)
        setResult({ type: 'text', text: d.reply });
      } else {
        toast.error('No recipe found. Try a different dish name.');
      }
      toast.success('Recipe ready! 🍗');
    } catch (err) {
      // Full offline fallback using SLM engine
      try {
        const { slmRespond } = await import('../utils/slmEngine');
        const reply = slmRespond(q);
        setResult({ type: 'text', text: reply });
        toast.success('Recipe ready! 🍗');
      } catch {
        toast.error('Failed to generate recipe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPick = (query) => {
    setDishType(query);
    generate(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <GiCook className="w-14 h-14 mx-auto text-primary-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">AI Recipe Generator</h1>
          <p className="text-gray-500 mt-2 text-sm">Ask for any chicken recipe — Chicken 65, Biryani, Shawarma & more</p>
        </div>

        {/* Quick Pick Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Pick</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_RECIPES.map((r) => (
              <button
                key={r.query}
                onClick={() => handleQuickPick(r.query)}
                disabled={loading}
                className="text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 hover:border-primary-400 px-3 py-1.5 rounded-full font-medium transition-all disabled:opacity-50"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <form onSubmit={(e) => { e.preventDefault(); generate(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                What would you like to cook?
              </label>
              <input
                type="text"
                value={dishType}
                onChange={(e) => setDishType(e.target.value)}
                placeholder="e.g., Chicken 65, Dragon Chicken, Shawarma, Biryani..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Preferences <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g., Spicy, Low fat, Quick recipe..."
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !dishType.trim()}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <><FiLoader className="animate-spin" /> Generating...</> : <><FiSend /> Generate Recipe</>}
            </button>
          </form>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded w-full" />)}
            </div>
          </div>
        )}

        {/* Recipe Result */}
        {!loading && result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            {/* Title */}
            {result.type === 'recipe' && (
              <>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-xl">🍗</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{result.recipe.name}</h2>
                    {result.recipe.nameTamil && <p className="text-sm text-gray-400">{result.recipe.nameTamil}</p>}
                  </div>
                </div>
                <RecipeCard recipe={result.recipe} />
              </>
            )}

            {result.type === 'multiple' && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">🍗 Matching Recipes</h2>
                <RecipeText text={result.reply} />
                <div className="mt-4 grid gap-3">
                  {result.recipes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setResult({ type: 'recipe', recipe: r, title: r.name })}
                      className="flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-xl border border-primary-200 transition-all text-left"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.cookingTime} · {r.difficulty}</p>
                      </div>
                      <span className="text-primary-600 text-sm font-medium">View →</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {result.type === 'text' && (
              <>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <span className="text-2xl">🍗</span>
                  <h2 className="text-lg font-bold text-gray-900">Recipe</h2>
                </div>
                <RecipeText text={result.text} />
              </>
            )}

            {/* Try another */}
            <button
              onClick={() => { setResult(null); setDishType(''); }}
              className="mt-6 w-full text-sm text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 py-2 rounded-xl transition-colors"
            >
              🔄 Try Another Recipe
            </button>
          </div>
        )}

        {/* Cooking Tips */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">💡 Quick Cooking Tips</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: '🍗', title: 'Marination', tip: 'Marinate at least 2 hours for better flavor' },
              { icon: '🌡️', title: 'Temperature', tip: 'Cook to 74°C internal temp for safety' },
              { icon: '🧂', title: 'Seasoning', tip: 'Use fresh spices for authentic taste' },
              { icon: '⏰', title: 'Resting', tip: 'Rest 5 mins after cooking to retain juices' },
            ].map((t) => (
              <div key={t.title} className="bg-white bg-opacity-15 rounded-xl p-3">
                <p className="font-semibold text-sm mb-1">{t.icon} {t.title}</p>
                <p className="text-xs text-white text-opacity-90">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecipes;
