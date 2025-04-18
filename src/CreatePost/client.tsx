import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const POST_API = `${REMOTE_SERVER}/api/posts`;


export const fetchPost = async (postId: string) => {
    const response = await axiosWithCredentials.get(`${POST_API}/${postId}`);
    return response.data;
};

export const fetchAllPosts = async() => {
    const {data} = await axiosWithCredentials.get(POST_API);
    return data;
};

export const createPost = async (post: any) => {
    const response = await axiosWithCredentials.post(POST_API, post);
    return response.data;
 
};

export const updatePost = async (post: any)=> {
    const { data } = await axiosWithCredentials.put(`${POST_API}/${post._id}`, post);
    return data;
};


export const deletePost = async (postId: string) => {
    const response = await axiosWithCredentials.delete(`${POST_API}/${postId}`);
    return response.data;
};


