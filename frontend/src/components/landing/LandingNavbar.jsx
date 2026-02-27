import { useState } from "react";
import { Link } from "react-router-dom";

function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-green-600 text-2xl">🌿</div>
          <div>
            <h1 className="text-xl font-bold text-green-700">
              AgriAdvise
            </h1>
            <p className="text-xs text-gray-500">
              Farmer Advisory System
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          <Link to="/weather" className="hover:text-green-600 transition">Weather</Link>
          <Link to="/advisory" className="hover:text-green-600 transition">Crop Advisory</Link>
          <Link to="/market" className="hover:text-green-600 transition">Market Prices</Link>
          <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
        </div>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-green-700"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-4">
          <Link to="/" className="block hover:text-green-600">Home</Link>
          <Link to="/weather" className="block hover:text-green-600">Weather</Link>
          <Link to="/advisory" className="block hover:text-green-600">Crop Advisory</Link>
          <Link to="/market" className="block hover:text-green-600">Market Prices</Link>
          <Link to="/contact" className="block hover:text-green-600">Contact</Link>
          <Link
            to="/register"
            className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

export default LandingNavbar;