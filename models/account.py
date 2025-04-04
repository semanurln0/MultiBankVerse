from sqlalchemy import Column, Integer, String, Float, ForeignKey
from db.database import Base

class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    bank_name = Column(String)
    balance = Column(Float)
