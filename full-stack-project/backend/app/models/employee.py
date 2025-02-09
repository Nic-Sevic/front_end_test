from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from ..database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    title = Column(String)
    email = Column(String, unique=True, index=True)
    department = Column(String)
    manager_id = Column(Integer, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    subordinates = relationship("Employee", 
                              backref="manager",
                              remote_side=[id],
                              cascade="all, delete-orphan")
    performance_metrics = relationship("PerformanceMetric", back_populates="employee")

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"))
    evaluation_date = Column(Date)
    performance_score = Column(Float)
    goals_achieved = Column(Integer)
    review_notes = Column(String)
    
    # Relationship
    employee = relationship("Employee", back_populates="performance_metrics")
