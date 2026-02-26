import { useEffect, useState } from "react";
import api from "../services/api";

function ManageAdvisories() {
  const [advisories, setAdvisories] = useState([]);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    crop: "",
    title: "",
    message: "",
    confidence: "",
    isActive: true
  });

  const [filters, setFilters] = useState({
    crop: "",
    confidence: "",
    status: ""
  });

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const fetchAdvisories = async () => {
    try {
      const res = await api.get("/admin/advisories");
      setAdvisories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAdvisory = async (id) => {
    if (!window.confirm("Delete this advisory?")) return;
    await api.delete(`/admin/advisories/${id}`);
    fetchAdvisories();
  };

  const openEdit = (adv) => {
    setEditing(adv._id);
    setFormData({
      crop: adv.crop || "",
      title: adv.title || "",
      message: adv.message || "",
      confidence: adv.confidence || "",
      isActive: adv.isActive ?? true
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitForm = async () => {
    const payload = {
      ...formData,
      confidence: Number(formData.confidence)
    };

    if (editing) {
      await api.put(`/admin/advisories/${editing}`, payload);
    } else {
      await api.post("/admin/advisories", payload);
    }

    setEditing(null);
    setFormData({
      crop: "",
      title: "",
      message: "",
      confidence: "",
      isActive: true
    });

    fetchAdvisories();
  };

  const filtered = advisories.filter((adv) => {
    if (filters.crop && adv.crop !== filters.crop) return false;
    if (filters.status === "active" && !adv.isActive) return false;
    if (filters.status === "inactive" && adv.isActive) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8">

      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-8">
        📋 Manage Advisories
      </h2>

      {/* FORM */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border mb-10">
        <h3 className="text-lg font-semibold mb-6">
          {editing ? "Edit Advisory" : "Add New Advisory"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

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
                isActive: e.target.value === "active"
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
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
        >
          {editing ? "Update Advisory" : "Add Advisory"}
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border">
        <table className="min-w-full text-sm md:text-base">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-4">Crop</th>
              <th className="p-4">Topic</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((adv) => (
              <tr key={adv._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{adv.crop}</td>
                <td className="p-4">{adv.title}</td>
                <td className="p-4">{adv.confidence}%</td>
                <td className="p-4">
                  {adv.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => openEdit(adv)}
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
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No advisories found.
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAdvisories;