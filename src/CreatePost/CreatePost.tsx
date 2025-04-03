import { useState } from 'react';
import Navbar from '../navbar/navbar';
import Footer from "../Footer/index";
import './CreatePost.css';

export default function CreatePost() {
  const [postType, setPostType] = useState('request');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      postType,
      title,
      category,
      location,
      availability,
      description
    });
  };

  return (
    <>
    <Navbar />
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      
      <form onSubmit={handleSubmit}>
        <section className="form-section">
          <h2>Post Type</h2>
          <div className="radio-group">
            <label>
              <input type="radio" name="postType"
                value="request" checked={postType === 'request'}
                onChange={(e) => setPostType(e.target.value)}
              />
              Request
            </label>
            <label>
              <input type="radio" name="postType"
                value="offer" checked={postType === 'offer'}
                onChange={(e) => setPostType(e.target.value)}
              />
              Offer
            </label>
          </div>
        </section>

        <section className="form-section">
          <h2>Post Information Section</h2>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="category"
                  value="general"
                  checked={category === 'general'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                General
              </label>
              <label>
                <input type="radio" name="category"
                  value="housing"
                  checked={category === 'housing'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                Housing
              </label>
              <label>
                <input type="radio" name="category"
                  value="tutoring"
                  checked={category === 'tutoring'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                Tutoring
              </label>
              <label>
                <input type="radio" name="category"
                  value="lend-borrow"
                  checked={category === 'lend-borrow'}
                  onChange={(e) => setCategory(e.target.value)}
                />
                Lend/Borrow
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            <input type="date" id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your post description"
              rows={5}
              required
            />
          </div>
        </section>

        <div className="button-group">
          <button type="button" className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn">Post Now</button>
        </div>
      </form>
    </div>
    <Footer/>
    </>
  );
} 