import { useEffect, useState } from "react";
import api from "../services/api";

function Admin() {
  const [advisories, setAdvisories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [advRes, reqRes] = await Promise.all([
        api.get("/admin/advisories"),
        api.get("/admin/profile-update-requests"),
      ]);

      setAdvisories(advRes.data || []);
      setRequests(reqRes.data || []);
    } catch (err) {
      console.error("Admin fetch failed:", err);
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      await api.post(`/admin/approve-profile-update/${id}`);
      fetchData();
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.post(`/admin/reject-profile-update/${id}`);
      fetchData();
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading admin data...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-10">
      <h2 className="text-3xl font-bold text-green-700">Admin Panel</h2>

      {/* Advisories */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Advisories</h3>
        {advisories.length === 0 && (
          <p className="text-gray-500">No advisories available.</p>
        )}
        {advisories.map((adv, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow mb-4">
            <h4 className="font-semibold text-lg">{adv.crop}</h4>
            <p>{adv.advisory}</p>
            <p className="text-sm text-gray-500">
              Confidence: {adv.confidence}%
            </p>
          </div>
        ))}
      </div>

      {/* Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Profile Update Requests
        </h3>
        {requests.length === 0 && (
          <p className="text-gray-500">No profile requests found.</p>
        )}
        {requests.map((req) => (
          <div key={req._id} className="bg-white p-6 rounded-xl shadow mb-4">
            <p><strong>User:</strong> {req.userId}</p>
            <p><strong>Status:</strong> {req.status}</p>

            {req.status === "pending" && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => approveRequest(req._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectRequest(req._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;