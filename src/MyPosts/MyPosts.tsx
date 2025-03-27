import { useState } from 'react';
import './MyPosts.css';

export default function MyPosts() {
  const [sort, setSort] = useState('latest');
  const [filters, setFilters] = useState({});

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [value]: !prev[category]?.[value]
      }
    }));
  };

  return (
    <>
      <div className="my-posts-container">
        <div className="my-posts-header">
          <h2>My Posts</h2>

          <div className="filter-dropdown">
            <label htmlFor="sort-posts">Sort by:</label>
            <select id="sort-posts" value={sort} onChange={handleSortChange}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="posts-content">
          <div className="filters-sidebar">
            <div className="filter-section">
              <h4>General</h4>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('General', 'My Requests')} /> My Requests</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('General', 'My Offer')} /> My Offer</label>
            </div>
            <div className="filter-section">
              <h4>Category</h4>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Category', 'General')} /> General</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Category', 'Tutoring')} /> Tutoring</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Category', 'Housing')} /> Housing</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Category', 'Borrow/Lend')} /> Borrow/Lend</label>
            </div>
            <div className="filter-section">
              <h4>Location</h4>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Location', 'Snell Library')} /> Snell Library</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Location', 'Curry Student Center')} /> Curry Student Center</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Location', 'International Village')} /> International Village</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Location', 'East Village')} /> East Village</label>
            </div>
            <div className="filter-section">
              <h4>Date Posted</h4>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Date Posted', 'All')} /> All</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Date Posted', 'Last Hour')} /> Last Hour</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Date Posted', 'Last 24 Hours')} /> Last 24 Hours</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Date Posted', 'Last 7 Days')} /> Last 7 Days</label>
              <label><input type="checkbox" onChange={() => handleCheckboxChange('Date Posted', 'Last 30 Days')} /> Last 30 Days</label>
            </div>
          </div>

          <div className="posts-list">
            <div className="post-item">
              <h3>Need a TI-84 Calculator for Finals? (Active – Borrow/Lend)</h3>
              <p>📍 Snell Library | 📅 Posted on March 12, 2025</p>
              <button className="details-btn">View Details</button>
              <button className="complete-btn">Mark as Completed</button>
            </div>

            <div className="post-item">
              <h3>Looking for a Roommate Near Campus! (Active – Housing)</h3>
              <p>📍 Fenway, Boston | 📅 Posted on March 10, 2025</p>
              <button className="details-btn">View Details</button>
              <button className="complete-btn">Mark as Completed</button>
            </div>

            <div className="post-item completed">
              <h3>Physics 2 Textbook Available to Borrow (Completed – Borrow/Lend)</h3>
              <p>📅 Borrowed by Alex J. on Feb 28, 2025</p>
              <button className="details-btn">View Details</button>
              <button className="completed-btn" disabled>Completed</button>
            </div>

            <div className="pagination">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="next-btn">Next ❯</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}