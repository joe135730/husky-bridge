// TEMPORARY COMPONENT FOR TESTING - DELETE LATER
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as client from './client';
import { Post } from './client';
import './Posts.css';

export default function AllPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllPosts();
  }, []);

  // TEMPORARY FUNCTION - DELETE LATER
  const loadAllPosts = async () => {
    try {
      setLoading(true);
      const data = await client.findAllPosts();
      setPosts(data);
    } catch (error: any) {
      console.error("Error loading posts:", error);
      setError(error.response?.data?.message || 'Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // TEMPORARY UI FOR TESTING - DELETE LATER
  return (
    <div className="posts-container">
      <h1>All Posts (Testing Page)</h1>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>Type: {post.postType}</p>
            <p>Category: {post.category}</p>
            <p>Status: {post.status}</p>
            <p>Location: {post.location}</p>
            <Link to={`/post/${post._id}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 