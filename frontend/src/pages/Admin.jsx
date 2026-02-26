import { useEffect, useState } from "react";
import api from "../services/api";

function Admin() {
  const [advisories, setAdvisories] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchAdvisories();
    fetchRequests();
  }, []);

  const fetchAdvisories = async () => {
    const res = await api.get("/admin/advisories");
    setAdvisories(res.data);
  };

  const fetchRequests = async () => {
    const res = await api.get("/admin/profile-update-requests");
    setRequests(res.data);
  };

  const approveRequest = async (id) => {
    await api.post(`/admin/approve-profile-update/${id}`);
    fetchRequests();
  };

  const rejectRequest = async (id) => {
    await api.post(`/admin/reject-profile-update/${id}`);
    fetchRequests();
  };

  return (
    <div className="page-container">
      <h2>Admin Panel</h2>

      <h3>Advisories</h3>
      {advisories.map((adv, index) => (
        <div key={index} className="admin-card">
          <h3>{adv.crop}</h3>
          <p>{adv.advisory}</p>
          <p><strong>Confidence:</strong> {adv.confidence}%</p>
        </div>
      ))}

      <h3>Profile Update Requests</h3>
      {requests.map((req) => (
        <div key={req._id} className="admin-card">
          <p><strong>User ID:</strong> {req.userId}</p>
          <p><strong>Status:</strong> {req.status}</p>

          {req.status === "pending" && (
            <>
              <button onClick={() => approveRequest(req._id)}>
                Approve
              </button>
              <button onClick={() => rejectRequest(req._id)}>
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Admin;