function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">

      <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-6">
        Welcome to AgriAdvise
      </h1>

      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
        Your trusted partner in modern farming. Get expert advice, weather updates,
        market insights, and more to maximize your agricultural success.
      </p>

      <div className="flex justify-center gap-6">
        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-md">
          Explore Features
        </button>

        <button className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold transition">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
