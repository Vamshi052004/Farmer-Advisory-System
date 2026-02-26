def predict_pest_risk(temp, humidity):
    if temp > 28 and humidity > 70:
        return "High pest risk"
    return "Low pest risk"
