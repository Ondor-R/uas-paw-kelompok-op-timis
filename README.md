# Op-timis Inventory Management System 📦

**Sistem Manajemen Inventori Berbasis Web**
*Tugas Besar Pemrograman Aplikasi Web (UAS)*

Website Live: [https://www.op-timis.web.id](https://www.op-timis.web.id)  

---

## 📖 Deskripsi

Op-timis Inventory adalah sistem aplikasi web yang dirancang untuk membantu pengelolaan stok barang, manajemen supplier, dan pelacakan transaksi barang masuk/keluar.

### 🌟 Fitur Utama
Sesuai dengan spesifikasi kebutuhan sistem:
* **User Authentication & RBAC:** Login multi-role (Admin & Staff) dengan keamanan password hashing (Bcrypt) dan JWT Token.
* **Dashboard Statistik:** Ringkasan total aset, jumlah produk, supplier, dan notifikasi stok menipis.
* **Product Management:** CRUD (Create, Read, Update, Delete) data produk lengkap dengan SKU, Kategori, dan Harga.
* **Supplier Management:** CRUD data supplier/pemasok barang.
* **Stock Tracking:** Pencatatan Transaksi Masuk (Purchase) dan Keluar (Sales) yang terhubung dengan stok produk.
* **Low Stock Alert:** Notifikasi visual otomatis jika stok produk berada di bawah batas minimum.
* **Reports & Export:** Laporan stok dan riwayat transaksi yang dapat diekspor ke format **CSV**.
* **Staff Management (Admin Only):** Fitur persetujuan (Approval) untuk pendaftaran staff baru dan penghapusan akun.

---

## 🛠 Teknologi yang Digunakan

### Frontend
* **Framework:** React JS (Vite)
* **HTTP Client:** Axios
* **Routing:** React Router DOM
* **Styling:** Native CSS
* **Hosting:** Vercel

### Backend
* **Language:** Python 3.x
* **Framework:** Pyramid
* **ORM:** SQLAlchemy
* **Database:** PostgreSQL
* **Server WSGI:** Gunicorn / Waitress
* **Hosting:** VPS (Ubuntu)

### Infrastructure & Security
* **Web Server:** Nginx (Reverse Proxy)
* **SSL:** Certbot (Let's Encrypt)
* **Process Manager:** Systemd

---

## 👨🏿‍🎨 Tim Pengembang
| Name | NIM | Role | Github |
|----------|----------|----------|----------|
| Reyhan Oktavian Putra  | 123140202  | Team Leader | Ondor-R |
| Muhammad Bimastiar  | 123140211  | Backend | 211-Bimas |
| Fanisa Aulia Safitri | 123140121  | Backend | Applepi121 |
| Refi Ikhsanti | 123140126 | Frontend | 7refi |
| Awi Septian Prasetyo  | 123140201 | Frontend | Awesome1209 |

---

## Screenshot

### Login & Register
<img width="2542" height="1259" alt="image" src="https://github.com/user-attachments/assets/ae9920ec-2f8c-4d26-bd62-2a6110a87a7c" />
<img width="2538" height="1267" alt="image" src="https://github.com/user-attachments/assets/4d323122-674a-405d-b057-3f85a42917d5" />

### Dashboard Admin
<img width="2537" height="1270" alt="image" src="https://github.com/user-attachments/assets/afc9a991-161f-429a-856e-63c2fe5f53be" />

### Dashboard Staff
<img width="2539" height="1235" alt="image" src="https://github.com/user-attachments/assets/d06fcf7b-424d-4f19-9165-2c49b5eeb157" />

### Dashboard with low stock alert
<img width="2526" height="1256" alt="image" src="https://github.com/user-attachments/assets/cc281949-c08f-4c5c-a5c4-24faf2e55894" />

### Manage Product
<img width="2540" height="1266" alt="image" src="https://github.com/user-attachments/assets/83ad2f91-fea1-4c44-9f52-f56a6e9210f6" />

### Transactions
<img width="2542" height="1271" alt="image" src="https://github.com/user-attachments/assets/82e6b178-4a5f-4bef-8800-cde98f202051" />

### Suppliers (admin only)
<img width="2540" height="1257" alt="image" src="https://github.com/user-attachments/assets/e13e1bbd-db50-43b1-882a-5c3a2a060d78" />

### Reports (admin only)
<img width="2532" height="1264" alt="image" src="https://github.com/user-attachments/assets/caeb60ad-935a-48aa-a0c9-60ca32b25cd8" />

### Manage Staff (admin only)
<img width="2534" height="1263" alt="image" src="https://github.com/user-attachments/assets/877ff5ff-e922-42e6-9e40-96ce7aeb01a3" />







