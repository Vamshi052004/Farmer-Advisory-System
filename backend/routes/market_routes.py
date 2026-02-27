from flask import Blueprint, jsonify
from config.db import get_db
from middlewares.auth_middleware import token_required
import re

market_bp = Blueprint("market", __name__)
db = get_db()


@market_bp.route("/", methods=["GET"])
@token_required
def get_all_market(current_user):

    crops = list(db.market.find())

    if not crops:
        return jsonify({"message": "No market data found"}), 404

    result = []

    for crop in crops:
        crop["_id"] = str(crop["_id"])

        if current_user["role"] != "admin":
            crop.pop("consumerPrice", None)

        result.append(crop)

    return jsonify(result), 200


@market_bp.route("/<crop_name>", methods=["GET"])
@token_required
def get_crop_market(current_user, crop_name):

    crop = db.market.find_one({
        "crop": {
            "$regex": f"^{re.escape(crop_name)}$",
            "$options": "i"
        }
    })

    if not crop:
        return jsonify({"message": "Crop not found"}), 404

    crop["_id"] = str(crop["_id"])

    if current_user["role"] != "admin":
        crop.pop("consumerPrice", None)

    return jsonify(crop), 200
