import React, { useState } from "react";

const ProductCard = ({
  product,
  onOpenDetails,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [selectedSize, setSelectedSize] = useState("fiveMl");

  // Price calculations based on selected decant size
  const getPrice = () => {
    if (product.samplePrices) {
      if (selectedSize === "twoMl") return product.samplePrices.twoMl || Math.round(product.price * 0.45);
      if (selectedSize === "fiveMl") return product.samplePrices.fiveMl || product.price;
      if (selectedSize === "tenMl") return product.samplePrices.tenMl || Math.round(product.price * 1.85);
    }
    return product.price;
  };

  const getSizeLabel = () => {
    if (selectedSize === "twoMl") return "2ml (~30 sprays)";
    if (selectedSize === "fiveMl") return "5ml (~75 sprays)";
    if (selectedSize === "tenMl") return "10ml (~150 sprays)";
    return "5ml";
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart({
      productId: product._id,
      name: product.name,
      brand: product.brand,
      size: selectedSize === "twoMl" ? "2ml" : selectedSize === "fiveMl" ? "5ml" : "10ml",
      price: getPrice(),
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div className="product-card">
      {/* Badge (Bestseller, Middle Eastern, etc.) */}
      <span className="card-badge">{product.badge || product.category}</span>

      {/* Wishlist Heart Button */}
      <button
        className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        title="Save to Wishlist"
      >
        <i className={isWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
      </button>

      {/* Product Image */}
      <div className="card-image-wrap" onClick={() => onOpenDetails(product)}>
        <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
      </div>

      {/* Content */}
      <div className="card-content">
        <span className="card-brand">{product.brand}</span>
        <h3 className="card-title" onClick={() => onOpenDetails(product)} title={product.name}>
          {product.name}
        </h3>
        <p className="card-family">
          <i className="fa-solid fa-droplet" style={{ fontSize: "10px", marginRight: "4px", color: "var(--gold-accent)" }}></i>
          {product.scentFamily || "Eau de Parfum"}
        </p>

        {/* Decant Size Selector (Gymshark pill selection) */}
        <div className="size-selector">
          <button
            type="button"
            className={`size-pill ${selectedSize === "twoMl" ? "active" : ""}`}
            onClick={() => setSelectedSize("twoMl")}
          >
            2 ML
          </button>
          <button
            type="button"
            className={`size-pill ${selectedSize === "fiveMl" ? "active" : ""}`}
            onClick={() => setSelectedSize("fiveMl")}
          >
            5 ML
          </button>
          <button
            type="button"
            className={`size-pill ${selectedSize === "tenMl" ? "active" : ""}`}
            onClick={() => setSelectedSize("tenMl")}
          >
            10 ML
          </button>
        </div>

        {/* Rating and Reviews count */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#666", marginBottom: "8px" }}>
          <span style={{ color: "#f4a261" }}>
            <i className="fa-solid fa-star"></i> {product.rating || 4.8}
          </span>
          <span>({product.reviewsCount || 15} reviews)</span>
        </div>

        {/* Price & Add to Bag Row */}
        <div className="card-price-row">
          <div className="price-text">
            Rs. {getPrice().toLocaleString()} <small>/ {selectedSize === "twoMl" ? "2ml" : selectedSize === "fiveMl" ? "5ml" : "10ml"}</small>
          </div>
          <button className="add-bag-btn" onClick={handleAdd}>
            <i className="fa-solid fa-bag-shopping"></i> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
