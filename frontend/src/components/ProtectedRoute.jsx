import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // No token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Expired
    if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }

    // Wrong token type
    if (decoded?.type !== "access") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }

    return children;

  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;