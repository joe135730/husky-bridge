import { axiosWithCredentials } from "../api/client";

// Define API endpoint paths
const POSTS_API = `/posts`;

export interface Participant {
  userId: string;
  status: "Pending" | "In Progress" | "Wait for Complete" | "Complete" | "Not Selected";
  completedAt: Date | null;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Post {
  _id?: string;
  userId: string;
  title: string;
  postType: "request" | "offer";
  category: "general" | "housing" | "tutoring" | "lend-borrow";
  location: string;
  availability: string; // Changed to string to store "startDate,endDate"
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: "Pending" | "In Progress" | "Wait for Complete" | "Complete";
  participants: Participant[];
  selectedParticipantId: string | null;
  ownerCompleted: boolean;
  participantCompleted: boolean;
  userRelationship?: "owner" | "selected" | "participant" | "none";
  userParticipantStatus?: "Pending" | "In Progress" | "Complete";
}

// Create a new post
export const createPost = async (
  post: Omit<
    Post,
    | "_id"
    | "userId"
    | "createdAt"
    | "updatedAt"
    | "status"
    | "participants"
    | "selectedParticipantId"
    | "ownerCompleted"
    | "participantCompleted"
  >
) => {
  const response = await axiosWithCredentials.post(POSTS_API, post);
  return response.data;
};

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

export const updatePost = async (postId: string, post: Partial<Post>) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}`,
    post
  );
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await axiosWithCredentials.delete(`${POSTS_API}/${postId}`);
  return response.data;
};

// Mark post as completed by owner
export const markPostAsCompletedByOwner = async (postId: string) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}/complete-owner`
  );
  return response.data;
};

// Mark post as completed by participant
export const markPostAsCompletedByParticipant = async (postId: string) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}/complete-participant`
  );
  return response.data;
};

// Express interest in a post (add current user as a participant)
export const participateInPost = async (postId: string) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}/participate`
  );
  return response.data;
};

// Select a participant (post owner accepting a participant)
export const selectParticipant = async (
  postId: string,
  participantId: string
) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}/select/${participantId}`
  );
  return response.data;
};

// Get participants for a post
export const getPostParticipants = async (postId: string) => {
  const response = await axiosWithCredentials.get(
    `${POSTS_API}/${postId}/participants`
  );
  return response.data;
};

export interface PostFilters {
  postType?: "request" | "offer";
  category?: "general" | "housing" | "tutoring" | "lend-borrow";
  location?: string;
  status?: "Pending" | "In Progress" | "Complete";
  dateRange?: number; // number of days to look back
  sort?: "latest" | "oldest";
}

export const findPostsWithFilters = async (filters: PostFilters) => {
  try {
    const params = new URLSearchParams();

    if (filters.postType) params.append("postType", filters.postType);
    if (filters.category) params.append("category", filters.category);
    if (filters.location) params.append("location", filters.location);
    // if (filters.isCompleted !== undefined) params.append('isCompleted', filters.isCompleted.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.dateRange)
      params.append("dateRange", filters.dateRange.toString());
    if (filters.sort) params.append("sort", filters.sort);

    const response = await axiosWithCredentials.get(`${POSTS_API}/filter`);

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    const response = await axiosWithCredentials.get(`${POSTS_API}/filter`, {
      params: filters,
    });
    return response.data;
  }
};

export const markPostComplete = async (postId: string): Promise<Post> => {
  try {
    const response = await axiosWithCredentials.put(
      `${POSTS_API}/${postId}/mark-complete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findPostByCategory = async (category: Post["category"]) => {
  const response = await axiosWithCredentials.get(`${POSTS_API}/category/${category}`);
  return response.data;
};

export const findPostsByCategories = async (categories: Post["category"][]) => {
  try {
    const postsPromises = categories.map(category => findPostByCategory(category));
    const postsResults = await Promise.all(postsPromises);
    return postsResults.flat();
  } catch (error) {
    console.error('Error fetching posts by categories:', error);
    throw error;
  }
};

export const findPostsByTitle = async (title: string) => {
  const response = await axiosWithCredentials.get(`${POSTS_API}/title/${encodeURIComponent(title)}`);
  return response.data;
};

// Remove a participant from a post
export const removeParticipant = async (postId: string, participantId: string) => {
  const response = await axiosWithCredentials.delete(
    `${POSTS_API}/${postId}/participants/${participantId}`
  );
  return response.data;
};

// Remove a post from My Posts (for not selected participants)
export const removePostFromMyPosts = async (postId: string) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}/remove-from-my-posts`
  );
  return response.data;
};

// Cancel active collaboration (for both owner and participant)
export const cancelCollaboration = async (postId: string) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}/cancel-collaboration`
  );
  return response.data;
};

// Remove a completed post from participant's view (without changing post status)
export const removeCompletedPost = async (postId: string) => {
  const response = await axiosWithCredentials.put(
    `${POSTS_API}/${postId}/remove-completed-post`
  );
  return response.data;
};
