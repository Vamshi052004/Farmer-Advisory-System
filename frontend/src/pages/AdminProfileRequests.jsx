import { useEffect, useState } from "react";
import api from "../services/api";

function AdminProfileRequests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  useEffect(() => {
    fetchRequests();
  }, [status, search, page]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/admin/profile-update-requests?status=${status}&search=${search}&page=${page}&limit=${limit}`
      );

      setRequests(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Request fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await api.post(`/admin/approve-profile-update/${id}`);
    fetchRequests();
  };

  const reject = async (id) => {
    await api.post(`/admin/reject-profile-update/${id}`);
    fetchRequests();
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
        📩 Profile Update Requests
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={status}
          onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          className="border p-3 rounded-xl"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Search farmer..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="border p-3 rounded-xl flex-1"
        />
      </div>

      {loading && <p>Loading requests...</p>}

      {requests.map((req) => (
        <div key={req._id} className="bg-white p-6 rounded-xl shadow mb-4">
          <p className="font-semibold">{req.userName}</p>
          <p className="text-sm text-gray-500">
            {new Date(req.requestedAt).toLocaleString()}
          </p>
          <p className="mt-2">Status: {req.status}</p>

          {req.status === "pending" && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => approve(req._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Approve
              </button>
              <button
                onClick={() => reject(req._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded-xl"
        >
          Prev
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded-xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminProfileRequests;