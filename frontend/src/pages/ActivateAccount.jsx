import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Activate() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

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
        password
      });

      setMessage("Account activated successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Activation failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card activate-card">
        <h2 className="auth-title">Activate Your Account</h2>
        <p className="auth-subtitle">
          Set a secure password to activate your account.
        </p>

        <form onSubmit={handleActivate} className="auth-form">

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="activate-btn"
            disabled={loading}
          >
            {loading ? "Activating..." : "Activate Account"}
          </button>

        </form>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}

export default Activate;
