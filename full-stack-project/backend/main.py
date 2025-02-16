from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.routes.routes as routes
import app


app = FastAPI(
    title="Organization Chart API",
    description="API for managing organizational structure and employee performance",
    version="1.0.0"
)

# Configure CORS - need to update for production
origins = [
    "http://localhost:3002",
	"http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"status": "API is running"}
