import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.db import get_db
from werkzeug.security import generate_password_hash
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

db = get_db()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@farm.com")
ADMIN_MOBILE = os.getenv("ADMIN_MOBILE", "6907543891")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not ADMIN_PASSWORD:
    print("❌ ADMIN_PASSWORD not set in environment variables.")
    print("👉 Please set ADMIN_PASSWORD in your .env file")
    sys.exit(1)

admin_user = {
    "name": "Super Admin",
    "email": ADMIN_EMAIL.lower(),
    "mobile": ADMIN_MOBILE,
    "passwordHash": generate_password_hash(ADMIN_PASSWORD),
    "role": "admin",
    "status": "active",
    "createdAt": datetime.utcnow()
}

try:
    existing_admin = db.users.find_one({
        "$or": [
            {"email": ADMIN_EMAIL.lower()},
            {"mobile": ADMIN_MOBILE}
        ]
    })

    if existing_admin:
        print("⚠ Admin already exists.")
    else:
        db.users.insert_one(admin_user)
        print("✅ Admin created successfully.")

except Exception as e:
    print("❌ Error creating admin:", str(e))