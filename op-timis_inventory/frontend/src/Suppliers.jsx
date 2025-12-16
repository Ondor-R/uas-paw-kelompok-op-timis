import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "", email: "" });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:6543/suppliers");
      setSuppliers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6543/suppliers", form);
      setMessage("✅ Supplier berhasil ditambahkan!");
      setForm({ name: "", contact: "", email: "" });
      setShowForm(false);
      fetchSuppliers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        "❌ Gagal menambahkan supplier: " +
          (error.response?.data?.message || error.message)
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
        <h1 className="products-title">Manajemen Supplier</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-add-product"
        >
          <span style={{ fontSize: "20px" }}>+</span> Tambah Supplier
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

      {/* FORM TAMBAH SUPPLIER */}
      {showForm && (
        <div className="product-form-card">
          <div className="form-header">
            <h3>Tambah Supplier Baru</h3>
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
                <label>Nama Supplier / PT</label>
                <input
                  className="modern-input"
                  name="name"
                  placeholder="Contoh: PT Sumber Jaya"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Kontak / No HP</label>
                <input
                  className="modern-input"
                  name="contact"
                  placeholder="Contoh: 08123456789"
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Email</label>
                <input
                  className="modern-input"
                  name="email"
                  type="email"
                  placeholder="supplier@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit-modern">
              Simpan Supplier
            </button>
          </form>
        </div>
      )}

      {/* TABEL DAFTAR SUPPLIER */}
      <div className="products-table-container">
        <div className="table-header">
          <h3>Daftar Supplier</h3>
          <span className="product-count">{suppliers.length} Supplier</span>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Nama Supplier</th>
                <th>Kontak</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    Belum ada supplier. Klik "Tambah Supplier" untuk memulai!
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                    </td>
                    <td>{s.contact}</td>
                    <td>{s.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
