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

    </div>
  );
}

export default Products;