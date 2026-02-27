from flask import Blueprint, jsonify, request
import requests
import os
from dotenv import load_dotenv

load_dotenv()

weather_bp = Blueprint("weather", __name__)
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


@weather_bp.route("/forecast", methods=["GET"])
def get_weather():

    if not OPENWEATHER_API_KEY:
        return jsonify({"message": "Weather service not configured"}), 500

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"message": "Latitude and Longitude required"}), 400

    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return jsonify({"message": "Invalid coordinates format"}), 400

    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return jsonify({"message": "Coordinates out of valid range"}), 400

    try:
        url = (
            f"https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}"
            f"&appid={OPENWEATHER_API_KEY}"
            f"&units=metric"
        )

        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return jsonify({"message": "Failed to fetch weather data"}), 502

        data = response.json()

        forecast_list = []
        total_temp = 0
        alert_count = 0
        rain_risk_slots = 0

        forecast_items = data.get("list", [])[:15]

        for item in forecast_items:
            temp = float(item["main"]["temp"])
            humidity = item["main"]["humidity"]
            rain_probability = float(item.get("pop", 0)) * 100

            total_temp += temp

            weather_alert = "Normal"

            if rain_probability > 80:
                weather_alert = "Heavy Rain Alert"
                alert_count += 1
                rain_risk_slots += 1
            elif rain_probability > 60:
                weather_alert = "Moderate Rain Alert"
                alert_count += 1
            elif temp >= 40:
                weather_alert = "Heatwave Alert"
                alert_count += 1
            elif temp <= 5:
                weather_alert = "Cold Wave Alert"
                alert_count += 1

            forecast_list.append({
                "time": item["dt_txt"],
                "temp": round(temp, 1),
                "humidity": humidity,
                "rainProbability": round(rain_probability, 2),
                "description": item["weather"][0]["description"],
                "alert": weather_alert
            })

        avg_temp = round(total_temp / len(forecast_list), 2)

        return jsonify({
            "location": data["city"]["name"],
            "forecast": forecast_list,
            "summary": {
                "averageTemperature": avg_temp,
                "totalAlerts": alert_count,
                "rainRiskSlots": rain_risk_slots
            }
        }), 200

    except Exception as e:
        print("Weather Error:", str(e))
        return jsonify({"message": "Weather fetch failed"}), 500


@weather_bp.route("/reverse-geocode", methods=["GET"])
def reverse_geocode():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"message": "Latitude and longitude required"}), 400

    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={
                "format": "json",
                "lat": lat,
                "lon": lon
            },
            headers={
                "User-Agent": "Farmer-Advisory-System"
            },
            timeout=10
        )

        return jsonify(response.json()), 200

    except Exception as e:
        print("Reverse Geocode Error:", e)
        return jsonify({"message": "Reverse geocoding failed"}), 500


@weather_bp.route("/search-location", methods=["GET"])
def search_location():
    query = request.args.get("q")

    if not query:
        return jsonify({"message": "Query required"}), 400

    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "format": "json",
                "q": query
            },
            headers={
                "User-Agent": "Farmer-Advisory-System"
            },
            timeout=10
        )

        return jsonify(response.json()), 200

    except Exception as e:
        print("Search Error:", e)
        return jsonify({"message": "Search failed"}), 500