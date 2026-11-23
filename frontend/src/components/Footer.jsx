import React from "react";

const Footer = ({ onSelectCategory }) => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col">
            <h4 style={{ letterSpacing: "0.1em" }}>
              SCENTSAMPLE<span style={{ color: "var(--gold-accent)" }}>.NP</span>
            </h4>
            <p>
              Nepal's premier destination for genuine luxury perfume decants and samples.
              Never blind buy again — experience world-class Middle Eastern, Designer, and Niche
              perfumery in pocket-friendly 2ml, 5ml, and 10ml sterile glass atomizers.
            </p>
            <div style={{ display: "flex", gap: "14px", marginTop: "18px", fontSize: "16px" }}>
              <a href="#" style={{ color: "#333" }}><i className="fa-brands fa-instagram"></i></a>
              <a href="#" style={{ color: "#333" }}><i className="fa-brands fa-tiktok"></i></a>
              <a href="#" style={{ color: "#333" }}><i className="fa-brands fa-facebook"></i></a>
              <a href="#" style={{ color: "#333" }}><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="footer-col">
            <h4>Fragrance Houses</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory("Middle Eastern"); }}>Middle Eastern Ouds</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory("Designer"); }}>Designer Classics</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory("Niche"); }}>Niche Extraits</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory("All"); }}>All Sample Decants</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="footer-col">
            <h4>Decant Quality</h4>
            <ul>
              <li><a href="#">100% Authentic Guarantee</a></li>
              <li><a href="#">Medical Grade Atomizers</a></li>
              <li><a href="#">Teflon Leak-Proof Seal</a></li>
              <li><a href="#">Kathmandu 24h Express Delivery</a></li>
              <li><a href="#">Cash on Delivery & eSewa</a></li>
            </ul>
          </div>

          {/* Col 4: Nepal Showroom & Contact */}
          <div className="footer-col">
            <h4>Kathmandu Hub</h4>
            <p style={{ marginBottom: "8px" }}>
              <i className="fa-solid fa-location-dot" style={{ marginRight: "8px", color: "var(--gold-accent)" }}></i>
              New Baneshwor, Kathmandu, Nepal
            </p>
            <p style={{ marginBottom: "8px" }}>
              <i className="fa-solid fa-phone" style={{ marginRight: "8px", color: "var(--gold-accent)" }}></i>
              +977 9801234567 / 01-4482910
            </p>
            <p>
              <i className="fa-solid fa-envelope" style={{ marginRight: "8px", color: "var(--gold-accent)" }}></i>
              scentsamplenepal@gmail.com
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ScentSampleNepal. Inspired by Gymshark's aesthetic simplicity & built with full MERN Stack architecture.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>eSewa Accepted</span>
            <span>Khalti Accepted</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
