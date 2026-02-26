from config.db import get_db
from datetime import datetime

db = get_db()

def create_user(user):
    user["createdAt"] = datetime.utcnow()
    return db.users.insert_one(user)

def find_user_by_mobile(mobile):
    return db.users.find_one({"mobile": mobile})

def find_user_by_email(email):
    return db.users.find_one({"email": email})