from sqlalchemy import (Column, Integer, String, Float, Date, ForeignKey, create_engine, Text)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy import Boolean

#Base class untuk semua model
Base = declarative_base()

#Tabel Users
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False) # 'admin' atau 'staff'
    is_active = Column(Boolean, default=False)

#Tabel Products
class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=False)
    category = Column(String)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    min_stock = Column(Integer, default=0)
    
    # Relasi
    transactions = relationship("Transaction", back_populates="product")

#Tabel Suppliers
class Supplier(Base):
    __tablename__ = 'suppliers'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    contact = Column(String)
    email = Column(String)

#Tabel Transactions (Stock In/Out)
class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=True) 

    type = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    notes = Column(Text)

    # Relasi
    product = relationship("Product", back_populates="transactions")
    supplier = relationship("Supplier")

#Tabel Product_Suppliers
class ProductSupplier(Base):
    __tablename__ = 'product_suppliers'
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    supplier_id = Column(Integer, ForeignKey('suppliers.id'))