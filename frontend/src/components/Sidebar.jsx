import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

function Sidebar({ isOpen }) {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  const token = localStorage.getItem("token");
  let userRole = null;

  // Decode role safely
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded?.role || null;
    } catch {
      userRole = null;
    }
  }

  const fetchPending = useCallback(async () => {
    try {
      const res = await api.get(
        "/admin/profile-update-requests?status=pending&page=1&limit=1"
      );
      setPendingCount(res?.data?.total || 0);
    } catch {
      // silent fail (no logic change)
    }
  }, []);

  useEffect(() => {
    let interval;

    if (userRole === "admin") {
      fetchPending();
      interval = setInterval(fetchPending, 15000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userRole, fetchPending]);

  const active = (path) =>
    location.pathname === path
      ? "bg-green-600 text-white"
      : "text-gray-600 hover:bg-green-50 hover:text-green-700";

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full bg-white z-40 transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 w-64 border-r p-6`}
    >
      <div className="flex flex-col gap-3 mt-4">

        <Link to="/dashboard" className={`px-4 py-3 rounded-xl ${active("/dashboard")}`}>
          📊 Dashboard
        </Link>

        <Link to="/advisory" className={`px-4 py-3 rounded-xl ${active("/advisory")}`}>
          🌾 Crop Advisory
        </Link>

        <Link to="/weather" className={`px-4 py-3 rounded-xl ${active("/weather")}`}>
          🌤 Weather
        </Link>

        <Link to="/market" className={`px-4 py-3 rounded-xl ${active("/market")}`}>
          📈 Market
        </Link>

        <Link to="/profile" className={`px-4 py-3 rounded-xl ${active("/profile")}`}>
          👤 Profile
        </Link>

        {userRole === "admin" && (
          <>
            <div className="border-t my-4"></div>

            <Link to="/admin" className={`px-4 py-3 rounded-xl ${active("/admin")}`}>
              👑 Admin Dashboard
            </Link>

            <Link
              to="/admin/advisories"
              className={`px-4 py-3 rounded-xl ${active("/admin/advisories")}`}
            >
              📋 Manage Advisories
            </Link>

            <Link
              to="/admin/profile-requests"
              className={`flex justify-between items-center px-4 py-3 rounded-xl ${active("/admin/profile-requests")}`}
            >
              <span>📩 Profile Requests</span>

              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
          </>
        )}

      </div>
    </aside>
  );
}

export default Sidebar;