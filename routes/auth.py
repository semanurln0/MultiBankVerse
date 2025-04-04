from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import SessionLocal
from models.user import User
from core.security import hash_password, verify_password, create_access_token
from pydantic import BaseModel
from sqlalchemy.future import select

router = APIRouter()

class Register(BaseModel):
    name: str
    email: str
    password: str  # ✅ Password is always treated as a string

class Login(BaseModel):
    email: str
    password: str

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/register")
async def register(user: Register, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalar():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(name=user.name, email=user.email, password=hash_password(user.password))
    db.add(new_user)
    await db.commit()
    return {"msg": "User registered"}

@router.post("/login")
async def login(user: Login, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalar()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}
