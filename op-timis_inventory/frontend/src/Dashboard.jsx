import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css"; // Pastikan import ini ada

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    lowStock: 0,
    totalAsset: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
      fetchData();
    }

    // Refresh data saat halaman di-focus
    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [resProd, resSupp] = await Promise.all([
        axios.get("http://localhost:6543/products"),
        axios.get("http://localhost:6543/suppliers"),
      ]);

      const products = resProd.data;
      const suppliers = resSupp.data;

      const lowStockCount = products.filter(
        (p) => p.stock <= p.min_stock
      ).length;
      const totalAssetValue = products.reduce(
        (acc, curr) => acc + curr.price * curr.stock,
        0
      );

      setStats({
        totalProducts: products.length,
        totalSuppliers: suppliers.length,
        lowStock: lowStockCount,
        totalAsset: totalAssetValue,
      });
    } catch (error) {
      console.error("Gagal mengambil data statistik", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="products-page">
      {/* Header Section */}
      <div className="products-header">
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src="/src/assets/OP-TIMIS.png"
            alt="Op-timis Logo"
            style={{
              width: "200px",
              height: "90px",
              objectFit: "contain",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", color: "#64748b" }}>
              Selamat datang,
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: "bold", color: "#1a202c" }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#667eea",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              {user.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-add-product"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="product-form-card" style={{ marginBottom: "30px" }}>
        <h1
          style={{ margin: "0 0 10px 0", fontSize: "32px", color: "#1a202c" }}
        >
          Dashboard Overview
        </h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: "16px" }}>
          Ringkasan sistem inventory dan statistik real-time
        </p>
      </div>

      {/* STATISTIK CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {/* Total Produk */}
        <div
          className="product-form-card"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>📦</div>
          <div style={{ fontSize: "18px", opacity: 0.9, marginBottom: "8px" }}>
            Total Produk
          </div>
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>
            {stats.totalProducts}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "8px" }}>
            Produk Terdaftar
          </div>
        </div>

        {/* Suppliers */}
        <div
          className="product-form-card"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>🏢</div>
          <div style={{ fontSize: "18px", opacity: 0.9, marginBottom: "8px" }}>
            Mitra Supplier
          </div>
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>
            {stats.totalSuppliers}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "8px" }}>
            Supplier Aktif
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          className="product-form-card"
          style={{
            background:
              stats.lowStock > 0
                ? "linear-gradient(135deg, #f97316 0%, #ef4444 100%)"
                : "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>
            {stats.lowStock > 0 ? "⚠️" : "✅"}
          </div>
          <div style={{ fontSize: "18px", opacity: 0.9, marginBottom: "8px" }}>
            Low Stock Alert
          </div>
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>
            {stats.lowStock}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "8px" }}>
            {stats.lowStock > 0
              ? "⚡ Perlu Re-stock Segera!"
              : "👍 Semua Stok Aman"}
          </div>
        </div>

        {/* Total Asset */}
        <div
          className="product-form-card"
          style={{
            background: "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>💰</div>
          <div
            style={{
              fontSize: "18px",
              opacity: 0.8,
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            Total Aset
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              wordBreak: "break-word",
            }}
          >
            Rp {stats.totalAsset.toLocaleString("id-ID")}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7, marginTop: "8px" }}>
            Estimasi Nilai Inventory
          </div>
        </div>
      </div>

      {/* MENU NAVIGASI */}
      <div className="product-form-card">
        <h2
          style={{ margin: "0 0 24px 0", fontSize: "24px", color: "#1a202c" }}
        >
          Menu Akses Cepat
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <button
            onClick={() => navigate("/products")}
            className="btn-add-product"
            style={{
              height: "120px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "16px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            <span style={{ fontSize: "40px" }}>📦</span>
            <span>Manage Products</span>
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className="btn-add-product"
            style={{
              height: "120px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "16px",
              background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
            }}
          >
            <span style={{ fontSize: "40px" }}>📊</span>
            <span>Transactions</span>
          </button>

          {user.role === "admin" && (
            <>
              <button
                onClick={() => navigate("/suppliers")}
                className="btn-add-product"
                style={{
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  fontSize: "16px",
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)",
                }}
              >
                <span style={{ fontSize: "40px" }}>🏢</span>
                <span>Suppliers</span>
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="btn-add-product"
                style={{
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  fontSize: "16px",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                  color: "#1a202c",
                }}
              >
                <span style={{ fontSize: "40px" }}>📈</span>
                <span>Reports</span>
              </button>

              <button
                onClick={() => navigate("/manage-staff")}
                className="btn-add-product"
                style={{
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  fontSize: "16px",
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                }}
              >
                <span style={{ fontSize: "40px" }}>👥</span>
                <span>Manage Staff</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
