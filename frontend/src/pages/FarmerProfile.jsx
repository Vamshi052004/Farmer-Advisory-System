import { useEffect, useState } from "react";
import api from "../services/api";

function FarmerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [cooldown, setCooldown] = useState(0);
  const [pending, setPending] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchProfile();
    checkLatestRequest();
  }, []);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/farmer/profile");
      setProfile(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHECK LATEST REQUEST ================= */
  const checkLatestRequest = async () => {
    try {
      const res = await api.get("/farmer/latest-profile-request");

      if (res.data.request) {
        const { status, requestedAt } = res.data.request;

        if (status === "pending") {
          setPending(true);
        }

        const requestTime = new Date(requestedAt);
        const nextAllowed = new Date(requestTime);
        nextAllowed.setDate(nextAllowed.getDate() + 1);

        const diff = nextAllowed - new Date();

        if (diff > 0) {
          setCooldown(Math.floor(diff / 1000));
        }
      }
    } catch (error) {
      console.error("Latest request check failed:", error);
    }
  };

  /* ================= COUNTDOWN TIMER ================= */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ================= REQUEST UPDATE ================= */
  const requestUpdate = async () => {
    try {
      setRequesting(true);
      setMessage("");

      const res = await api.post(
        "/farmer/request-profile-update",
        profile
      );

      setMessage(res.data.message || "Request sent successfully.");

      setPending(true);

      if (res.data.requestedAt) {
        const requestTime = new Date(res.data.requestedAt);
        const nextAllowed = new Date(requestTime);
        nextAllowed.setDate(nextAllowed.getDate() + 1);

        const diff = nextAllowed - new Date();
        setCooldown(Math.floor(diff / 1000));
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to submit request.");
      }
    } finally {
      setRequesting(false);
    }
  };

  /* ================= FORMAT TIMER ================= */
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (loading) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-20">No profile data found.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-2xl font-bold text-green-700 mb-8">
          👨‍🌾 My Profile
        </h2>

        {/* PROFILE DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(profile).map((key) => (
            <div key={key} className="bg-gray-50 p-4 rounded-xl border">
              <p className="font-semibold capitalize">{key}</p>
              <p>{profile[key] || "-"}</p>
            </div>
          ))}
        </div>

        {/* PENDING STATUS */}
        {pending && (
          <div className="mt-6 bg-yellow-100 text-yellow-800 p-4 rounded-xl">
            ⏳ Request already pending
          </div>
        )}

        {/* COOLDOWN TIMER */}
        {cooldown > 0 && (
          <div className="mt-4 bg-blue-100 text-blue-800 p-4 rounded-xl">
            ⏱ Next request allowed in: {formatTime(cooldown)}
          </div>
        )}

        {/* REQUEST BUTTON */}
        <div className="mt-8">
          <button
            onClick={requestUpdate}
            disabled={requesting || cooldown > 0}
            className={`px-6 py-3 rounded-xl transition font-semibold
              ${
                cooldown > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }
            `}
          >
            {requesting
              ? "Submitting..."
              : cooldown > 0
              ? "Request Disabled"
              : "Request Profile Update"}
          </button>
        </div>

        {message && (
          <div className="mt-6 text-green-600">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

export default FarmerProfile;