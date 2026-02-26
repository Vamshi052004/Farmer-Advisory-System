from flask import Blueprint, jsonify, request
from config.db import get_db
from middlewares.auth_middleware import token_required

market_bp = Blueprint("market", __name__)
db = get_db()

# =========================================
# GET ALL MARKET DATA
# =========================================
@market_bp.route("/", methods=["GET"])
@token_required
def get_all_market(current_user):

    crops = list(db.market.find())

    for crop in crops:
        crop["_id"] = str(crop["_id"])

        # Hide consumer price for farmer
        if current_user["role"] != "admin":
            crop.pop("consumerPrice", None)

    return jsonify(crops)


# =========================================
# GET SINGLE CROP DATA
# =========================================
@market_bp.route("/<crop_name>", methods=["GET"])
@token_required
def get_crop_market(current_user, crop_name):

    crop = db.market.find_one({"crop": crop_name})

    if not crop:
        return jsonify({"message": "Crop not found"}), 404

    crop["_id"] = str(crop["_id"])

    if current_user["role"] != "admin":
        crop.pop("consumerPrice", None)

    return jsonify(crop)
