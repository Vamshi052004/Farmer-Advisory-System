import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ActivateAccount() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.post("/auth/activate", {
        token,
        password,
      });

      setMessage("Account activated successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Activation failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-white/40">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-4">
          🌾 Activate Your Account
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Set a secure password to activate your account.
        </p>

        <form onSubmit={handleActivate} className="space-y-4">

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-md"
          >
            {loading ? "Activating..." : "Activate Account"}
          </button>

        </form>

        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

      </div>

    </div>
  );
}

export default ActivateAccount;