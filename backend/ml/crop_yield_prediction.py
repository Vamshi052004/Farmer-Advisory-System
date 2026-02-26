def predict_crop_yield(crop, area, rainfall):
    """
    Simple rule-based yield prediction (placeholder for ML model)
    """

    base_yield = {
        "rice": 30,
        "wheat": 25,
        "maize": 20,
        "tomato": 18
    }

    yield_per_acre = base_yield.get(crop.lower(), 15)

    if rainfall < 400:
        yield_per_acre *= 0.8
    elif rainfall > 800:
        yield_per_acre *= 1.1

    total_yield = yield_per_acre * area

    return round(total_yield, 2)