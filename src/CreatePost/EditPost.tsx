import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreType } from '../store';
import * as client from '../Posts/client';
import { Post } from '../Posts/client';
import './CreatePost.css';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);
  const [postType, setPostType] = useState<Post['postType']>('request');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Post['category']>('general');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      if (!id) return;
      const post = await client.findPostById(id);
      setPostType(post.postType.toLowerCase() as Post['postType']);
      setTitle(post.title);
      setCategory(post.category.toLowerCase() as Post['category']);
      setLocation(post.location);
      const [start, end] = post.availability.split(',').map(date => date.split('T')[0]);
      setStartDate(start);
      setEndDate(end);
      setDescription(post.description);
    } catch (error: unknown) {
      console.error("Error loading post:", error);
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Error loading post');
    }
  }, [id]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/Account/login');
      return;
    }
    loadPost();
  }, [currentUser, id, loadPost, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/Account/login');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      if (!id) return;
      const updatedPost = {
        title,
        postType,
        category,
        location,
        availability: `${startDate},${endDate}`,
        description
      };
      await client.updatePost(id, updatedPost);
      // Navigate to post detail and force reload by adding timestamp
      // This ensures the post data is refreshed after edit
      navigate(`/post/${id}?refresh=${Date.now()}`);
    } catch (error: unknown) {
      console.error("Error updating post:", error);
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Error updating post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Edit Post</h1>
      
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

          <div className="form-group date-range">
            <div className="date-field">
              <label htmlFor="startDate">Start Date</label>
              <input type="date" id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="date-field">
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your post description"
              rows={5}
              required
            />
          </div>
        </section>

        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => navigate(`/post/${id}`)}>Cancel</button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 