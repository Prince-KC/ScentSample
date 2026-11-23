import React from "react";

const CategoryHero = ({ onSelectCategory }) => {
  const categories = [
    {
      title: "Middle Eastern",
      tag: "Opulent & Beast-Mode",
      desc: "Rich Arabic coffee, sweet dates, warm cinnamon, and intoxicating smoky woods. Exceptional longevity and sillage.",
      brands: "Lattafa • Afnan • Rasasi • Armaf",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Designer",
      tag: "Mainstream Perfection",
      desc: "The world's most beloved compliment magnets. Masterfully crafted blends from Paris, Milan, and New York.",
      brands: "Dior • Tom Ford • Chanel • YSL",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Niche",
      tag: "Artisanal Connoisseur",
      desc: "Rare raw ingredients, extraordinary concentration extraits, and artistic mastery for true perfume collectors.",
      brands: "MFK • Parfums de Marly • Creed • Xerjoff",
      image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80",
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
              <p className="tile-desc">{cat.desc}</p>
              <span style={{ fontSize: "11px", color: "var(--gold-accent)", marginBottom: "14px", fontWeight: "600" }}>
                {cat.brands}
              </span>
              <button className="tile-btn">Shop {cat.title} Decants</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryHero;
