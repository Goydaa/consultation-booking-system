from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    full_name: str
    role: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class SlotBase(BaseModel):
    teacher_id: int
    start_time: datetime
    end_time: datetime
    max_students: int = 1

class SlotCreate(SlotBase):
    pass

class SlotResponse(SlotBase):
    id: int
    is_available: int
    teacher: Optional[UserResponse] = None
    appointments_count: int = 0
    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    slot_id: int
    topic: str

class AppointmentCreate(AppointmentBase):
    student_id: int

class AppointmentResponse(AppointmentBase):
    id: int
    student_id: int
    created_at: datetime
    slot: Optional[SlotResponse] = None
    student: Optional[UserResponse] = None
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
