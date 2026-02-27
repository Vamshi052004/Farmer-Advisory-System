from functools import wraps
from flask import jsonify


def role_required(required_roles):

    if isinstance(required_roles, str):
        required_roles = [required_roles]

    def wrapper(f):
        @wraps(f)
        def decorated(current_user, *args, **kwargs):

            user_role = current_user.get("role")

            if user_role not in required_roles:
                return jsonify({
                    "message": "Access denied. Insufficient permissions."
                }), 403

            return f(current_user, *args, **kwargs)

        return decorated

    return wrapper