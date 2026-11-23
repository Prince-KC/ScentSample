import React, { useState } from "react";
import axios from "axios";

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin
      ? "http://localhost:8000/user/login"
      : "http://localhost:8000/user/register";

    try {
      const res = await axios.post(url, formData);
      if (res.data.success) {
        localStorage.setItem("scent_token", res.data.token);
        localStorage.setItem("scent_user", JSON.stringify(res.data.user));
        onAuthSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ padding: "36px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #e5e5e5", marginBottom: "24px" }}>
            <button
              style={{
                flex: 1,
                padding: "12px",
                fontWeight: "800",
                fontSize: "14px",
                textTransform: "uppercase",
                borderBottom: isLogin ? "2px solid #000" : "none",
                background: "none",
              }}
              onClick={() => { setIsLogin(true); setError(""); }}
            >
              Sign In
            </button>
            <button
              style={{
                flex: 1,
                padding: "12px",
                fontWeight: "800",
                fontSize: "14px",
                textTransform: "uppercase",
                borderBottom: !isLogin ? "2px solid #000" : "none",
                background: "none",
                color: !isLogin ? "#000" : "#888",
              }}
              onClick={() => { setIsLogin(false); setError(""); }}
            >
              Register
            </button>
          </div>

          {error && (
            <div style={{ backgroundColor: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: "6px", fontSize: "12px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aayush Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: "14px" }}>
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", background: "#000", color: "#fff" }}
            >
              {loading ? "Processing..." : isLogin ? "Sign In to Account" : "Create Account"}
            </button>
          </form>

          {isLogin && (
            <div style={{ marginTop: "16px", padding: "10px", background: "#f8f8f8", borderRadius: "6px", fontSize: "11px", color: "#666" }}>
              <strong>Demo Admin:</strong> admin@scentsample.np / admin123
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
