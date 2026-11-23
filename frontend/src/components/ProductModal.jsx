import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState("fiveMl");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product?._id) {
      axios
        .get(`http://localhost:8000/review/product/${product._id}`)
        .then((res) => {
          if (res.data.success) {
            setReviews(res.data.result);
          }
        })
        .catch(() => {});
    }
  }, [product]);

  if (!product) return null;

  const getPrice = () => {
    if (product.samplePrices) {
      if (selectedSize === "twoMl") return product.samplePrices.twoMl || Math.round(product.price * 0.45);
      if (selectedSize === "fiveMl") return product.samplePrices.fiveMl || product.price;
      if (selectedSize === "tenMl") return product.samplePrices.tenMl || Math.round(product.price * 1.85);
    }
    return product.price;
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;

    setSubmittingReview(true);
    try {
      const res = await axios.post("http://localhost:8000/review", {
        productId: product._id,
        userName: newReview.userName,
        rating: Number(newReview.rating),
        comment: newReview.comment,
        scentLongevity: "8+ Hours",
      });

      if (res.data.success) {
        setReviews([res.data.result, ...reviews]);
        setNewReview({ userName: "", rating: 5, comment: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      productId: product._id,
      name: product.name,
      brand: product.brand,
      size: selectedSize === "twoMl" ? "2ml" : selectedSize === "fiveMl" ? "5ml" : "10ml",
      price: getPrice(),
      image: product.image,
      category: product.category,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="product-modal-grid">
          {/* Left: Image view */}
          <div className="detail-image-box">
            <img src={product.image} alt={product.name} className="detail-image" />
          </div>

          {/* Right: Details */}
          <div>
            <span className="detail-brand">{product.brand} • {product.category}</span>
            <h2 className="detail-title">{product.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <span style={{ color: "#f4a261", fontSize: "14px", fontWeight: "700" }}>
                ★ {product.rating || 4.9}
              </span>
              <span style={{ color: "#777", fontSize: "12px" }}>
                ({reviews.length > 0 ? reviews.length : product.reviewsCount || 20} Verified Buyer Reviews)
              </span>
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Scent Pyramid */}
            <div className="notes-pyramid">
              <div className="pyramid-level">
                <span className="level-name">
                  <i className="fa-solid fa-cloud" style={{ color: "var(--gold-accent)" }}></i> Top Notes (0 - 30 mins)
                </span>
                <p className="level-notes">
                  {product.notes?.top?.length ? product.notes.top.join(", ") : "Zesty Bergamot, Cardamom, Citrus Sparkle"}
                </p>
              </div>

              <div className="pyramid-level">
                <span className="level-name">
                  <i className="fa-solid fa-heart" style={{ color: "var(--gold-accent)" }}></i> Heart / Middle Notes (30 mins - 4 hrs)
                </span>
                <p className="level-notes">
                  {product.notes?.middle?.length ? product.notes.middle.join(", ") : "French Lavender, Praline, Sweet Spices"}
                </p>
              </div>

              <div className="pyramid-level">
                <span className="level-name">
                  <i className="fa-solid fa-tree" style={{ color: "var(--gold-accent)" }}></i> Base Notes (Drydown 4 - 12+ hrs)
                </span>
                <p className="level-notes">
                  {product.notes?.base?.length ? product.notes.base.join(", ") : "Ambergris, Warm Vanilla, Creamy Sandalwood"}
                </p>
              </div>
            </div>

            {/* Spray Guide */}
            <div className="spray-guide">
              <i className="fa-solid fa-spray-can-sparkles" style={{ color: "var(--gold-accent)", fontSize: "16px" }}></i>
              <span>
                <strong>Decant Guide:</strong> 2ml = ~30 sprays | 5ml = ~75 sprays | 10ml = ~150 sprays. Hand-filled in sterile glass atomizers with Teflon sealing.
              </span>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                Select Decant Sample Size:
              </label>
              <div className="size-selector">
                <button
                  type="button"
                  className={`size-pill ${selectedSize === "twoMl" ? "active" : ""}`}
                  onClick={() => setSelectedSize("twoMl")}
                >
                  2 ML • Rs. {(product.samplePrices?.twoMl || Math.round(product.price * 0.45)).toLocaleString()}
                </button>
                <button
                  type="button"
                  className={`size-pill ${selectedSize === "fiveMl" ? "active" : ""}`}
                  onClick={() => setSelectedSize("fiveMl")}
                >
                  5 ML • Rs. {(product.samplePrices?.fiveMl || product.price).toLocaleString()}
                </button>
                <button
                  type="button"
                  className={`size-pill ${selectedSize === "tenMl" ? "active" : ""}`}
                  onClick={() => setSelectedSize("tenMl")}
                >
                  10 ML • Rs. {(product.samplePrices?.tenMl || Math.round(product.price * 1.85)).toLocaleString()}
                </button>
              </div>
            </div>

            {/* Add to Bag Button */}
            <button className="btn-primary" style={{ width: "100%", background: "#000", color: "#fff" }} onClick={handleAddToCart}>
              <i className="fa-solid fa-bag-shopping" style={{ marginRight: "8px" }}></i> Add to Bag (Rs. {getPrice().toLocaleString()})
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h4>Customer Fragrance Reviews & Longevity Reports</h4>

          {/* New Review Form */}
          <form onSubmit={handleAddReview} style={{ backgroundColor: "#fafafa", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
            <h5 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", textTransform: "uppercase" }}>Leave Your Review</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Your Name (e.g. Samir from Kathmandu)"
                value={newReview.userName}
                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                required
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }}
              />
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px" }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
              </select>
            </div>
            <textarea
              placeholder="How did this sample smell to you? How long did it project on your skin?"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              rows={2}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", marginBottom: "10px" }}
            />
            <button type="submit" disabled={submittingReview} className="btn-primary" style={{ background: "#000", color: "#fff", padding: "8px 20px", fontSize: "12px" }}>
              {submittingReview ? "Submitting..." : "Post Review"}
            </button>
          </form>

          {/* List of reviews */}
          {reviews.length === 0 ? (
            <p style={{ color: "#777", fontSize: "13px" }}>No reviews yet for this decant. Be the first to share your olfactory thoughts!</p>
          ) : (
            reviews.map((rev, idx) => (
              <div key={idx} className="review-item">
                <div className="review-author">
                  <span>{rev.userName} <span style={{ color: "#2b9348", fontSize: "11px", marginLeft: "6px" }}><i className="fa-solid fa-check"></i> Verified Sample Tester</span></span>
                  <span style={{ color: "#f4a261" }}>{"★".repeat(rev.rating)}</span>
                </div>
                <p className="review-text">"{rev.comment}"</p>
                {rev.scentLongevity && (
                  <span style={{ fontSize: "11px", color: "#888", display: "inline-block", marginTop: "4px" }}>
                    ⏱ Longevity: {rev.scentLongevity}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
