def test_farmer_profile_unauthorized(client):
    response = client.get("/api/farmer/profile")
    assert response.status_code == 401