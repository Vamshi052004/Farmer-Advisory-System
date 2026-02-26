def validate_mobile(mobile):
    if not mobile:
        return False
    return mobile.isdigit() and len(mobile) == 10

def validate_required_fields(data, fields):
    for field in fields:
        if field not in data or not data[field]:
            return False, field
    return True, None