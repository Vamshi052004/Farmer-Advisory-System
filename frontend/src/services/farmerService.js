import api from "./api";

export const getFarmerProfile = async () => {
  const res = await api.get("/farmer/profile");
  return res.data;
};

export const updateFarmerProfile = async (farmerData) => {
  const res = await api.put("/farmer/profile", farmerData);
  return res.data;
};

export const getDashboardData = async (crop) => {
  const res = await api.get("/farmer/dashboard", {
    params: {
      crop: crop || ""
    }
  });
  return res.data;
};