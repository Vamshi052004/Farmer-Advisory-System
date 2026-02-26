from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import jwt
from apscheduler.schedulers.background import BackgroundScheduler

from config.settings import Config
from config.db import get_db
from middlewares.error_handler import register_error_handlers

from routes.auth_routes import auth_bp
from routes.farmer_routes import farmer_bp
from routes.advisory_routes import advisory_bp
from routes.weather_routes import weather_bp
from routes.admin_routes import admin_bp
from routes.ai_routes import ai_bp
from routes.market_routes import market_bp

from services.email_service import send_activation_reminder

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ GLOBAL CORS FIX (handles OPTIONS automatically)
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True
    )

    register_error_handlers(app)

    # ==============================
    # REGISTER BLUEPRINTS
    # ==============================
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(farmer_bp, url_prefix="/api/farmer")
    app.register_blueprint(advisory_bp, url_prefix="/api/advisory")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(market_bp, url_prefix="/api/market")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.route("/")
    def health_check():
        return {"status": "Backend running successfully 🚀"}

    start_scheduler()

    return app


# ==============================
# ACTIVATION REMINDER SCHEDULER
# ==============================
def check_pending_users():
    db = get_db()
    SECRET_KEY = os.getenv("SECRET_KEY")
    FRONTEND_URL = os.getenv("FRONTEND_URL")

    twelve_hours_ago = datetime.utcnow() - timedelta(hours=12)

    pending_users = db.users.find({
        "status": "pending",
        "createdAt": {"$lte": twelve_hours_ago}
    })

    for user in pending_users:
        try:
            activation_token = jwt.encode(
                {
                    "email": user["email"],
                    "exp": datetime.utcnow() + timedelta(hours=12)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

            activation_link = f"{FRONTEND_URL}/activate/{activation_token}"

            send_activation_reminder(
                to_email=user["email"],
                activation_link=activation_link,
                name=user.get("name", "Farmer")
            )

            print(f"Reminder email sent to {user['email']}")

        except Exception as e:
            print("Reminder Error:", e)


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_pending_users, "interval", hours=6)
    scheduler.start()
    print("Activation reminder scheduler started 🚀")


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)