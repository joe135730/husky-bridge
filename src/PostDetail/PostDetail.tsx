import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreType } from '../store';
import Navbar from '../navbar/navbar';
import Footer from "../Footer/index";
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

  const handleAccept = async () => {
    try {
      if (!post?._id) return;
      await client.acceptPost(post._id);
      loadPost(); // Reload post to get updated status
    } catch (error: any) {
      console.error("Error accepting post:", error);
      setError(error.response?.data?.message || 'Error accepting post');
    }
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

  const isOwner = currentUser?._id === post.userId;
  const isPending = post.status === 'pending';
  const isCompleted = post.status === 'completed';

  return (
    <>
    <Navbar />
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <div className="post-meta">
        Posted by: {post.userId} | Date: {new Date(post.createdAt).toLocaleDateString()}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="detail-section">
        <h2>Post Information Section</h2>
        
        <div className="info-group">
          <div className="info-label">Post Type</div>
          <div className="info-value">{post.postType}</div>
        </div>

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

        {post.acceptedBy && (
          <div className="info-group">
            <div className="info-label">Accepted By</div>
            <div className="info-value">{post.acceptedBy}</div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="back-btn" onClick={handleBack}>
          Back to all Posts
        </button>
        {!isOwner && !isCompleted && (
          <>
            <button className="message-btn" onClick={handleMessage}>
              Message
            </button>
            <button 
              className="accept-btn" 
              onClick={handleAccept}
              disabled={isPending}
            >
              {isPending ? 'Pending Acceptance' : 'Accept Offer / Request'}
            </button>
          </>
        )}
        <button className="report-btn" onClick={handleReport}>
          Report Post
        </button>
      </div>

      {isPending && (
        <div className="status-badge pending">
          Pending
        </div>
      )}
      {isCompleted && (
        <div className="status-badge completed">
          Completed
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
} 