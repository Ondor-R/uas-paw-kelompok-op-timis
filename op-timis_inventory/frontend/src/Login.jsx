import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoOptimis from "./assets/OP-TIMIS.png";

function Login() {
  // State Login & Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State Khusus Register
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Default false (Mode Login)

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      if (isRegister) {
        // --- LOGIKA REGISTER (DAFTAR STAFF) ---
        await axios.post("http://localhost:6543/register", {
          name: name,
          email: email,
          password: password,
        });
        setMessage("Registrasi Berhasil! Mohon tunggu validasi Admin.");
        setIsRegister(false); // Kembalikan ke mode login otomatis
        setName(""); // Reset nama
        setPassword(""); // Reset password
      } else {
        // --- LOGIKA LOGIN ---
        const response = await axios.post("http://localhost:6543/login", {
          email: email,
          password: password,
        });

        setMessage("Login Berhasil!");
        // Simpan user & token
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
    <div
      className="products-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        className="product-form-card"
        onSubmit={handleAuth}
        style={{ maxWidth: "450px", width: "100%" }}
      >
        {/* Logo and Title */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img
            src={logoOptimis}
            alt="Op-timis Logo"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              marginBottom: "20px",
            }}
          />
          <h2
            style={{
              margin: "0 0 10px 0",
              fontSize: "28px",
              color: "#1a202c",
              fontWeight: "bold",
            }}
          >
            {isRegister ? "Register Account" : "Login Account"}
          </h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Op-timis Inventory System
          </p>
        </div>

        {message && (
          <div
            className={`alert-modern ${
              message.includes("Berhasil") ? "alert-success" : "alert-error"
            }`}
            style={{ marginBottom: "20px" }}
          >
            {message}
          </div>
        )}

        {/* Input Nama hanya muncul saat Register */}
        {isRegister && (
          <div className="form-field" style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#1a202c",
                fontWeight: "600",
              }}
            >
              Full Name
            </label>
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

        <div className="form-field" style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#1a202c",
              fontWeight: "600",
            }}
          >
            Email
          </label>
          <input
            type="email"
            className="modern-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />
        </div>

        <div className="form-field" style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#1a202c",
              fontWeight: "600",
            }}
          >
            Password
          </label>
          <input
            type="password"
            className="modern-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="btn-submit-modern"
          style={{ width: "100%" }}
        >
          {isRegister ? "Register Now" : "Login"}
        </button>

        {/* Link Switch Mode */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
            <span
              style={{
                color: "#3b82f6",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
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
