from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy import create_engine, desc, outerjoin
from sqlalchemy.orm import sessionmaker
import bcrypt
import datetime
from models import User, Base, Product, Transaction, Supplier

DATABASE_URL = "postgresql://postgres:18oktober@localhost/d5_db"
db_engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=db_engine)

#-----------------------------------------------FUNGSI CORS (IZIN AKSES)
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)

# --- VIEW KHUSUS OPTIONS (PREFLIGHT) ---
@view_config(route_name='register', request_method='OPTIONS')
@view_config(route_name='login', request_method='OPTIONS')
def options_view(request):
    return Response(status=200)

#-----------------------------------------------FITUR REGISTER
@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        payload = request.json_body
        name = payload.get('name')
        email = payload.get('email')
        password = payload.get('password')
        role = 'staff'

        session = Session()
        if session.query(User).filter_by(email=email).first():
            session.close()
            request.response.status = 400
            return {'message': 'Email sudah terdaftar!'}

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(name=name, email=email, password=hashed.decode('utf-8'), role=role)
        session.add(new_user)
        session.commit()
        session.close()
        return {'message': 'Registrasi berhasil! Mohon tunggu verifikasi Admin.'}
    except Exception as e:
        request.response.status = 500
        return {'message': f'Error: {str(e)}'}

#-----------------------------------------------FITUR LOGIN
@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    try:
        payload = request.json_body
        email = payload.get('email')
        password = payload.get('password')

        session = Session()
        user = session.query(User).filter_by(email=email).first()
        session.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            
            if not user.is_active:
                request.response.status = 403
                return {'message': 'Akun belum diaktifkan oleh Admin!'}

            return {
                'message': 'Login Sukses',
                'user': {'id': user.id, 'name': user.name, 'role': user.role}
            }
        else:
            request.response.status = 401
            return {'message': 'Email atau Password salah!'}
            
    except Exception as e:
        request.response.status = 500
        return {'message': f'Error: {str(e)}'}

#-----------------------------------------------FITUR ADMIN: LIST STAFF PENDING
@view_config(route_name='users', renderer='json', request_method='GET')
def get_pending_users(request):
    session = Session()
    users = session.query(User).filter_by(role='staff').order_by(User.id).all()
    data = [{'id': u.id, 'name': u.name, 'email': u.email, 'is_active': u.is_active} for u in users]
    session.close()
    return data

#-----------------------------------------------FITUR ADMIN: APPROVE STAFF
@view_config(route_name='approve_user', renderer='json', request_method='POST')
def approve_user(request):
    payload = request.json_body
    user_id = payload.get('user_id')
    
    session = Session()
    user = session.query(User).filter_by(id=user_id).first()
    if user:
        user.is_active = True
        session.commit()
        session.close()
        return {'message': 'User berhasil diaktifkan!'}
    
    session.close()
    return {'message': 'User tidak ditemukan'}

#-----------------------------------------------FITUR ADMIN: HAPUS USER (REJECT / DELETE)
@view_config(route_name='delete_user', renderer='json', request_method='POST')
def delete_user(request):
    try:
        payload = request.json_body
        user_id = payload.get('user_id')
        
        session = Session()
        
        user = session.query(User).filter_by(id=user_id).first()
        
        if not user:
            session.close()
            request.response.status = 404
            return {'message': 'User tidak ditemukan'}

        if user.role == 'admin':
            session.close()
            request.response.status = 400
            return {'message': 'TIDAK BOLEH MENGHAPUS ADMIN!'}

        session.delete(user)
        session.commit()
        session.close()
        
        return {'message': 'User berhasil dihapus/direject.'}

    except Exception as e:
        request.response.status = 500
        return {'message': str(e)}

#-----------------------------------------------FITUR PRODUK: LIHAT SEMUA (READ)
@view_config(route_name='products', renderer='json', request_method='GET')
def get_products(request):
    try:
        session = Session()

        products = session.query(Product).order_by(desc(Product.id)).all()

        data = []
        for p in products:
            data.append({
                'id': p.id,
                'name': p.name,
                'sku': p.sku,
                'category': p.category,
                'price': p.price,
                'stock': p.stock,
                'min_stock': p.min_stock
            })
        
        session.close()
        return data
    except Exception as e:
        request.response.status = 500
        return {'message': str(e)}

#-----------------------------------------------FITUR PRODUK: TAMBAH BARU (CREATE)
@view_config(route_name='products', renderer='json', request_method='POST')
def create_product(request):
    try:
        payload = request.json_body
        session = Session()
        
        if session.query(Product).filter_by(sku=payload['sku']).first():
            session.close()
            request.response.status = 400
            return {'message': 'Kode SKU sudah ada!'}

        new_product = Product(
            name=payload['name'],
            sku=payload['sku'],
            category=payload['category'],
            price=float(payload['price']),
            stock=int(payload['stock']),
            min_stock=int(payload['min_stock'])
        )
        
        session.add(new_product)
        session.commit()
        session.close()
        
        return {'message': 'Produk berhasil disimpan!'}
    except Exception as e:
        request.response.status = 500
        return {'message': str(e)}

