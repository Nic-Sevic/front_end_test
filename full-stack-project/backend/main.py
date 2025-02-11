from fastapi import FastAPI
import app.routes.routes as routes
import app


app = FastAPI(
    title="Organization Chart API",
    description="API for managing organizational structure and employee performance",
    version="1.0.0"
)

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"status": "API is running"}
