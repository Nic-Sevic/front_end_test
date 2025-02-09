from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.employee import Employee
from ..schemas.employee import EmployeeCreate, Employee as EmployeeSchema
from sqlalchemy import or_

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("/", response_model=EmployeeSchema)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee."""
    # Check if manager exists if manager_id is provided
    if employee.manager_id:
        manager = db.query(Employee).filter(Employee.id == employee.manager_id).first()
        if not manager:
            raise HTTPException(status_code=404, detail="Manager not found")

    # Check if email already exists
    existing_employee = db.query(Employee).filter(Employee.email == employee.email).first()
    if existing_employee:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.get("/", response_model=List[EmployeeSchema])
def get_employees(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search by name, title, or department"),
    department: Optional[str] = Query(None, description="Filter by department"),
    db: Session = Depends(get_db)
):
    """Get all employees with optional filtering."""
    query = db.query(Employee)
    
    if search:
        query = query.filter(
            or_(
                Employee.name.ilike(f"%{search}%"),
                Employee.title.ilike(f"%{search}%"),
                Employee.department.ilike(f"%{search}%")
            )
        )
    
    if department:
        query = query.filter(Employee.department == department)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{employee_id}", response_model=EmployeeSchema)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get a specific employee by ID."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/{employee_id}", response_model=EmployeeSchema)
def update_employee(
    employee_id: int,
    employee_update: EmployeeCreate,
    db: Session = Depends(get_db)
):
    """Update an employee's information."""
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if new manager exists if manager_id is being updated
    if employee_update.manager_id:
        manager = db.query(Employee).filter(Employee.id == employee_update.manager_id).first()
        if not manager:
            raise HTTPException(status_code=404, detail="Manager not found")
        
        # Prevent circular management relationships
        if employee_id == employee_update.manager_id:
            raise HTTPException(status_code=400, detail="An employee cannot be their own manager")

    # Update employee attributes
    for key, value in employee_update.model_dump().items():
        setattr(db_employee, key, value)

    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    """Delete an employee."""
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if employee has subordinates
    if db_employee.subordinates:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete employee with subordinates. Please reassign subordinates first."
        )
    
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}

@router.get("/{employee_id}/subordinates", response_model=List[EmployeeSchema])
def get_subordinates(employee_id: int, db: Session = Depends(get_db)):
    """Get all direct subordinates of an employee."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee.subordinates

@router.get("/{employee_id}/chain", response_model=List[EmployeeSchema])
def get_management_chain(employee_id: int, db: Session = Depends(get_db)):
    """Get the management chain above an employee."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    chain = []
    current = employee.manager
    while current is not None:
        chain.append(current)
        current = current.manager
    
    return chain
