from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from db.database import Base
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    type = Column(String)
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
