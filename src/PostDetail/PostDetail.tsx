import { useState } from 'react';
import Navbar from '../navbar/navbar';
import Footer from "../Footer/index";
import { useNavigate } from 'react-router-dom';
import './PostDetail.css';

export default function PostDetail() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(true);

  // Mock data - in real app, this would come from props or API
  const post = {
    title: "Need a Calculator for Finals?",
    postedBy: "Sarah L.",
    date: "March 12, 2025",
    postType: "Request",
    category: "Borrow/lend",
    location: "Northeastern Library (Snell Library)",
    availability: "March 14 - March 21, 2025",
    description: "Hey Huskies! I have a TI-84 Plus calculator available for borrow. If you need one for your exams or assignments, feel free to reach out. I'm happy to lend it for one week on a first-come, first-served basis."
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log("Message button clicked");
  };

  const handleAccept = () => {
    // TODO: Implement accept functionality
    setIsPending(false);
    console.log("Accept button clicked");
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report button clicked");
  };

  return (
    <>
    <Navbar />
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <div className="post-meta">
        Posted by: {post.postedBy} | Date: {post.date}
      </div>

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
          <div className="info-value">{post.availability}</div>
        </div>

        <div className="info-group">
          <div className="info-label">Description</div>
          <div className="info-value description">{post.description}</div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="back-btn" onClick={handleBack}>
          Back to all Post
        </button>

        <button className="message-btn" onClick={handleMessage}>
          Message
        </button>

        <button className="accept-btn" onClick={handleAccept} disabled={!isPending}>
          Accept Offer / Accept Request
        </button>
        
        <button className="report-btn" onClick={handleReport}>
          Report Post
        </button>
      </div>

      {!isPending && (
        <div className="status-badge pending">
          Pending
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
} 