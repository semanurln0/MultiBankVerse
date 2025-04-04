from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import SessionLocal
from models.transaction import Transaction
from pydantic import BaseModel
from sqlalchemy.future import select

router = APIRouter()

class TransactionCreate(BaseModel):
    user_id: int
    amount: float
    type: str
    description: str

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/")
async def create_transaction(tx: TransactionCreate, db: AsyncSession = Depends(get_db)):
    new_tx = Transaction(**tx.dict())
    db.add(new_tx)
    await db.commit()
    return {"msg": "Transaction added"}

@router.get("/{user_id}")
async def get_transactions(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Transaction).where(Transaction.user_id == user_id))
    return result.scalars().all()
