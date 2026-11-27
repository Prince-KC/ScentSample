import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";

import { defaultProducts } from "./data/defaultProducts";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoryHero from "./components/CategoryHero";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import QuizModal from "./components/QuizModal";
import CollectionBar from "./components/CollectionBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerAccount from "./pages/CustomerAccount";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function StorePage({
  products, loading, user, onLogout,
  cart, setCart, wishlist, setWishlist,
  showToast,
}) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFamily, setActiveFamily] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesFamily =
      activeFamily === "All" ||
      (p.scentFamily && p.scentFamily.toLowerCase().includes(activeFamily.toLowerCase()));
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.scentFamily && p.scentFamily.toLowerCase().includes(query));
    return matchesCategory && matchesFamily && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.size} sample of ${item.name} to bag!`);
  };

  const handleUpdateQty = (productId, size, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity: newQty } : i))
    );
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        showToast(`Removed ${product.name} from wishlist.`);
        return prev.filter((p) => p._id !== product._id);
      } else {
        showToast(`Saved ${product.name} to your wishlist ❤️`);
        return [...prev, product];
      }
    });
  };

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="app-wrapper">
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => {
          if (wishlist.length === 0) showToast("Your wishlist is empty. Tap any heart icon to add!");
          else showToast(`You have ${wishlist.length} item(s) in wishlist.`);
        }}
        openAuth={() => user ? navigate("/account") : navigate("/login")}
        openAdmin={() => navigate("/admin")}
        openQuiz={() => setIsQuizOpen(true)}
        user={user}
        onLogout={onLogout}
      />

      <Hero
        onExploreCategory={(cat) => {
          setActiveCategory(cat);
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      <CollectionBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onScrollToCatalog={() =>
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <CategoryHero
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div id="catalog-section">
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeFamily={activeFamily}
          setActiveFamily={setActiveFamily}
          sortBy={sortBy}
          setSortBy={setSortBy}
          itemCount={sortedProducts.length}
          onResetFilters={() => {
            setActiveCategory("All");
            setActiveFamily("All");
            setSortBy("popular");
            setSearchQuery("");
          }}
        />
      </div>

      <main className="container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "32px", color: "#333", marginBottom: "16px" }}></i>
            <p style={{ fontWeight: "700" }}>Loading authentic fragrance decants from Nepal database...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <i className="fa-solid fa-droplet-slash" style={{ fontSize: "40px", color: "#ccc", marginBottom: "16px" }}></i>
            <h3 style={{ fontSize: "20px", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px" }}>
              No Fragrances Found
            </h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
              Try clearing filters or search for another note, brand, or house.
            </p>
            <button
              className="btn-primary"
              style={{ background: "#000", color: "#fff" }}
              onClick={() => { setActiveCategory("All"); setActiveFamily("All"); setSearchQuery(""); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOpenDetails={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlist.some((w) => w._id === product._id)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer onSelectCategory={(cat) => setActiveCategory(cat)} />

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={(productId, size) =>
          setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)))
        }
        onProceedCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={() => {
          setCart([]);
          showToast("Order placed successfully! ScentSampleNepal will contact you shortly.");
        }}
      />
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />
    </div>
  );
}

function App() {
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("scent_cart")) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("scent_wishlist")) || []; } catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("scent_user")) || null; } catch { return null; }
  });
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => { localStorage.setItem("scent_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("scent_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/product`);
      if (res.data.success) setProducts(res.data.result);
    } catch (err) {
      console.warn("Backend not reachable, using default products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAuthSuccess = (u) => {
    setUser(u);
    showToast(`Welcome${u.name ? ", " + u.name : ""}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("scent_token");
    localStorage.removeItem("scent_user");
    setUser(null);
    showToast("Logged out successfully");
  };

  return (
    <>
      {/* Global Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed", bottom: "24px", right: "24px",
            backgroundColor: "#000000", color: "#ffffff",
            padding: "14px 24px", borderRadius: "30px", zIndex: 9999,
            fontSize: "13px", fontWeight: "700", boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", gap: "10px",
          }}
        >
          <i className="fa-solid fa-check" style={{ color: "#c8a96e" }}></i>
          {toastMessage}
        </div>
      )}

      <Routes>
        {/* Main store */}
        <Route
          path="/"
          element={
            <StorePage
              products={products}
              loading={loading}
              user={user}
              onLogout={handleLogout}
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
              showToast={showToast}
            />
          }
        />

        {/* Login / Register */}
        <Route
          path="/login"
          element={<LoginPage onAuthSuccess={handleAuthSuccess} />}
        />

        {/* Admin dashboard — admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requireAdmin>
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Customer account — any logged-in user */}
        <Route
          path="/account"
          element={
            <ProtectedRoute user={user}>
              <CustomerAccount user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all → home */}
        <Route path="*" element={<StorePage
          products={products} loading={loading} user={user} onLogout={handleLogout}
          cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist}
          showToast={showToast}
        />} />
      </Routes>
    </>
  );
}

export default App;
