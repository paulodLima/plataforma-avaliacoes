from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.settings import settings
from app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="UP",
        service=settings.app_name,
        timestamp=datetime.now(timezone.utc),
    )
