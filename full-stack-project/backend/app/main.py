from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .database import engine, get_db
from . import models
from .models.employee import Employee as EmployeeModel, PerformanceMetric as PerformanceMetricModel
from .models import Base
from .schemas.employee import Employee as EmployeeSchema, PerformanceMetric as PerformanceMetricSchema, EmployeeCreate, PerformanceMetricCreate
from .routes import metrics, employee
from .models.metrics import PerformanceMetric as PerformanceMetricModelMetric, SkillAssessment as SkillAssessmentModel
from .schemas.metrics import PerformanceMetric as PerformanceMetricSchema, SkillAssessment as SkillAssessmentSchema, PerformanceMetricCreate, SkillAssessmentCreate 


app.include_router(metrics.router)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OrgChart API")

@app.post("/employees/", response_model=EmployeeSchema)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = EmployeeModel(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.get("/employees/", response_model=List[EmployeeSchema])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = db.query(EmployeeModel).offset(skip).limit(limit).all()
    return employees

@app.get("/employees/{employee_id}", response_model=EmployeeSchema)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(EmployeeModel).filter(EmployeeModel.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@app.post("/employees/{employee_id}/metrics/", response_model=PerformanceMetricSchema)
def create_performance_metric(employee_id: int, metric: PerformanceMetricCreate, db: Session = Depends(get_db)):
    db_metric = PerformanceMetricModel(**metric.model_dump(), employee_id=employee_id)
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric
