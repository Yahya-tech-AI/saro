
"""
Aro Mini v0.1 — API server
FastAPI + PyTorch
"""

import os
import logging
from contextlib import asynccontextmanager

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from model import DEVICE, load_model, generate_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aro-mini")

# Load the model once when the server starts.
model = None
stoi = None
itos = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, stoi, itos

    logger.info("Loading Aro Mini...")

    try:
        model, stoi, itos = load_model()
        logger.info("Aro Mini loaded on %s", DEVICE)
    except Exception:
        logger.exception("Failed to load Aro Mini")
        raise

    yield

    model = None
    stoi = None
    itos = None
    logger.info("Aro Mini server stopped")


app = FastAPI(
    title="Aro Mini API",
    description="Inference API for Aro Mini v0.1 by Aro.",
    version="0.1.0",
    lifespan=lifespan,
)


class GenerateRequest(BaseModel):
    prompt: str = Field(
        min_length=1,
        max_length=2000,
        description="Text prompt for Aro Mini",
    )
    max_new_tokens: int = Field(
        default=200, ge=1, le=500
    )
    temperature: float = Field(
        default=0.8, gt=0, le=2.0
    )
    top_k: int = Field(
        default=20, ge=1, le=100
    )


class GenerateResponse(BaseModel):
    model: str
    response: str
    device: str


@app.get("/")
def root():
    return {
        "name": "Aro Mini",
        "version": "0.1.0",
        "status": "online" if model is not None else "loading",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy" if model is not None else "loading",
        "model_loaded": model is not None,
        "device": str(DEVICE),
    }


@app.get("/v1/models")
def list_models():
    return {
        "object": "list",
        "data": [
            {
                "id": "aro-mini-v0.1",
                "object": "model",
                "owned_by": "aro",
                "status": (
                    "ready" if model is not None else "loading"
                ),
            }
        ],
    }


@app.post("/v1/generate", response_model=GenerateResponse)
def generate(request: GenerateRequest):
    if model is None or stoi is None or itos is None:
        raise HTTPException(
            status_code=503,
            detail="Aro Mini is not ready",
        )

    try:
        with torch.inference_mode():
            result = generate_text(
                model=model,
                stoi=stoi,
                itos=itos,
                prompt=request.prompt,
                max_new_tokens=request.max_new_tokens,
                temperature=request.temperature,
                top_k=request.top_k,
            )

        # Return only the generated continuation.
        # The model output also contains its input prompt.
        continuation = result[len(request.prompt):]

        return GenerateResponse(
            model="aro-mini-v0.1",
            response=continuation,
            device=str(DEVICE),
        )

    except Exception:
        logger.exception("Generation failed")
        raise HTTPException(
            status_code=500,
            detail="Aro Mini generation failed",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host=os.getenv("ARO_HOST", "127.0.0.1"),
        port=int(os.getenv("ARO_PORT", "8000")),
        reload=False,
    )
