import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const axiosWithCredentials = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export interface Post {
  _id: string;
  title: string;
  postType: string;
  category: string;
  location: string;
  availability: string;
  description: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    userId: string;
    status: string;
    createdAt: string;
  }>;
  selectedParticipantId: string | null;
  ownerCompleted: boolean;
  participantCompleted: boolean;
}

export const createPost = async (postData: Omit<Post, '_id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'participants' | 'selectedParticipantId' | 'ownerCompleted' | 'participantCompleted'>) => {
  const response = await axiosWithCredentials.post("/posts", postData);
  return response.data;
};

export const findPostById = async (id: string): Promise<Post> => {
  const response = await axiosWithCredentials.get(`/posts/${id}`);
  return response.data;
};

export const updatePost = async (id: string, postData: Partial<Post>): Promise<Post> => {
  const response = await axiosWithCredentials.put(`/posts/${id}`, postData);
  return response.data;
};

export const fetchPost = async (postId: string) => {
  const response = await axiosWithCredentials.get(`/posts/${postId}`);
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await axiosWithCredentials.delete(`/posts/${postId}`);
  return response.data;
};


