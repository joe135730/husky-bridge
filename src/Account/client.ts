import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const USERS_API = `${API_BASE}/users`;

// Get token from local storage
const getToken = () => localStorage.getItem('authToken');

// Create an axios instance with credentials to maintain session
const axiosWithCredentials = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
axiosWithCredentials.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
    token?: string; // JWT token for auth
}

export const signup = async (user: User) => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
        // Store token in localStorage if provided
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.log("Signup error:", error);
        throw error;
    }
};

export const signin = async (email: string, password: string) => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/signin`, { email, password });
        // Store token in localStorage if provided
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.log("Signin error:", error);
        throw error;
    }
};

export const signout = async () => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
        // Clear token on logout
        localStorage.removeItem('authToken');
        return response.data;
    } catch (error) {
        console.log("Signout error:", error);
        throw error;
    }
};

export const profile = async () => {
    try {
        const response = await axiosWithCredentials.get(`${USERS_API}/profile`);
        return response.data;
    } catch (error) {
        console.log("Profile fetch error", error);
        throw error;
    }
};

export const findAllUsers = async () => {
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
