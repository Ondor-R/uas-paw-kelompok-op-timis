# Op-timis Inventory Management System 📦

**Sistem Manajemen Inventori Berbasis Web (Full Stack)**
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
| Name | NIM | Github |
|----------|----------|----------|
| Reyhan Oktavian Putra  | 123140202  | Ondor-R |
| Muhammad Bimastiar  | 123140211  | 211-Bimas |
| Fanisa Aulia Safitri | 123140121  | Applepi121 |
| Refi Ikhsanti | 123140126 | 7refi |
| Awi Septian Prasetyo  | 123140201 | Awesome1209 |

