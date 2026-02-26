import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CropAdvisory from './pages/CropAdvisory'
import Weather from './pages/Weather'
import SoilHealth from './pages/SoilHealth'
import Alerts from './pages/Alerts'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ActivateAccount from './pages/ActivateAccount'

function RoutesConfig() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/advisory"
        element={
          <ProtectedRoute>
            <CropAdvisory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        }
      />

      <Route
        path="/soil-health"
        element={
          <ProtectedRoute>
            <SoilHealth />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
      <Route path="/activate/:token" element={<ActivateAccount />} />
    </Routes>
  )
}

export default RoutesConfig