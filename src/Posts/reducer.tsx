import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
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

interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    currentPost: Post | null;
}

const initialState: PostsState = {
    posts: [],
    loading: false,
    error: null,
    currentPost: null
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        },
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action: PayloadAction<Post>) => {
            const index = state.posts.findIndex(post => post._id === action.payload._id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        deletePost: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
        },
        setCurrentPost: (state, action: PayloadAction<Post | null>) => {
            state.currentPost = action.payload;
        },
        markCompleted: (state, action: PayloadAction<string>) => {
            const post = state.posts.find(post => post._id === action.payload);
            if (post) {
                post.isCompleted = true;
                post.status = 'completed';
            }
        },
        acceptPost: (state, action: PayloadAction<{ postId: string, userId: string }>) => {
            const post = state.posts.find(post => post._id === action.payload.postId);
            if (post) {
                post.acceptedBy = action.payload.userId;
                post.status = 'pending';
            }
        }
    }
});

export const {
    setLoading,
    setError,
    setPosts,
    addPost,
    updatePost,
    deletePost,
    setCurrentPost,
    markCompleted,
    acceptPost
} = postsSlice.actions;

export default postsSlice.reducer;
    