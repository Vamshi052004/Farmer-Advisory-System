def test_get_advisory(client):
    response = client.get("/api/advisory/")
    assert response.status_code == 200