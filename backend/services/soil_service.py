def get_soil_recommendation(soil_type):
    """
    Soil-based fertilizer recommendation
    """

    if not soil_type:
        return "Soil type not provided"

    recommendations = {
        "red": "Use organic compost and nitrogen-rich fertilizer",
        "black": "Use phosphorus-rich fertilizer",
        "sandy": "Increase irrigation frequency and add organic matter"
    }

    return recommendations.get(
        soil_type.lower(),
        "General soil care recommended"
    )