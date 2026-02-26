function WeatherCard({ temperature, condition, rainfall }) {
  return (
    <div className="card">
      <h4>Weather</h4>
      <p>Temperature: {temperature}°C</p>
      <p>Condition: {condition}</p>
      <p>Rainfall: {rainfall} mm</p>
    </div>
  )
}

export default WeatherCard