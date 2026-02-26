def test_login(client):
    response = client.post("/api/auth/login", json={
        "mobile": "9999999999"
    })

    assert response.status_code in [200, 404]