const ChickenCutsBanner = ({ onViewGuide }) => {
  const cuts = [
    { name: 'Cube Cut', emoji: '🎲' },
    { name: 'Butterfly', emoji: '🦋' },
    { name: 'Dragon Cut', emoji: '🐉' },
    { name: 'Chicken 65', emoji: '🌶️' },
    { name: 'Julienne', emoji: '🥢' },
    { name: 'Lollipop', emoji: '🍭' },
    { name: 'Tikka', emoji: '🍢' },
    { name: 'Shawarma', emoji: '🌯' },
  ];

  return (
    <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              🔪 18 Premium Chicken Cuts Available
            </h2>
            <p className="text-primary-100 text-sm md:text-base">
              Fresh cuts daily - From traditional curry cuts to premium restaurant-style varieties
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                📞 Order Now: <strong>+91 77080 32726</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {cuts.map((cut, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default"
              >
                <span className="text-lg">{cut.emoji}</span>
                <span className="text-xs font-semibold whitespace-nowrap">{cut.name}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onViewGuide}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold text-sm hover:bg-primary-50 transition-colors whitespace-nowrap shadow-lg"
          >
            📖 View All 18 Cuts
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChickenCutsBanner;
