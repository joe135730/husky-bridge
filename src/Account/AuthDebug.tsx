import { useState, useEffect } from 'react';
import * as client from './client';
import { useSelector } from 'react-redux';
import { StoreType } from '../store';

export default function AuthDebug() {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [browserCookies, setBrowserCookies] = useState<string>('');
  const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);

  // Get browser cookies on mount
  useEffect(() => {
    setBrowserCookies(document.cookie);
  }, []);

  const checkAuth = async () => {
    try {
      setError(null);
      setAuthInfo(null); // Clear previous data
      
      // Update browser cookies
      setBrowserCookies(document.cookie);
      
      // Use the comprehensive auth check function
      const result = await client.checkAuthStatus();
      setAuthInfo(result);
    } catch (err: any) {
      console.error("Auth debug error:", err);
      setError(err.message || 'Error checking auth');
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Authentication Debugger</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Redux Store User</h4>
        {currentUser ? (
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify({
              id: currentUser._id,
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              email: currentUser.email,
              role: currentUser.role
            }, null, 2)}
          </pre>
        ) : (
          <p>No user in Redux store</p>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Browser Cookies</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', wordBreak: 'break-all' }}>
          {browserCookies || 'No cookies found'}
        </pre>
      </div>
      
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