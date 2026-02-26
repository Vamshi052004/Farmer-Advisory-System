import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const dash = await api.get("/admin/dashboard");
    const farmersList = await api.get("/admin/farmers");

    setSummary(dash.data.summary);
    setFarmers(farmersList.data);
  };

  const deleteFarmer = async (id) => {
    await api.delete(`/admin/farmer/${id}`);
    fetchData();
  };

  return (
    <div className="p-4 md:p-8">

      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8">
        👑 Admin Dashboard
      </h2>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p>Total Users</p>
            <p className="text-3xl font-bold">{summary.totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p>Farmers</p>
            <p className="text-3xl font-bold text-green-600">
              {summary.totalFarmers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p>Active Advisories</p>
            <p className="text-3xl font-bold text-blue-600">
              {summary.activeAdvisories}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p>Pending Requests</p>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.pendingProfileRequests}
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
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