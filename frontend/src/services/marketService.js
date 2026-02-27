import api from "./api";

export const getMarketData = async (crop) => {
  const res = await api.get(`/market/${crop}`);
  return res.data;
};