import React from "react";

const Hero = () => {
  return (
    <section className="hero-gymshark-banner">
      {/* Full-bleed Hero2.jpg image as background */}
      <img
        src="/images/hero/Hero2.jpg"
        alt="ScentSampleNepal Luxury Perfume Decants"
        className="hero-gymshark-bg-image"
      />

      {/* Dark gradient overlay on the left so white text is crisp & readable directly inside the image */}
      <div className="hero-gymshark-gradient"></div>

      {/* Left-Aligned Text Content Container INSIDE the image */}
      <div className="hero-gymshark-container">
        <div className="hero-left-content">
          <span className="hero-badge-tag">AUTHENTIC LUXURY DECANTS</span>

          <h1 className="hero-gymshark-title">
            BUILD YOUR<br />NEXT SCENT
          </h1>

          <p className="hero-gymshark-desc">
            Shop versatile, high-performing fragrance decants to test, wear, layer — and everything in between.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
