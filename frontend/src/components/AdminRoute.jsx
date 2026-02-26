import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  // 🚫 No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // 🚫 Token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // 🚫 Not admin
    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    // ✅ Admin allowed
    return children;

  } catch (error) {
    // 🚫 Invalid token format
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}

export default AdminRoute;
