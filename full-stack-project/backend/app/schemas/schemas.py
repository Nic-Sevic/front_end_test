from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Company schemas
class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Employee schemas
class EmployeeBase(BaseModel):
    name: str
    title: str
    email: EmailStr
    manager_id: Optional[int] = None
    company_id: int

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# PerformanceMetric schemas
class PerformanceMetricBase(BaseModel):
    category: str
    rating: int
    employee_id: int

class PerformanceMetricCreate(PerformanceMetricBase):
    pass

class PerformanceMetric(PerformanceMetricBase):
    id: int
    updated_at: datetime

    class Config:
        orm_mode = True

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    company_id: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
