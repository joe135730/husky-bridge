import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as client from '../Posts/client';
import { Participant, Post } from '../Posts/client';
import './MyPosts.css';

export default function PendingOffers() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postId) {
      loadPostAndParticipants();
    }
  }, [postId]);

  const loadPostAndParticipants = async () => {
    try {
      setLoading(true);
      const [postData, participantsData] = await Promise.all([
        client.findPostById(postId!),
        client.getPostParticipants(postId!)
      ]);
      
      setPost(postData);
      setParticipants(participantsData);
    } catch (error: any) {
      console.error("Error loading data:", error);
      setError(error.response?.data?.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/post/${postId}`);
  };

  const handleSelectParticipant = async (participantId: string) => {
    try {
      if (!postId) return;
      
      await client.selectParticipant(postId, participantId);
      navigate(`/post/${postId}`); // Go back to post details
    } catch (error: any) {
      console.error("Error selecting participant:", error);
      setError(error.response?.data?.message || 'Error selecting participant');
    }
  };

  const handleMessage = (participantId: string) => {
    // TODO: Implement messaging functionality
    console.log("Message button clicked for participant:", participantId);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="pending-offers-container">
      <div className="pending-offers-header">
        <h2>Pending Requests for "{post.title}"</h2>
        <button className="back-btn" onClick={handleBack}>Back to Post</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="participants-list">
        {participants.length === 0 ? (
          <div className="no-participants">
            <p>No pending requests yet.</p>
          </div>
        ) : (
          participants.map((participant) => (
            <div key={participant.userId} className="participant-item">
              <div className="participant-info">
                <h3>{participant.user?.username || 'Unknown User'}</h3>
                {participant.user?.firstName && participant.user?.lastName && (
                  <p>{participant.user.firstName} {participant.user.lastName}</p>
                )}
                {participant.user?.email && (
                  <p>{participant.user.email}</p>
                )}
                <p>Status: {participant.status}</p>
              </div>
              <div className="participant-actions">
                {participant.status === 'Pending' && (
                  <button 
                    className="accept-btn" 
                    onClick={() => handleSelectParticipant(participant.userId)}
                  >
                    Accept
                  </button>
                )}
                <button 
                  className="message-btn" 
                  onClick={() => handleMessage(participant.userId)}
                >
                  Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 