import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:6543/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
    }
  };

  const [form, setForm] = useState({
    name: '', sku: '', category: '', price: '', stock: '', min_stock: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:6543/products', form);
      setMessage('Produk berhasil ditambahkan!');
      setForm({ name: '', sku: '', category: '', price: '', stock: '', min_stock: '' });
      fetchProducts(); // Refresh tabel otomatis
    } catch (error) {
      setMessage('Gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="page-container">
        <button onClick={() => navigate('/dashboard')} className="btn-back">&larr; Dashboard</button>
        <h2>Manajemen Produk</h2>

        <div className="form-card">
            <h3>Tambah Produk Baru</h3>
            {message && <p className="alert-msg" style={{color: 'blue'}}>{message}</p>}
            
            <form onSubmit={handleSubmit} className="form-grid-2">
            <input className="form-input" name="name" placeholder="Nama Produk" value={form.name} onChange={handleChange} required />
            <input className="form-input" name="sku" placeholder="SKU (Kode Unik)" value={form.sku} onChange={handleChange} required />
            <input className="form-input" name="category" placeholder="Kategori" value={form.category} onChange={handleChange} />
            <input className="form-input" name="price" type="number" placeholder="Harga" value={form.price} onChange={handleChange} required />
            <input className="form-input" name="stock" type="number" placeholder="Stok Awal" value={form.stock} onChange={handleChange} required />
            <input className="form-input" name="min_stock" type="number" placeholder="Stok Minimum" value={form.min_stock} onChange={handleChange} required />
            
            <button type="submit" className="btn-action bg-color-2 form-grid-full">Simpan Produk</button>
            </form>
        </div>

        <h3>Daftar Produk</h3>
        <table className="data-table">
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Min Stok</th>
                </tr>
            </thead>
            <tbody>
            {products.map((p) => (
                <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>Rp {p.price.toLocaleString()}</td>
                <td style={{ fontWeight: 'bold', color: p.stock <= p.min_stock ? 'red' : 'inherit' }}>
                    {p.stock}
                </td>
                <td>{p.min_stock}</td>
                </tr>
            ))}
            </tbody>
        </table>

    </div>
  );
}

export default Products;