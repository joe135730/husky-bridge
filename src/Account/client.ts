import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const USERS_API = `${API_BASE}/users`;

export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    dob?: Date;
}

export const signup = async (user: User) => {
    const response = await axios.post(`${USERS_API}/signup`, user);
    return response.data;
};

export const signin = async (email: string, password: string) => {
    const response = await axios.post(`${USERS_API}/signin`, { email, password });
    return response.data;
};
