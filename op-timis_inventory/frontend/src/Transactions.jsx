import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Transactions() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [type, setType] = useState('in');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchHistory();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:6543/products');
    setProducts(res.data);
    if(res.data.length > 0) setSelectedProduct(res.data[0].id);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get('http://localhost:6543/suppliers');
    setSuppliers(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get('http://localhost:6543/transactions');
    setTransactions(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Memproses...');
    try {
      await axios.post('http://localhost:6543/transactions', {
        product_id: selectedProduct,
        supplier_id: selectedSupplier,
        type: type,
        quantity: quantity,
        notes: notes
      });
      setMessage('Sukses! Stok telah berubah.');
      fetchHistory();
      setSelectedSupplier('');
      setQuantity('');
      setNotes('');
    } catch (error) {
      setMessage('Gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="page-container">
        <button onClick={() => navigate('/dashboard')} className="btn-back">&larr; Dashboard</button>
        <h2>Transaksi Stok (Masuk / Keluar)</h2>

        {/* FORM TRANSAKSI */}
        <div className="form-card" style={{ background: '#ffffffff' }}>
            <h3>Catat Transaksi Baru</h3>
            {message && <p className="alert-msg">{message}</p>}
            
            <form onSubmit={handleSubmit} className="transaction-form">
                {/* Pilih Produk */}
                <div className="trans-group">
                    <label>Produk:</label>
                    <select className="trans-select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Sisa: {p.stock})</option>
                        ))}
                    </select>
                </div>

                {/* Pilih Tipe */}
                <div className="trans-group">
                    <label>Tipe:</label>
                    <select className="trans-select" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="in">➕ Produk In (Purchase)</option>
                        <option value="out">➖ Produk Out (Sales)</option>
                    </select>
                </div>

                {/* Supplier (Conditional) */}
                {type === 'in' && (
                    <div className="trans-group" style={{background:'#dfdfdfff', padding:'5px', borderRadius:'4px'}}>
                        <label>Supplier (Wajib):</label>
                        <select className="trans-select" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} required={type === 'in'}>
                            <option value="">-- Pilih Supplier --</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                )} 

                {/* Jumlah */}
                <div className="trans-group" style={{ maxWidth: '100px' }}>
                    <label>Jumlah:</label>
                    <input className="trans-input" type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>

                {/* Catatan */}
                <div className="trans-group">
                    <label>Catatan:</label>
                    <input className="trans-input" type="text" placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <button type="submit" className="btn-action bg-color-2" style={{ height: '38px' }}>Simpan</button>
            </form>
        </div>

        {/* RIWAYAT TRANSAKSI */}
        <h3>Riwayat Transaksi</h3>
        <table className="data-table">
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Produk</th>
                    <th>Supplier</th>
                    <th>Tipe</th>
                    <th>Jumlah</th>
                    <th>Catatan</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map(t => (
                <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.product_name}</td>
                    <td>{t.supplier_name}</td>
                    <td style={{ color: t.type === 'in' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {t.type === 'in' ? 'MASUK' : 'KELUAR'}
                    </td>
                    <td>{t.quantity}</td>
                    <td>{t.notes}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}

export default Transactions;