from flask import Blueprint, jsonify, request
from middlewares.auth_middleware import token_required
from config.db import get_db
from bson import ObjectId
from datetime import datetime, timedelta
import jwt
import os

from services.email_service import send_profile_update_link

admin_bp = Blueprint("admin", __name__)
db = get_db()


# =========================================
# HELPER: CHECK ADMIN ROLE
# =========================================
def is_admin(user):
    return user.get("role") == "admin"


# =========================================
# ADMIN DASHBOARD
# =========================================
@admin_bp.route("/dashboard", methods=["GET"])
@token_required
def admin_dashboard(current_user):

    if not is_admin(current_user):
        return jsonify({"message": "Access denied. Admin only."}), 403

    return jsonify({
        "summary": {
            "totalUsers": db.users.count_documents({}),
            "totalFarmers": db.users.count_documents({"role": "farmer"}),
            "totalAdmins": db.users.count_documents({"role": "admin"}),
            "totalAdvisories": db.advisories.count_documents({}),
            "activeAdvisories": db.advisories.count_documents({"isActive": True}),
            "pendingProfileRequests": db.profile_update_requests.count_documents({"status": "pending"})
        }
    })


# =========================================
# GET ALL PROFILE UPDATE REQUESTS
# =========================================
@admin_bp.route("/profile-update-requests", methods=["GET"])
@token_required
def get_profile_update_requests(current_user):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    status = request.args.get("status")  # pending / approved / completed / rejected
    search = request.args.get("search", "")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 5))

    query = {}

    if status and status != "all":
        query["status"] = status

    requests_cursor = db.profile_update_requests.find(query).sort("requestedAt", -1)

    requests_list = list(requests_cursor)

    formatted = []

    for req in requests_list:
        user = db.users.find_one({"_id": req["userId"]})

        user_name = user.get("name") if user else "Unknown"

        if search and search.lower() not in user_name.lower():
            continue

        formatted.append({
            "_id": str(req["_id"]),
            "userName": user_name,
            "status": req.get("status", "pending"),
            "requestedAt": req.get("requestedAt")
        })

    total = len(formatted)

    start = (page - 1) * limit
    end = start + limit

    return jsonify({
        "total": total,
        "page": page,
        "limit": limit,
        "data": formatted[start:end]
    })

# =========================================
# APPROVE PROFILE UPDATE
# =========================================
@admin_bp.route("/approve-profile-update/<request_id>", methods=["POST"])
@token_required
def approve_profile_update(current_user, request_id):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    request_data = db.profile_update_requests.find_one(
        {"_id": ObjectId(request_id)}
    )

    if not request_data:
        return jsonify({"message": "Request not found"}), 404

    user = db.users.find_one({"_id": request_data["userId"]})

    if not user:
        return jsonify({"message": "User not found"}), 404

    SECRET_KEY = os.getenv("SECRET_KEY")
    FRONTEND_URL = os.getenv("FRONTEND_URL")

    update_token = jwt.encode(
        {
            "userId": str(user["_id"]),
            "requestId": request_id,
            "exp": datetime.utcnow() + timedelta(hours=1)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    update_link = f"{FRONTEND_URL}/profile-update/{update_token}"

    send_profile_update_link(
        to_email=user["email"],
        name=user.get("name", "Farmer"),
        update_link=update_link
    )

    db.profile_update_requests.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": "approved",
                "approvedAt": datetime.utcnow(),
                "updateToken": update_token
            }
        }
    )

    return jsonify({"message": "Update link sent successfully"}), 200


# =========================================
# REJECT PROFILE UPDATE
# =========================================
@admin_bp.route("/reject-profile-update/<request_id>", methods=["POST"])
@token_required
def reject_profile_update(current_user, request_id):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    db.profile_update_requests.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": "rejected",
                "rejectedAt": datetime.utcnow()
            }
        }
    )

    return jsonify({"message": "Profile update request rejected"}), 200


# =========================================
# (ALL YOUR EXISTING ROUTES BELOW — UNCHANGED)
# =========================================
# GET ALL FARMERS
@admin_bp.route("/farmers", methods=["GET"])
@token_required
def get_all_farmers(current_user):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    farmers = list(db.users.find({"role": "farmer"}))

    for farmer in farmers:
        farmer["_id"] = str(farmer["_id"])
        farmer.pop("passwordHash", None)

    return jsonify(farmers)


# DELETE FARMER
@admin_bp.route("/farmer/<id>", methods=["DELETE"])
@token_required
def delete_farmer(current_user, id):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    db.users.delete_one({"_id": ObjectId(id)})

    return jsonify({"message": "Farmer deleted successfully"})


# =========================================
# GET ALL ADVISORIES
# =========================================
@admin_bp.route("/advisories", methods=["GET"])
@token_required
def get_all_advisories(current_user):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    advisories = list(db.advisories.find().sort("createdAt", -1))

    for adv in advisories:
        adv["_id"] = str(adv["_id"])

    return jsonify(advisories), 200


# =========================================
# ADD NEW ADVISORY
# =========================================
@admin_bp.route("/advisories", methods=["POST"])
@token_required
def add_advisory(current_user):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.json

    required_fields = ["crop", "title", "message", "confidence"]

    if not data or not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    new_advisory = {
        "crop": data["crop"],
        "title": data["title"],
        "message": data["message"],
        "confidence": float(data["confidence"]),
        "isActive": data.get("isActive", True),
        "createdAt": datetime.utcnow()
    }

    db.advisories.insert_one(new_advisory)

    return jsonify({"message": "Advisory added successfully"}), 201


# =========================================
# UPDATE ADVISORY
# =========================================
@admin_bp.route("/advisories/<id>", methods=["PUT"])
@token_required
def update_advisory(current_user, id):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.json

    try:
        update_data = {
            "crop": data.get("crop"),
            "title": data.get("title"),
            "message": data.get("message"),
            "confidence": float(data.get("confidence")),
            "isActive": data.get("isActive", True),
            "updatedAt": datetime.utcnow()
        }

        db.advisories.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )

        return jsonify({"message": "Advisory updated successfully"}), 200

    except Exception as e:
        print("Update Advisory Error:", e)
        return jsonify({"message": "Invalid advisory ID"}), 400


# =========================================
# DELETE ADVISORY
# =========================================
@admin_bp.route("/advisories/<id>", methods=["DELETE"])
@token_required
def delete_advisory(current_user, id):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    try:
        db.advisories.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Advisory deleted successfully"}), 200
    except:
        return jsonify({"message": "Invalid advisory ID"}), 400

# DELETE ALL PROFILE UPDATE REQUESTS (DEV ONLY)
@admin_bp.route("/delete-all-profile-requests", methods=["DELETE"])
@token_required
def delete_all_profile_requests(current_user):

    if not is_admin(current_user):
        return jsonify({"message": "Unauthorized"}), 403

    result = db.profile_update_requests.delete_many({})

    return jsonify({
        "message": "All profile update requests deleted",
        "deletedCount": result.deleted_count
    })