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
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, { email, password });
    return response.data;
};

export const signout = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
    return response.data;
};

export const profile = async () => {
    try {
        const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
        return response.data;
    } catch (error: any) {
        // For 401 errors (not logged in), return null instead of throwing
        if (error.response && error.response.status === 401) {
            return null;
        }
        // Rethrow other errors
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
