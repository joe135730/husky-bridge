import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const USERS_API = `${API_BASE}/users`;

// Create an axios instance with credentials to maintain session
const axiosWithCredentials = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Additional Axios config to ensure credentials are always sent
axiosWithCredentials.defaults.withCredentials = true;

// Add request interceptor to ensure cookies are included in all requests
axiosWithCredentials.interceptors.request.use(
  config => {
    // Always include credentials
    config.withCredentials = true;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors globally
axiosWithCredentials.interceptors.response.use(
  response => response,
  async error => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear localStorage if server says we're not authenticated
      localStorage.removeItem('currentUser');
    }
    return Promise.reject(error);
  }
);

export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    dob?: Date;
    lastActivity?: Date;
    totalActivity?: string;
}

export const signup = async (user: User) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    return response.data;
};

export const signin = async (email: string, password: string) => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/signin`, { email, password });
        // Save user data to localStorage as fallback
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error("Sign in error:", error);
        throw error;
    }
};

export const signout = async () => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
        // Clear localStorage on signout
        localStorage.removeItem('currentUser');
        return response.data;
    } catch (error) {
        // Still clear localStorage even if server signout fails
        localStorage.removeItem('currentUser');
        console.error("Sign out error:", error);
        throw error;
    }
};

export const profile = async () => {
    try {
        // Make request to get the current user profile
        const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
        // Update localStorage with fresh user data
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        return response.data;
    } catch (error: any) {
        // If server says we're not authenticated and we have localStorage data
        if (error.response && error.response.status === 401) {
            // Don't fall back to localStorage anymore - this causes session inconsistency
            localStorage.removeItem('currentUser');
            return null;
        }
        // Rethrow other errors
        throw error;
    }
};

// Helper function to check and refresh authentication status
export const verifyAuth = async () => {
    try {
        // Always check with the server first
        const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
        // Update localStorage with fresh data
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        return response.data;
    } catch (error: any) {
        // If the server says we're not authenticated
        if (error.response?.status === 401) {
            // Clear localStorage for consistency
            localStorage.removeItem('currentUser');
            return null;
        }
        
        // For network errors or other issues, use localStorage as a fallback
        if (!error.response) {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    return JSON.parse(savedUser);
                } catch (e) {
                    localStorage.removeItem('currentUser');
                }
            }
        }
        
        throw error;
    }
};

// Add call to verifyAuth in other functions
export const findAllUsers = async () => {
    await verifyAuth(); // Ensure authentication is valid
    const response = await axiosWithCredentials.get(USERS_API);
    return response.data;
};

export const findUserById = async (userId: string) => {
    const response = await axiosWithCredentials.get(`${USERS_API}/${userId}`);
    return response.data;
};

export const updateUser = async (userId: string, user: User) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${userId}`, user);
    return response.data;
};

export const deleteUser = async (userId: string) => {
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
    return response.data;
};

// Check if cookies are working and debug auth issues
export const checkAuthStatus = async () => {
    console.log("Client: Starting auth status check");
    
    // First, check if we have data in localStorage
    const savedUser = localStorage.getItem('currentUser');
    console.log("Client: localStorage check:", {
        hasUser: !!savedUser,
        userData: savedUser ? JSON.parse(savedUser) : null
    });
    
    try {
        // Make a request to the debug endpoint
        console.log("Client: Making request to auth debug endpoint");
        const response = await axiosWithCredentials.get(`${API_BASE}/auth/debug`);
        console.log("Client: Auth debug response:", response.data);
        
        return {
            localStorage: savedUser ? JSON.parse(savedUser) : null,
            serverResponse: response.data
        };
    } catch (error) {
        console.error("Client: Auth debug request failed:", error);
        return {
            localStorage: savedUser ? JSON.parse(savedUser) : null,
            serverResponse: null,
            error: error
        };
    }
};
