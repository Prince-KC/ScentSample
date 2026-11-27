import React from "react";

const CategoryHero = ({ onSelectCategory }) => {
  const categories = [
    {
      title: "Middle Eastern",
      tag: "Exotic & Beast-Mode",
      image: "/images/categories/rasasi-hawas-ice.jpg",
    },
    {
      title: "Designer",
      tag: "Mainstream Iconics",
      image: "/images/categories/bleu-de-chanel.jpg",
    },
    {
      title: "Niche",
      tag: "Artisanal Luxury",
      image: "/images/categories/creed-aventus.jpg",
    },
  ];

  return (
    <section className="category-tiles container">
      <div className="section-header">
        <h2>Explore By Fragrance House</h2>
        <p>Curated collections bottled in leak-proof glass atomizers</p>
      </div>
      <div className="tiles-grid">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="tile-card"
            onClick={() => onSelectCategory(cat.title)}
          >
            <img src={cat.image} alt={cat.title} className="tile-img" />
            <div className="tile-overlay">
              <span className="tile-tag">{cat.tag}</span>
              <h3 className="tile-title">{cat.title}</h3>
              <div className="tile-action">
                <span>Shop Decants</span>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryHero;
