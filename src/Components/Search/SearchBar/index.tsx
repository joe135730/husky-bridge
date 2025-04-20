import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import * as postClient from "../../../Posts/client";

interface Category {
  id: string;
  name: string;
  checked: boolean;
}

interface Post {
  _id?: string;
  userId: string;
  title: string;
  postType: "request" | "offer";
  category: "general" | "housing" | "tutoring" | "lend-borrow";
  location: string;
  availability: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: "Pending" | "In Progress" | "Wait for Complete" | "Complete";
  participants: postClient.Participant[];
  selectedParticipantId: string | null;
  ownerCompleted: boolean;
  participantCompleted: boolean;
  userRelationship?: "owner" | "selected" | "participant" | "none";
  userParticipantStatus?: "Pending" | "In Progress" | "Complete";
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: "general", name: "General", checked: false },
    { id: "lend-borrow", name: "Borrow/Lend", checked: false },
    { id: "housing", name: "Housing", checked: false },
    { id: "tutoring", name: "Tutoring", checked: false },
  ]);

  const handleCategoryChange = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, checked: !cat.checked } : cat
    ));
  };

  const handleSearch = async () => {
    const selectedCategories = categories.filter(cat => cat.checked).map(cat => cat.id);
    if (searchQuery.trim()) {
      try {
        const posts = await postClient.findPostsByTitle(searchQuery);
        navigate(`/AllPosts?search=${encodeURIComponent(searchQuery)}`);
        return;
      } catch (error) {
        console.error('Error fetching posts by title:', error);
      }
    }
    
    if (selectedCategories.length >= 2) {
      try {
        const categories = selectedCategories.map(cat => cat as Post["category"]);
        const posts = await postClient.findPostsByCategories(categories);
        
        navigate(`/posts/multiple-categories`, { 
          state: { 
            posts,
            categories
          } 
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
        navigate(`/posts/category/${selectedCategories[0]}`);
      }
    } else if (selectedCategories.length === 1) {
      try {
        const category = selectedCategories[0] as Post["category"];
        const posts = await postClient.findPostByCategory(category);
        navigate(`/posts/category/${category}`, { state: { posts } });
      } catch (error) {
        console.error('Error fetching posts:', error);
        navigate(`/posts/category/${selectedCategories[0]}`);
      }
    } else if(selectedCategories.length === 0) {
      navigate(`/AllPosts`);
      return;
    } 
    else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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