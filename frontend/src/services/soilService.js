import api from "./api";

export const getSoilHealth = async (crop, soilType) => {
  const res = await api.get(
    `/soil/health?crop=${crop || ""}&soilType=${soilType || ""}`
  );
  return res.data;
};
