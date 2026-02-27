from functools import wraps
from flask import request, jsonify
import jwt
from bson import ObjectId
from config.db import get_db
from config.settings import Config

SECRET_KEY = Config.SECRET_KEY


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Authorization token is missing or invalid format"}), 401

        token = auth_header.split(" ")[1]

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            db = get_db()
            current_user = db.users.find_one(
                {"_id": ObjectId(data.get("user_id"))}
            )

            if not current_user:
                return jsonify({"message": "User not found"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        except Exception:
            return jsonify({"message": "Authentication failed"}), 401

        return f(current_user, *args, **kwargs)

    return decorated