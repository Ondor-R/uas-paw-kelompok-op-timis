import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Login() {
  // State Login & Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State Khusus Register
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Default false (Mode Login)

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    try {
      if (isRegister) {
        // --- LOGIKA REGISTER (DAFTAR STAFF) ---
        await axios.post('http://localhost:6543/register', {
            name: name,
            email: email,
            password: password
        });
        setMessage('Registrasi Berhasil! Mohon tunggu validasi Admin.');
        setIsRegister(false); // Kembalikan ke mode login otomatis
        setName(''); // Reset nama
        setPassword(''); // Reset password

      } else {
        // --- LOGIKA LOGIN ---
        const response = await axios.post('http://localhost:6543/login', {
            email: email,
            password: password
        });

        setMessage('Login Berhasil!');
        // Simpan user & token
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/dashboard');
      }

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Gagal menghubungi server backend.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleAuth}>
        <h2 className="login-title">
            {isRegister ? 'Register Account' : 'Login Account'}
        </h2>
        
        {message && <p className="error-message">{message}</p>}

        {/* Input Nama hanya muncul saat Register */}
        {isRegister && (
            <div className="form-group">
                <label>Full Name:</label>
                <input 
                    type="text" 
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    placeholder="Budi Staff"
                />
            </div>
        )}

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="email@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            placeholder="******"
          />
        </div>

        <button type="submit" className="btn-login">
            {isRegister ? 'Register Now' : 'Enter'}
        </button>

        {/* Link Switch Mode */}
        <p className="toggle-text">
            {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <span className="toggle-link" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Login disini' : 'Daftar Staff'}
            </span>
        </p>

      </form>
    </div>
  );
}

export default Login;