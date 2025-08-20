import React, { useState, useEffect } from 'react';
import Home from './Home'
import './ChatPage.css'

const ChatPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <button 
          className="refresh-button" 
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh History'}
        </button>
        
        <div className="list-container">
          {loading && <p className="loading-message">Loading...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          
          <ul className="data-list">
            {data.map(item => (
              <li key={item.id} className="list-item">
                <h4 className="item-title">{item.title}</h4>
                <p className="item-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="placeholder">
          <Home/>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;