from flask import Blueprint, jsonify, request

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/yield-prediction", methods=["POST"])
def yield_prediction():

    data = request.json

    crop = data.get("crop")
    temperature = float(data.get("temperature", 0))
    rainfall = float(data.get("rainfall", 0))
    soil = data.get("soilType")

    score = 50

    if 20 <= temperature <= 32:
        score += 15

    if rainfall > 60:
        score += 15

    if soil in ["Alluvial Soil", "Loamy Soil"]:
        score += 10

    if crop in ["Rice", "Wheat"]:
        score += 10

    if score > 85:
        prediction = "High Yield Expected"
    elif score > 65:
        prediction = "Moderate Yield"
    else:
        prediction = "Low Yield Risk"

    return jsonify({
        "crop": crop,
        "yieldScore": score,
        "prediction": prediction
    })

@ai_bp.route("/pest-risk", methods=["POST"])
def pest_risk():

    data = request.json

    humidity = float(data.get("humidity", 0))
    temperature = float(data.get("temperature", 0))

    risk = "Low"

    if humidity > 75 and temperature > 25:
        risk = "High Risk of Fungal Infection"

    elif humidity > 60:
        risk = "Moderate Pest Risk"

    return jsonify({
        "riskLevel": risk
    })
