from flask import Blueprint, jsonify, request
from middlewares.auth_middleware import token_required
from config.db import get_db

advisory_bp = Blueprint("advisory", __name__)
db = get_db()


VALID_SOILS = [
    "Alluvial Soil", "Black Soil", "Red Soil",
    "Laterite Soil", "Arid Soil", "Mountain Soil",
    "Desert Soil", "Sandy Soil", "Loamy Soil",
    "Clay Soil"
]

VALID_CROPS = [
    "Rice", "Wheat", "Maize", "Barley", "Jowar (Sorghum)",
    "Bajra (Pearl Millet)", "Ragi (Finger Millet)",
    "Chickpea (Chana)", "Pigeon Pea (Tur/Arhar)",
    "Green Gram (Moong)", "Black Gram (Urad)",
    "Lentil (Masoor)", "Groundnut", "Mustard",
    "Soybean", "Sunflower", "Sesame (Til)",
    "Castor", "Cotton", "Sugarcane", "Tobacco",
    "Jute", "Tea", "Coffee", "Rubber",
    "Coconut", "Arecanut", "Cashew", "Tomato",
    "Potato", "Onion", "Chilli", "Brinjal",
    "Cabbage", "Cauliflower", "Okra (Ladyfinger)",
    "Mango", "Banana", "Apple", "Grapes",
    "Pomegranate", "Papaya", "Guava",
    "Orange", "Turmeric", "Ginger",
    "Coriander", "Cumin", "Cardamom",
    "Black Pepper"
]


@advisory_bp.route("/ai", methods=["GET"])
@token_required
def ai_advisory(current_user):
    return jsonify({
        "irrigation": "Moderate irrigation recommended",
        "pestRisk": "Low",
        "fertilizerAdvice": "Balanced NPK recommended",
        "confidence": 85
    }), 200


@advisory_bp.route("/recommendation", methods=["GET"])
@token_required
def crop_recommendation(current_user):

    try:
        crop = request.args.get("crop")
        soil = request.args.get("soilType")

        if not crop:
            crop = current_user.get("preferredCrop")

        if not soil:
            soil = current_user.get("soilType")

        if not crop:
            return jsonify({"message": "Please select a crop"}), 400

        if crop not in VALID_CROPS:
            return jsonify({"message": "Invalid crop selected"}), 400

        if soil and soil not in VALID_SOILS:
            return jsonify({"message": "Invalid soil type"}), 400

        advisory_points = []
        confidence_score = 70

        if soil == "Clay Soil":
            advisory_points.extend([
                "Clay soil retains high moisture. Avoid over-irrigation.",
                "Ensure proper drainage to prevent root rot."
            ])
            confidence_score += 5

        elif soil == "Sandy Soil":
            advisory_points.extend([
                "Sandy soil drains quickly. Increase irrigation frequency.",
                "Add organic compost to improve water retention."
            ])
            confidence_score += 5

        elif soil == "Black Soil":
            advisory_points.extend([
                "Black soil is rich in minerals but retains water.",
                "Avoid waterlogging and ensure proper aeration."
            ])
            confidence_score += 5

        elif soil == "Red Soil":
            advisory_points.extend([
                "Red soil is low in nitrogen. Apply organic manure.",
                "Use green manure crops to improve fertility."
            ])
            confidence_score += 5

        elif soil == "Loamy Soil":
            advisory_points.extend([
                "Loamy soil is ideal for most crops.",
                "Maintain balanced fertilizer schedule."
            ])
            confidence_score += 10

        elif soil:
            advisory_points.append(
                "Conduct soil testing before fertilizer application."
            )

        if crop == "Rice":
            advisory_points.extend([
                "Maintain standing water during early growth stage.",
                "Monitor brown planthopper infestation."
            ])
            confidence_score += 10

        elif crop == "Wheat":
            advisory_points.extend([
                "Avoid excess irrigation during flowering stage.",
                "Monitor rust disease symptoms."
            ])
            confidence_score += 10

        elif crop == "Cotton":
            advisory_points.extend([
                "Monitor bollworm infestation.",
                "Apply balanced nitrogen fertilizer."
            ])
            confidence_score += 10

        elif crop in ["Apple", "Mango", "Banana"]:
            advisory_points.extend([
                "Ensure proper pruning and pest management.",
                "Use potassium-rich fertilizers for fruit quality."
            ])
            confidence_score += 8

        elif crop in ["Tomato", "Potato", "Onion", "Chilli"]:
            advisory_points.extend([
                "Maintain proper spacing and drainage.",
                "Monitor fungal diseases regularly."
            ])
            confidence_score += 8

        else:
            advisory_points.extend([
                "Follow recommended agronomic practices.",
                "Consult local agriculture officer if needed."
            ])

        confidence_score = min(confidence_score, 95)

        return jsonify({
            "crop": crop,
            "soilType": soil if soil else "Not specified",
            "advisory": advisory_points,
            "confidence": confidence_score
        }), 200

    except Exception as e:
        print("Advisory Error:", str(e))
        return jsonify({
            "message": "Failed to generate advisory"
        }), 500


@advisory_bp.route("/crops", methods=["GET"])
@token_required
def get_available_crops(current_user):

    return jsonify({
        "crops": sorted(VALID_CROPS)
    }), 200


@advisory_bp.route("/soils", methods=["GET"])
@token_required
def get_available_soils(current_user):

    return jsonify({
        "soilTypes": sorted(VALID_SOILS)
    }), 200
