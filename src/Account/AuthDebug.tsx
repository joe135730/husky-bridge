import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// Create an axios instance with credentials to maintain session
const axiosWithCredentials = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

export default function AuthDebug() {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setError(null);
      const response = await axiosWithCredentials.get('/auth/debug');
      setAuthInfo(response.data);
    } catch (err: any) {
      console.error("Auth debug error:", err);
      setError(err.message || 'Error checking auth');
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Authentication Debugger</h3>
      
      <button 
        onClick={checkAuth}
        style={{ 
          padding: '10px 15px', 
          background: '#4CAF50', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        Check Authentication Status
      </button>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {authInfo && (
        <div>
          <h4>Authentication Status</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(authInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 