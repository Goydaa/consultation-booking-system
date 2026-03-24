from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

os.makedirs("data", exist_ok=True)

DATABASE_URL = "sqlite:///data/consultations.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String, default="student")
    slots = relationship("Slot", back_populates="teacher")
    appointments = relationship("Appointment", back_populates="student")

class Slot(Base):
    __tablename__ = "slots"
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    max_students = Column(Integer, default=1)
    is_available = Column(Integer, default=1)
    teacher = relationship("User", back_populates="slots")
    appointments = relationship("Appointment", back_populates="slot")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    slot_id = Column(Integer, ForeignKey("slots.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    slot = relationship("Slot", back_populates="appointments")
    student = relationship("User", back_populates="appointments")

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_test_data():
    db = SessionLocal()
    if db.query(User).count() == 0:
        teacher = User(username="teacher", full_name="Иван Петрович", role="teacher")
        db.add(teacher)
        student1 = User(username="student1", full_name="Анна Смирнова", role="student")
        student2 = User(username="student2", full_name="Петр Иванов", role="student")
        db.add(student1)
        db.add(student2)
        db.commit()
        
        from datetime import timedelta
        now = datetime.now()
        
        slots = [
            Slot(teacher_id=1, start_time=now + timedelta(days=1, hours=10), end_time=now + timedelta(days=1, hours=11), max_students=2, is_available=1),
            Slot(teacher_id=1, start_time=now + timedelta(days=1, hours=14), end_time=now + timedelta(days=1, hours=15), max_students=2, is_available=1),
            Slot(teacher_id=1, start_time=now + timedelta(days=2, hours=11), end_time=now + timedelta(days=2, hours=12), max_students=2, is_available=1),
        ]
        for slot in slots:
            db.add(slot)
        db.commit()
    db.close()

init_test_data()
