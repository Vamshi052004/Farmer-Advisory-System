import { useEffect, useState } from "react";
import {
  getCropAdvisory,
  getAvailableCrops,
  getAvailableSoils
} from "../services/advisoryService";

function CropAdvisory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedSoil, setSelectedSoil] = useState("");
  const [cropList, setCropList] = useState([]);
  const [soilList, setSoilList] = useState([]);

  useEffect(() => {
    async function loadData() {
      const crops = await getAvailableCrops();
      const soils = await getAvailableSoils();
      setCropList(crops || []);
      setSoilList(soils || []);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedCrop) {
      setData(null);
      return;
    }

    async function fetchAdvisory() {
      setLoading(true);
      try {
        const result = await getCropAdvisory(selectedCrop, selectedSoil);
        setData(result);
      } finally {
        setLoading(false);
      }
    }

    fetchAdvisory();
  }, [selectedCrop, selectedSoil]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <h2 className="text-3xl font-bold text-green-700 mb-8">
        🌾 Crop Advisory
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid md:grid-cols-2 gap-6 mb-8">
        <div>
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

        <div>
          <label className="block font-medium mb-2">Select Soil</label>
          <select
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
            value={selectedSoil}
            onChange={(e) => setSelectedSoil(e.target.value)}
          >
            <option value="">Select Soil</option>
            {soilList.map((soil, i) => (
              <option key={i} value={soil}>
                {soil}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-green-600 font-semibold">
          Generating AI advisory...
        </p>
      )}

      {data && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Advisory Recommendations
          </h3>

          <ul className="space-y-3 text-gray-600">
            {Array.isArray(data.advisory)
              ? data.advisory.map((point, i) => (
                  <li key={i}>✔ {point}</li>
                ))
              : <li>{data.advisory}</li>}
          </ul>

          <div className="mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-xl inline-block">
            Confidence Level: {data.confidence}%
          </div>
        </div>
      )}
    </div>
  );
}

export default CropAdvisory;
