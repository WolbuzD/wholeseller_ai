import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackSection = ({ API_BASE }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('feature');
  const [submitterName, setSubmitterName] = useState('');
  const [allFeedback, setAllFeedback] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/feedback`);
      setAllFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      alert('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/feedback`, {
        type: feedbackType,
        message: feedback,
        submitter_name: submitterName || 'Anonymous',
        timestamp: new Date().toISOString()
      });
      
      setFeedback('');
      setSubmitterName('');
      alert('Thank you for your feedback!');
      fetchFeedback(); // Refresh the feedback list
    } catch (error) {
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'feature': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'improvement': return { backgroundColor: '#fef3c7', color: '#d97706' };
      case 'bug': return { backgroundColor: '#fee2e2', color: '#dc2626' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>💡 Community Feedback</h2>
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          {showFeedback ? 'Hide Suggestions' : 'View All Suggestions'}
        </button>
      </div>

      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Help shape the future of Wholesaler AI! Share your ideas for new features or improvements.
      </p>

      {/* Submit New Feedback */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem' }}>Submit Your Suggestion</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Your Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Suggestion Type
            </label>
            <select
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option value="feature">New Feature Request</option>
              <option value="improvement">Improve Existing Feature</option>
              <option value="bug">Bug Report</option>
              <option value="general">General Feedback</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Your Suggestion
          </label>
          <textarea
            placeholder="Describe your feature request, improvement idea, or feedback..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              minHeight: '100px',
              resize: 'vertical'
            }}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <button
          onClick={submitFeedback}
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#9ca3af' : '#16a34a',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Submitting...' : '📝 Submit Suggestion'}
        </button>
      </div>

      {/* Display All Feedback */}
      {showFeedback && (
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem' }}>
            Community Suggestions ({allFeedback.length})
          </h3>
          
          {allFeedback.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No suggestions yet. Be the first to share your ideas!
            </p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {allFeedback.map((item, index) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                        {item.submitter_name}
                      </span>
                      <span style={{
                        ...getTypeColor(item.type),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0 }}>
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;