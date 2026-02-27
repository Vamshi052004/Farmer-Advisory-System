import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import api from "../services/api";              // ✅ FIXED
import { getWeather } from "../services/weatherService";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* ================= FIX LEAFLET ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

/* ================= MAP CLICK HANDLER ================= */
function MapClickHandler({ setPosition, fetchWeather, fetchLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      fetchWeather(lat, lng);
      fetchLocation(lat, lng);
    }
  });
  return null;
}

function Weather() {
  const [position, setPosition] = useState(null);
  const [weatherData, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);

  /* ================= FETCH WEATHER ================= */
  const fetchWeather = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await getWeather(lat, lng);
      setWeather(data);
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REVERSE GEOCODE ================= */
const fetchLocation = async (lat, lng) => {
  try {
    const res = await api.get(
      `/weather/reverse-geocode?lat=${lat}&lon=${lng}`
    );

    const data = res.data;

    if (data?.address) {

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        data.address.state_district ||
        "";

      const state = data.address.state || "";
      const country = data.address.country || "";

      const ocean =
        data.address.ocean ||
        data.address.sea ||
        data.address.water ||
        "";

      // ✅ PRIORITY 1: Ocean / Sea detected
      if (ocean) {
        setLocationName(`🌊 ${ocean}`);
        return;
      }

      // ✅ PRIORITY 2: Normal land location
      if (city || state || country) {
        setLocationName(
          [city, state, country]
            .filter(Boolean)
            .join(", ")
        );
        return;
      }

      // ✅ PRIORITY 3: No address but valid response
      setLocationName("🌊 International Waters");

    } else {
      setLocationName("🌊 International Waters");
    }

  } catch (error) {
    console.error("Reverse geocode error:", error);

    // ✅ If API fails (ocean / no data)
    setLocationName("🌊 International Waters");
  }
};

  /* ================= SEARCH LOCATION ================= */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await api.get(
        `/weather/search-location?q=${searchQuery}`
      );

      const data = res.data; // ✅ FIXED

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setPosition([lat, lng]);
        fetchWeather(lat, lng);
        fetchLocation(lat, lng);

        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], 10);
        }
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
        🌤 Weather Intelligence
      </h2>

      {/* ================= SEARCH BAR ================= */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search city or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-3 border rounded-xl shadow-sm"
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Search
        </button>
      </div>

      {/* ================= MAP ================= */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="h-64 md:h-96 w-full"
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            setPosition={setPosition}
            fetchWeather={fetchWeather}
            fetchLocation={fetchLocation}
          />

          {position && (
            <Marker position={position}>
              <Popup>
                📍 {locationName || "Selected Location"}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="text-green-600 font-semibold mb-4">
          Fetching weather data...
        </div>
      )}

      {/* ================= LOCATION DISPLAY ================= */}
      {locationName && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
          <p className="text-lg font-semibold text-gray-700">
            📍 {locationName}
          </p>
        </div>
      )}

      {/* ================= WEATHER RESULTS ================= */}
      {weatherData?.forecast && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherData.forecast.slice(0, 6).map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="font-semibold mb-2">
                {new Date(item.time).toLocaleString()}
              </h4>
              <div className="text-2xl font-bold text-green-600">
                {item.temp}°C
              </div>
              <p>{item.description}</p>
              <p className="text-sm text-gray-500">
                Alert: {item.alert}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Weather;