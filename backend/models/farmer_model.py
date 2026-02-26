def farmer_schema(farmer):
    return {
        "id": str(farmer["_id"]),
        "name": farmer.get("name"),
        "mobile": farmer.get("mobile"),
        "location": farmer.get("location"),
        "crop": farmer.get("crop"),
        "land_size": farmer.get("land_size"),
        "soil_type": farmer.get("soil_type")
    }