from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date

class PerformanceMetricBase(BaseModel):
    evaluation_date: date
    performance_score: float
    goals_achieved: int
    review_notes: str

class PerformanceMetricCreate(PerformanceMetricBase):
    pass

class PerformanceMetric(PerformanceMetricBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True

class EmployeeBase(BaseModel):
    name: str
    title: str
    email: EmailStr
    department: str
    manager_id: Optional[int] = None

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    performance_metrics: List[PerformanceMetric] = []
    subordinates: List['Employee'] = []

    class Config:
        from_attributes = True

# This is needed for the recursive relationship
Employee.model_rebuild()
