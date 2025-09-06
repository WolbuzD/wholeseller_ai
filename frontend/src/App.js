import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FeedbackSection from './FeedbackSection';

const API_BASE = 'https://wholesellerai-production.up.railway.app';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [situationTypes, setSituationTypes] = useState([]);
  const [filters, setFilters] = useState({
    zip_code: '',
    situation_types: [],
    min_equity: '',
    max_equity: '',
    min_value: '',
    max_value: '',
    min_motivation: ''
  });
  const [generatingMessage, setGeneratingMessage] = useState(null);
  const [generatedMessages, setGeneratedMessages] = useState({});

  useEffect(() => {
    fetchSituationTypes();
  }, []);

  const fetchSituationTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/situation-types`);
      setSituationTypes(response.data.situation_types);
    } catch (error) {
      console.error('Error fetching situation types:', error);
    }
  };

  const searchProperties = async () => {
    setLoading(true);
    try {
      const searchFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) =>
          value !== '' && (Array.isArray(value) ? value.length > 0 : true)
        )
      );

      const response = await axios.post(`${API_BASE}/api/properties/search`, searchFilters);
      setProperties(response.data);
    } catch (error) {
      console.error('Error searching properties:', error);
      alert('Error searching properties. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const generateMessage = async (propertyId) => {
    setGeneratingMessage(propertyId);
    try {
      const response = await axios.post(`${API_BASE}/api/generate-message`, {
        property_id: propertyId
      });

      setGeneratedMessages(prev => ({
        ...prev,
        [propertyId]: response.data
      }));
    } catch (error) {
      console.error('Error generating message:', error);
      alert('Error generating message. Please check backend connection.');
    } finally {
      setGeneratingMessage(null);
    }
  };

  const handleSituationTypeChange = (situationType) => {
    setFilters(prev => ({
      ...prev,
      situation_types: prev.situation_types.includes(situationType)
        ? prev.situation_types.filter(type => type !== situationType)
        : [...prev.situation_types, situationType]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (decimal) => {
    return `${Math.round(decimal * 100)}%`;
  };

  const getSituationLabel = (situationType) => {
    const situation = situationTypes.find(s => s.value === situationType);
    return situation ? situation.label : situationType;
  };

  const getMotivationColor = (score) => {
    if (score >= 8) return { color: '#dc2626', backgroundColor: '#fee2e2' };
    if (score >= 6) return { color: '#d97706', backgroundColor: '#fef3c7' };
    return { color: '#16a34a', backgroundColor: '#dcfce7' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>      
            🏠 Wholesaler AI - Property Prospector
          </h1>
          <p style={{ color: '#6b7280' }}>
            Find motivated sellers with AI-powered insights and personalized messaging
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Search Filters */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>🔍 Search Properties</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Zip Code
              </label>
              <input
                type="text"
                placeholder="30309 (Atlanta) or 10001 (NYC)"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                value={filters.zip_code}
                onChange={(e) => setFilters(prev => ({ ...prev, zip_code: e.target.value }))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Min Equity % (1-100)
              </label>
              <input
                type="number"
                placeholder="25"
                min="1"
                max="100"
                step="1"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                value={filters.min_equity ? Math.round(filters.min_equity * 100) : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters(prev => ({
                    ...prev,
                    min_equity: value ? parseFloat(value) / 100 : ''
                  }));
                }}
              />
              <small style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                Enter whole numbers (e.g., 25 for 25% equity)
              </small>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Min Motivation Score
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                value={filters.min_motivation}
                onChange={(e) => setFilters(prev => ({ ...prev, min_motivation: e.target.value ? parseInt(e.target.value) : '' }))}
              >
                <option value="">Any</option>
                <option value="6">6+ (Good)</option>
                <option value="8">8+ (High)</option>
                <option value="9">9+ (Very High)</option>
              </select>
            </div>
          </div>

          {/* Situation Types */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Situation Types
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {situationTypes.map(type => (
                <label key={type.value} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    style={{ marginRight: '0.5rem' }}
                    checked={filters.situation_types.includes(type.value)}
                    onChange={() => handleSituationTypeChange(type.value)}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={searchProperties}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : '🔍 Search Properties'}
          </button>

          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>
            💡 Try Atlanta zip codes (30309, 30308, 30305) for real data, or NYC zip codes (10001) for demo data
          </div>
        </div>

        {/* Results */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              📋 Found {properties.length} Properties
            </h2>
            {properties.length > 0 && (
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Sorted by motivation score (highest first)
              </span>
            )}
          </div>

          {properties.map(property => (
            <div key={property.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Property Info */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {property.address}
                      </h3>
                      <p style={{ color: '#6b7280' }}>
                        {property.city}, {property.state} {property.zip_code}
                      </p>
                      {property.data_source && (
                        <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                          📊 Source: {property.data_source}
                        </p>
                      )}
                    </div>
                    <div style={{
                      ...getMotivationColor(property.motivation_score),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      🎯 {property.motivation_score}/10 Motivation
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: '#6b7280' }}>Owner:</span>
                      <p style={{ fontWeight: '500' }}>{property.owner_name}</p>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Situation:</span>
                      <p style={{ fontWeight: '500' }}>{getSituationLabel(property.situation_type)}</p>        
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Est. Value:</span>
                      <p style={{ fontWeight: '500', color: '#16a34a' }}>{formatCurrency(property.estimated_value)}</p>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Equity:</span>
                      <p style={{ fontWeight: '500' }}>{formatPercentage(property.equity_percentage)}</p>      
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Liens:</span>
                      <p style={{ fontWeight: '500', color: '#dc2626' }}>{formatCurrency(property.liens_amount)}</p>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Days in Situation:</span>
                      <p style={{ fontWeight: '500' }}>{property.days_in_situation} days</p>
                    </div>
                  </div>
                </div>

                {/* AI Message Generation */}
                <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '1.5rem' }}>
                  <h4 style={{ fontWeight: '500', marginBottom: '0.75rem' }}>🤖 AI-Generated Message</h4>      

                  {!generatedMessages[property.id] ? (
                    <button
                      onClick={() => generateMessage(property.id)}
                      disabled={generatingMessage === property.id}
                      style={{
                        backgroundColor: generatingMessage === property.id ? '#9ca3af' : '#16a34a',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: generatingMessage === property.id ? 'not-allowed' : 'pointer',
                        width: '100%',
                        marginBottom: '0.75rem'
                      }}
                    >
                      {generatingMessage === property.id ?
                        '✨ Generating...' :
                        '✨ Generate Message'
                      }
                    </button>
                  ) : (
                    <div>
                      <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        marginBottom: '0.75rem'
                      }}>
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Personalized Message:</p>
                        <p style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>"{generatedMessages[property.id].generated_message}"</p>
                      </div>
                      <button style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '0.5rem'
                      }}>
                        📱 Send Message
                      </button>
                      <button
                        onClick={() => generateMessage(property.id)}
                        style={{
                          backgroundColor: '#6b7280',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        🔄 Regenerate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {properties.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#6b7280' }}>
                Enter a zip code and search to find motivated sellers in your area.
              </p>
            </div>
          )}
        </div>

        {/* Community Feedback Section */}
        <FeedbackSection API_BASE={API_BASE} />
      </div>
    </div>
  );
}

export default App;