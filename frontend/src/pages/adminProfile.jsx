import { useEffect, useState } from "react";
import api from "../services/api";

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/farmer/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("Profile fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-10 text-center">No profile found.</div>;
  }

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold text-green-700 mb-8">
        👑 Admin Profile
      </h2>

      <div className="bg-white p-8 rounded-xl shadow max-w-2xl space-y-6">
        <div>
          <label className="text-gray-500">Name</label>
          <p className="text-lg font-semibold">{profile.name}</p>
        </div>

        <div>
          <label className="text-gray-500">Email</label>
          <p className="text-lg">{profile.email}</p>
        </div>

        <div>
          <label className="text-gray-500">Mobile</label>
          <p className="text-lg">{profile.mobile}</p>
        </div>

        <div>
          <label className="text-gray-500">Role</label>
          <p className="text-lg font-semibold text-green-600">ADMIN</p>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;