import requests
import os

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

BRAND_COLOR = "#2e7d32"
ACCENT_COLOR = "#66bb6a"


def send_email(payload):

    if not BREVO_API_KEY or not SENDER_EMAIL:
        print("Email service not configured properly")
        return 500

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        return response.status_code
    except Exception as e:
        print("Email sending failed:", str(e))
        return 500


def send_activation_email(to_email, activation_link, language="en", name="Farmer"):

    subject = "🌾 Activate Your Smart Farmer Account"

    html_content = f"""
    <h2>Hello {name} 👋</h2>
    <p>Please activate your account:</p>
    <a href="{activation_link}">Activate Now</a>
    """

    payload = {
        "sender": {"email": SENDER_EMAIL, "name": "Smart Farmer Advisory"},
        "to": [{"email": to_email, "name": name}],
        "subject": subject,
        "htmlContent": html_content
    }

    return send_email(payload)


def send_activation_reminder(to_email, activation_link, name="Farmer"):

    subject = "⏳ Reminder: Activate Your Account"

    html_content = f"""
    <h2>Hello {name}</h2>
    <p>Please activate your account:</p>
    <a href="{activation_link}">Activate Now</a>
    """

    payload = {
        "sender": {"email": SENDER_EMAIL, "name": "Smart Farmer Advisory"},
        "to": [{"email": to_email, "name": name}],
        "subject": subject,
        "htmlContent": html_content
    }

    return send_email(payload)


def send_profile_update_link(to_email, name, update_link):

    subject = "✅ Profile Update Access Granted"

    html_content = f"""
    <h2>Hello {name} 👋</h2>
    <p>Your profile update request has been approved.</p>
    <p>Click below to update your profile:</p>
    <a href="{update_link}"
       style="background:{ACCENT_COLOR};
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:6px;">
       Update Profile
    </a>
    <p>This link expires in 1 hour.</p>
    """

    payload = {
        "sender": {"email": SENDER_EMAIL, "name": "Smart Farmer Advisory"},
        "to": [{"email": to_email, "name": name}],
        "subject": subject,
        "htmlContent": html_content
    }

    return send_email(payload)