# File: services/prediction-service/auth/jwt.py
import jwt
import os
import sys
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

# SECURITY: JWT_SECRET must be provided via environment variable
JWT_SECRET = os.getenv('JWT_SECRET')
if not JWT_SECRET:
    print('❌ CRITICAL: JWT_SECRET environment variable is not set!', file=sys.stderr)
    print('   The application cannot start without a valid JWT secret.', file=sys.stderr)
    sys.exit(1)

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
