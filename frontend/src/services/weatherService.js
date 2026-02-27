import api from "./api";

export const getWeather = async (lat, lon) => {
  const res = await api.get("/weather/forecast", {
    params: {
      lat,
      lon
    }
  });
  return res.data;
};