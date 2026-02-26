def advisory_schema(advisory):
    return {
        "id": str(advisory["_id"]),
        "crop": advisory.get("crop"),
        "irrigation": advisory.get("irrigation"),
        "fertilizer": advisory.get("fertilizer"),
        "pest_alert": advisory.get("pest_alert"),
        "date": advisory.get("date")
    }