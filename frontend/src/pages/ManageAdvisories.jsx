import { useEffect, useState } from "react";
import api from "../services/api";

function ManageAdvisories() {
  const [advisories, setAdvisories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    crop: "",
    title: "",
    message: "",
    confidence: "",
    isActive: true,
  });

  /* ================= FETCH ================= */
  const fetchAdvisories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/advisories");
      setAdvisories(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  /* ================= SUBMIT ================= */
  const submitForm = async () => {
    if (!formData.crop || !formData.title || !formData.message) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      ...formData,
      confidence: Number(formData.confidence),
    };

    try {
      if (editing) {
        await api.put(`/admin/advisories/${editing}`, payload);
      } else {
        await api.post("/admin/advisories", payload);
      }

      resetForm();
      fetchAdvisories();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      crop: "",
      title: "",
      message: "",
      confidence: "",
      isActive: true,
    });
  };

  const deleteAdvisory = async (id) => {
    if (!window.confirm("Delete this advisory?")) return;
    try {
      await api.delete(`/admin/advisories/${id}`);
      fetchAdvisories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold text-green-700 mb-8">
        📋 Manage Advisories
      </h2>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
        <h3 className="text-lg font-semibold mb-6">
          {editing ? "Edit Advisory" : "Add New Advisory"}
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Crop"
            value={formData.crop}
            onChange={(e) =>
              setFormData({ ...formData, crop: e.target.value })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Advisory Topic"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Confidence %"
            value={formData.confidence}
            onChange={(e) =>
              setFormData({ ...formData, confidence: e.target.value })
            }
            className="border p-3 rounded-xl"
          />

          <select
            value={formData.isActive ? "active" : "inactive"}
            onChange={(e) =>
              setFormData({
                ...formData,
                isActive: e.target.value === "active",
              })
            }
            className="border p-3 rounded-xl"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <textarea
          rows="4"
          placeholder="Recommendation Details"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="border p-4 rounded-xl w-full mb-6"
        />

        <button
          onClick={submitForm}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          {editing ? "Update Advisory" : "Add Advisory"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Loading advisories...</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-4">Crop</th>
                <th className="p-4">Title</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {advisories.map((adv) => (
                <tr key={adv._id} className="border-b">
                  <td className="p-4">{adv.crop}</td>
                  <td className="p-4">{adv.title}</td>
                  <td className="p-4">{adv.confidence}%</td>
                  <td className="p-4">
                    {adv.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => {
                        setEditing(adv._id);
                        setFormData(adv);
                      }}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteAdvisory(adv._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {advisories.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No advisories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageAdvisories;