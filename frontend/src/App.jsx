import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminRoute from "./components/AdminRoute";

import ActivateAccount from "./pages/ActivateAccount";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CropAdvisory from "./pages/CropAdvisory";
import Weather from "./pages/Weather";
import FarmerProfile from "./pages/FarmerProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ManageAdvisories from "./pages/ManageAdvisories";
import Market from "./pages/MarketIntelligence";
import AdminProfileRequests from "./pages/AdminProfileRequests";
import SecureProfileUpdate from "./pages/SecureProfileUpdate";
import AdminProfile from "./pages/AdminProfile";

//  PUBLIC LAYOUT 
function PublicLayout({ children }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

//  PRIVATE LAYOUT 
function PrivateLayout({ children }) {
  const token = localStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex min-h-screen bg-gray-50 relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} />

        <div className="flex-1 p-4 md:p-8 transition-all duration-300">
          {children}
        </div>
      </div>
    </>
  );
}

//  ROLE BASED PROFILE 
function ProfileRouter() {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;

  try {
    const parsed = JSON.parse(userData);
    return parsed?.role === "admin" ? <AdminProfile /> : <FarmerProfile />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

//  APP ROUTES 
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate/:token" element={<ActivateAccount />} />

        <Route
          path="/profile-update/:token"
          element={<PublicLayout><SecureProfileUpdate /></PublicLayout>}
        />

        <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
        <Route path="/advisory" element={<PrivateLayout><CropAdvisory /></PrivateLayout>} />
        <Route path="/weather" element={<PrivateLayout><Weather /></PrivateLayout>} />
        <Route path="/profile" element={<PrivateLayout><ProfileRouter /></PrivateLayout>} />
        <Route path="/market" element={<PrivateLayout><Market /></PrivateLayout>} />

        <Route
          path="/admin"
          element={
            <PrivateLayout>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/advisories"
          element={
            <PrivateLayout>
              <AdminRoute>
                <ManageAdvisories />
              </AdminRoute>
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/profile-requests"
          element={
            <PrivateLayout>
              <AdminRoute>
                <AdminProfileRequests />
              </AdminRoute>
            </PrivateLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;