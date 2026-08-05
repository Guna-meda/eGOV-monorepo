from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.predict import router as predict_router
from app.model_loader import ModelLoader

app = FastAPI(
    title="Severity Service",
    description="ML-based Severity Prediction Service",
    version="2.0.0"
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Startup
# =====================================================

@app.on_event("startup")
async def startup():

    print("\nStarting Severity Service...\n")

    try:

        ModelLoader.load()

        print("Severity Service Ready.\n")

    except Exception as e:

        print("\nFailed to load ML artifacts.\n")

        print(e)

        raise

# =====================================================
# Root Endpoint
# =====================================================

@app.get("/")
async def root():

    return {

        "service": "Severity Service",

        "version": "2.0.0",

        "status": "Running"

    }

# =====================================================
# Health Endpoint
# =====================================================

@app.get("/health")
async def health():

    return {

        "status": "healthy",

        "model_loaded": ModelLoader._model is not None,

        "embedder_loaded": ModelLoader._embedder is not None

    }

# =====================================================
# Register Routers
# =====================================================

app.include_router(predict_router)