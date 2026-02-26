import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.db import get_db
from werkzeug.security import generate_password_hash
from datetime import datetime

db = get_db()

admin_user = {
    "name": "Super Admin",
    "email": "admin@farm.com",
    "mobile": "6907543891",
    "passwordHash": generate_password_hash("admin123"),
    "role": "admin",
    "status": "active",
    "createdAt": datetime.utcnow()
}

# Prevent duplicate admin
if db.users.find_one({"mobile": "9999999999"}):
    print("⚠ Admin already exists")
else:
    db.users.insert_one(admin_user)
    print("✅ Admin created successfully")
