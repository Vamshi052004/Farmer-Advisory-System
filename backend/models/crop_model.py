def crop_schema(crop):
    return {
        "id": str(crop["_id"]),
        "crop_name": crop.get("crop_name"),
        "season": crop.get("season"),
        "ideal_ph": crop.get("ideal_ph"),
        "water_requirement": crop.get("water_requirement")
    }