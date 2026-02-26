import api from "./api";

export const getCropAdvisory = async (crop, soilType) => {
  const res = await api.get(
    `/advisory/recommendation?crop=${crop || ""}&soilType=${soilType || ""}`
  );
  return res.data;
};

export const getAvailableCrops = async () => {
  const res = await api.get("/advisory/crops");
  return res.data.crops;
};

export const getAvailableSoils = async () => {
  const res = await api.get("/advisory/soils");
  return res.data.soilTypes;
};
