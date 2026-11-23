import React from "react";

const Header = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  cartCount,
  wishlistCount,
  openCart,
  openWishlist,
  openAuth,
  openAdmin,
  openQuiz,
  user,
  onLogout,
}) => {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        FREE DELIVERY ACROSS KATHMANDU VALLEY ON ORDERS OVER <span>RS. 2,500</span> | 100% AUTHENTIC PERFUME DECANTS
      </div>

      {/* Main Header */}
      <header>
        <div className="header-container">
          {/* Nav Categories */}
          <nav className="main-nav">
            <button
              className={activeCategory === "All" ? "active-nav" : ""}
              onClick={() => setActiveCategory("All")}
            >
              All Scents
            </button>
            <button
              className={activeCategory === "Middle Eastern" ? "active-nav" : ""}
              onClick={() => setActiveCategory("Middle Eastern")}
            >
              Middle Eastern
            </button>
            <button
              className={activeCategory === "Designer" ? "active-nav" : ""}
              onClick={() => setActiveCategory("Designer")}
            >
              Designer
            </button>
            <button
              className={activeCategory === "Niche" ? "active-nav" : ""}
              onClick={() => setActiveCategory("Niche")}
            >
              Niche
            </button>
            <button onClick={openQuiz} style={{ color: "var(--gold-accent)" }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: "6px" }}></i>
              Scent Quiz
            </button>
          </nav>

          {/* Logo (Gymshark inspired centered/bold) */}
          <div className="logo">
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory("All"); }}>
              SCENTSAMPLE<span>.NP</span>
            </a>
          </div>

          {/* Right Header Controls */}
          <div className="header-right">
            {/* Gymshark Search Input */}
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search scents, brands, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", color: "#999", fontSize: "12px" }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Action Icons */}
            <div className="header-icons">
              {/* Wishlist Heart */}
              <button
                className="icon-btn"
                title="Wishlist"
                onClick={openWishlist}
              >
                <i className={wishlistCount > 0 ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ color: wishlistCount > 0 ? "var(--red-accent)" : "inherit" }}></i>
                {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
              </button>

              {/* User Account */}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    className="icon-btn"
                    title={user.name}
                    onClick={openAdmin}
                    style={{ fontSize: "13px", fontWeight: "700" }}
                  >
                    <i className="fa-solid fa-user-check" style={{ color: "var(--gold-accent)" }}></i>
                  </button>
                  <button
                    onClick={onLogout}
                    style={{ fontSize: "11px", fontWeight: "700", background: "#f0f0f0", padding: "4px 8px", borderRadius: "12px" }}
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="icon-btn"
                  title="Sign In / Register"
                  onClick={openAuth}
                >
                  <i className="fa-regular fa-user"></i>
                </button>
              )}

              {/* Admin Panel Access Button */}
              <button
                className="icon-btn"
                title="MERN Admin Dashboard"
                onClick={openAdmin}
              >
                <i className="fa-solid fa-sliders"></i>
              </button>

              {/* Shopping Bag Cart */}
              <button
                className="icon-btn"
                title="Shopping Bag"
                onClick={openCart}
              >
                <i className="fa-solid fa-bag-shopping"></i>
                {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
