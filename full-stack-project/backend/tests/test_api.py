# run with pytest tests/test_api.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from main import app  # Adjust import based on project structure
from app.database import get_db, Base
from app.models import models
from app.schemas import schemas

# Create a test database (SQLite in-memory for simplicity)
SQLALCHEMY_DATABASE_URL = "sqlite:///./database/testing_database_copy.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Setup and teardown fixture for database session
@pytest.fixture(scope="function")
def test_db():
    connection = engine.connect()
    transaction = connection.begin()  # Start a transaction

    db = Session(bind=connection)  # Bind the connection to the session

    try:
        yield db  # Provide the session to the test
    finally:
        db.rollback()  # Rollback any changes after test
        connection.close()  # Close connection

# Override the FastAPI dependency to use the test database
@pytest.fixture(scope="function")
def client(test_db):
    def override_get_db():
        print("Using test database session...")
        try:
            yield test_db  # Use the persistent test database
        finally:
            pass  # Do nothing, avoid closing session prematurely

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

# Test GET all employees
def test_get_employees(client, test_db):
    response = client.get("/employees")
    assert response.status_code == 200
    employees = response.json()
    assert isinstance(employees, list)
    assert len(employees) > 0
    assert "name" in employees[0]
    assert "email" in employees[0]
    assert "company_id" in employees[0]
    assert "id" in employees[0]
    assert "title" in employees[0]
    
# # Test GET employee by ID
def test_get_employee(client, test_db):
    employee = models.Employee(name="Bob", email="bobby@example.com", company_id=1, title="Engineer")
    test_db.add(employee)
    test_db.commit()
    test_db.refresh(employee)
    
    response = client.get(f"/employees/{employee.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Bob"

# # Test GET employee by invalid ID
def test_get_employee_invalid_id(client, test_db):
    response = client.get("/employees/999")
    assert response.status_code == 404

# # Test GET all companies
def test_get_companies(client, test_db):
    response = client.get("/companies")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

# # Test GET company by ID
def test_get_company(client, test_db):
    company = models.Company(name="TestCorp")
    test_db.add(company)
    test_db.commit()
    test_db.refresh(company)
    
    response = client.get(f"/companies/{company.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "TestCorp"
    
# # Test GET company by invalid ID
def test_get_company_invalid_id(client, test_db):
    response = client.get("/companies/999")
    assert response.status_code == 404
    
# # Test GET employees by company ID
def test_get_employees_by_company(client, test_db):
    company = models.Company(name="TestCorp")
    test_db.add(company)
    test_db.commit()
    test_db.refresh(company)

    employee = models.Employee(name="Bob", email="bobby@example.com", company_id=company.id, title="Engineer")
    test_db.add(employee)
    test_db.commit()
    test_db.refresh(employee)
    
    response = client.get(f"/companies/{company.id}/employees")
    assert response.status_code == 200
    assert response.json()[0]["name"] == "Bob"

# # Test GET performance metrics by employee ID
def test_get_performance_metrics(client, test_db):
    response = client.get("/employees/4/performance_metrics")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

# # Test POST new company
def test_create_company(client, test_db):
    company_data = {"name": "BizQuest"}
    response = client.post("/companies", json=company_data)
    assert response.status_code == 200
    assert response.json()["name"] == "BizQuest"
    
# # Test creating a company with existing name
def test_create_company_duplicate_name(client, test_db):
    company_data = {"name": "BizQuest"}
    client.post("/companies", json=company_data)
    response = client.post("/companies", json=company_data)
    assert response.status_code == 400

# # Test POST new employee
def test_create_employee(client, test_db):
    employee_data = {"name": "Alice", "email": "alice@example.com", "company_id": 1, "title": "Engineer"}
    response = client.post("/employees", json=employee_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Alice"

# # Test creating an employee with existing email
def test_create_employee_duplicate_email(client, test_db):
    employee_data = {"name": "Alice", "email": "alice@example.com", "company_id": 1, "title": "Engineer"}
    client.post("/employees", json=employee_data)
    response = client.post("/employees", json=employee_data)
    assert response.status_code == 400



# # Test PUT update employee
def test_update_employee(client, test_db):
    employee = models.Employee(name="Charlie", email="charlie@example.com", company_id=1, title= "Engineer")
    test_db.add(employee)
    test_db.commit()
    test_db.refresh(employee)
    
    update_data = {"name": "Charlie Updated", "email": "charlie_updated@example.com", "company_id" : 1, "title": "Engineer"}
    response = client.put(f"/employees/{employee.id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Charlie Updated"

# # Test updating a non-existent employee
def test_update_employee_not_found(client, test_db):
    update_data = {"name": "Ghost", "email": "ghost@example.com", "title": "Engineer", "company_id": 1}
    response = client.put("/employees/999", json=update_data)
    assert response.status_code == 404



# Run all tests
if __name__ == "__main__":
    pytest.main()
