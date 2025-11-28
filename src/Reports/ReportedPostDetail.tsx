import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Reports.css";
import { StoreType } from "../store";
import { axiosWithCredentials } from "../api/client";

interface ReportedPostDetails {
  _id: string;
  title: string;
  author: {
    _id: string;
    username: string;
  };
  reportedDate: string;
  reportReason: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ReportedPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);
  const [post, setPost] = useState<ReportedPostDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (currentUser === null) {
      // User data not loaded yet
      return;
    }
    
    if (!currentUser || currentUser.role?.toUpperCase() !== "ADMIN") {
      setError("You need admin privileges to view this page");
      // Redirect after a delay
      setTimeout(() => navigate("/"), 3000);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchReportedPost = async () => {
      try {
        if (!currentUser || currentUser.role?.toUpperCase() !== "ADMIN") {
          return;
        }
        
        setLoading(true);
        const response = await axiosWithCredentials.get(`/reports/${postId}`);
        setPost(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching reported post:", err);
        const error = err as { response?: { status?: number; data?: { message?: string } } };
        
        // Better error handling based on status code
        if (error.response && error.response.status === 401) {
          setError("Authentication error: Please log in again with admin credentials");
          // Redirect to login page
          setTimeout(() => navigate("/Account/login"), 3000);
        } else if (error.response && error.response.status === 403) {
          setError("You don't have permission to access this page. Admin privileges required.");
        } else {
          setError("Failed to load reported post details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is admin and we have a postId
    if (postId && currentUser && currentUser.role?.toUpperCase() === "ADMIN") {
      fetchReportedPost();
    } else if (currentUser !== null) {
      // User is loaded but not admin or no postId
      setLoading(false);
    }
  }, [postId, currentUser, navigate]);

  const handleBackToList = () => {
    navigate("/reports");
  };

  const handleKeepPost = async () => {
    try {
      await axiosWithCredentials.post(`/reports/${postId}/keep`, {});
      navigate("/reports");
    } catch (err: unknown) {
      console.error("Error keeping post:", err);
      const error = err as { response?: { status?: number } };
      
      if (error.response && error.response.status === 401) {
        setError("Authentication error: Please log in again");
      } else {
        setError("Failed to keep post. Please try again.");
      }
    }
  };

  const handleDeletePost = async () => {
    try {
      await axiosWithCredentials.delete(`/reports/${postId}`);
      navigate("/reports");
    } catch (err: unknown) {
      console.error("Error deleting post:", err);
      const error = err as { response?: { status?: number } };
      
      if (error.response && error.response.status === 401) {
        setError("Authentication error: Please log in again");
      } else {
        setError("Failed to delete post. Please try again.");
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/Account/login");
  };

  if (loading && currentUser !== null) {
    return <div className="loading">Loading reported post details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          {error}
        </div>
        {(error.includes("authentication") || error.includes("log in")) && (
          <button className="login-button" onClick={handleLoginRedirect}>
            Go to Login
          </button>
        )}
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // If current user is null, we're still loading the auth state
  if (currentUser === null) {
    return <div className="loading">Checking authorization...</div>;
  }

  if (!post) {
    return <div className="error-message">Reported post not found</div>;
  }

  return (
    <div className="reported-post-detail-container">
      <h1>{post.title}</h1>
      <div className="reported-meta">
        <span>Reported Date: {new Date(post.reportedDate).toLocaleDateString()}</span>
      </div>
      
      <div className="reason-badge">
        Reason for Reporting: {post.reportReason}
      </div>
      
      <div className="detail-section">
        <div className="info-group">
          <span className="info-label">Category</span>
          <span className="info-value">{post.category}</span>
        </div>
        
        <div className="info-group">
          <span className="info-label">Location</span>
          <span className="info-value">{post.location}</span>
        </div>
        
        <div className="info-group">
          <span className="info-label">Start Date</span>
          <span className="info-value">{new Date(post.startDate).toLocaleDateString()}</span>
        </div>
        
        <div className="info-group">
          <span className="info-label">End Date</span>
          <span className="info-value">{new Date(post.endDate).toLocaleDateString()}</span>
        </div>
        
        <div className="info-group">
          <span className="info-label">Description</span>
          <span className="info-value description">{post.description}</span>
        </div>
      </div>
      
      <div className="action-buttons">
        <button className="back-button" onClick={handleBackToList}>
          Back to Reported Lists
        </button>
        <button className="keep-button" onClick={handleKeepPost}>
          Keep Post
        </button>
        <button className="delete-button" onClick={handleDeletePost}>
          Delete Post
        </button>
      </div>
    </div>
  );
};

export default ReportedPostDetail; 