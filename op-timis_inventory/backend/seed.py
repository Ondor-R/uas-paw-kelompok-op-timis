import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Base

DATABASE_URL = "postgresql://postgres:18oktober@localhost/d5_db"

def seed_data():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    #utk cek apakah admin sudah ada biar tidak duplicate
    existing_admin = session.query(User).filter_by(email="sigmaadmin@gmail.com").first()
    if existing_admin:
        print("Admin sudah ada, tidak perlu dibuat lagi.")
        return

    #Hashing Password (Mengacak password 'admin123')
    password_raw = "admin123"
    #string jadi bytes, lalu di-hash
    hashed = bcrypt.hashpw(password_raw.encode('utf-8'), bcrypt.gensalt())
    #bytes kembali ke string untuk disimpan di DB
    password_hashed = hashed.decode('utf-8')

    #Membuat Object User Admin
    new_admin = User(
        name="Sigma Admin",
        email="sigmaadmin@gmail.com",
        password=password_hashed,
        role="admin"  # Sesuai requirement role Admin 
    )

    #Menyimpan ke Database
    session.add(new_admin)
    session.commit()
    print("SUKSES! User Admin berhasil dibuat.")
    print("Sigmaadmin@gmail.com")
    print("Pass : admin123")

if __name__ == "__main__":
    seed_data()