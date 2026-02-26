function LandingNavbar() {
  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="text-green-600 text-2xl">🌿</div>
          <div>
            <h1 className="text-xl font-bold text-green-700">
              AgriAdvise
            </h1>
            <p className="text-xs text-gray-500">
              Farmer Advisory System
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-green-600 transition">Home</a>
          <a href="#" className="hover:text-green-600 transition">Weather</a>
          <a href="#" className="hover:text-green-600 transition">Crop Advisory</a>
          <a href="#" className="hover:text-green-600 transition">Market Prices</a>
          <a href="#" className="hover:text-green-600 transition">Contact</a>
        </div>

        {/* Button */}
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingNavbar;
