import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    lowStock: 0,
    totalAsset: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(storedUser));
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [resProd, resSupp] = await Promise.all([
        axios.get('http://localhost:6543/products'),
        axios.get('http://localhost:6543/suppliers')
      ]);

      const products = resProd.data;
      const suppliers = resSupp.data;

      const lowStockCount = products.filter(p => p.stock <= p.min_stock).length;
      const totalAssetValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

      setStats({
        totalProducts: products.length,
        totalSuppliers: suppliers.length,
        lowStock: lowStockCount,
        totalAsset: totalAssetValue
      });
    } catch (error) {
      console.error("Gagal mengambil data statistik", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div>
      <div className="dashboard-header">
        <h3 style={{ margin: 0 }}>Op-timis' Inventory</h3>
        <div className="header-user">
          <span>Hi, <b>{user.name}</b> ({user.role})</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="page-container">
        <h2>Status</h2>
        
        <div className="stat-grid">
          <div className="stat-card bg-color-1">
            <span className="stat-label">Total Produk</span>
            <span className="stat-value">{stats.totalProducts}</span>
          </div>

          <div className="stat-card bg-color-4">
            <span className="stat-label">Mitra Supplier</span>
            <span className="stat-value">{stats.totalSuppliers}</span>
          </div>

          <div className={`stat-card ${stats.lowStock > 0 ? 'bg-danger' : 'bg-color-2'}`}>
            <span className="stat-label">Low Stock (ALERT)</span>
            <span className="stat-value">
               {stats.lowStock} <span style={{ fontSize: '16px' }}>Item</span>
            </span>
            {stats.lowStock > 0 && <small>Perlu re-stock segera!</small>}
          </div>

          <div className="stat-card bg-color-3">
            <span className="stat-label">Total Asset</span>
            <span className="stat-value" style={{fontSize: '24px'}}>
               Rp {stats.totalAsset.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <h3 style={{ marginTop: '40px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Menu</h3>
        <div className="quick-menu-grid">
              
          <button onClick={() => navigate('/products')} className="menu-btn bg-color-1">Manage Products</button>
          <button onClick={() => navigate('/transactions')} className="menu-btn bg-color-2">Transactions</button>
          
          {user.role === 'admin' && (
            <>
              <button onClick={() => navigate('/suppliers')} className="menu-btn bg-color-3">Suppliers</button>
              <button onClick={() => navigate('/reports')} className="menu-btn bg-color-4">Reports</button>
              <button onClick={() => navigate('/manage-staff')} className="menu-btn bg-color-5">Manage Staff</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;