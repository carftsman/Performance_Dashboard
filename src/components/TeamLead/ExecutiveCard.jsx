import React, { useState } from 'react';

const ExecutiveCard = ({ executive }) => {
  const [showChallenges, setShowChallenges] = useState(false);
  const achievementRate = ((executive.achieved / executive.target) * 100).toFixed(1);

  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ marginBottom: '0' }}>{executive.name}</h3>
        <div style={{
          backgroundColor: achievementRate >= 100 ? '#00b894' : '#fdcb6e',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {achievementRate}%
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Target:</span>
          <strong>{executive.target}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Achieved:</span>
          <strong style={{ color: '#00b894' }}>{executive.achieved}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Balance:</span>
          <strong style={{ color: executive.balance > 0 ? '#e17055' : '#00b894' }}>
            {executive.balance}
          </strong>
        </div>
      </div>
      
      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={() => setShowChallenges(!showChallenges)}
          className="btn"
          style={{ width: '100%', padding: '8px' }}
        >
          {showChallenges ? 'Hide' : 'View'} Challenges
        </button>
        
        {showChallenges && executive.challenges.length > 0 && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <strong>Challenges & Questions:</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              {executive.challenges.map((challenge, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{challenge}</li>
              ))}
            </ul>
          </div>
        )}
        
        {showChallenges && executive.challenges.length === 0 && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            No challenges reported
          </div>
        )}
      </div>
      
      <button 
        onClick={() => alert(`Viewing detailed report for ${executive.name}`)}
        className="btn btn-success"
        style={{ width: '100%', marginTop: '15px' }}
      >
        View Detailed Report
      </button>
    </div>
  );
};

export default ExecutiveCard;