import api from "./api";

export const getMarketData = async (crop) => {
  const response = await api.get(`/market/${crop}`);
  return response.data;
};
