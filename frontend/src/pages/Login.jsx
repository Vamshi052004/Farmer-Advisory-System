import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!mobile || !password) {
      setError("Please enter mobile and password");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ mobile, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(data.user?.role === "admin" ? "/admin" : "/dashboard");

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Invalid mobile or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          🌾 Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        <div className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-700 font-semibold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;