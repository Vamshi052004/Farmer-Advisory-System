import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token");

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleLearnMore = () => {
    const section = document.getElementById("features");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">

        <h1 className="text-5xl md:text-6xl font-bold text-green-700 leading-tight mb-6">
          🌾 Smart Farmer Advisory Platform
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Empowering farmers with AI-driven crop recommendations,
          intelligent soil insights, and real-time weather monitoring.
        </p>

        <p className="text-gray-500 max-w-4xl mx-auto mb-10">
          Our platform combines agricultural science with artificial intelligence
          to provide accurate crop advisories, performance analytics,
          soil compatibility insights, and climate-aware recommendations.
          Designed to support sustainable farming and maximize productivity.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">

          {/* Get Started */}
          <button
            onClick={handleGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            Get Started
          </button>

          {/* Learn More */}
          <button
            onClick={handleLearnMore}
            className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold transition duration-300 transform hover:-translate-y-1"
          >
            Learn More
          </button>

        </div>

      </section>


      {/* ================= FEATURE CARDS ================= */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="grid md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="text-3xl mb-4">🌱</div>

            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Crop Intelligence
            </h4>

            <p className="text-green-600 font-semibold text-lg mb-3">
              AI Powered
            </p>

            <p className="text-gray-600">
              Smart advisory system that analyzes crop type,
              soil condition, and region to provide precise
              agricultural recommendations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="text-3xl mb-4">🌦</div>

            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Weather Monitoring
            </h4>

            <p className="text-green-600 font-semibold text-lg mb-3">
              Real-Time Updates
            </p>

            <p className="text-gray-600">
              Integrated live weather data to help farmers
              make climate-aware decisions and protect crops
              from environmental risks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="text-3xl mb-4">🧪</div>

            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Soil Analysis
            </h4>

            <p className="text-green-600 font-semibold text-lg mb-3">
              Scientific Insights
            </p>

            <p className="text-gray-600">
              Soil-type specific recommendations to improve
              yield quality and optimize resource utilization
              efficiently.
            </p>
          </div>

        </div>
      </section>


      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-green-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h3 className="text-3xl font-bold text-green-700 mb-10">
            Why Choose Our Platform?
          </h3>

          <div className="grid md:grid-cols-2 gap-6 text-left">

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              ✔ AI-based decision support system
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              ✔ Data-driven crop advisory insights
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              ✔ Secure farmer profile management
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              ✔ Analytics dashboard for farm monitoring
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 hover:shadow-md transition">
              ✔ Scalable and future-ready architecture
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
