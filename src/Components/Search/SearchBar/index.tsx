import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number>(1);

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search For......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="category-dropdown">
          <span>{selectedCategories} category selected</span>
          <span className="dropdown-arrow">▼</span>
        </div>
        <button className="search-button">Search</button>
      </div>
    </div>
  );
}
