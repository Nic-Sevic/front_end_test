# FILE: /full-stack-project/full-stack-project/backend/app/routes/__init__.py

from fastapi import APIRouter

router = APIRouter()

# Import your route handlers here
# from . import your_route_file

# Example route
# @router.get("/example")
# async def example_route():
#     return {"message": "This is an example route"}

# Include the router in the main application
# def include_routes(app):
#     app.include_router(router)