import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_OPTIONS = ["Processing", "Dispatched", "Delivered"];

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Data
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Order filter
  const [statusFilter, setStatusFilter] = useState("All");

  // Toast
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Fetch ──────────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get(`${API}/order`);
      if (res.data.success) setOrders(res.data.result);
    } catch { /* ignore */ } finally { setLoadingOrders(false); }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${API}/product`);
      if (res.data.success) setProducts(res.data.result);
    } catch { /* ignore */ } finally { setLoadingProducts(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${API}/user`);
      if (res.data.success) setUsers(res.data.result);
    } catch { /* ignore */ } finally { setLoadingUsers(false); }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, []);

  // ── Actions ───────────────────────────────────────────────
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/order/${id}`, { orderStatus: status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)));
      showToast(`Order status → ${status}`);
    } catch { showToast("Failed to update status"); }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await axios.delete(`${API}/order/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      showToast("Order deleted");
    } catch { showToast("Failed to delete order"); }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await axios.delete(`${API}/user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast("User deleted");
    } catch { showToast("Failed to delete user"); }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/product/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Product deleted");
    } catch { showToast("Failed to delete product"); }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  // ── Stats ─────────────────────────────────────────────────
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const processing = orders.filter((o) => o.orderStatus === "Processing").length;
  const dispatched = orders.filter((o) => o.orderStatus === "Dispatched").length;
  const delivered = orders.filter((o) => o.orderStatus === "Delivered").length;

  const filteredOrders =
    statusFilter === "All" ? orders : orders.filter((o) => o.orderStatus === statusFilter);

  // ── Nav items ─────────────────────────────────────────────
  const navItems = [
    { id: "overview", icon: "fa-chart-simple", label: "Overview" },
    { id: "orders", icon: "fa-box", label: "Orders" },
    { id: "products", icon: "fa-spray-can-sparkles", label: "Products" },
    { id: "users", icon: "fa-users", label: "Users" },
  ];

  return (
    <div className="admin-page">
      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo" onClick={() => navigate("/")}>
          SCENTSAMPLE<span>.NP</span>
        </div>
        <div className="admin-badge">Admin Panel</div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="admin-nav-item" onClick={() => navigate("/")}>
            <i className="fa-solid fa-store"></i> View Store
          </button>
          <button className="admin-nav-item logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* ── OVERVIEW ───────────────────────────────────── */}
        {activeTab === "overview" && (
          <section className="admin-section">
            <h1 className="admin-title">Overview</h1>
            <div className="stats-grid">
              <StatCard icon="fa-box" label="Total Orders" value={orders.length} />
              <StatCard icon="fa-money-bill-wave" label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} accent />
              <StatCard icon="fa-spray-can-sparkles" label="Products" value={products.length} />
              <StatCard icon="fa-users" label="Customers" value={users.filter((u) => u.role !== "admin").length} />
            </div>

            <div className="stats-grid" style={{ marginTop: 16 }}>
              <StatCard icon="fa-clock" label="Processing" value={processing} color="#6fa3ef" />
              <StatCard icon="fa-truck" label="Dispatched" value={dispatched} color="#c8a96e" />
              <StatCard icon="fa-check-circle" label="Delivered" value={delivered} color="#6fe090" />
            </div>

            {/* Recent orders preview */}
            <div style={{ marginTop: 40 }}>
              <div className="admin-section-subheader">
                <h2>Recent Orders</h2>
                <button className="admin-link-btn" onClick={() => setActiveTab("orders")}>View all →</button>
              </div>
              <OrderTable
                orders={orders.slice(0, 5)}
                onStatusChange={updateOrderStatus}
                onDelete={deleteOrder}
                compact
              />
            </div>
          </section>
        )}

        {/* ── ORDERS ─────────────────────────────────────── */}
        {activeTab === "orders" && (
          <section className="admin-section">
            <div className="admin-section-header-row">
              <h1 className="admin-title">Orders <span className="admin-count">{orders.length}</span></h1>
              <div className="filter-pills">
                {["All", ...STATUS_OPTIONS].map((s) => (
                  <button
                    key={s}
                    className={`filter-pill ${statusFilter === s ? "active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {loadingOrders ? (
              <Loader />
            ) : (
              <OrderTable
                orders={filteredOrders}
                onStatusChange={updateOrderStatus}
                onDelete={deleteOrder}
              />
            )}
          </section>
        )}

        {/* ── PRODUCTS ───────────────────────────────────── */}
        {activeTab === "products" && (
          <section className="admin-section">
            <div className="admin-section-header-row">
              <h1 className="admin-title">Products <span className="admin-count">{products.length}</span></h1>
            </div>
            {loadingProducts ? <Loader /> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div className="product-cell">
                            {p.image && (
                              <img
                                src={p.image.startsWith("http") ? p.image : `${window.location.origin}${p.image}`}
                                alt={p.name}
                                className="product-thumb"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            )}
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td>{p.brand}</td>
                        <td><span className="category-pill">{p.category}</span></td>
                        <td>Rs. {p.price}</td>
                        <td>
                          <button className="table-action-btn danger" onClick={() => deleteProduct(p._id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── USERS ──────────────────────────────────────── */}
        {activeTab === "users" && (
          <section className="admin-section">
            <div className="admin-section-header-row">
              <h1 className="admin-title">Users <span className="admin-count">{users.length}</span></h1>
            </div>
            {loadingUsers ? <Loader /> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="user-avatar-sm">{u.name?.charAt(0).toUpperCase()}</div>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ color: "#888" }}>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                        <td>
                          {u.role !== "admin" && (
                            <button className="table-action-btn danger" onClick={() => deleteUser(u._id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function StatCard({ icon, label, value, accent, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={color ? { color } : accent ? { color: "#c8a96e" } : {}}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="stat-value" style={color ? { color } : accent ? { color: "#c8a96e" } : {}}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function OrderTable({ orders, onStatusChange, onDelete, compact }) {
  if (orders.length === 0) {
    return (
      <div className="admin-empty">
        <i className="fa-solid fa-box-open"></i>
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            {!compact && <th>Items</th>}
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="order-id-cell">#{o._id.slice(-8).toUpperCase()}</td>
              <td>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customerName || o.name || "—"}</div>
                  <div style={{ color: "#555", fontSize: 11 }}>{o.email}</div>
                </div>
              </td>
              {!compact && (
                <td>
                  <div className="items-preview">
                    {o.items?.slice(0, 2).map((item, i) => (
                      <span key={i} className="item-chip">{item.name} · {item.size}</span>
                    ))}
                    {o.items?.length > 2 && (
                      <span className="item-chip">+{o.items.length - 2} more</span>
                    )}
                  </div>
                </td>
              )}
              <td style={{ color: "#c8a96e", fontWeight: 700 }}>
                Rs. {o.totalPrice?.toLocaleString() || "—"}
              </td>
              <td>
                <select
                  className="status-select"
                  value={o.orderStatus}
                  onChange={(e) => onStatusChange(o._id, e.target.value)}
                  data-status={o.orderStatus}
                >
                  {["Processing", "Dispatched", "Delivered"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td style={{ color: "#555", fontSize: 12 }}>
                {new Date(o.createdAt).toLocaleDateString("en-US", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </td>
              <td>
                <button className="table-action-btn danger" onClick={() => onDelete(o._id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Loader() {
  return (
    <div className="admin-loading">
      <i className="fa-solid fa-spinner fa-spin"></i>
      <span>Loading…</span>
    </div>
  );
}
