import { useEffect, useState } from "react";
import api from "../services/api";

function AdminProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/farmer/profile");
    setProfile(res.data);
  };

  return (
    <div className="p-8">

      <h2 className="text-3xl font-bold text-green-700 mb-8">
        👑 Admin Profile
      </h2>

      {profile && (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl">

          <div className="space-y-4">

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
              <p className="text-lg font-semibold text-green-600">
                ADMIN
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminProfile;