import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function ManageStaff() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      alert("Akses Ditolak!");
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://72.62.120.161:6543/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Gagal ambil data user", error);
    }
  };

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Yakin ingin mengaktifkan staff "${name}"?`)) return;
    try {
      await axios.post("http://72.62.120.161:6543/users/approve", { user_id: id });
      setMessage(`✅ Staff ${name} berhasil diaktifkan!`);
      fetchUsers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Gagal mengaktifkan staff");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id, name, isPending) => {
    const actionWord = isPending ? "MENOLAK (Reject)" : "MENGHAPUS (Delete)";
    if (
      !window.confirm(
        `Apakah Anda yakin ingin ${actionWord} akun "${name}"? Data ini akan hilang permanen.`
      )
    )
      return;
    try {
      await axios.post("http://72.62.120.161:6543/users/delete", { user_id: id });
      setMessage(`✅ Akun ${name} berhasil dihapus.`);
      fetchUsers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        "❌ Gagal menghapus: " + (error.response?.data?.message || "Error")
      );
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="products-page">
      {/* Header Section */}
      <div className="products-header">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-back-modern"
        >
          <span>←</span> Kembali
        </button>
        <h1 className="products-title">Kelola Staff (HR)</h1>
        <div style={{ width: "160px" }}></div> {/* Spacer for alignment */}
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`alert-modern ${
            message.includes("✅") ? "alert-success" : "alert-error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Info Box */}
      <div className="product-form-card" style={{ marginBottom: "20px" }}>
        <p style={{ margin: 0, color: "#666" }}>
          ℹ️ Validasi pendaftaran baru atau hapus akses staff.
        </p>
      </div>

      {/* TABEL DAFTAR STAFF */}
      <div className="products-table-container">
        <div className="table-header">
          <h3>Daftar Staff</h3>
          <span className="product-count">{users.length} Staff</span>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
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
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    Belum ada data staff.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className={!u.is_active ? "row-low-stock" : ""}
                  >
                    <td>{u.id}</td>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {u.is_active ? (
                        <span className="status-badge status-ok">AKTIF</span>
                      ) : (
                        <span className="status-badge status-warning">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        {!u.is_active && (
                          <button
                            onClick={() => handleApprove(u.id, u.name)}
                            className="btn-submit-modern"
                            style={{
                              padding: "6px 16px",
                              fontSize: "13px",
                              background: "#28a745",
                            }}
                          >
                            ✓ Accept
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDelete(u.id, u.name, !u.is_active)
                          }
                          className="btn-submit-modern"
                          style={{
                            padding: "6px 16px",
                            fontSize: "13px",
                            background: "#dc3545",
                          }}
                        >
                          ✕ {!u.is_active ? "Tolak" : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageStaff;
