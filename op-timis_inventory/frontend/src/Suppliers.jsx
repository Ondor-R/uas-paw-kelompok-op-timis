import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', contact: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:6543/suppliers');
      setSuppliers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:6543/suppliers', form);
      setMessage('Supplier berhasil disimpan!');
      setForm({ name: '', contact: '', email: '' });
      fetchSuppliers();
    } catch (error) {
      setMessage('Gagal menambahkan supplier.');
    }
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">&larr; Dashboard</button>
      <h2>Manajemen Supplier</h2>

      {/* FORM TAMBAH */}
      <div className="form-card">
        <h3>Tambah Supplier Baru</h3>
        {message && <p className="alert-msg">{message}</p>}
        <form onSubmit={handleSubmit} className="form-grid-2">
          <input className="form-input" name="name" placeholder="Nama PT / Toko" value={form.name} onChange={handleChange} required />
          <input className="form-input" name="contact" placeholder="Kontak / No HP" value={form.contact} onChange={handleChange} required />
          <input className="form-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          
          <button type="submit" className="btn-action bg-color-2 form-grid-full">
            Simpan Supplier
          </button>
        </form>
      </div>

      {/* TABEL LIST */}
      <h3>Daftar Supplier</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kontak</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.contact}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Suppliers;