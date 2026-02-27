from ml.irrigation_model import irrigation_recommendation
from ml.pest_disease_model import predict_pest_risk
from ml.crop_yield_prediction import predict_crop_yield


def generate_recommendation(data):
    """
    Central advisory logic combining ML outputs
    """

    try:
        irrigation = irrigation_recommendation(
            float(data.get("soil_moisture", 0)),
            float(data.get("temperature", 0))
        )

        pest = predict_pest_risk(
            float(data.get("temperature", 0)),
            float(data.get("humidity", 0))
        )

        yield_prediction = predict_crop_yield(
            data.get("crop"),
            float(data.get("area", 0)),
            float(data.get("rainfall", 0))
        )

        return {
            "irrigation": irrigation,
            "pest": pest,
            "expected_yield": yield_prediction
        }

    except Exception as e:
        print("Recommendation Engine Error:", str(e))
        return {
            "error": "Failed to generate recommendation"
        }