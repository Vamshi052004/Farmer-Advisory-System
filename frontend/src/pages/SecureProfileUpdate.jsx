import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function SecureProfileUpdate() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🔹 Fetch existing profile using token
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/farmer/profile-by-token/${token}`);
      setFormData(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/farmer/secure-update", {
        token,
        updateData: formData
      });

      setMessage(res.data.message);
      setTimeout(() => navigate("/profile"), 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">

        <h2 className="text-2xl font-bold text-green-700 mb-6">
          ✏️ Update Your Profile
        </h2>

        {Object.keys(formData).map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>

            <input
              type="text"
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl mt-4"
        >
          Submit Profile Update
        </button>

        {message && (
          <p className="mt-4 text-green-600 font-medium">{message}</p>
        )}

      </div>
    </div>
  );
}

export default SecureProfileUpdate;