import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// Create an axios instance with credentials to maintain session
export const axiosWithCredentials = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Export API base for direct fetch calls if needed
export { API_BASE }; 