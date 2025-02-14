from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import models
from ..schemas import schemas

router = APIRouter()

# GET all employees
@router.get("/employees", response_model=List[schemas.Employee])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    return employees

# GET Company by ID
@router.get("/companies/{company_id}", response_model=schemas.Company)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

# GET all companies
@router.get("/companies", response_model=List[schemas.Company])
def get_companies(db: Session = Depends(get_db)):
	companies = db.query(models.Company).all()
	return companies

# GET employees by company ID
@router.get("/companies/{company_id}/employees", response_model=List[schemas.Employee])
def get_employees_by_company(company_id: int, db: Session = Depends(get_db)):
	employees = db.query(models.Employee).filter(models.Employee.company_id == company_id).all()
	if not employees:
		raise HTTPException(status_code=404, detail="Company not found")
	return employees

# GET employee by ID
@router.get("/employees/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

# GET performance metrics by employee ID 
@router.get("/employees/{employee_id}/performance_metrics", response_model=List[schemas.PerformanceMetric])
def get_performance_metrics_by_employee(employee_id: int, db: Session = Depends(get_db)):
	performance_metrics = db.query(models.PerformanceMetric).filter(models.PerformanceMetric.employee_id == employee_id).all()
	if not performance_metrics:
		raise HTTPException(status_code=404, detail="Employee not found")
	return performance_metrics

# GET performance metric by comany ID and category 
@router.get("/companies/{company_id}/performance_metrics", response_model=List[schemas.PerformanceMetric])
def get_performance_metrics_by_company(company_id: int, category: Optional[str] = Query(None), db: Session = Depends(get_db)):
	performance_metrics = db.query(models.PerformanceMetric).join(models.Employee).filter(models.Employee.company_id == company_id)
	if category:
		performance_metrics = performance_metrics.filter(models.PerformanceMetric.category == category)
		if not category:
			raise HTTPException(status_code=404, detail="Category not found")
	return performance_metrics.all()

# POST new company 
@router.post("/companies", response_model=schemas.Company)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
	db_company = models.Company(**company.model_dump())
	# check if company already exists first
	if db.query(models.Company).filter(models.Company.name == db_company.name).first():
		raise HTTPException(status_code=400, detail="Company already exists")
	db.add(db_company)
	db.commit()
	db.refresh(db_company)
	return db_company

# POST new employee 
@router.post("/employees", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
	# check if employee already exists first
	if db.query(models.Employee).filter(models.Employee.email == employee.email).first():
		raise HTTPException(status_code=400, detail="Employee already exists")
	db_employee = models.Employee(**employee.model_dump())
	db.add(db_employee)
	db.commit()
	db.refresh(db_employee)
	return db_employee

# PUT update employee by ID
@router.put("/employees/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.model_dump().items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee

# POST performance metric by employee ID
@router.post("/performance_metrics", response_model=schemas.PerformanceMetric)
def add_performance_metric(performance_metric: schemas.PerformanceMetricCreate, db: Session = Depends(get_db)):
    # check if performance metric already exists first
    existing_metric = db.query(models.PerformanceMetric).filter(
        models.PerformanceMetric.employee_id == performance_metric.employee_id,
        models.PerformanceMetric.category == performance_metric.category
    ).first()
    
    if existing_metric:
        # update existing performance metric
        existing_metric.rating = performance_metric.rating
        db.commit()
        db.refresh(existing_metric)
        return existing_metric
    else:
        # create new performance metric
        db_performance_metric = models.PerformanceMetric(**performance_metric.model_dump())
        db.add(db_performance_metric)
        db.commit()
        db.refresh(db_performance_metric)
        return db_performance_metric



