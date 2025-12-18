from fastapi import FastAPI
from pydantic import BaseModel
from routers import predictions
import uvicorn

app = FastAPI(
    title="Prediction Service",
    description="Agricultural yield prediction and risk assessment API",
    version="1.0.0"
)

# Include the predictions router with /predict prefix to match gateway routing
app.include_router(predictions.router, prefix="/api/predict", tags=["predictions"])

class HelloResponse(BaseModel):
    service: str
    message: str
    status: str

@app.get("/")
async def root():
    return {
        "message": "Prediction Service API",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/api/predict/hello", response_model=HelloResponse)
async def hello():
    return {
        "service": "Prediction Service",
        "message": "Hello World from Prediction Service!",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "prediction-service"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
