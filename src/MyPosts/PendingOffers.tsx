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
  const [hasSelectedParticipant, setHasSelectedParticipant] = useState(false);

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
      
      // Check if there's already a selected participant
      if (
        postData.selectedParticipantId || 
        postData.status === 'In Progress' ||
        postData.status === 'Wait for Complete' ||
        participantsData.some((p: Participant) => 
          p.status === 'In Progress' || p.status === 'Wait for Complete'
        )
      ) {
        setHasSelectedParticipant(true);
      } else {
        setHasSelectedParticipant(false); // Reset the state when no selected participant
      }
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
      
      // Show confirmation dialog warning about other participants
      const confirmSelect = window.confirm(
        'Accepting this participant will mark all other participants as "Not Selected". Do you want to continue?'
      );
      
      if (!confirmSelect) return;
      
      setIsProcessing(true);
      setError('');
      
      await client.selectParticipant(postId, participantId);
      await loadPostAndParticipants();
      setHasSelectedParticipant(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error selecting participant');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMessage = (participantId: string) => {
    // Navigate to chat and store the participant ID to focus on
    localStorage.setItem('chatFocusUser', participantId);
    navigate('/messages');
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

  const handleMarkComplete = async () => {
    try {
      if (!postId) return;
      setIsProcessing(true);
      setError('');
      
      const confirmComplete = window.confirm(
        'Are you sure you want to mark this collaboration as complete?'
      );
      
      if (!confirmComplete) {
        setIsProcessing(false);
        return;
      }
      
      // Use try-catch within the function to handle potential session issues
      try {
        await client.markPostComplete(postId);
        await loadPostAndParticipants();
      } catch (innerError: any) {
        console.error('API error when marking post as complete:', innerError);
        
        // Check if the error is authentication-related
        if (innerError.response?.status === 401) {
          setError('Your session has expired. Please refresh the page and try again.');
        } else {
          setError(innerError.response?.data?.message || 'Error marking post as complete');
        }
      }
    } catch (error: any) {
      console.error('Error marking post as complete:', error);
      setError(error.response?.data?.message || 'Error marking post as complete');
    } finally {
      setIsProcessing(false);
    }
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
        {hasSelectedParticipant && (
          <div className="info-message">
            You have already accepted a participant for this post. You cannot accept additional participants.
          </div>
        )}

        <div className="participants-list">
          {participants.length === 0 ? (
            <div className="no-participants">
              <p>No pending requests yet.</p>
            </div>
          ) : (
            participants.map((participant) => {
              const name = getParticipantName(participant);
              
              return (
                <div key={participant.userId} className="participant-item">
                  <div className="participant-info">
                    <div className="participant-header">
                      <h3>{name}</h3>
                      {participant.status === 'In Progress' && (
                        <span id="pending-offer-status-badge">In Progress</span>
                      )}
                      {participant.status === 'Wait for Complete' && (
                        <span id="pending-offer-status-badge" className="wait-for-complete">Wait for Complete</span>
                      )}
                      {participant.status === 'Not Selected' && (
                        <span id="pending-offer-status-badge" className="not-selected">Not Selected</span>
                      )}
                    </div>
                    <p>Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="participant-actions" id="pending-offer-actions">
                    {participant.status === 'Pending' && (
                      <>
                        <button 
                          id="pending-offer-accept-button" 
                          onClick={() => handleSelectParticipant(participant.userId)}
                          disabled={hasSelectedParticipant || isProcessing}
                          className={hasSelectedParticipant ? 'disabled' : ''}
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
                          disabled={isProcessing}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    
                    {participant.status === 'In Progress' && post.status !== 'Wait for Complete' && (
                      <>
                        <button 
                          id="pending-offer-mark-complete-button" 
                          onClick={() => handleMarkComplete()}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Mark as Complete'}
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
                          disabled={isProcessing}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    
                    {(participant.status === 'Wait for Complete' || 
                      (participant.status === 'In Progress' && post.status === 'Wait for Complete')) && (
                      <>
                        <button 
                          id="pending-offer-mark-complete-button" 
                          disabled={true}
                          className="disabled"
                        >
                          Waiting for Completion
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
                          disabled={isProcessing}
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {participant.status === 'Not Selected' && (
                      <>
                        <button 
                          id="pending-offer-accept-button" 
                          onClick={() => handleSelectParticipant(participant.userId)}
                          disabled={hasSelectedParticipant || isProcessing}
                          className={hasSelectedParticipant ? 'disabled' : ''}
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
                          disabled={isProcessing}
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