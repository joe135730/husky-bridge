import React, { useState } from 'react';
import './ReportModal.css';

interface ReportModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (reason: string, comments: string) => void;
  error?: string | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ 
  show, 
  onClose, 
  onSubmit,
  error
}) => {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  
  if (!show) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason, comments);
  };
  
  return (
    <div className="modal-backdrop">
      <div className="report-modal">
        <div className="modal-header">
          <h2>Report Post</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-note">
            <p>You can report this post anonymously if you're not logged in. All reports are reviewed by moderators.</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="reason">Reason for reporting</label>
            <select 
              id="reason" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="harassment">Harassment</option>
              <option value="scam">Scam/Fraud</option>
              <option value="false">False information</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="comments">Additional comments</label>
            <textarea 
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please provide additional details about the issue"
              rows={4}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal; 