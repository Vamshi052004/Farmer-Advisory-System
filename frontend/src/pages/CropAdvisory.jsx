import { useEffect, useState } from "react";
import {
  getCropAdvisory,
  getAvailableCrops,
  getAvailableSoils,
} from "../services/advisoryService";

function CropAdvisory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedSoil, setSelectedSoil] = useState("");
  const [cropList, setCropList] = useState([]);
  const [soilList, setSoilList] = useState([]);
  const [error, setError] = useState("");

  /* ================= LOAD OPTIONS ================= */
  useEffect(() => {
    async function loadOptions() {
      try {
        const crops = await getAvailableCrops();
        const soils = await getAvailableSoils();
        setCropList(crops || []);
        setSoilList(soils || []);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    }
    loadOptions();
  }, []);

  /* ================= FETCH ADVISORY ================= */
  useEffect(() => {
    if (!selectedCrop) {
      setData(null);
      return;
    }

    async function fetchAdvisory() {
      try {
        setLoading(true);
        setError("");
        const result = await getCropAdvisory(selectedCrop, selectedSoil);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to generate advisory. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAdvisory();
  }, [selectedCrop, selectedSoil]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6 md:p-10">
      <h2 className="text-3xl font-bold text-green-700 mb-8">
        🌾 Crop Advisory
      </h2>

      {/* SELECT SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-md grid md:grid-cols-2 gap-6 mb-8">
        <select
          className="border rounded-xl px-4 py-3"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          <option value="">Select Crop</option>
          {cropList.map((crop, i) => (
            <option key={i} value={crop}>{crop}</option>
          ))}
        </select>

        <select
          className="border rounded-xl px-4 py-3"
          value={selectedSoil}
          onChange={(e) => setSelectedSoil(e.target.value)}
        >
          <option value="">Select Soil</option>
          {soilList.map((soil, i) => (
            <option key={i} value={soil}>{soil}</option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-green-600 font-semibold mb-4">
          Generating AI advisory...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-500 font-medium mb-4">
          {error}
        </div>
      )}

      {/* RESULT */}
      {data && (
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Advisory Recommendations
          </h3>

          <ul className="space-y-3 text-gray-700">
            {Array.isArray(data.advisory)
              ? data.advisory.map((point, i) => (
                  <li key={i}>✔ {point}</li>
                ))
              : <li>{data.advisory}</li>}
          </ul>

          <div className="mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-xl inline-block">
            Confidence: {data.confidence ?? 0}%
          </div>
        </div>
      )}
    </div>
  );
}

export default CropAdvisory;