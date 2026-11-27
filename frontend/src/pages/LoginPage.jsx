import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function LoginPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = tab === "login" ? "/user/login" : "/user/register";
      const payload =
        tab === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await axios.post(`${API}${endpoint}`, payload);
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem("scent_token", token);
        localStorage.setItem("scent_user", JSON.stringify(user));
        if (onAuthSuccess) onAuthSuccess(user);
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/account");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo" onClick={() => navigate("/")}>
          <span className="login-logo-text">SCENTSAMPLE<span className="login-logo-np">.NP</span></span>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            className={`login-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {tab === "register" && (
            <div className="login-field">
              <label>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="login-field">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Back to store */}
        <button className="login-back" onClick={() => navigate("/")}>
          ← Back to store
        </button>
      </div>
    </div>
  );
}
