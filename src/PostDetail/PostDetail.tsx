import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreType } from '../store';
import * as client from '../Posts/client';
import { Post } from '../Posts/client';
import './PostDetail.css';

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useSelector((state: StoreType) => state.accountReducer);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await client.findPostById(id);
      setPost(data);
    } catch (error: any) {
      console.error("Error loading post:", error);
      setError(error.response?.data?.message || 'Error loading post');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log("Message button clicked");
  };

  const handleManageRequests = () => {
    navigate(`/my-posts/${post?._id}/pending-offers`);
  };

  const handleEdit = () => {
    navigate(`/edit-post/${post?._id}`);
  };

  const handleDelete = () => {
    navigate(`/delete-post/${post?._id}`);
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report button clicked");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="post-detail-container">
      <div className="status-badge">
        {post.status}
      </div>

      <h1>{post.title}</h1>
      
      <div className="post-meta">
        Posted by: {post.userId} | Date: {new Date(post.createdAt).toLocaleDateString()}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="post-type">
        <div className="post-type-label">Post Type</div>
        <div className="post-type-value">{post.postType}</div>
      </div>

      <div className="detail-section">
        <h2>Post Information Section</h2>
        
        <div className="detail-section-content">
          <div className="info-group">
            <div className="info-label">Category</div>
            <div className="info-value">{post.category}</div>
          </div>

          <div className="info-group">
            <div className="info-label">Location</div>
            <div className="info-value">{post.location}</div>
          </div>

          <div className="info-group">
            <div className="info-label">Availability</div>
            <div className="info-value">{new Date(post.availability).toLocaleDateString()}</div>
          </div>

          <div className="info-group">
            <div className="info-label">Description</div>
            <div className="info-value description">{post.description}</div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <div className="action-buttons-left">
          {post.userRelationship === 'owner' && post.status === 'Pending' && (
            <>
              <button className="edit-post" onClick={handleEdit}>Edit Post</button>
              <button className="delete-post" onClick={handleDelete}>Delete Post</button>
              <button className="manage-requests" onClick={handleManageRequests}>Manage Requests</button>
            </>
          )}
          <button className="back-btn" onClick={handleBack}>Back to My Posts</button>
          <button className="message-button" onClick={handleMessage}>Message</button>
        </div>
        <div className="action-buttons-right">
          <button className="report-post" onClick={handleReport}>Report Post</button>
        </div>
      </div>
    </div>
  );
} 