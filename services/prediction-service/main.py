# File: services/prediction-service/main.py

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predictions
import os

# Initialiser l'application FastAPI
app = FastAPI(
    title="Prediction Service API",
    version="1.0.0",
    description="Agricultural yield prediction and risk assessment service"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Prediction Service",
        "version": "1.0.0"
    }

@app.get("/")
def read_root():
    return {
        "message": "Prediction Service is running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Inclure les routes du module predictions.py
app.include_router(predictions.router, prefix="/predictions", tags=["predictions"])

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)