import datetime

def current_timestamp():
    return datetime.datetime.utcnow().isoformat()

def success_response(message, data=None):
    response = {
        "status": "success",
        "message": message
    }
    if data is not None:
        response["data"] = data
    return response

def error_response(message):
    return {
        "status": "error",
        "message": message
    }