import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function ManageStaff() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        alert("Akses Ditolak!");
        navigate('/dashboard');
        return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const res = await axios.get('http://localhost:6543/users');
        setUsers(res.data);
    } catch (error) {
        console.error("Gagal ambil data user", error);
    }
  };

  const handleApprove = async (id, name) => {
    if(!window.confirm(`Yakin ingin mengaktifkan staff "${name}"?`)) return;
    try {
        await axios.post('http://localhost:6543/users/approve', { user_id: id });
        alert(`Staff ${name} berhasil diaktifkan!`);
        fetchUsers(); 
    } catch (error) {
        alert("Gagal update");
    }
  };

  const handleDelete = async (id, name, isPending) => {
    const actionWord = isPending ? "MENOLAK (Reject)" : "MENGHAPUS (Delete)";
    if(!window.confirm(`Apakah Anda yakin ingin ${actionWord} akun "${name}"? Data ini akan hilang permanen.`)) return;
    try {
        await axios.post('http://localhost:6543/users/delete', { user_id: id });
        alert(`Akun ${name} berhasil dihapus.`);
        fetchUsers(); 
    } catch (error) {
        alert("Gagal menghapus: " + (error.response?.data?.message || "Error"));
    }
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        &larr; Dashboard
      </button>

      <h2>Kelola Staff (HR)</h2>
      <p>Validasi pendaftaran baru atau hapus akses staff.</p>

      <table className="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nama Staff</th>
                <th>Email</th>
                <th>Status</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            {users.length === 0 && (
                <tr><td colSpan="5" style={{textAlign:'center'}}>Belum ada data staff.</td></tr>
            )}
            
            {users.map(u => (
                <tr key={u.id} style={{background: u.is_active ? 'white' : '#fff3cd'}}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                        {u.is_active ? 
                            <span className="badge badge-active">AKTIF</span> : 
                            <span className="badge badge-pending">PENDING</span>
                        }
                    </td>
                    <td>
                        <div className="staff-actions">
                            {!u.is_active && (
                                <button onClick={() => handleApprove(u.id, u.name)} className="btn-action bg-color-2">
                                    Accept
                                </button>
                            )}
                            <button onClick={() => handleDelete(u.id, u.name, !u.is_active)} className="btn-action bg-danger">
                                {!u.is_active ? 'Tolak' : 'Hapus Akun'}
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageStaff;