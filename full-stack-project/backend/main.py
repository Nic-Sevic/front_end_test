from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt import PyJWTError as JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import app.routes.routes as routes
import app
from app.database import SessionLocal, engine
from app.models import models
from sqlalchemy.orm import Session
from app.database import get_db

# TODO Secret key to encode the JWT token
# SHOULD NOT BE HARDCODED IN PRODUCTION
# SHOULD BE STORED IN ENVIRONMENT VARIABLES
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(
    title="Organization Chart API",
    description="API for managing organizational structure and employee performance",
    version="1.0.0"
)

# Configure CORS - need to update for production
origins = [
    "https://localhost:8000",
    "https://localhost:3000"
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

# Utility functions for authentication
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=5)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.email == username).first()
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

# TODO move this to routes.py
@app.post("/token") 
async def login_for_access_token(response: Response, form_data: 
    OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="Lax")
    return {"company_id": user.company_id, "company_name": db.query(models.Company).filter(models.Company.id == user.company_id).first().name}

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")  # This removes the HTTP-only cookie
    return {"message": "Logged out"}
