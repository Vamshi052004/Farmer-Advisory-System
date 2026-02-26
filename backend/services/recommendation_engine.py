from ml.irrigation_model import irrigation_recommendation
from ml.pest_disease_model import predict_pest_risk
from ml.crop_yield_prediction import predict_crop_yield

def generate_recommendation(data):
    """
    Central advisory logic combining ML outputs
    """
    irrigation = irrigation_recommendation(
        data.get("soil_moisture"),
        data.get("temperature")
    )

    pest = predict_pest_risk(
        data.get("temperature"),
        data.get("humidity")
    )

    yield_prediction = predict_crop_yield(
        data.get("crop"),
        data.get("area"),
        data.get("rainfall")
    )

    return {
        "irrigation": irrigation,
        "pest": pest,
        "expected_yield": yield_prediction
    }