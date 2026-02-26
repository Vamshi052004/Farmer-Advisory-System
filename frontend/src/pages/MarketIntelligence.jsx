import { useEffect, useState } from "react";
import { getAvailableCrops } from "../services/advisoryService";
import { getMarketData } from "../services/marketService";

function MarketIntelligence() {
  const [cropList, setCropList] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  useEffect(() => {
    async function loadCrops() {
      const crops = await getAvailableCrops();
      setCropList(crops || []);
    }
    loadCrops();
  }, []);

  useEffect(() => {
    if (!selectedCrop) {
      setMarketData(null);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const data = await getMarketData(selectedCrop);
        setMarketData(data);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <h2 className="text-3xl font-bold text-green-700 mb-8">
        💰 Market Intelligence
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8">
        <label className="block font-medium mb-2">Select Crop</label>
        <select
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          <option value="">Select Crop</option>
          {cropList.map((crop, i) => (
            <option key={i} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Fetching market data...</p>}

      {marketData && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-semibold text-green-700 mb-6">
            {marketData.crop}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-xl">
              Market Price: ₹{marketData.marketPrice}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              Farmer Selling: ₹{marketData.farmerSellingPrice}
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl">
              Production Cost: ₹{marketData.costOfProduction}
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              Profit/Loss: ₹{marketData.profit > 0
                ? marketData.profit
                : marketData.loss}
            </div>

            {role === "admin" && (
              <div className="bg-gray-100 p-4 rounded-xl">
                Consumer Price: ₹{marketData.consumerPrice}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketIntelligence;
