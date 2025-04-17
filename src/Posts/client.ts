import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const POSTS_API = `${API_BASE}/posts`;

// Create an axios instance with credentials to maintain session
const axiosWithCredentials = axios.create({
    withCredentials: true,
});

export interface Post {
    _id?: string;
    userId: string;
    title: string;
    postType: 'request' | 'offer';
    category: 'general' | 'housing' | 'tutoring' | 'lend-borrow';
    location: string;
    availability: Date;
    description: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    acceptedBy: string | null;
    status: 'active' | 'pending' | 'completed';
}

// Create a new post
export const createPost = async (post: Omit<Post, '_id' | 'userId' | 'isCompleted' | 'createdAt' | 'updatedAt' | 'acceptedBy' | 'status'>) => {
    const response = await axiosWithCredentials.post(POSTS_API, post);
    return response.data;
};

// Get all posts
export const findAllPosts = async () => {
    const response = await axiosWithCredentials.get(POSTS_API);
    return response.data;
};

// Get current user's posts
export const findMyPosts = async () => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/user`);
    return response.data;
};

// Get post by ID
export const findPostById = async (postId: string) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/${postId}`);
    return response.data;
};

// Update post
export const updatePost = async (postId: string, post: Partial<Post>) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}`, post);
    return response.data;
};

// Delete post
export const deletePost = async (postId: string) => {
    const response = await axiosWithCredentials.delete(`${POSTS_API}/${postId}`);
    return response.data;
};

// Mark post as completed
export const markPostAsCompleted = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/complete`);
    return response.data;
};

// Accept post
export const acceptPost = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/accept`);
    return response.data;
};

// Find posts with filters
export interface PostFilters {
    postType?: 'request' | 'offer';
    category?: 'general' | 'housing' | 'tutoring' | 'lend-borrow';
    location?: string;
    isCompleted?: boolean;
    status?: 'active' | 'pending' | 'completed';
    dateRange?: number; // number of days to look back
    sort?: 'latest' | 'oldest';
}

export const findPostsWithFilters = async (filters: PostFilters) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/filter`, { params: filters });
    return response.data;
}; 