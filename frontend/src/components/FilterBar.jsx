import React from "react";

const FilterBar = ({
  activeCategory,
  setActiveCategory,
  activeFamily,
  setActiveFamily,
  sortBy,
  setSortBy,
  itemCount,
  onResetFilters,
}) => {
  const families = ["All", "Gourmand", "Warm Spicy", "Fresh Aquatic", "Smoky Woody", "Amber Floral"];

  return (
    <section className="filter-bar">
      <div className="container filter-container">
        {/* Left Category Buttons */}
        <div className="filter-left">
          <button
            className={`filter-btn ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All Products ({itemCount})
          </button>
          <button
            className={`filter-btn ${activeCategory === "Middle Eastern" ? "active" : ""}`}
            onClick={() => setActiveCategory("Middle Eastern")}
          >
            Middle Eastern
          </button>
          <button
            className={`filter-btn ${activeCategory === "Designer" ? "active" : ""}`}
            onClick={() => setActiveCategory("Designer")}
          >
            Designer
          </button>
          <button
            className={`filter-btn ${activeCategory === "Niche" ? "active" : ""}`}
            onClick={() => setActiveCategory("Niche")}
          >
            Niche
          </button>

          {/* Scent Family Filter */}
          <select
            className="sort-select"
            value={activeFamily}
            onChange={(e) => setActiveFamily(e.target.value)}
            style={{ marginLeft: "6px" }}
          >
            <option value="All">All Scent Profiles</option>
            {families.filter((f) => f !== "All").map((fam) => (
              <option key={fam} value={fam}>{fam}</option>
            ))}
          </select>
        </div>

        {/* Right Sort Controls */}
        <div className="filter-right">
          <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "#666" }}>
            Sort:
          </label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>

          {(activeCategory !== "All" || activeFamily !== "All" || sortBy !== "popular") && (
            <button
              onClick={onResetFilters}
              style={{
                background: "none",
                fontSize: "12px",
                fontWeight: "700",
                textDecoration: "underline",
                color: "#888",
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
