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
    preferredCrop: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await api.post("/auth/register", formData);

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2500);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 px-4 py-10">

      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/40">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          🌿 Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="name" placeholder="Full Name" onChange={handleChange} required className="input-style" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input-style" />
          <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required className="input-style" />
          <input type="date" name="dob" onChange={handleChange} required className="input-style" />
          <input name="state" placeholder="State" onChange={handleChange} required className="input-style" />
          <input name="district" placeholder="District" onChange={handleChange} required className="input-style" />
          <input name="village" placeholder="Village" onChange={handleChange} required className="input-style" />
          <input type="number" name="landArea" placeholder="Land Area (acres)" onChange={handleChange} required className="input-style" />

          <select name="regionType" onChange={handleChange} required className="input-style">
            <option value="">Select Region</option>
            {REGION_TYPES.map((region, i) => (
              <option key={i} value={region}>{region}</option>
            ))}
          </select>

          <select name="soilType" onChange={handleChange} required className="input-style">
            <option value="">Select Soil Type</option>
            {SOIL_TYPES.map((soil, i) => (
              <option key={i} value={soil}>{soil}</option>
            ))}
          </select>

          <select name="preferredCrop" onChange={handleChange} required className="input-style md:col-span-2">
            <option value="">Select Preferred Crop</option>
            {CROPS.map((crop, i) => (
              <option key={i} value={crop}>{crop}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
