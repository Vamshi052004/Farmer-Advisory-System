from flask import Blueprint, jsonify, request
from middlewares.auth_middleware import token_required
from config.db import get_db
from bson import ObjectId
from datetime import datetime
import jwt
import os
from datetime import datetime, timedelta

farmer_bp = Blueprint("farmer", __name__)
db = get_db()


def get_user_object_id(current_user):
    try:
        return ObjectId(current_user["_id"])
    except Exception:
        return None


@farmer_bp.route("/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    try:
        user_id = get_user_object_id(current_user)
        user = db.users.find_one({"_id": user_id})

        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify({
            "name": user.get("name"),
            "email": user.get("email"),
            "mobile": user.get("mobile"),
            "dob": user.get("dob"),
            "state": user.get("state"),
            "district": user.get("district"),
            "village": user.get("village"),
            "regionType": user.get("regionType"),
            "soilType": user.get("soilType"),
            "landArea": user.get("landArea"),
            "preferredCrop": user.get("preferredCrop"),
            "irrigationType": user.get("irrigationType"),
            "farmingExperience": user.get("farmingExperience")
        }), 200

    except Exception as e:
        print("Profile Fetch Error:", e)
        return jsonify({"message": "Failed to fetch profile"}), 500


@farmer_bp.route("/request-profile-update", methods=["POST"])
@token_required
def request_profile_update(current_user):

    user_id = current_user["_id"]

    now = datetime.utcnow()
    start_of_day = datetime(now.year, now.month, now.day)
    end_of_day = start_of_day + timedelta(days=1)

    existing_request = db.profile_update_requests.find_one({
        "userId": user_id,
        "requestedAt": {
            "$gte": start_of_day,
            "$lt": end_of_day
        }
    })

    if existing_request:
        return jsonify({
            "message": "You have already submitted a profile update request today. Please try again tomorrow."
        }), 400

    db.profile_update_requests.insert_one({
        "userId": user_id,
        "status": "pending",
        "requestedAt": now
    })

    return jsonify({
    "message": "Profile update request submitted successfully.",
    "requestedAt": now.isoformat()
}), 201

@farmer_bp.route("/latest-profile-request", methods=["GET"])
@token_required
def get_latest_profile_request(current_user):

    user_id = current_user["_id"]

    latest_request = db.profile_update_requests.find_one(
        {"userId": user_id},
        sort=[("requestedAt", -1)]
    )

    if not latest_request:
        return jsonify({"request": None}), 200

    return jsonify({
        "request": {
            "status": latest_request.get("status"),
            "requestedAt": latest_request.get("requestedAt")
        }
    }), 200


@farmer_bp.route("/profile-by-token/<token>", methods=["GET"])
def get_profile_by_token(token):
    try:
        SECRET_KEY = os.getenv("SECRET_KEY")
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        user_id = ObjectId(decoded["userId"])
        user = db.users.find_one({"_id": user_id})

        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify({
            "name": user.get("name"),
            "dob": user.get("dob"),
            "state": user.get("state"),
            "district": user.get("district"),
            "village": user.get("village"),
            "regionType": user.get("regionType"),
            "soilType": user.get("soilType"),
            "landArea": user.get("landArea"),
            "preferredCrop": user.get("preferredCrop"),
            "irrigationType": user.get("irrigationType"),
            "farmingExperience": user.get("farmingExperience")
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Update link expired"}), 401
    except Exception as e:
        print("Token profile error:", e)
        return jsonify({"message": "Invalid token"}), 400


@farmer_bp.route("/secure-update", methods=["POST"])
def secure_profile_update():
    try:
        data = request.get_json()
        token = data.get("token")
        update_data = data.get("updateData")

        SECRET_KEY = os.getenv("SECRET_KEY")
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        user_id = ObjectId(decoded["userId"])
        request_id = ObjectId(decoded["requestId"])

        allowed_fields = [
            "name", "dob", "state", "district", "village",
            "regionType", "soilType", "landArea",
            "preferredCrop", "irrigationType", "farmingExperience"
        ]

        safe_update_data = {
            k: update_data[k]
            for k in allowed_fields
            if k in update_data
        }

        safe_update_data["updatedAt"] = datetime.utcnow()

        db.users.update_one({"_id": user_id}, {"$set": safe_update_data})

        db.profile_update_requests.update_one(
            {"_id": request_id},
            {"$set": {"status": "completed", "completedAt": datetime.utcnow()}}
        )

        return jsonify({"message": "Profile updated successfully"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except Exception as e:
        print("Secure Update Error:", e)
        return jsonify({"message": "Invalid token"}), 400


@farmer_bp.route("/dashboard", methods=["GET"])
@token_required
def dashboard(current_user):
    try:
        crop = request.args.get("crop")
        query = {}

        if crop and crop != "All":
            query["crop"] = crop

        pipeline = []
        if query:
            pipeline.append({"$match": query})

        pipeline.append({
            "$group": {
                "_id": None,
                "totalAdvisories": {"$sum": 1},
                "activeAlerts": {
                    "$sum": {
                        "$cond": [{"$eq": ["$isActive", True]}, 1, 0]
                    }
                },
                "averageConfidence": {"$avg": "$confidence"}
            }
        })

        summary_result = list(db.advisories.aggregate(pipeline))

        summary = {
            "totalAdvisories": 0,
            "activeAlerts": 0,
            "averageConfidence": 0
        }

        if summary_result:
            summary = {
                "totalAdvisories": summary_result[0].get("totalAdvisories", 0),
                "activeAlerts": summary_result[0].get("activeAlerts", 0),
                "averageConfidence": round(summary_result[0].get("averageConfidence", 0), 2)
            }

        latest_adv = db.advisories.find(query).sort("createdAt", -1).limit(1)

        latest = None
        for adv in latest_adv:
            adv["_id"] = str(adv["_id"])
            latest = adv

        return jsonify({
            "summary": summary,
            "latestAdvisory": latest
        }), 200

    except Exception as e:
        print("Dashboard Error:", e)
        return jsonify({"message": "Dashboard fetch failed"}), 500