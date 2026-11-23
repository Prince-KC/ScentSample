import React, { useState, useEffect } from "react";
import axios from "axios";
import { defaultProducts } from "../data/defaultProducts";

// This Admin Panel implements all the assignment MERN features:
// - CreateProduct (Product.create)
// - ReadAllProduct (Product.find)
// - UpdateProduct (Product.findByIdAndUpdate)
// - DeleteProduct (Product.findByIdAndDelete)
// - ReadAllUser (User.find)
const AdminPanel = ({ isOpen, onClose, onRefreshProducts }) => {
  const [activeTab, setActiveTab] = useState("products"); // 'products', 'create', 'users'
  const [products, setProducts] = useState(defaultProducts);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states matching CreateProduct.jsx
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "Middle Eastern",
    scentFamily: "Gourmand Spicy",
    price: "",
    twoMl: "",
    fiveMl: "",
    tenMl: "",
    quantity: 50,
    description: "",
    image: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/product");
      if (res.data.success) {
        setProducts(res.data.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/user");
      if (res.data.success) {
        setUsers(res.data.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Create Product (matching assignment CreateProduct.jsx)
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const basePrice = Number(formData.price);
    const payload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      scentFamily: formData.scentFamily,
      price: basePrice,
      samplePrices: {
        twoMl: formData.twoMl ? Number(formData.twoMl) : Math.round(basePrice * 0.45),
        fiveMl: formData.fiveMl ? Number(formData.fiveMl) : basePrice,
        tenMl: formData.tenMl ? Number(formData.tenMl) : Math.round(basePrice * 1.85),
      },
      quantity: Number(formData.quantity) || 50,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    };

    try {
      if (editingProduct) {
        // Update Product
        await axios.patch(`http://localhost:8000/product/${editingProduct._id}`, payload);
        alert("Perfume updated successfully!");
        setEditingProduct(null);
      } else {
        // Create Product
        await axios.post("http://localhost:8000/product", payload);
        alert("Perfume created successfully!");
      }

      setFormData({
        name: "",
        brand: "",
        category: "Middle Eastern",
        scentFamily: "Gourmand Spicy",
        price: "",
        twoMl: "",
        fiveMl: "",
        tenMl: "",
        quantity: 50,
        description: "",
        image: "",
      });

      fetchProducts();
      onRefreshProducts();
      setActiveTab("products");
    } catch (err) {
      alert("Error saving perfume: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Product (matching assignment DeleteProduct.jsx)
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`http://localhost:8000/product/${id}`);
      alert("Product deleted successfully.");
      fetchProducts();
      onRefreshProducts();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const startEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      scentFamily: p.scentFamily || "",
      price: p.price,
      twoMl: p.samplePrices?.twoMl || "",
      fiveMl: p.samplePrices?.fiveMl || "",
      tenMl: p.samplePrices?.tenMl || "",
      quantity: p.quantity || 50,
      description: p.description || "",
      image: p.image || "",
    });
    setActiveTab("create");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="admin-header">
          <div>
            <h3>ScentSampleNepal — MERN Stack Control Center</h3>
            <p style={{ fontSize: "12px", color: "#666" }}>
              Full CRUD features for Products & Users connected to MongoDB
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <i className="fa-solid fa-boxes-stacked" style={{ marginRight: "6px" }}></i>
            All Perfumes ({products.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => {
              if (activeTab !== "create") setEditingProduct(null);
              setActiveTab("create");
            }}
          >
            <i className="fa-solid fa-plus" style={{ marginRight: "6px" }}></i>
            {editingProduct ? "Edit Perfume" : "Add New Decant"}
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fa-solid fa-users" style={{ marginRight: "6px" }}></i>
            Registered Users ({users.length})
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === "products" && (
          <div className="admin-body">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700" }}>Live Database Items ({products.length})</span>
              <button
                className="btn-primary"
                style={{ background: "#000", color: "#fff", padding: "6px 14px", fontSize: "11px" }}
                onClick={() => { setEditingProduct(null); setActiveTab("create"); }}
              >
                + Add New Scent
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>5ml Price (Rs)</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      </td>
                      <td><strong>{prod.name}</strong></td>
                      <td>{prod.brand}</td>
                      <td>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: prod.category === "Niche" ? "#fdf0d5" : prod.category === "Designer" ? "#e0f2fe" : "#f1f5f9"
                        }}>
                          {prod.category}
                        </span>
                      </td>
                      <td>Rs. {prod.price.toLocaleString()}</td>
                      <td>{prod.quantity || 50}</td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-icon-edit"
                            onClick={() => startEdit(prod)}
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            className="btn-icon-del"
                            onClick={() => handleDelete(prod._id, prod.name)}
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Create / Update Product Form */}
        {activeTab === "create" && (
          <div className="admin-body">
            <h4 style={{ fontSize: "16px", fontWeight: "800", textTransform: "uppercase", marginBottom: "16px" }}>
              {editingProduct ? `Edit Perfume: ${editingProduct.name}` : "Create New Fragrance Decant"}
            </h4>

            <form onSubmit={handleCreate}>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Perfume Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Khamrah Qahwa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Brand / House *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lattafa / Dior / Creed"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Middle Eastern">Middle Eastern</option>
                    <option value="Designer">Designer</option>
                    <option value="Niche">Niche</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Scent Profile Family</label>
                  <input
                    type="text"
                    placeholder="e.g. Woody Amber / Fresh Aquatic"
                    value={formData.scentFamily}
                    onChange={(e) => setFormData({ ...formData, scentFamily: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Standard 5ml Base Price (NPR Rs.) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 850"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>2ml Sample Price (NPR Rs.)</label>
                  <input
                    type="number"
                    placeholder="Auto-calculated if blank (e.g. 400)"
                    value={formData.twoMl}
                    onChange={(e) => setFormData({ ...formData, twoMl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>10ml Sample Price (NPR Rs.)</label>
                  <input
                    type="number"
                    placeholder="Auto-calculated if blank (e.g. 1550)"
                    value={formData.tenMl}
                    onChange={(e) => setFormData({ ...formData, tenMl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Quantity in Stock</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Bottle / Decant Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label>Description & Story</label>
                <textarea
                  rows={3}
                  placeholder="Olfactory profile, occasion, and notes breakdown..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ background: "#000", color: "#fff" }}
                >
                  {loading ? "Saving to MongoDB..." : editingProduct ? "Update Perfume" : "Add to Live Store"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ color: "#000", borderColor: "#ccc" }}
                    onClick={() => { setEditingProduct(null); setActiveTab("products"); }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Users Table (matching ReadAllUser.jsx) */}
        {activeTab === "users" && (
          <div className="admin-body">
            <h4 style={{ fontSize: "16px", fontWeight: "800", textTransform: "uppercase", marginBottom: "16px" }}>
              Registered Users & Customers
            </h4>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: u.role === "admin" ? "#dcfce7" : "#f3f4f6",
                        color: u.role === "admin" ? "#166534" : "#374151"
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
