def get_crop_health(ndvi_value):
    """
    NDVI-based crop health analysis (placeholder)
    """

    if ndvi_value is None:
        return "NDVI data not available"

    try:
        ndvi_value = float(ndvi_value)
    except:
        return "Invalid NDVI value"

    if ndvi_value > 0.7:
        return "Healthy crop"
    elif ndvi_value > 0.4:
        return "Moderate crop health"
    else:
        return "Poor crop health"