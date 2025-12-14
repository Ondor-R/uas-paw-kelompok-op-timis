setup environtment, database, dll

Pastikan anda punya:
-python 3x
-PostgreSQL

setup postgresqlnya dulu dan buat database bernama "d5_db"
lalu di app.py:
DATABASE_URL = "postgresql://postgres:(**isi password PostgreSQL kalian**)r@localhost/d5_db"

buka terminal di folder backend lalu buat virtual environment:
-python -m venv venv
**lalu aktifkan environtment (penting)**: 
-.\venv\Scripts\activate

install pyramid & sqlalchemy(**pastikan virtual environtmentnya sudah aktif**):
-pip install pyramid sqlalchemy psycopg2-binary alembic waitress bcrypt pyramid_jwt

lalu jalankan:
-python init_db.py
-python seed.py
