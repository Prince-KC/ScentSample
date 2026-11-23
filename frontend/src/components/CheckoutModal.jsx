import React, { useState } from "react";
import axios from "axios";

const CheckoutModal = ({ isOpen, onClose, items, onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    city: "Kathmandu",
    address: "",
    paymentMethod: "Cash on Delivery",
  });
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 2500 || formData.city === "Kathmandu (Pickup)" ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      ...formData,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        brand: i.brand,
        size: i.size,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      totalAmount: grandTotal,
    };

    try {
      const res = await axios.post("http://localhost:8000/order", orderPayload);
      if (res.data.success) {
        setPlacedOrder(res.data.result);
        setOrderComplete(true);
        onOrderSuccess();
      }
    } catch (err) {
      alert("Error placing order: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ padding: "32px" }}>
          {orderComplete ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#2b9348", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>
                ✓
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px" }}>
                Order Confirmed!
              </h3>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6", marginBottom: "20px" }}>
                Dhanyabad, <strong>{formData.customerName}</strong>! Your luxury decant order of <strong>Rs. {grandTotal.toLocaleString()}</strong> has been received. Our team in Kathmandu will call your number (<strong>{formData.phone}</strong>) for delivery scheduling.
              </p>
              <div style={{ background: "#f8f8f8", padding: "16px", borderRadius: "8px", textAlign: "left", fontSize: "13px", marginBottom: "24px" }}>
                <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
                <p><strong>Delivery Destination:</strong> {formData.address}, {formData.city}</p>
                <p><strong>Total Items:</strong> {items.length} decant(s)</p>
              </div>
              <button className="btn-primary" style={{ background: "#000", color: "#fff" }} onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: "20px", fontWeight: "900", textTransform: "uppercase", marginBottom: "4px" }}>
                Secure Checkout
              </h3>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>
                Fast delivery across Kathmandu Valley & all major cities of Nepal.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sujan Sharma"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "14px" }}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "14px", marginBottom: "14px" }}>
                  <div className="form-group">
                    <label>Delivery City *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Chitwan">Chitwan</option>
                      <option value="Butwal">Butwal</option>
                      <option value="Biratnagar">Biratnagar</option>
                      <option value="Dharan">Dharan</option>
                      <option value="Other Nepal">Other City in Nepal</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Street / Area Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Baneshwor, Marg 4, Near Temple"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                {/* Nepal Payment Options */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Payment Method (Nepal)
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["Cash on Delivery", "eSewa", "Khalti"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method })}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          border: formData.paymentMethod === method ? "2px solid #000" : "1px solid #ddd",
                          backgroundColor: formData.paymentMethod === method ? "#f7f7f7" : "#fff",
                          fontWeight: "700",
                          fontSize: "12px",
                        }}
                      >
                        {method === "eSewa" ? "🟢 eSewa" : method === "Khalti" ? "🟣 Khalti" : "💵 COD"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary box */}
                <div style={{ background: "#f8f8f8", padding: "14px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span>Items Subtotal:</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span>Delivery Fee:</span>
                    <span>{shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "15px", paddingTop: "8px", borderTop: "1px solid #e0e0e0" }}>
                    <span>Total Payable:</span>
                    <span>Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", background: "#000", color: "#fff" }}
                >
                  {loading ? "Confirming Order..." : `Place Order (Rs. ${grandTotal.toLocaleString()})`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
