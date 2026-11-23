import React from "react";

const tabs = [
  {
    label: "ALL COLLECTIONS",
    category: "All",
    sub: null,
  },
  {
    label: "MIDDLE EASTERN",
    category: "Middle Eastern",
    icon: "🕌",
    sub: "Lattafa, Afnan, Rasasi",
  },
  {
    label: "DESIGNER",
    category: "Designer",
    icon: "✦",
    sub: "Dior, Chanel, Tom Ford",
  },
  {
    label: "NICHE",
    category: "Niche",
    icon: "🌿",
    sub: "MFK, Creed, Parfums de Marly",
  },
];

const CollectionBar = ({ activeCategory, setActiveCategory, onScrollToCatalog }) => {
  const handleClick = (category) => {
    setActiveCategory(category);
    if (onScrollToCatalog) onScrollToCatalog();
  };

  return (
    <nav className="collection-bar">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.category;
        return (
          <button
            key={tab.category}
            className={`collection-tab ${isActive ? "active" : ""}`}
            onClick={() => handleClick(tab.category)}
          >
            {tab.icon && <span className="col-tab-icon">{tab.icon}</span>}
            <span className="col-tab-label">{tab.label}</span>
            {tab.sub && <span className="col-tab-sub">{tab.sub}</span>}
          </button>
        );
      })}
    </nav>
  );
};

export default CollectionBar;
