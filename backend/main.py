
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Annotated
import math
from fastapi import HTTPException

app = FastAPI(
    title="CheckMyHeart API",
    description="API d'analyse de signaux ECG",
    version="0.1.0"
)

# Autoriser notre frontend React à communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class ECGPoint(BaseModel):
    time: float
    ecg: float


class ECGRequest(BaseModel):
    points: Annotated[list[ECGPoint], Field(min_length=2)]


@app.get("/")
def home():
    return {
        "message": "Bienvenue sur l'API CheckMyHeart"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/api/status")
def api_status():
    return {
        "status": "online",
        "service": "CheckMyHeart API"
    }


@app.post("/api/ecg/analyze")
def analyze_ecg(request: ECGRequest):
    points = request.points
    times = [point.time for point in points]
    amplitudes = [point.ecg for point in points]

    if not all(math.isfinite(value) for value in times + amplitudes):
        raise HTTPException(
            status_code=400,
            detail="Le signal contient des valeurs non valides."
        )

    for i in range(1, len(times)):
        if times[i] <= times[i - 1]:
            raise HTTPException(
                status_code=400,
                detail="Les valeurs de temps doivent être croissantes."
            )

    duration = times[-1] - times [0]

    return {
            "point_count" : len(points),
            "duration" : duration,
            "min_amplitude" : min(amplitudes),
            "max_amplitude": max(amplitudes),
            "mean_amplitude": sum(amplitudes) / len(amplitudes)
        }