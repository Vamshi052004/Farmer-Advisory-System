import api from "./api";

export const getWeather = async (lat, lon) => {
  const res = await api.get(
    `/weather/forecast?lat=${lat}&lon=${lon}`
  );
  return res.data;
};
