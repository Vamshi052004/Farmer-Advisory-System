import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { CROPS, SOIL_TYPES, REGION_TYPES } from "../utils/agricultureData";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    state: "",
    district: "",
    village: "",
    regionType: "",
    soilType: "",
    landArea: "",
    preferredCrop: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
          🌿 Create Your Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {Object.keys(formData).map((key) =>
            key === "regionType" ? (
              <select
                key={key}
                name={key}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-xl"
              >
                <option value="">Select Region</option>
                {REGION_TYPES.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : key === "soilType" ? (
              <select
                key={key}
                name={key}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-xl"
              >
                <option value="">Select Soil Type</option>
                {SOIL_TYPES.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : key === "preferredCrop" ? (
              <select
                key={key}
                name={key}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-xl md:col-span-2"
              >
                <option value="">Select Preferred Crop</option>
                {CROPS.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={key}
                type={
                  key === "email"
                    ? "email"
                    : key === "dob"
                    ? "date"
                    : key === "landArea"
                    ? "number"
                    : "text"
                }
                name={key}
                placeholder={key}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-xl"
              />
            )
          )}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        <div className="text-center mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;