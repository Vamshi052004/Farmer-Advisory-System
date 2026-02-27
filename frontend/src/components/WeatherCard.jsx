function WeatherCard({ temperature, condition, rainfall }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h4 className="text-lg font-semibold text-green-700 mb-3">
        Weather
      </h4>
      <p className="text-gray-600">Temperature: {temperature}°C</p>
      <p className="text-gray-600">Condition: {condition}</p>
      <p className="text-gray-600">Rainfall: {rainfall} mm</p>
    </div>
  );
}
export default WeatherCard;