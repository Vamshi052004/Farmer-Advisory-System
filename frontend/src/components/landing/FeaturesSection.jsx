import { useNavigate } from "react-router-dom";

function FeaturesSection() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Weather Forecast",
      desc: "Get accurate weather predictions for better crop planning and irrigation management.",
      icon: "☁️",
      color: "bg-blue-100 text-blue-600",
      route: "/weather"
    },
    {
      title: "Crop Advisory",
      desc: "Expert AI-driven advice on crop selection, planting schedules, and soil management.",
      icon: "🌱",
      color: "bg-green-100 text-green-600",
      route: "/advisory"
    },
    {
      title: "Market Prices",
      desc: "Stay updated with real-time agricultural market prices to maximize profit.",
      icon: "📈",
      color: "bg-orange-100 text-orange-600",
      route: "/market"
    },
    {
      title: "Expert Support",
      desc: "Connect with agricultural experts for personalized guidance and farming solutions.",
      icon: "📞",
      color: "bg-purple-100 text-purple-600",
      route: "/contact"
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-green-700 mb-4">
            Powerful Features for Smart Farming
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to make data-driven agricultural decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.route)}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 
                         hover:shadow-xl hover:-translate-y-2 
                         transition duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-2xl mb-5 ${feature.color}`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-4 text-sm">
                {feature.desc}
              </p>

              <span className="text-green-600 font-medium text-sm">
                Learn More →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;