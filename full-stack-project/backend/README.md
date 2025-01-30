# FILE: /full-stack-project/full-stack-project/backend/README.md

# Backend API Documentation

## Overview
This backend is built using FastAPI and serves as the API for the full-stack project. It handles requests from the frontend and interacts with the database to manage employee data and performance ratings.

## Setup Instructions

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd full-stack-project/backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Application
To run the FastAPI application, execute the following command:
```
uvicorn app.main:app --reload
```
This will start the server at `http://127.0.0.1:8000`.

### API Documentation
Once the server is running, you can access the interactive API documentation at:
```
http://127.0.0.1:8000/docs
```

## Directory Structure
- `app/`: Contains the main application code.
  - `controllers/`: Business logic for handling requests.
  - `models/`: Data models representing database tables.
  - `routes/`: API route definitions.
  - `schemas/`: Pydantic schemas for request and response validation.
  - `services/`: Service layer logic for database interactions.

## Docker
To build and run the application using Docker, use the following commands:
1. Build the Docker image:
   ```
   docker build -t backend .
   ```

2. Run the Docker container:
   ```
   docker run -d -p 8000:8000 backend
   ```

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.