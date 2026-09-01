from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = Field(default="gabarito", alias="APP_NAME")
    app_env: str = Field(default="local", alias="APP_ENV")


settings = Settings()
