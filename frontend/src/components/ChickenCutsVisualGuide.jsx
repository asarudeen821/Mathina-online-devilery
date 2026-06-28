import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const chickenCutVarieties = [
  {
    id: 1,
    name: 'Cube Cut',
    tamilName: 'க்யூப் கட்',
    description: 'Small 1-inch cube-sized pieces, perfect for quick cooking',
    image: '/images/products/chicken-breast-diced.png',
    bestFor: ['Stir Fry', 'Fried Rice', 'Noodles', 'Salads', 'Kebabs'],
    cookingTime: '8-10 mins',
    size: '1 inch cubes',
    boneless: true,
    popular: true,
  },
  {
    id: 2,
    name: 'Butterfly Cut',
    tamilName: 'பட்டர்ஃப்ளை கட்',
    description: 'Chicken breast split open horizontally like butterfly wings',
    image: '/images/products/chicken-breast-butterfly.png',
    bestFor: ['Grilling', 'Stuffing', 'Pan Fry', 'Restaurant Style'],
    cookingTime: '12-15 mins',
    size: 'Thin, wide pieces',
    boneless: true,
    premium: true,
  },
  {
    id: 3,
    name: 'Dragon Cut',
    tamilName: 'டிராகன் கட்',
    description: 'Long drumstick-like pieces with meat on both ends',
    image: '/images/products/chicken-drumsticks-raw.png',
    bestFor: ['Dragon Chicken', 'Chettinad', 'Gravy Dishes', 'Roasting'],
    cookingTime: '20-25 mins',
    size: '4-5 inch length',
    boneless: false,
    popular: true,
  },
  {
    id: 4,
    name: 'Chicken 65 Pieces',
    tamilName: 'சிக்கன் 65 துண்டுகள்',
    description: 'Small boneless bits marinated for signature Chicken 65 dish',
    image: '/images/products/chicken-breast-diced.png',
    bestFor: ['Chicken 65', 'Crispy Fry', 'Appetizers', 'Party Snacks'],
    cookingTime: '15-18 mins',
    size: 'Bite-sized pieces',
    boneless: true,
    popular: true,
  },
  {
    id: 5,
    name: 'Finger Cut',
    tamilName: 'ஃபிங்கர் கட்',
    description: 'Long thin strips resembling fingers, uniform size',
    image: '/images/products/chicken-breast-strips.png',
    bestFor: ['Chicken Fingers', 'Wraps', 'Stir Fry', 'Sandwiches'],
    cookingTime: '10-12 mins',
    size: '3 inch strips',
    boneless: true,
  },
  {
    id: 6,
    name: 'Chicken Lollipop',
    tamilName: 'சிக்கன் லாலிபாப்',
    description: 'Frenched wingette with meat pushed to one end, lollipop shape',
    image: '/images/products/chicken-lollipop-drumstick.png',
    bestFor: ['Appetizers', 'Kids Meals', 'Party Snacks', 'Frying'],
    cookingTime: '18-20 mins',
    size: 'Lollipop shape',
    boneless: false,
    premium: true,
  },
  {
    id: 7,
    name: 'Small Curry Cut',
    tamilName: 'சிறிய கறி கட்',
    description: 'Traditional 1.5-inch pieces with bone for authentic flavor',
    image: '/images/products/chicken-drumsticks-raw.png',
    bestFor: ['Curry', 'Gravy', 'Traditional Dishes', 'Daily Cooking'],
    cookingTime: '20-25 mins',
    size: '1.5 inch pieces',
    boneless: false,
    popular: true,
  },
  {
    id: 8,
    name: 'Big Curry Cut',
    tamilName: 'பெரிய கறி கட்',
    description: 'Large 2-3 inch pieces with bone, restaurant style',
    image: '/images/products/chicken-leg-marinated.png',
    bestFor: ['Biryani', 'Pulao', 'Restaurant Gravies', 'Special Dishes'],
    cookingTime: '25-30 mins',
    size: '2-3 inch pieces',
    boneless: false,
  },
  {
    id: 9,
    name: 'Boneless Curry Cut',
    tamilName: 'எலும்பில்லா கறி கட்',
    description: 'Curry cut pieces without bones, easy to eat',
    image: '/images/products/chicken-breast-boneless.png',
    bestFor: ['Quick Curry', 'Kids Meals', 'Stir Fry', 'Healthy Meals'],
    cookingTime: '15-18 mins',
    size: '1.5 inch pieces',
    boneless: true,
  },
  {
    id: 10,
    name: 'Whole Chicken',
    tamilName: 'முழு சிக்கன்',
    description: 'Complete chicken, cleaned and dressed, ready to cook',
    image: '/images/products/whole-chicken-seasoned.png',
    bestFor: ['Roasting', 'Traditional Curry', 'Family Meals', 'Festivals'],
    cookingTime: '45-60 mins',
    size: '1.5-2 kg whole',
    boneless: false,
    popular: true,
  },
  {
    id: 11,
    name: 'Breast Fillet',
    tamilName: 'பிரெஸ்ட் ஃபில்லெட்',
    description: 'Thin sliced breast meat, perfect for quick cooking',
    image: '/images/products/chicken-breast-boneless.png',
    bestFor: ['Grilling', 'Salads', 'Sandwiches', 'Healthy Meals'],
    cookingTime: '8-10 mins',
    size: 'Thin slices',
    boneless: true,
    premium: true,
  },
  {
    id: 12,
    name: 'Chicken Wings',
    tamilName: 'சிக்கன் இறக்கைகள்',
    description: 'Whole wings with drumette, flat and tip sections',
    image: '/images/products/chicken-drumsticks-raw.png',
    bestFor: ['BBQ', 'Frying', 'Grilling', 'Party Snacks'],
    cookingTime: '20-25 mins',
    size: 'Whole wings',
    boneless: false,
    popular: true,
  },
  {
    id: 13,
    name: 'Chicken Drumsticks',
    tamilName: 'டிரம்ஸ்டிக்ஸ்',
    description: 'Lower leg portion with tender meat, kids favorite',
    image: '/images/products/chicken-leg-marinated.png',
    bestFor: ['Frying', 'Grilling', 'Curry', 'Kids Meals'],
    cookingTime: '20-25 mins',
    size: '4-5 inch drumsticks',
    boneless: false,
    popular: true,
  },
  {
    id: 14,
    name: 'Chicken Thighs',
    tamilName: 'தொடை பகுதி',
    description: 'Upper leg portion, juicy and flavorful',
    image: '/images/products/chicken-leg-marinated.png',
    bestFor: ['Roasting', 'Curry', 'Grilling', 'Braising'],
    cookingTime: '25-30 mins',
    size: 'Medium thighs',
    boneless: false,
  },
  {
    id: 15,
    name: 'Chicken Tikkas',
    tamilName: 'சிக்கன் திக்கா',
    description: 'Boneless cubes marinated for tandoor/grill',
    image: '/images/products/chicken-breast-diced.png',
    bestFor: ['Tikka Masala', 'Grilling', 'Kebabs', 'Appetizers'],
    cookingTime: '15-18 mins',
    size: '1.5 inch cubes',
    boneless: true,
    premium: true,
  },
  {
    id: 16,
    name: 'Chicken Malai Tikka',
    tamilName: 'மலை திக்கா',
    description: 'Creamy marinated boneless pieces, mild and juicy',
    image: '/images/products/chicken-breast-boneless.png',
    bestFor: ['Appetizers', 'Grilling', 'Party Snacks', 'Kids'],
    cookingTime: '15-18 mins',
    size: '1.5 inch cubes',
    boneless: true,
    premium: true,
  },
  {
    id: 17,
    name: 'Chicken Shawarma Slices',
    tamilName: 'ஷவர்மா ஸ்லைஸஸ்',
    description: 'Thin sliced seasoned chicken for shawarma wraps',
    image: '/images/products/chicken-breast-strips.png',
    bestFor: ['Shawarma', 'Wraps', 'Rolls', 'Sandwiches'],
    cookingTime: '10-12 mins',
    size: 'Thin slices',
    boneless: true,
    popular: true,
  },
  {
    id: 18,
    name: 'Chicken Katsu',
    tamilName: 'காட்சு',
    description: 'Japanese-style breaded cutlets for frying',
    image: '/images/products/chicken-breast-butterfly.png',
    bestFor: ['Frying', 'Japanese Dishes', 'Cutlets', 'Kids Meals'],
    cookingTime: '12-15 mins',
    size: 'Flat cutlets',
    boneless: true,
    premium: true,
  },
];

