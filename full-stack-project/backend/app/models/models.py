from sqlalchemy import Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from ..database import Base
import bcrypt

class Company(Base):
	__tablename__ = "companies"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	name: Mapped[str] = mapped_column(String, index=True, nullable=False)
	created_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)

	# Relationships
	employees = relationship("Employee", back_populates="company")
	users = relationship("User", back_populates="company")

class Employee(Base):
	__tablename__ = "employees"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	company_id: Mapped[int] = mapped_column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
	name: Mapped[str] = mapped_column(String, index=True)
	title: Mapped[str] = mapped_column(String)
	email: Mapped[str] = mapped_column(String, unique=True, index=True)
	manager_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
	created_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
	updated_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
	status: Mapped[str] = mapped_column(String, nullable=False, server_default="active")

	# Relationships
	company = relationship("Company", back_populates="employees")
	manager = relationship("Employee", remote_side=[id])
	performance_ratings = relationship("PerformanceMetric", back_populates="employee")	


class PerformanceMetric(Base):
	__tablename__ = "performance_ratings"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	employee_id: Mapped[int] = mapped_column(Integer, ForeignKey("employees.id", ondelete="CASCADE"))
	category: Mapped[str] = mapped_column(String)
	rating: Mapped[int] = mapped_column(Integer)
	updated_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)

	# Relationships
	employee = relationship("Employee", back_populates="performance_ratings")

class User(Base):
	__tablename__ = "users"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	company_id: Mapped[int] = mapped_column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
	email: Mapped[str] = mapped_column(String, unique=True, index=True)
	password_hash: Mapped[str] = mapped_column(String)
	created_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, server_default=func.now(), nullable=False)
	salt: Mapped[str] = mapped_column(String, default=bcrypt.gensalt())

	# Relationships
	company = relationship("Company", back_populates="users")
