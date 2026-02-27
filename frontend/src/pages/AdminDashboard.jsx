import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [dashRes, farmersRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/farmers"),
      ]);

      setSummary(dashRes.data?.summary || {});
      setFarmers(farmersRes.data || []);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFarmer = async (id) => {
    if (!window.confirm("Delete this farmer?")) return;

    try {
      await api.delete(`/admin/farmer/${id}`);
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-10">
      <h2 className="text-3xl font-bold text-green-700">
        👑 Admin Dashboard
      </h2>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p>Total Users</p>
            <p className="text-3xl font-bold">{summary.totalUsers || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Farmers</p>
            <p className="text-3xl font-bold text-green-600">
              {summary.totalFarmers || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Active Advisories</p>
            <p className="text-3xl font-bold text-blue-600">
              {summary.activeAdvisories || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Pending Requests</p>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.pendingProfileRequests || 0}
            </p>
          </div>
        </div>
      )}

      {/* Farmers Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow mt-8">
        <table className="min-w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">State</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer._id} className="border-b">
                <td className="p-4">{farmer.name}</td>
                <td className="p-4">{farmer.mobile}</td>
                <td className="p-4">{farmer.state}</td>
                <td className="p-4">
                  <button
                    onClick={() => deleteFarmer(farmer._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {farmers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No farmers found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;