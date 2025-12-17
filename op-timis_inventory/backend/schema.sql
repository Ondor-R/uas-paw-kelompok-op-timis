-- Hapus tabel lama jika ada (agar bersih/fresh start)
DROP TABLE IF EXISTS product_suppliers CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Tabel Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE
);

-- 2. Tabel Suppliers
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    email VARCHAR(255)
);

-- 3. Tabel Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255),
    price DOUBLE PRECISION NOT NULL,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0
);

-- 4. Tabel Transactions
-- Memiliki Foreign Key ke products dan suppliers
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    date DATE NOT NULL,
    notes TEXT
);

-- 5. Tabel Product_Suppliers (Many-to-Many)
CREATE TABLE product_suppliers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE
);

-- SEED DATA (Isi Data Awal)
INSERT INTO users (name, email, password, role, is_active)
VALUES (
    'Sigma Admin', 
    'sigmaadmin@gmail.com', 
    'admin123', 
    'admin', 
    TRUE
) ON CONFLICT (email) DO NOTHING;