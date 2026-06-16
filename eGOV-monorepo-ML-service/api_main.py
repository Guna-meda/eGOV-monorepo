from fastapi import FastAPI

from src.api.routes import router


app = FastAPI(
    title="Smart Grievance ML API",
    description="AI-powered grievance analysis service",
    version="1.0.0"
)


app.include_router(router)


@app.get("/")
def health_check():

    return {
        "status": "running",
        "service": "Smart Grievance ML API",
        "version": "1.0.0"
    }