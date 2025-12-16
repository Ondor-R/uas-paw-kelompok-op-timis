import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Reports() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [activeTab, setActiveTab] = useState('stock');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [resProd, resTrans, resSupp] = await Promise.all([
        axios.get('http://localhost:6543/products'),
        axios.get('http://localhost:6543/transactions'),
        axios.get('http://localhost:6543/suppliers')
      ]);

      setProducts(resProd.data);
      setTransactions(resTrans.data);
      setSuppliers(resSupp.data);
    } catch (error) {
      console.error("Gagal ambil data laporan", error);
    }
  };

  const totalItems = products.reduce((acc, curr) => acc + curr.stock, 0);
  const totalAssetValue = products.reduce((acc, curr) => acc + (curr.stock * curr.price), 0);

  const downloadCSV = (data, filename) => {
    if (data.length === 0) {
        alert("Data kosong, tidak ada yang bisa didownload.");
        return;
    }
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">&larr; Dashboard</button>
      <h2>Laporan Sistem (Reports)</h2>

      {/* RINGKASAN KEUANGAN */}
      <div className="report-summary-container">
        <div className="summary-box green">
            <h3>Total Stok Barang</h3>
            <h1>{totalItems} Unit</h1>
        </div>
        <div className="summary-box blue">
            <h3>Estimasi Nilai Aset</h3>
            <h1>Rp {totalAssetValue.toLocaleString()}</h1>
        </div>
      </div>

      {/* NAVIGASI TAB */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => setActiveTab('stock')}>Laporan Stok</button>
        <button className={`tab-btn ${activeTab === 'trans' ? 'active' : ''}`} onClick={() => setActiveTab('trans')}>Riwayat Transaksi</button>
        <button className={`tab-btn ${activeTab === 'supplier' ? 'active' : ''}`} onClick={() => setActiveTab('supplier')}>Data Supplier</button>
      </div>

      {/* KONTEN TAB */}
      <div className="tab-content">
        
        {/* TAB 1: STOK */}
        {activeTab === 'stock' && (
            <div>
                <div className="tab-header">
                    <h3>Laporan Stok Terkini</h3>
                    <button onClick={() => downloadCSV(products, 'laporan_stok.csv')} className="btn-action bg-color-2">Download CSV</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr><th>Nama</th><th>SKU</th><th>Stok</th><th>Harga</th><th>Total Nilai</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.sku}</td>
                                <td>{p.stock}</td>
                                <td>{p.price.toLocaleString()}</td>
                                <td>{(p.stock * p.price).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* TAB 2: TRANSAKSI */}
        {activeTab === 'trans' && (
            <div>
                 <div className="tab-header">
                    <h3>Riwayat Transaksi Lengkap</h3>
                    <button onClick={() => downloadCSV(transactions, 'laporan_transaksi.csv')} className="btn-action bg-color-2">Download CSV</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr><th>Tanggal</th><th>Produk</th><th>Tipe</th><th>Jumlah</th><th>Catatan</th></tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.date}</td>
                                <td>{t.product_name}</td>
                                <td>{t.type === 'in' ? 'MASUK' : 'KELUAR'}</td>
                                <td>{t.quantity}</td>
                                <td>{t.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* TAB 3: SUPPLIER */}
        {activeTab === 'supplier' && (
             <div>
                <div className="tab-header">
                    <h3>Daftar Mitra Supplier</h3>
                    <button onClick={() => downloadCSV(suppliers, 'data_supplier.csv')} className="btn-action bg-color-2">Download CSV</button>
                </div>
                <table className="data-table">
                     <thead>
                        <tr><th>Nama</th><th>Kontak</th><th>Email</th></tr>
                    </thead>
                    <tbody>
                        {suppliers.map(s => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.contact}</td>
                                <td>{s.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

      </div>
    </div>
  );
}

export default Reports;