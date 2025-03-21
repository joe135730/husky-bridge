import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

interface SearchResult {
    title: string;
    author: string;
    date: string;
    id: string; // Added for navigation purposes
}

export default function SearchBar() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<number>(1);

    // Mock data for demonstration
    const mockResults: SearchResult[] = [
        {
            id: '1',
            title: "Need a Calculator for Finals?",
            author: "Nick Bedford",
            date: "March 12, 2025"
        },
        {
            id: '2',
            title: "Looking for a Roommate Near Campus!",
            author: "Markus Andersen",
            date: "March 10, 2025"
        },
        {
            id: '3',
            title: "Offering Python Tutoring Sessions!",
            author: "Bellamy",
            date: "March 9, 2025"
        },
        {
            id: '4',
            title: "Selling a Red Sox Ticket for This Weekend",
            author: "Shaun La",
            date: "March 8, 2025"
        }
    ];

    const handlePostClick = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className="search-section">
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

            <div className="search-results">
                {mockResults.map((result) => (
                    <div key={result.id} className="result-item">
                        <div className="result-content">
                            <h3 onClick={() => handlePostClick(result.id)}>{result.title}</h3>
                            <div className="result-meta">
                                <span>{result.author}</span>
                                <span className="date-separator">|</span>
                                <span>{result.date}</span>
                            </div>
                        </div>
                        <button className="go-button" onClick={() => handlePostClick(result.id)}>GO</button>
                    </div>
                ))}
                <div className="results-count">
                    1,535 results
                    <button className="show-more">Show me more results -</button>
                </div>
            </div>
        </div>
    );
} 