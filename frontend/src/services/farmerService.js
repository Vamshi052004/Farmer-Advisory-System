import api from './api'

export const getFarmerProfile = async () => {
  const response = await api.get('/farmer/profile')
  return response.data
}

export const updateFarmerProfile = async (farmerData) => {
  const response = await api.put('/farmer/profile', farmerData)
  return response.data
}

export const getDashboardData = async (crop) => {
  const res = await api.get(
    `/farmer/dashboard?crop=${crop || ""}`
  );
  return res.data;
};
