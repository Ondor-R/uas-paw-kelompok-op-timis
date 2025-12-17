import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

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
        axios.get("http://72.62.120.161:6543/products"),
        axios.get("http://72.62.120.161:6543/suppliers"),
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
        <div className="header-logo-section">
          <img
            src="/src/assets/OP-TIMIS.png"
            alt="Op-timis Logo"
            className="header-logo"
          />
        </div>
        <div className="header-user-section">
          <div className="user-info">
            <div className="user-welcome">Selamat datang,</div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-add-product bg-grad-red"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="product-form-card mb-20">
        <h1 className="products-title mb-10">Dashboard Overview</h1>
        <p className="auth-subtitle" style={{ fontSize: "16px" }}>
          Ringkasan sistem inventory dan statistik real-time
        </p>
      </div>

      {/* STATISTIK CARDS */}
      <div className="stats-grid">
        {/* Total Produk */}
        <div className="stat-card bg-grad-purple">
          <div className="stat-icon">📦</div>
          <div className="stat-title">Total Produk</div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-desc">Produk Terdaftar</div>
        </div>

        {/* Suppliers */}
        <div className="stat-card bg-grad-cyan">
          <div className="stat-icon">🏢</div>
          <div className="stat-title">Mitra Supplier</div>
          <div className="stat-value">{stats.totalSuppliers}</div>
          <div className="stat-desc">Supplier Aktif</div>
        </div>

        {/* Low Stock Alert */}
        <div
          className={`stat-card ${
            stats.lowStock > 0 ? "bg-grad-orange" : "bg-grad-green"
          }`}
        >
          <div className="stat-icon">{stats.lowStock > 0 ? "⚠️" : "✅"}</div>
          <div className="stat-title">Low Stock Alert</div>
          <div className="stat-value">{stats.lowStock}</div>
          <div className="stat-desc">
            {stats.lowStock > 0
              ? "⚡ Perlu Re-stock Segera!"
              : "👍 Semua Stok Aman"}
          </div>
        </div>

        {/* Total Asset */}
        <div className="stat-card bg-grad-rose">
          <div className="stat-icon">💰</div>
          <div className="stat-title">Total Aset</div>
          <div className="stat-money">
            Rp {stats.totalAsset.toLocaleString("id-ID")}
          </div>
          <div className="stat-desc">Estimasi Nilai Inventory</div>
        </div>
      </div>

      {/* MENU NAVIGASI */}
      <div className="product-form-card">
        <h2 className="products-title mb-20" style={{ fontSize: "24px" }}>
          Menu Akses Cepat
        </h2>

        <div className="menu-grid">
          <button
            onClick={() => navigate("/products")}
            className="menu-card-btn bg-grad-purple"
          >
            <span className="menu-icon">📦</span>
            <span>Manage Products</span>
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className="menu-card-btn bg-grad-pink"
          >
            <span className="menu-icon">📊</span>
            <span>Transactions</span>
          </button>

          {user.role === "admin" && (
            <>
              <button
                onClick={() => navigate("/suppliers")}
                className="menu-card-btn bg-grad-cyan"
              >
                <span className="menu-icon">🏢</span>
                <span>Suppliers</span>
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="menu-card-btn bg-grad-yellow"
              >
                <span className="menu-icon">📈</span>
                <span>Reports</span>
              </button>

              <button
                onClick={() => navigate("/manage-staff")}
                className="menu-card-btn bg-grad-indigo"
              >
                <span className="menu-icon">👥</span>
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