##-----------------------------------------------FITUR TRANSAKSI: STOK MASUK/KELUAR
@view_config(route_name='transactions', renderer='json', request_method='POST')
def create_transaction(request):
    try:
        payload = request.json_body
        product_id = int(payload['product_id'])
        trans_type = payload['type']
        quantity = int(payload['quantity'])
        notes = payload.get('notes', '')
        
        supplier_id = payload.get('supplier_id') 

        session = Session()
        product = session.query(Product).filter_by(id=product_id).first()

        if not product:
            session.close()
            request.response.status = 404
            return {'message': 'Produk tidak ditemukan!'}

        #-----------------------------------------------LOGIKA VALIDASI BARU
        if trans_type == 'in':
            if not supplier_id:
                session.close()
                request.response.status = 400
                return {'message': 'Untuk barang masuk, Supplier wajib dipilih!'}
            
            product.stock += quantity
            
        elif trans_type == 'out':
            if product.stock < quantity:
                session.close()
                request.response.status = 400
                return {'message': f'Stok tidak cukup! Sisa: {product.stock}'}
            
            product.stock -= quantity
            supplier_id = None
            
        else:
            session.close()
            request.response.status = 400
            return {'message': 'Tipe transaksi salah'}

        new_trans = Transaction(
            product_id=product.id,
            supplier_id=supplier_id,
            type=trans_type,
            quantity=quantity,
            date=datetime.date.today(),
            notes=notes
        )

        session.add(new_trans)
        session.commit()
        session.close()

        return {'message': 'Transaksi berhasil disimpan!'}

    except Exception as e:
        request.response.status = 500
        return {'message': str(e)}

#-----------------------------------------------FITUR RIWAYAT: LIHAT SEMUA TRANSAKSI
@view_config(route_name='transactions', renderer='json', request_method='GET')
def get_transactions(request):
    try:
        session = Session()
        
        results = session.query(Transaction, Product, Supplier).\
            join(Product, Transaction.product_id == Product.id).\
            outerjoin(Supplier, Transaction.supplier_id == Supplier.id).\
            order_by(desc(Transaction.id)).all()
        
        data = []
        for t, p, s in results:
            data.append({
                'id': t.id,
                'product_name': p.name,
                'supplier_name': s.name if s else '-',
                'type': t.type,
                'quantity': t.quantity,
                'date': str(t.date),
                'notes': t.notes
            })
            
        session.close()
        return data
    except Exception as e:
        request.response.status = 500
        return {'message': str(e)}

##-----------------------------------------------FITUR SUPPLIER: LIHAT SEMUA (READ)
@view_config(route_name='suppliers', renderer='json', request_method='GET')
def get_suppliers(request):
    try:
        session = Session()
        suppliers = session.query(Supplier).order_by(desc(Supplier.id)).all()
        
        data = []
        for s in suppliers:
            data.append({
                'id': s.id,
                'name': s.name,
                'contact': s.contact,
                'email': s.email
            })
        
        session.close()
        return data
    except Exception as e:
        request.response.status = 500
        return {'message': str(e)}

#-----------------------------------------------FITUR SUPPLIER: TAMBAH BARU (CREATE)
@view_config(route_name='suppliers', renderer='json', request_method='POST')
def create_supplier(request):
    try:
        payload = request.json_body
        session = Session()
        
        new_supplier = Supplier(
            name=payload['name'],
            contact=payload['contact'],
            email=payload['email']
        )
        
        session.add(new_supplier)
        session.commit()
        session.close()
        
        return {'message': 'Supplier berhasil ditambahkan!'}
    except Exception as e:
        request.response.status = 500
        return {'message': str(e)}


#-----------------------------------------------MAIN SERVER
if __name__ == '__main__':
    with Configurator() as config:
        config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewRequest')
        
        config.add_route('register', '/register')
        config.add_route('login', '/login')
        config.add_route('products', '/products')
        config.add_route('transactions', '/transactions')
        config.add_route('suppliers', '/suppliers')
        config.add_route('users', '/users')
        config.add_route('approve_user', '/users/approve')
        config.add_route('delete_user', '/users/delete')
        
        config.add_view(options_view, route_name='products')
        config.add_view(options_view, route_name='transactions')
        config.add_view(options_view, route_name='suppliers')
        config.add_view(options_view, route_name='users')
        config.add_view(options_view, route_name='approve_user')
        config.add_view(options_view, route_name='delete_user')
        
        config.scan()
        app = config.make_wsgi_app()

    print("Server Backend berjalan di http://localhost:6543")
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()