from fastapi import FastAPI
from .routes import employee_router, metrics_router

# Create the FastAPI application
app = FastAPI(
    title="Organization Chart API",
    description="API for managing organizational structure and employee performance",
    version="1.0.0"
)

# Include our route modules
app.include_router(employee_router)
app.include_router(metrics_router)

# This makes these items available when someone imports from the app package
__all__ = ['app']
