from flask import jsonify

def api_response(data, status=200):
    return jsonify(data), status