import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoOptimis from "./assets/OP-TIMIS.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      if (isRegister) {
        await axios.post("http://localhost:6543/register", {
          name,
          email,
          password,
        });
        setMessage("Registrasi Berhasil! Mohon tunggu validasi Admin.");
        setIsRegister(false);
        setName("");
        setPassword("");
      } else {
        const response = await axios.post("http://localhost:6543/login", {
          email,
          password,
        });
        setMessage("Login Berhasil!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Gagal menghubungi server backend.");
      }
    }
  };

  return (
    <div className="products-page auth-container">
      <form className="product-form-card auth-card" onSubmit={handleAuth}>
        <div className="text-center mb-20">
          <img src={logoOptimis} alt="Op-timis Logo" className="auth-logo" />
          <h2 className="auth-title">
            {isRegister ? "Register Account" : "Login Account"}
          </h2>
          <p className="auth-subtitle">Op-timis Inventory System</p>
        </div>

        {message && (
          <div
            className={`alert-modern ${
              message.includes("Berhasil") ? "alert-success" : "alert-error"
            }`}
          >
            {message}
          </div>
        )}

        {isRegister && (
          <div className="form-field mb-20">
            <label>Full Name</label>
            <input
              type="text"
              className="modern-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Masukkan nama lengkap"
            />
          </div>
        )}

        <div className="form-field mb-20">
          <label>Email</label>
          <input
            type="email"
            className="modern-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />
        </div>

        <div className="form-field mb-20">
          <label>Password</label>
          <input
            type="password"
            className="modern-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-submit-modern" style={{ width: "100%" }}>
          {isRegister ? "Register Now" : "Login"}
        </button>

        <div className="auth-footer">
          <p className="auth-subtitle">
            {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
            <span
              className="link-text"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login disini" : "Daftar Staff"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;