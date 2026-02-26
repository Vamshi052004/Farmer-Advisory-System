def irrigation_recommendation(soil_moisture, temperature):
    if soil_moisture < 30 and temperature > 30:
        return "High irrigation required"
    elif soil_moisture < 40:
        return "Moderate irrigation"
    return "No irrigation needed"