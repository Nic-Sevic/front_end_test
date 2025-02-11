from . import models, routes
from .database import engine

# Create the FastAPI application


# Include our route modules
# app.include_router(employee_router)
# app.include_router(metrics_router)

# This makes these items available when someone imports from the app package
__all__ = ['app']

# Create database tables
models.Base.metadata.create_all(bind=engine)
