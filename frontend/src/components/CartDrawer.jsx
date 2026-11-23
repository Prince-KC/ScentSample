import React from "react";

const CartDrawer = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2500;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <h3>Your Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Free Shipping Progress bar for Nepal */}
        <div className="free-shipping-progress">
          <div className="progress-text">
            {remainingForFree === 0 ? (
              <span style={{ color: "#2b9348", fontWeight: "700" }}>
                <i className="fa-solid fa-check-circle" style={{ marginRight: "4px" }}></i>
                YOU'VE UNLOCKED FREE DELIVERY ACROSS KATHMANDU!
              </span>
            ) : (
              <span>
                Add <strong>Rs. {remainingForFree.toLocaleString()}</strong> more for FREE delivery in Kathmandu
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%`, backgroundColor: remainingForFree === 0 ? "#2b9348" : "#000" }}></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
              <i className="fa-solid fa-bag-shopping" style={{ fontSize: "40px", marginBottom: "16px", color: "#ccc" }}></i>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "#333", marginBottom: "6px" }}>Your Bag is Empty</p>
              <p style={{ fontSize: "13px" }}>Explore Middle Eastern, Designer & Niche decants to fill it.</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.productId}-${item.size}-${idx}`} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <span className="cart-item-brand">{item.brand}</span>
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-size">Sample Size: <strong>{item.size}</strong></p>
                  
                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button className="qty-btn" onClick={() => onUpdateQty(item.productId, item.size, item.quantity - 1)}>
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => onUpdateQty(item.productId, item.size, item.quantity + 1)}>
                        +
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "800" }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.productId, item.size)}
                        style={{ background: "none", color: "#999", fontSize: "13px" }}
                        title="Remove"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: "11px", color: "#777", marginBottom: "14px" }}>
              Taxes calculated at checkout. Cash on Delivery, eSewa & Khalti accepted.
            </p>
            <button className="checkout-btn" onClick={onProceedCheckout}>
              Checkout (Rs. {subtotal.toLocaleString()})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
