from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List
import models
import database
from database import get_db, User, Slot, Appointment

app = FastAPI(title="Consultation Booking System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/login")
def login(request: models.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "username": user.username, "role": user.role, "full_name": user.full_name}

@app.get("/api/slots/available", response_model=List[models.SlotResponse])
def get_available_slots(db: Session = Depends(get_db)):
    slots = db.query(Slot).filter(Slot.is_available == 1).options(joinedload(Slot.teacher)).all()
    result = []
    for slot in slots:
        appointments_count = db.query(Appointment).filter(Appointment.slot_id == slot.id).count()
        if appointments_count < slot.max_students:
            result.append(models.SlotResponse(
                id=slot.id,
                teacher_id=slot.teacher_id,
                start_time=slot.start_time,
                end_time=slot.end_time,
                max_students=slot.max_students,
                is_available=slot.is_available,
                teacher=slot.teacher,
                appointments_count=appointments_count
            ))
    return result

@app.get("/api/slots/teacher/{teacher_id}", response_model=List[models.SlotResponse])
def get_teacher_slots(teacher_id: int, db: Session = Depends(get_db)):
    slots = db.query(Slot).filter(Slot.teacher_id == teacher_id).options(joinedload(Slot.teacher)).all()
    result = []
    for slot in slots:
        appointments_count = db.query(Appointment).filter(Appointment.slot_id == slot.id).count()
        appointments = db.query(Appointment).filter(Appointment.slot_id == slot.id).options(joinedload(Appointment.student)).all()
        result.append(models.SlotResponse(
            id=slot.id,
            teacher_id=slot.teacher_id,
            start_time=slot.start_time,
            end_time=slot.end_time,
            max_students=slot.max_students,
            is_available=slot.is_available,
            teacher=slot.teacher,
            appointments_count=appointments_count
        ))
    return result

@app.post("/api/slots")
def create_slot(slot: models.SlotCreate, db: Session = Depends(get_db)):
    db_slot = Slot(**slot.model_dump(), is_available=1)
    db.add(db_slot)
    db.commit()
    db.refresh(db_slot)
    return db_slot

@app.get("/api/appointments/teacher/{teacher_id}", response_model=List[models.AppointmentResponse])
def get_teacher_appointments(teacher_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).join(Slot).filter(Slot.teacher_id == teacher_id).options(
        joinedload(Appointment.slot), joinedload(Appointment.student)
    ).all()
    return appointments

@app.get("/api/appointments/slot/{slot_id}", response_model=List[models.AppointmentResponse])
def get_slot_appointments(slot_id: int, db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.slot_id == slot_id).options(
        joinedload(Appointment.slot), joinedload(Appointment.student)
    ).all()

@app.get("/api/appointments/student/{student_id}", response_model=List[models.AppointmentResponse])
def get_student_appointments(student_id: int, db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.student_id == student_id).options(
        joinedload(Appointment.slot), joinedload(Appointment.student)
    ).all()

@app.post("/api/appointments")
def create_appointment(appointment: models.AppointmentCreate, db: Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == appointment.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    current_bookings = db.query(Appointment).filter(Appointment.slot_id == appointment.slot_id).count()
    if current_bookings >= slot.max_students:
        raise HTTPException(status_code=400, detail="Slot is full")
    db_appointment = Appointment(
        slot_id=appointment.slot_id,
        student_id=appointment.student_id,
        topic=appointment.topic
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@app.delete("/api/appointments/{appointment_id}")
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appointment)
    db.commit()
    return {"message": "Appointment cancelled"}

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_slots = db.query(Slot).count()
    available_slots = len([s for s in db.query(Slot).filter(Slot.is_available == 1).all()])
    total_bookings = db.query(Appointment).count()
    return {
        "total_slots": total_slots,
        "available_slots": available_slots,
        "total_bookings": total_bookings
    }
