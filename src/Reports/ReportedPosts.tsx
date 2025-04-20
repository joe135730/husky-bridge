import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Reports.css";
import { StoreType } from "../store";
import { axiosWithCredentials } from "../api/client";

interface ReportedPost {
  _id: string;
  title: string;
  author: {
    _id: string;
    username: string;
  };
  reportedDate: string;
  reportReason: string;
  reportId: string;
}

const ReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);
  
  // Debug log for authentication state
  useEffect(() => {
    console.log("Auth Debug:", { 
      currentUser, 
      role: currentUser?.role,
      isLoggedIn: !!currentUser,
      isAdmin: currentUser?.role === "ADMIN"
    });
  }, [currentUser]);
  
  // Redirect if not admin
  useEffect(() => {
    if (currentUser === null) {
      console.log("User data not loaded yet");
      return;
    }
    
    if (!currentUser) {
      setError("You need to be logged in to view this page");
      setTimeout(() => navigate("/Account/login"), 3000);
      return;
    }
    
    if (currentUser.role !== "ADMIN") {
      console.log("User is not admin:", currentUser.role);
      setError(`You need admin privileges to view this page. Your current role: ${currentUser.role || 'undefined'}`);
      setTimeout(() => navigate("/"), 3000);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        setLoading(true);
        // Only fetch if user is admin
        if (!currentUser || currentUser.role !== "ADMIN") {
          return;
        }
        
        console.log("Making API request to /reports with credentials");
        
        // Make the API request without the custom header
        const response = await axiosWithCredentials.get(`/reports`);
        
        console.log("API Response:", response);
        setReportedPosts(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching reported posts:", err);
        console.log("Error details:", {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
        
        // Better error handling based on status code
        if (err.response && err.response.status === 401) {
          setError(`Authentication error: Please log in again with admin credentials. Server message: ${err.response.data?.message || 'Unauthorized'}`);
        } else if (err.response && err.response.status === 403) {
          setError(`You don't have permission to access this page. Admin privileges required. Server message: ${err.response.data?.message || 'Forbidden'}`);
        } else {
          setError(`Failed to load reported posts. Please try again. Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user data is loaded and user is admin
    if (currentUser && currentUser.role === "ADMIN") {
      fetchReportedPosts();
    } else if (currentUser !== null) {
      // User is loaded but not admin
      setLoading(false);
    }
  }, [currentUser, navigate]);

  const handleViewPost = (postId: string) => {
    navigate(`/reports/${postId}`);
  };

  const handleLoginRedirect = () => {
    navigate("/Account/login");
  };

  const handleCheckSession = async () => {
    try {
      // Check regular auth status
      const authResponse = await axiosWithCredentials.get(`/auth/current`);
      console.log("Regular auth check:", authResponse.data);
      
      // Check auth test endpoint
      try {
        const reportsAuthTest = await axiosWithCredentials.get(`/reports-auth-test`);
        console.log("Reports auth test:", reportsAuthTest.data);
        alert(`Reports auth test: Success!\n\nAuth data: ${JSON.stringify(reportsAuthTest.data)}`);
      } catch (reportsAuthErr: any) {
        console.error("Reports auth test failed:", reportsAuthErr);
        alert(`Reports auth test failed: ${reportsAuthErr.response?.data?.message || reportsAuthErr.message}`);
      }
      
      // Check admin status
      try {
        const adminResponse = await axiosWithCredentials.get(`/auth/check-admin`);
        console.log("Admin auth check:", adminResponse.data);
        alert(`Admin check: ${adminResponse.data.isAdmin ? 'You are an admin' : 'Not admin'}\n\nAuth data: ${JSON.stringify(adminResponse.data)}`);
      } catch (adminErr: any) {
        console.error("Admin check failed:", adminErr);
        alert(`Admin check failed: ${adminErr.response?.data?.message || adminErr.message}`);
      }
    } catch (err: any) {
      console.error("Session check failed:", err);
      alert(`Session check failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading && currentUser !== null) {
    return <div className="loading">Loading reported posts...</div>;
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
        <button className="debug-button" onClick={handleCheckSession}>
          Check Session
        </button>
      </div>
    );
  }

  // If current user is null, we're still loading the auth state
  if (currentUser === null) {
    return <div className="loading">Checking authorization...</div>;
  }

  if (currentUser && currentUser.role !== "ADMIN") {
    return (
      <div className="error-container">
        <div className="role-info">
          Your current role: <strong>{currentUser.role || "No role assigned"}</strong>
        </div>
        <div className="error-message">
          This page is only accessible to administrators.
        </div>
        <button className="primary-button" onClick={() => navigate("/")}>
          Go to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="reported-posts-container">
      <h1>Reported Posts</h1>
      <div className="admin-badge">Admin: {currentUser.username}</div>
      
      {reportedPosts.length === 0 ? (
        <div className="no-posts">No reported posts found</div>
      ) : (
        <>
          <div className="posts-count">{reportedPosts.length} reported posts</div>
          <div className="reported-posts-list">
            {reportedPosts.map((post) => (
              <div key={post._id} className="post-item">
                <div className="post-info">
                  <h2 className="post-title">{post.title}</h2>
                  <div className="post-metadata">
                    <span className="post-author">{post.author.username}</span>
                    <span className="report-date">{new Date(post.reportedDate).toLocaleDateString()}</span>
                    <span className="report-reason">{post.reportReason}</span>
                  </div>
                </div>
                <button
                  className="go-button"
                  onClick={() => handleViewPost(post._id)}
                >
                  GO
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportedPosts; 