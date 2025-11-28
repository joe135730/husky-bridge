import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "../Posts/client";
import { Post, PostFilters } from "../Posts/client";
import { StoreType } from "../store";
import "./AllPost.css";

export default function AllPost() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { category } = useParams<{ category: PostFilters['category'] }>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUser = useSelector((state: StoreType) => state.accountReducer.currentUser);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let fetchedPosts: Post[];
            const searchQuery = searchParams.get('search');

            if (searchQuery) {
                fetchedPosts = await client.findPostsByTitle(searchQuery);
            } else if (category) {
                fetchedPosts = await client.findPostByCategory(category);
            } else {
                fetchedPosts = await client.findAllPosts();
            }

            if (Array.isArray(fetchedPosts)) {
                setPosts(fetchedPosts);
            } else {
                console.error("Unexpected response format:", fetchedPosts);
                setError("Error loading posts. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Error loading posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [category, searchParams]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const handlePostClick = (postId: string) => {
        if (!currentUser) {
            // Redirect to login if not authenticated
            navigate("/Account/login", { state: { from: `/post/${postId}` } });
        } else {
            // Navigate to post detail if authenticated
            navigate(`/post/${postId}`);
        }
    };

    const getCategoryTitle = () => {
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            return `Search Results for "${searchQuery}"`;
        }
        switch (category) {
            case 'general':
                return 'General Posts';
            case 'lend-borrow':
                return 'Borrow/Lend Posts';
            case 'housing':
                return 'Housing Posts';
            case 'tutoring':
                return 'Tutoring Posts';
            default:
                return 'All Posts';
        }
    };

    if (loading) {
        return (
            <div className="all-posts-container">
                <div className="loading">Loading posts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="all-posts-container">
                <div className="error-message">{error}</div>
                <button onClick={fetchPosts} className="retry-button">Try Again</button>
            </div>
        );
    }

    return (
        <div className="all-posts-container">
            <h3>{getCategoryTitle()}</h3>
            <div className="posts-count">{posts.length} results</div>
            {posts.map((post) => (
                <div key={post._id} className="post-item">
                    <div className="post-info">
                        <div className="post-title">{post.title}</div>
                        <div className="post-metadata">
                            {/* Remove or comment out the userId line */}
                            {/* <span className="post-author">{post.userId}</span> */}
                            <span className="post-date">Date posted: {formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                    <button
                        className="go-button"
                        onClick={() => post._id && handlePostClick(post._id)}
                    >
                        GO
                    </button>
                </div>
            ))}
            {posts.length === 0 && (
                <div className="no-posts">
                    <p>No posts available in this category.</p>
                </div>
            )}
        </div>
    );
}