from flask import Blueprint, request, jsonify
from services.email_service import send_activation_email
from models.user_model import (
    create_user,
    find_user_by_mobile,
    find_user_by_email
)
from werkzeug.security import generate_password_hash, check_password_hash
from config.db import get_db
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
import os
import re

load_dotenv()

auth_bp = Blueprint("auth", __name__)
db = get_db()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise Exception("SECRET_KEY not set in environment variables")

TOKEN_EXPIRY_HOURS = 5


# ======================================================
# HELPER: EMAIL VALIDATION
# ======================================================
def is_valid_email(email):
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return re.match(pattern, email)


# ======================================================
# HELPER: MOBILE VALIDATION (India)
# ======================================================
def is_valid_mobile(mobile):
    return re.match(r"^[6-9]\d{9}$", mobile)


# ======================================================
# ---------------- REGISTER ----------------------------
# ======================================================
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "Invalid input"}), 400

        required_fields = [
            "name", "email", "mobile", "dob",
            "state", "district", "village",
            "regionType", "soilType",
            "landArea", "preferredCrop"
        ]

        for field in required_fields:
            if not data.get(field):
                return jsonify({"message": f"{field} is required"}), 400

        name = data["name"].strip()
        email = data["email"].strip().lower()
        mobile = data["mobile"].strip()

        if not is_valid_email(email):
            return jsonify({"message": "Invalid email format"}), 400

        if not is_valid_mobile(mobile):
            return jsonify({"message": "Invalid mobile number"}), 400

        try:
            land_area = float(data["landArea"])
            if land_area <= 0:
                return jsonify({"message": "Land area must be greater than 0"}), 400
        except:
            return jsonify({"message": "Land area must be numeric"}), 400

        if find_user_by_mobile(mobile):
            return jsonify({"message": "Mobile already registered"}), 409

        if find_user_by_email(email):
            return jsonify({"message": "Email already registered"}), 409

        user = {
            "name": name,
            "email": email,
            "mobile": mobile,
            "dob": data["dob"],
            "state": data["state"],
            "district": data["district"],
            "village": data["village"],
            "regionType": data["regionType"],
            "soilType": data["soilType"],
            "landArea": land_area,
            "preferredCrop": data["preferredCrop"],
            "language": data.get("language", "en"),
            "role": "farmer",
            "status": "pending",
            "passwordHash": None,
            "createdAt": datetime.utcnow()
        }

        create_user(user)

        activation_token = jwt.encode(
            {
                "email": email,
                "type": "activation",
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        activation_link = f"{FRONTEND_URL}/activate/{activation_token}"

        send_activation_email(
            to_email=email,
            activation_link=activation_link,
            language=user["language"],
            name=name
        )

        return jsonify({
            "message": "Registration successful. Please check your email to activate your account."
        }), 201

    except Exception as e:
        print("Register Error:", str(e))
        return jsonify({"message": "Server error"}), 500


# ======================================================
# ---------------- ACTIVATE ACCOUNT --------------------
# ======================================================
@auth_bp.route("/activate", methods=["POST"])
def activate_account():
    try:
        data = request.get_json()

        if not data or not data.get("token") or not data.get("password"):
            return jsonify({"message": "Invalid request"}), 400

        password = data["password"]

        if len(password) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400

        decoded = jwt.decode(data["token"], SECRET_KEY, algorithms=["HS256"])

        if decoded.get("type") != "activation":
            return jsonify({"message": "Invalid activation token"}), 400

        email = decoded["email"]

        user = find_user_by_email(email)
        if not user:
            return jsonify({"message": "User not found"}), 404

        if user.get("status") == "active":
            return jsonify({"message": "Account already activated"}), 400

        password_hash = generate_password_hash(password)

        db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "passwordHash": password_hash,
                    "status": "active",
                    "activatedAt": datetime.utcnow()
                }
            }
        )

        return jsonify({"message": "Account activated successfully"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Activation link expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid activation token"}), 400
    except Exception as e:
        print("Activation Error:", str(e))
        return jsonify({"message": "Server error"}), 500


# ======================================================
# ---------------- LOGIN -------------------------------
# ======================================================
# Only showing login improvement section

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data or not data.get("mobile") or not data.get("password"):
            return jsonify({"message": "Mobile and password required"}), 400

        mobile = data["mobile"].strip()
        password = data["password"]

        if not is_valid_mobile(mobile):
            return jsonify({"message": "Invalid mobile format"}), 400

        user = find_user_by_mobile(mobile)

        if not user:
            return jsonify({"message": "User not found"}), 404

        if user.get("status") != "active":
            return jsonify({"message": "Account not activated"}), 403

        if not check_password_hash(user["passwordHash"], password):
            return jsonify({"message": "Invalid credentials"}), 401

        token = jwt.encode(
            {
                "user_id": str(user["_id"]),
                "role": user["role"],
                "type": "access",  # ✅ important
                "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return jsonify({
            "token": token,
            "user": {
                "_id": str(user["_id"]),
                "name": user["name"],
                "mobile": user["mobile"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:
        print("Login Error:", str(e))
        return jsonify({"message": "Server error"}), 500