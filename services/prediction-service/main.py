# File: services/prediction-service/main.py

import uvicorn
from fastapi import FastAPI
from routers import predictions

# Initialiser l'application FastAPI
app = FastAPI(title="Prediction Service API", version="1.0.0")

# Inclure les routes du module predictions.py
app.include_router(predictions.router, prefix="/predictions", tags=["predictions"])

@app.get("/")
def read_root():
    return {"message": "Prediction Service is running on port 8000"}

if __name__ == "__main__":
    # Exécute l'application avec Uvicorn sur le port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)