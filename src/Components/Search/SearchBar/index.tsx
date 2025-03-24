import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

interface Category {
  id: string;
  name: string;
  checked: boolean;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: "general", name: "General", checked: false },
    { id: "borrow-lend", name: "Borrow/Lend", checked: false },
    { id: "housing", name: "Housing", checked: false },
    { id: "tutoring", name: "Tutoring", checked: false },
  ]);

  const handleCategoryChange = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, checked: !cat.checked } : cat
    ));
  };

  const handleSearch = () => {
    const selectedCategories = categories.filter(cat => cat.checked).map(cat => cat.id);
    // Navigate to search page with query parameters
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&categories=${selectedCategories.join(',')}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectedCount = categories.filter(cat => cat.checked).length;

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search For......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <div className="category-dropdown-container">
          <div 
            className="category-dropdown"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedCount === 0 ? "Select categories" : `${selectedCount} ${selectedCount === 1 ? 'category' : 'categories'} selected`}</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {categories.map(category => (
                <label key={category.id} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={category.checked}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}
