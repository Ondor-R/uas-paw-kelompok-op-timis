import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Products() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">&larr; Dashboard</button>
      <h2>Manajemen Produk</h2>

    </div>
  );
}

export default Products;