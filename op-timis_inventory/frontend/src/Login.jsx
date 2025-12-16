import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    try {
      const response = await axios.post('http://localhost:6543/login', {
        email: email,
        password: password
      });

      //Login Berhasil
      // Simpan user
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Tampilkan alert lalu redirect
      navigate('/dashboard');
      
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
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login Account</h2>
        
        {message && <p className="error-message">{message}</p>}

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="sigmaadmin@gmail.com"
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
            placeholder="admin123"
          />
        </div>

        <button type="submit" class="btn-login">Enter</button>
      </form>
    </div>
  );
}

export default Login;