const ChickenCutsVisualGuide = ({ onClose }) => {
  const [selectedCut, setSelectedCut] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                🍗 Chicken Cuts Visual Guide
              </h2>
              <p className="text-gray-300 text-lg">
                Explore different chicken cutting varieties and choose your perfect cut
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chickenCutVarieties.map((cut) => (
            <div
              key={cut.id}
              onClick={() => setSelectedCut(cut)}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cut.image}
                  alt={cut.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {cut.popular && (
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Popular
                    </span>
                  )}
                  {cut.premium && (
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      👑 Premium
                    </span>
                  )}
                  {cut.boneless && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      🌿 Boneless
                    </span>
                  )}
                </div>

                {/* Cooking Time */}
                <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg shadow-lg">
                  <span className="text-xs font-semibold text-gray-700">⏱️ {cut.cookingTime}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cut.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{cut.tamilName}</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{cut.description}</p>
                
                {/* Size Info */}
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  {cut.size}
                </div>

                {/* Best For Tags */}
                <div className="flex flex-wrap gap-1">
                  {cut.bestFor.slice(0, 2).map((use, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {use}
                    </span>
                  ))}
                  {cut.bestFor.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{cut.bestFor.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="max-w-7xl mx-auto mt-12 mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">📞 Order Now - Fresh Cuts Daily</h3>
                <p className="text-green-100 text-sm">
                  Call us to place your order or for bulk inquiries. We provide fresh cuts every morning!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="tel:+917708032726"
                  className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg flex items-center gap-3"
                >
                  📱 +91 77080 32726
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedCut && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCut(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-64 md:h-full">
                  <img
                    src={selectedCut.image}
                    alt={selectedCut.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedCut(null)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 md:hidden"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Side */}
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedCut.name}
                      </h3>
                      <p className="text-gray-500">{selectedCut.tamilName}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCut(null)}
                      className="hidden md:block bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCut.popular && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ Most Popular
                      </span>
                    )}
                    {selectedCut.premium && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        👑 Premium Quality
                      </span>
                    )}
                    {selectedCut.boneless && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        🌿 100% Boneless
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-6">{selectedCut.description}</p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">⏱️ Cooking Time</p>
                      <p className="font-semibold text-gray-900">{selectedCut.cookingTime}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">📏 Size</p>
                      <p className="font-semibold text-gray-900">{selectedCut.size}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">🦴 Bone Content</p>
                      <p className="font-semibold text-gray-900">
                        {selectedCut.boneless ? 'Boneless' : 'With Bone'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">🍽️ Servings</p>
                      <p className="font-semibold text-gray-900">2-3 people</p>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCut.bestFor.map((use, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={`/products?category=chicken-cuts&subCategory=${selectedCut.name.toLowerCase().replace(' ', '-')}`}
                    className="block w-full bg-primary-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors mb-4"
                  >
                    Order {selectedCut.name} Now
                  </a>

                  {/* Contact Info */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">📞 Call to Order</p>
                    <a href="tel:+917708032726" className="text-2xl font-bold text-green-700 hover:text-green-800">
                      +91 77080 32726
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Shop Owner - Fresh Cuts Daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChickenCutsVisualGuide;
