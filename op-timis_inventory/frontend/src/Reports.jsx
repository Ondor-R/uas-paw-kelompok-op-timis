import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Reports() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [activeTab, setActiveTab] = useState("stock");
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:6543';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [resProd, resTrans, resSupp] = await Promise.all([
        axios.get(`${apiUrl}/products`),
        axios.get(`${apiUrl}/transactions`),
        axios.get(`${apiUrl}/suppliers`),
      ]);

      setProducts(resProd.data);
      setTransactions(resTrans.data);
      setSuppliers(resSupp.data);
    } catch (error) {
      console.error("Gagal ambil data laporan", error);
    }
  };

  const totalItems = products.reduce((acc, curr) => acc + curr.stock, 0);
  const totalAssetValue = products.reduce(
    (acc, curr) => acc + curr.stock * curr.price,
    0
  );

  const downloadCSV = (data, filename) => {
    if (data.length === 0) {
      setMessage("❌ Data kosong, tidak ada yang bisa didownload.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((obj) =>
        Object.values(obj)
          .map((val) => `"${val}"`)
          .join(",")
      )
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage(`✅ File ${filename} berhasil didownload!`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <button onClick={() => navigate("/dashboard")} className="btn-back-modern">
          <span>←</span> Kembali
        </button>
        <h1 className="products-title">Laporan Sistem</h1>
        <div style={{ width: "160px" }}></div>
      </div>

      {message && (
        <div className={`alert-modern ${message.includes("✅") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      {/* RINGKASAN KEUANGAN */}
      <div className="report-summary-grid">
        <div className="stat-card bg-grad-blue-purple">
          <h3 className="stat-title">Total Stok Barang</h3>
          <h1 className="stat-value">
            {totalItems} <span style={{ fontSize: "20px" }}>Unit</span>
          </h1>
        </div>
        <div className="stat-card bg-grad-pink-red">
          <h3 className="stat-title">Estimasi Nilai Aset</h3>
          <h1 className="stat-value">
            Rp {totalAssetValue.toLocaleString("id-ID")}
          </h1>
        </div>
      </div>

      {/* NAVIGASI TAB */}
      <div className="tab-container">
        <button
          className={`${activeTab === "stock" ? "btn-add-product" : "btn-back-modern"} tab-btn`}
          onClick={() => setActiveTab("stock")}
        >
          Laporan Stok
        </button>
        <button
          className={`${activeTab === "trans" ? "btn-add-product" : "btn-back-modern"} tab-btn`}
          onClick={() => setActiveTab("trans")}
        >
          Riwayat Transaksi
        </button>
        <button
          className={`${activeTab === "supplier" ? "btn-add-product" : "btn-back-modern"} tab-btn`}
          onClick={() => setActiveTab("supplier")}
        >
          Data Supplier
        </button>
      </div>

      <div className="products-table-container">
        {/* TAB 1: STOK */}
        {activeTab === "stock" && (
          <>
            <div className="table-header">
              <h3>Laporan Stok Terkini</h3>
              <button
                onClick={() => downloadCSV(products, "laporan_stok.csv")}
                className="btn-submit-modern"
                style={{ marginTop: 0, padding: "8px 20px", fontSize: "14px" }}
              >
                Download CSV
              </button>
            </div>
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Nama Produk</th>
                    <th>SKU</th>
                    <th>Stok</th>
                    <th>Harga</th>
                    <th>Total Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ padding: "40px", color: "#999" }}>
                        Belum ada data produk.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td><span className="sku-badge">{p.sku}</span></td>
                        <td>
                          <span className={`stock-badge ${p.stock <= p.min_stock ? "stock-low" : "stock-ok"}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td><span className="price-text">Rp {p.price.toLocaleString("id-ID")}</span></td>
                        <td><strong>Rp {(p.stock * p.price).toLocaleString("id-ID")}</strong></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TAB 2: TRANSAKSI */}
        {activeTab === "trans" && (
          <>
            <div className="table-header">
              <h3>Riwayat Transaksi Lengkap</h3>
              <button
                onClick={() => downloadCSV(transactions, "laporan_transaksi.csv")}
                className="btn-submit-modern"
                style={{ marginTop: 0, padding: "8px 20px", fontSize: "14px" }}
              >
                Download CSV
              </button>
            </div>
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Produk</th>
                    <th>Tipe</th>
                    <th>Jumlah</th>
                    <th>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ padding: "40px", color: "#999" }}>
                        Belum ada transaksi.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.date}</td>
                        <td><strong>{t.product_name}</strong></td>
                        <td>
                          {t.type === "in" ? (
                            <span className="status-badge status-ok">➕ MASUK</span>
                          ) : (
                            <span className="status-badge status-warning">➖ KELUAR</span>
                          )}
                        </td>
                        <td>
                          <span className={`stock-badge ${t.type === "in" ? "stock-ok" : "stock-low"}`}>
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
          </>
        )}

        {/* TAB 3: SUPPLIER */}
        {activeTab === "supplier" && (
          <>
            <div className="table-header">
              <h3>Daftar Mitra Supplier</h3>
              <button
                onClick={() => downloadCSV(suppliers, "data_supplier.csv")}
                className="btn-submit-modern"
                style={{ marginTop: 0, padding: "8px 20px", fontSize: "14px" }}
              >
                Download CSV
              </button>
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
                      <td colSpan="3" className="text-center" style={{ padding: "40px", color: "#999" }}>
                        Belum ada supplier.
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((s) => (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.contact}</td>
                        <td>{s.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;