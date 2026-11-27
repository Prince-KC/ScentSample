import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CustomerAccount.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_COLORS = {
  Processing: { bg: "#1a1a2e", color: "#6fa3ef", border: "#6fa3ef33" },
  Dispatched: { bg: "#1a2a1a", color: "#6fe090", border: "#6fe09033" },
  Delivered: { bg: "#1a2a1a", color: "#c8a96e", border: "#c8a96e33" },
};

export default function CustomerAccount({ user, onLogout }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/order/customer/${encodeURIComponent(user.email)}`);
      if (res.data.success) setOrders(res.data.result);
    } catch {
      // fallback: fetch all and filter client side
      try {
        const res = await axios.get(`${API}/order`);
        if (res.data.success) {
          setOrders(res.data.result.filter((o) => o.email === user.email));
        }
      } catch (err) {
        console.error("Could not fetch orders", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="account-page">
      {/* Sidebar */}
      <aside className="account-sidebar">
        <div className="account-logo" onClick={() => navigate("/")}>
          SCENTSAMPLE<span>.NP</span>
        </div>

        <div className="account-profile-pill">
          <div className="account-avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div className="account-name">{user.name}</div>
            <div className="account-email">{user.email}</div>
          </div>
        </div>

        <nav className="account-nav">
          {[
            { id: "orders", icon: "fa-box", label: "My Orders" },
            { id: "profile", icon: "fa-user", label: "Profile" },
          ].map((item) => (
            <button
              key={item.id}
              className={`account-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="account-sidebar-bottom">
          <button className="account-nav-item" onClick={() => navigate("/")}>
            <i className="fa-solid fa-store"></i> Back to Store
          </button>
          <button className="account-nav-item logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="account-main">
        {activeTab === "orders" && (
          <section className="account-section">
            <div className="account-section-header">
              <h1>My Orders</h1>
              <p>{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
            </div>

            {loading ? (
              <div className="account-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Loading your orders…</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="account-empty">
                <i className="fa-solid fa-box-open"></i>
                <h3>No orders yet</h3>
                <p>Your orders will appear here after you shop.</p>
                <button className="account-cta" onClick={() => navigate("/")}>
                  Explore Fragrances
                </button>
              </div>
            ) : (
              <div className="order-list">
                {orders.map((order) => {
                  const style = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.Processing;
                  return (
                    <div className="order-card" key={order._id}>
                      <div className="order-card-head">
                        <div>
                          <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                        <span
                          className="order-status-badge"
                          style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="order-card-body">
                        <div className="order-items-list">
                          {order.items?.map((item, i) => (
                            <span key={i} className="order-item-pill">
                              {item.name} · {item.size}
                            </span>
                          ))}
                        </div>
                        <div className="order-total">
                          Rs. {order.totalPrice?.toLocaleString() || "—"}
                        </div>
                      </div>
                      {order.address && (
                        <div className="order-address">
                          <i className="fa-solid fa-location-dot"></i>
                          {order.address}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "profile" && (
          <section className="account-section">
            <div className="account-section-header">
              <h1>Profile</h1>
            </div>
            <div className="profile-card">
              <div className="profile-avatar-large">{user.name?.charAt(0).toUpperCase()}</div>
              <div className="profile-details">
                <div className="profile-row">
                  <span className="profile-label">Name</span>
                  <span className="profile-value">{user.name}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{user.email}</span>
                </div>
                <div className="profile-row">
                  <span className="profile-label">Account Type</span>
                  <span className="profile-value" style={{ textTransform: "capitalize" }}>{user.role}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
