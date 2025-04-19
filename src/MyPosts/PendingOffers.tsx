import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [isProcessing, setIsProcessing] = useState(false);

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
      setError(error.response?.data?.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = () => {
    navigate(`/post/${postId}`);
  };

  const handleSelectParticipant = async (participantId: string) => {
    try {
      if (!postId) return;
      await client.selectParticipant(postId, participantId);
      await loadPostAndParticipants();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error selecting participant');
    }
  };

  const handleMessage = (participantId: string) => {
    // TODO: Implement messaging functionality
  };

  const handleDecline = async (participantId: string) => {
    if (!postId || isProcessing) return;

    try {
      setIsProcessing(true);
      setError('');
      await client.removeParticipant(postId, participantId);
      // Refresh the participants list after successful decline
      await loadPostAndParticipants();
    } catch (error: any) {
      console.error('Error declining participant:', error);
      setError(error.response?.data?.message || 'Error declining participant');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkComplete = async (participantId: string) => {
    // TODO: Implement mark complete functionality
  };

  const getParticipantName = (participant: Participant) => {
    if (participant.user?.firstName && participant.user?.lastName) {
      return `${participant.user.firstName} ${participant.user.lastName}`;
    }
    return 'Unknown User';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="pending-offers-container">
      <div className="post-card">
        <h2 className="post-card-title" onClick={handleTitleClick}>
          {post.title}
        </h2>
        <div className="post-card-info">
          <p>📍 {post.location}</p>
          <p>Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="participants-section">
        <h3>Pending Requests</h3>
        {error && <div className="error-message">{error}</div>}

        <div className="participants-list">
          {participants.length === 0 ? (
            <div className="no-participants">
              <p>No pending requests yet.</p>
            </div>
          ) : (
            participants.map((participant) => {
              const name = getParticipantName(participant);
              const isAccepted = participant.status === 'In Progress';
              
              return (
                <div key={participant.userId} className="participant-item">
                  <div className="participant-info">
                    <div className="participant-header">
                      <h3>{name}</h3>
                      {isAccepted && (
                        <span id="pending-offer-status-badge">In Progress</span>
                      )}
                    </div>
                    <p>Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="participant-actions" id="pending-offer-actions">
                    {participant.status === 'Pending' ? (
                      <>
                        <button 
                          id="pending-offer-accept-button" 
                          onClick={() => handleSelectParticipant(participant.userId)}
                        >
                          Accept
                        </button>
                        <button 
                          id="pending-offer-message-button" 
                          onClick={() => handleMessage(participant.userId)}
                        >
                          Message
                        </button>
                        <button 
                          id="pending-offer-decline-button" 
                          onClick={() => handleDecline(participant.userId)}
                        >
                          Decline
                        </button>
                      </>
                    ) : isAccepted && (
                      <>
                        <button 
                          id="pending-offer-mark-complete-button" 
                          onClick={() => handleMarkComplete(participant.userId)}
                        >
                          Mark as Complete
                        </button>
                        <button 
                          id="pending-offer-message-button" 
                          onClick={() => handleMessage(participant.userId)}
                        >
                          Message
                        </button>
                        <button 
                          id="pending-offer-decline-button" 
                          onClick={() => handleDecline(participant.userId)}
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 