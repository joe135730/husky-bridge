import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from "../Footer/index";
import * as client from '../Posts/client';
import { Post } from '../Posts/client';
import './CreatePost.css';

export default function CreatePost() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<Post['postType']>('request');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Post['category']>('general');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const newPost = {
        title,
        postType,
        category,
        location,
        availability: new Date(availability),
        description
      };

      await client.createPost(newPost);
      navigate('/my-posts');
    } catch (error: any) {
      console.error("Error creating post:", error);
      setError(error.response?.data?.message || 'Error creating post. Please try again.');
    }
  };

  return (
    <>
    <Navbar />
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <section className="form-section">
          <h2>Post Type</h2>
          <div className="radio-group">
            <label>
              <input type="radio" name="postType"
                value="request" checked={postType === 'request'}
                onChange={(e) => setPostType(e.target.value as Post['postType'])}
              />
              Request
            </label>
            <label>
              <input type="radio" name="postType"
                value="offer" checked={postType === 'offer'}
                onChange={(e) => setPostType(e.target.value as Post['postType'])}
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
                  onChange={(e) => setCategory(e.target.value as Post['category'])}
                />
                General
              </label>
              <label>
                <input type="radio" name="category"
                  value="housing"
                  checked={category === 'housing'}
                  onChange={(e) => setCategory(e.target.value as Post['category'])}
                />
                Housing
              </label>
              <label>
                <input type="radio" name="category"
                  value="tutoring"
                  checked={category === 'tutoring'}
                  onChange={(e) => setCategory(e.target.value as Post['category'])}
                />
                Tutoring
              </label>
              <label>
                <input type="radio" name="category"
                  value="lend-borrow"
                  checked={category === 'lend-borrow'}
                  onChange={(e) => setCategory(e.target.value as Post['category'])}
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
              min={new Date().toISOString().split('T')[0]}
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
          <button type="submit" className="submit-btn">Post Now</button>
        </div>
      </form>
    </div>
    <Footer/>
    </>
  );
} 