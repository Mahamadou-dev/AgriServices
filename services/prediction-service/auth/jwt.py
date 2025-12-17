# File: services/prediction-service/auth/jwt.py
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

security = HTTPBearer()
JWT_SECRET = os.getenv('JWT_SECRET', 'dGhpcy1pcy1hLWxvbmctYW5kLXNlY3VyZS1zZWNyZXQta2V5LWZvci10aGUtanctdC1hdXRoLXNlcnZpY2UtdG8tc2lnbi1hbmQtdmFsaWRhdGUtam9zLTM4')

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify JWT token from Authorization header"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
