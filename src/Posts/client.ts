import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const POSTS_API = `${API_BASE}/posts`;

// Create an axios instance with credentials to maintain session
const axiosWithCredentials = axios.create({
    withCredentials: true,
});

export interface Participant {
    userId: string;
    status: 'Pending' | 'In Progress' | 'Complete';
    completedAt: Date | null;
    user?: {
        _id: string;
        username: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
}

export interface Post {
    _id?: string;
    userId: string;
    title: string;
    postType: 'request' | 'offer';
    category: 'general' | 'housing' | 'tutoring' | 'lend-borrow';
    location: string;
    availability: Date;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'Pending' | 'In Progress' | 'Complete';
    participants: Participant[];
    selectedParticipantId: string | null;
    ownerCompleted: boolean;
    participantCompleted: boolean;
    userRelationship?: 'owner' | 'selected' | 'participant' | 'none';
    userParticipantStatus?: 'Pending' | 'In Progress' | 'Complete';
}

// Create a new post
export const createPost = async (post: Omit<Post, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'status' | 'participants' | 'selectedParticipantId' | 'ownerCompleted' | 'participantCompleted'>) => {
    const response = await axiosWithCredentials.post(POSTS_API, post);
    return response.data;
};

// TEMPORARY FUNCTION FOR TESTING - DELETE LATER
export const findAllPosts = async () => {
    const response = await axiosWithCredentials.get(POSTS_API);
    return response.data;
};

// Get current user's posts (created by the user)
export const findMyPosts = async () => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/user`);
    return response.data;
};

// Get posts where the current user is participating (either as owner or participant)
export const findParticipatingPosts = async () => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/participating`);
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

// Mark post as completed by owner
export const markPostAsCompletedByOwner = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/complete-owner`);
    return response.data;
};

// Mark post as completed by participant
export const markPostAsCompletedByParticipant = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/complete-participant`);
    return response.data;
};

// Express interest in a post (add current user as a participant)
export const participateInPost = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/participate`);
    return response.data;
};

// Select a participant (post owner accepting a participant)
export const selectParticipant = async (postId: string, participantId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/select/${participantId}`);
    return response.data;
};

// Get participants for a post
export const getPostParticipants = async (postId: string) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/${postId}/participants`);
    return response.data;
};

// Find posts with filters
export interface PostFilters {
    postType?: 'request' | 'offer';
    category?: 'general' | 'housing' | 'tutoring' | 'lend-borrow';
    location?: string;
    status?: 'Pending' | 'In Progress' | 'Complete';
    dateRange?: number; // number of days to look back
    sort?: 'latest' | 'oldest';
}

export const findPostsWithFilters = async (filters: PostFilters) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/filter`, { params: filters });
    return response.data;
}; 