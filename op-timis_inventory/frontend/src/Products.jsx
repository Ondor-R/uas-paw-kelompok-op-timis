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

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">&larr; Dashboard</button>
      <h2>Manajemen Produk</h2>

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