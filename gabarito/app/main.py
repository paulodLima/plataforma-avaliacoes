from fastapi import FastAPI

from app.api.routes import health
from app.core.settings import settings

app = FastAPI(
    title="Servico de Gabarito",
    description="Servico para processamento futuro de imagens de provas.",
    version="0.1.0",
)

app.include_router(health.router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": settings.app_name,
        "docs": "/docs",
        "health": "/health",
    }
