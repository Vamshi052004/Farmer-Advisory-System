import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "./DashboardLayout";

function PrivateLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default PrivateLayout;