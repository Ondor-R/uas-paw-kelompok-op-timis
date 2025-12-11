from sqlalchemy import create_engine
from models import Base

DATABASE_URL = "postgresql://postgres:18oktober@localhost/d5_db"

def init_db():
    try:
        engine = create_engine(DATABASE_URL)
        print("Menghubungkan ke database...")
        
        #perintah utk membuat semua tabel dari models.py
        Base.metadata.create_all(engine)
        
        print("SUKSES! Tabel Users, Products, Suppliers, Transactions berhasil dibuat.")
    except Exception as e:
        print(f"TERJADI ERROR: {e}")
        print("Cek apakah password benar dan database 'digit5_db' sudah dibuat.")

if __name__ == "__main__":
    init_db()