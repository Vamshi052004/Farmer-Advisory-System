function FeaturesSection() {
  const features = [
    {
      title: "Weather Forecast",
      desc: "Get accurate weather predictions for better crop planning.",
      icon: "☁️",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Crop Advisory",
      desc: "Expert advice on crop selection, planting and care.",
      icon: "🌱",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Market Prices",
      desc: "Stay updated with real-time agricultural market prices.",
      icon: "📈",
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Expert Support",
      desc: "Connect with agricultural experts for personalized help.",
      icon: "📞",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-8">

        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300"
          >
            <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-2xl mb-5 ${feature.color}`}>
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {feature.title}
            </h3>

            <p className="text-gray-600 mb-4">
              {feature.desc}
            </p>

            <button className="text-green-600 font-medium hover:underline">
              Learn More →
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default FeaturesSection;
