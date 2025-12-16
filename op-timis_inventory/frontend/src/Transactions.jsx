import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Transactions() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [type, setType] = useState("in");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchHistory();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:6543/products");
    setProducts(res.data);
    if (res.data.length > 0) setSelectedProduct(res.data[0].id);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:6543/suppliers");
    setSuppliers(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get("http://localhost:6543/transactions");
    setTransactions(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6543/transactions", {
        product_id: selectedProduct,
        supplier_id: selectedSupplier,
        type: type,
        quantity: quantity,
        notes: notes,
      });
      setMessage("✅ Transaksi berhasil dicatat! Stok telah diperbarui.");
      fetchHistory();
      setSelectedSupplier("");
      setQuantity("");
      setNotes("");
      setShowForm(false);
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
        <h1 className="products-title">Transaksi Stok</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-add-product"
        >
          <span style={{ fontSize: "20px" }}>+</span> Catat Transaksi
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

      {/* FORM TRANSAKSI */}
      {showForm && (
        <div className="product-form-card">
          <div className="form-header">
            <h3>Catat Transaksi Baru</h3>
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
                <label>Pilih Produk</label>
                <select
                  className="modern-input"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stok: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Tipe Transaksi</label>
                <select
                  className="modern-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="in">➕ Stok Masuk (Purchase)</option>
                  <option value="out">➖ Stok Keluar (Sales)</option>
                </select>
              </div>
            </div>

            {type === "in" && (
              <div className="form-row">
                <div className="form-field">
                  <label>Supplier (Wajib untuk Stok Masuk)</label>
                  <select
                    className="modern-input"
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    required={type === "in"}
                  >
                    <option value="">-- Pilih Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-field">
                <label>Jumlah</label>
                <input
                  className="modern-input"
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Catatan (Opsional)</label>
                <input
                  className="modern-input"
                  type="text"
                  placeholder="Catatan tambahan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit-modern">
              Simpan Transaksi
            </button>
          </form>
        </div>
      )}

      {/* TABEL RIWAYAT TRANSAKSI */}
      <div className="products-table-container">
        <div className="table-header">
          <h3>Riwayat Transaksi</h3>
          <span className="product-count">{transactions.length} Transaksi</span>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Produk</th>
                <th>Supplier</th>
                <th>Tipe</th>
                <th>Jumlah</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    Belum ada transaksi. Klik "Catat Transaksi" untuk
                    memulai!
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>
                      <strong>{t.product_name}</strong>
                    </td>
                    <td>{t.supplier_name || "-"}</td>
                    <td>
                      {t.type === "in" ? (
                        <span className="status-badge status-ok">➕ MASUK</span>
                      ) : (
                        <span className="status-badge status-warning">
                          ➖ KELUAR
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`stock-badge ${
                          t.type === "in" ? "stock-ok" : "stock-low"
                        }`}
                      >
                        {t.quantity}
                      </span>
                    </td>
                    <td>{t.notes || "-"}</td>
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

export default Transactions;
