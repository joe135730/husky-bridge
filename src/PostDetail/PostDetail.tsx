import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreType } from '../store';
import Navbar from '../navbar/navbar';
import * as client from '../Posts/client';
import type { Post } from '../Posts/client';
import './PostDetail.css';
import { findPostById, participateInPost, markPostComplete } from '../Posts/client';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await client.findPostById(id);
      setPost(data);
      
      // Check if current user has already accepted this post
      if (currentUser && data.participants.some((p: { userId: string }) => p.userId === currentUser._id)) {
        setHasAccepted(true);
      } else if (data.userRelationship === 'participant') {
        // Also set hasAccepted if user is already a participant
        setHasAccepted(true);
      }
    } catch (error: any) {
      console.error("Error loading post:", error);
      setError(error.response?.data?.message || 'Error loading post');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // If owner, go back to my posts, otherwise go back to all posts
    if (post?.userRelationship === 'owner') {
      navigate('/my-posts');
    } else {
      navigate('/all-posts');
    }
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log("Message button clicked");
  };

  const handleEdit = () => {
    navigate(`/edit-post/${post?._id}`);
  };

  const handleDelete = async () => {
    try {
      if (!post?._id) return;

      // Show confirmation dialog
      const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
      if (!confirmDelete) return;

      await client.deletePost(post._id);
      navigate('/my-posts'); // Navigate back to My Posts page after successful deletion
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(error.response?.data?.message || 'Error deleting post');
    }
  };

  const handleManageRequests = () => {
    navigate(`/my-posts/${post?._id}/pending-offers`);
  };

  const handleAccept = async () => {
    try {
      if (!currentUser) {
        navigate('/Account/login');
        return;
      }
      if (!post?._id) return;

      setError(''); // Clear any previous errors
      await client.participateInPost(post._id);
      setHasAccepted(true);
      await loadPost(); // Reload post to get updated status
    } catch (error: any) {
      console.error("Error accepting post:", error);
      setError(error.response?.data?.message || 'Error accepting post');
      // If the error is that we're already participating, still set hasAccepted
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Already participating')) {
        setHasAccepted(true);
      }
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report button clicked");
  };

  const handleMarkComplete = async () => {
    try {
      if (!post?._id) return;
      setIsCompleting(true);
      setError(null);

      const updatedPost = await client.markPostComplete(post._id);
      setPost(updatedPost);
      
      // Refresh the post data to get the latest status
      await loadPost();
    } catch (err: any) {
      console.error('Error marking post as complete:', err);
      setError(err.response?.data?.message || 'Failed to mark post as complete');
    } finally {
      setIsCompleting(false);
    }
  };

  const showCompleteButton = () => {
    if (!post || !currentUser) return false;
    
    // For owner
    if (isOwner) {
      // Show button if post is In Progress or if participant is in Wait for Complete
      const participant = post.participants.find(p => p.userId === post.selectedParticipantId);
      return post.status === 'In Progress' || 
             (participant?.status === 'Wait for Complete' && !post.ownerCompleted);
    }
    
    // For participant
    if (isParticipant && currentUser) {
      const participant = post.participants.find(p => p.userId === currentUser._id);
      // Show button only if participant is In Progress
      return participant?.status === 'In Progress';
    }
    
    return false;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  const isOwner = post.userRelationship === 'owner';
  const isParticipant = post.participants?.some(p => p.userId === currentUser?._id);
  const showStatusBadge = isOwner || isParticipant;

  // Get the status to display based on user relationship and completion state
  const getDisplayStatus = () => {
    // If post is fully complete, show Complete for everyone
    if (post.status === 'Complete') {
      return 'Complete';
    }

    if (isOwner) {
      // If participant has marked complete but owner hasn't
      const participant = post.participants.find(p => p.userId === post.selectedParticipantId);
      if (participant?.status === 'Wait for Complete' && !post.ownerCompleted) {
        return 'In Progress';
      }
      // Otherwise show post status
      return post.status;
    }

    if (isParticipant && currentUser) {
      const participant = post.participants.find(p => p.userId === currentUser._id);
      if (!participant) return post.status;

      // Show participant's specific status
      return participant.status;
    }

    return post.status;
  };

  const displayStatus = getDisplayStatus();

  return (
    <div className="post-detail-container">
      {showStatusBadge && (
        <>
          {displayStatus === 'In Progress' && (
            <div className="status-badge in-progress">In Progress</div>
          )}
          {displayStatus === 'Complete' && (
            <div className="status-badge complete">Complete</div>
          )}
          {displayStatus === 'Pending' && (
            <div className="status-badge pending">Pending</div>
          )}
          {displayStatus === 'Wait for Complete' && (
            <div className="status-badge wait-for-complete">Wait for Complete</div>
          )}
        </>
      )}

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
          {isOwner && (
            <>
              {post.status !== 'Wait for Complete' ? (
                <>
                  <button className="edit-post" onClick={handleEdit}>Edit Post</button>
                  <button className="delete-post" onClick={handleDelete}>Delete Post</button>
                  <button className="manage-requests" onClick={handleManageRequests}>Manage Requests</button>
                  <button className="back-btn" onClick={handleBack}>Back to My Posts</button>
                  <button className="message-button" onClick={handleMessage}>Message</button>
                </>
              ) : (
                <>
                  <button className="back-btn" onClick={handleBack}>Back to My Posts</button>
                  <button className="delete-post" onClick={handleDelete}>Delete Post</button>
                  <button className="message-button" onClick={handleMessage}>Message</button>
                </>
              )}
            </>
          )}
          {!isOwner && (
            <>
              <button className="back-btn" onClick={handleBack}>Back to All Posts</button>
              <button className="message-button" onClick={handleMessage}>Message</button>
            </>
          )}
        </div>
        <div className="action-buttons-right">
          {!isOwner && !isParticipant && (
            <button 
              className={`accept-btn ${hasAccepted ? 'accepted' : ''}`} 
              onClick={handleAccept}
              disabled={hasAccepted}
            >
              Accept
            </button>
          )}
          {showCompleteButton() && (
            <button 
              className="complete-btn"
              onClick={handleMarkComplete}
              disabled={isCompleting}
            >
              {isCompleting ? 'Marking as Complete...' : 'Mark as Complete'}
            </button>
          )}
          <button className="report-post" onClick={handleReport}>Report Post</button>
        </div>
      </div>
    </div>
  );
} 