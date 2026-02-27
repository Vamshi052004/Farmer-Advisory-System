from flask import Blueprint, jsonify, request
from middlewares.auth_middleware import token_required
from config.db import get_db

soil_bp = Blueprint("soil", __name__)
db = get_db()


@soil_bp.route("/health", methods=["GET"])
@token_required
def soil_health(current_user):

    crop = request.args.get("crop")
    soil_type = request.args.get("soilType")

    if not soil_type:
        return jsonify({"message": "Soil type required"}), 400

    nutrients = []
    ph = "Neutral"
    recommendations = []

    if soil_type == "Black Soil":
        nutrients = ["Nitrogen", "Phosphorus"]
        ph = "Neutral to Slightly Alkaline"
        recommendations = [
            "Ensure proper drainage",
            "Apply organic compost",
            "Good for Cotton and Wheat"
        ]

    elif soil_type == "Red Soil":
        nutrients = ["Nitrogen", "Potassium"]
        ph = "Slightly Acidic"
        recommendations = [
            "Add lime to reduce acidity",
            "Use green manure",
            "Suitable for Groundnut and Millets"
        ]

    elif soil_type == "Clay Soil":
        nutrients = ["Poor Drainage"]
        ph = "Neutral"
        recommendations = [
            "Avoid waterlogging",
            "Improve aeration using compost"
        ]

    else:
        recommendations = ["No specific recommendation available"]

    return jsonify({
        "soilType": soil_type,
        "crop": crop,
        "soilPH": ph,
        "deficientNutrients": nutrients,
        "recommendations": recommendations,
        "confidence": "High"
    })
