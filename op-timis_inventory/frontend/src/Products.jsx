import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    min_stock: "",
  });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:6543';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // MENGGUNAKAN apiUrl
      const res = await axios.get(`${apiUrl}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // MENGGUNAKAN apiUrl
      await axios.post(`${apiUrl}/products`, form);
      setMessage("✅ Produk berhasil ditambahkan!");
      setForm({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        min_stock: "",
      });
      setShowForm(false);
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        "❌ Gagal: " + (error.response?.data?.message || error.message)
      );
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="products-page">
      {/* Header Section */}
      <div className="products-header">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-back-modern"
        >
          <span>←</span> Kembali
        </button>
        <h1 className="products-title">Manajemen Produk</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-add-product"
        >
          <span style={{ fontSize: "20px" }}>+</span> Tambah Produk
        </button>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`alert-modern ${
            message.includes("✅") ? "alert-success" : "alert-error"
          }`}
        >
          {message}
        </div>
      )}

      {/* FORM TAMBAH PRODUK */}
      {showForm && (
        <div className="product-form-card">
          <div className="form-header">
            <h3>Tambah Produk Baru</h3>
            <button
              onClick={() => setShowForm(false)}
              className="btn-close-form"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-row">
              <div className="form-field">
                <label>Nama Produk</label>
                <input
                  className="modern-input"
                  name="name"
                  placeholder="Masukkan nama produk"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>SKU (Kode Unik)</label>
                <input
                  className="modern-input"
                  name="sku"
                  placeholder="Contoh: PRD-001"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Kategori</label>
                <input
                  className="modern-input"
                  name="category"
                  placeholder="Contoh: Elektronik"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>Harga (Rp)</label>
                <input
                  className="modern-input"
                  name="price"
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Stok Awal</label>
                <input
                  className="modern-input"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Stok Minimum</label>
                <input
                  className="modern-input"
                  name="min_stock"
                  type="number"
                  placeholder="0"
                  value={form.min_stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit-modern">
              Simpan Produk
            </button>
          </form>
        </div>
      )}

      {/* TABEL DAFTAR PRODUK */}
      <div className="products-table-container">
        <div className="table-header">
          <h3>Daftar Produk</h3>
          <span className="product-count">{products.length} Produk</span>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Min Stok</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    Belum ada produk. Klik "Tambah Produk" untuk memulai!
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isLowStock = p.stock <= p.min_stock;
                  return (
                    <tr
                      key={p.id}
                      className={isLowStock ? "row-low-stock" : ""}
                    >
                      <td>
                        <span className="sku-badge">{p.sku}</span>
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>{p.category || "-"}</td>
                      <td>
                        <span className="price-text">
                          Rp {p.price.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`stock-badge ${
                            isLowStock ? "stock-low" : "stock-ok"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.min_stock}</td>
                      <td>
                        {isLowStock ? (
                          <span className="status-badge status-warning">
                            Stok Rendah
                          </span>
                        ) : (
                          <span className="status-badge status-ok">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;