# test_api.py
import requests

BASE = "http://localhost:8000"

def test_list_designations(token):
    url = f"{BASE}/api/designations/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type":  "application/json",
    }
    resp = requests.get(url, headers=headers)
    print("STATUS:", resp.status_code)
    print("DATA:", resp.json())

def test_create_designation(token):
    url = f"{BASE}/api/designations/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type":  "application/json",
    }
    payload = {
        "name": "New Role",
        "description": "Created via script",
        # … any other required fields
    }
    resp = requests.post(url, json=payload, headers=headers)
    print("STATUS:", resp.status_code)
    print("DATA:", resp.json())

if __name__ == "__main__":
    # If you need to first log in and fetch a token:
    auth = requests.post(f"{BASE}/api/token/", json={
        "username": "admin",
        "password": "secret",
    }).json()
    token = auth["access"]

    test_list_designations(token)
    test_create_designation(token)


# in pure python
# import json
# from http.client import HTTPConnection

# BASE_HOST = "localhost"
# BASE_PORT = 8000

# def do_request(method, path, token=None, body=None):
#     conn = HTTPConnection(BASE_HOST, BASE_PORT)
#     headers = {"Content-Type": "application/json"}
#     if token:
#         headers["Authorization"] = f"Bearer {token}"
#     body_bytes = json.dumps(body).encode("utf-8") if body is not None else None
#     conn.request(method, path, body=body_bytes, headers=headers)
#     resp = conn.getresponse()
#     data = resp.read().decode("utf-8")
#     try:
#         data = json.loads(data)
#     except ValueError:
#         pass
#     print(f"\n→ {method} {path}\n  → {resp.status} {resp.reason}\n  → {data}")
#     conn.close()
#     return data

# if __name__ == "__main__":
#     # 1) get a JWT token
#     auth = do_request(
#         "POST",
#         "/api/token/",
#         body={"username": "admin", "password": "secret"}
#     )
#     token = auth.get("access")

#     # 2) list designations
#     do_request("GET", "/api/designations/", token=token)

#     # 3) create one
#     do_request("POST", "/api/designations/", token=token, body={
#         "name": "Std-lib Role",
#         "description": "Created without requests",
#     })
