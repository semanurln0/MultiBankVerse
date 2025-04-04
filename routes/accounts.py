from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import SessionLocal
from models.account import Account
from pydantic import BaseModel
from sqlalchemy.future import select

router = APIRouter()

class AccountCreate(BaseModel):
    user_id: int
    bank_name: str
    balance: float

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/")
async def create_account(account: AccountCreate, db: AsyncSession = Depends(get_db)):
    new_account = Account(**account.dict())
    db.add(new_account)
    await db.commit()
    return {"msg": "Account added"}

@router.get("/{user_id}")
async def get_accounts(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Account).where(Account.user_id == user_id))
    return result.scalars().all()
