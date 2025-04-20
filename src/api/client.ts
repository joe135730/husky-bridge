import axios from "axios";
import store from "../store";
import { clearCurrentUser } from "../store/account-reducer";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// Create an axios instance with credentials to maintain session
export const axiosWithCredentials = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor to handle authentication errors
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

// Helper function to handle token refresh and retry requests
const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string | null) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// Add response interceptor
axiosWithCredentials.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If the error is due to authentication (401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log('Auth error interceptor - 401 detected, attempting to refresh session');
      
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;
        
        try {
          // Try to refresh the session by calling profile endpoint
          const response = await axios.post(`${API_BASE}/users/profile`, {}, {
            withCredentials: true
          });
          
          if (response.data) {
            console.log('Session refreshed successfully');
            // If successful, update the store and retry the original request
            onTokenRefreshed('refreshed');
            return axiosWithCredentials(originalRequest);
          } else {
            // If failed, clear the user and reject
            console.log('Session refresh failed, clearing user');
            store.dispatch(clearCurrentUser());
            onTokenRefreshed(null);
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.log('Session refresh error:', refreshError);
          store.dispatch(clearCurrentUser());
          onTokenRefreshed(null);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Wait for the token to be refreshed
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            if (token) {
              resolve(axiosWithCredentials(originalRequest));
            } else {
              resolve(Promise.reject(error));
            }
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Export API base for direct fetch calls if needed
export { API_BASE }; 