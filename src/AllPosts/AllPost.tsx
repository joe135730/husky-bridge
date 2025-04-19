import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Footer from "../Footer/index";
import * as client from "../Posts/client";
import { Post, PostFilters } from "../Posts/client";
import "./AllPost.css";

export default function AllPost() {
    const navigate = useNavigate();
    const { category } = useParams<{ category: PostFilters['category'] }>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let fetchedPosts: Post[];
            
            if (category) {
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
    };

    useEffect(() => {
        fetchPosts();
    }, [category]);

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const getCategoryTitle = () => {
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
            <>
                <Navbar />
                <div className="all-posts-container">
                    <div className="loading">Loading posts...</div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="all-posts-container">
                    <div className="error-message">{error}</div>
                    <button onClick={fetchPosts} className="retry-button">Try Again</button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="all-posts-container">
                <h3>{getCategoryTitle()}</h3>
                <div className="posts-count">{posts.length} results</div>
                {posts.map((post) => (
                    <div key={post._id} className="post-item">
                        <div className="post-info">
                            <div className="post-title">{post.title}</div>
                            <div className="post-metadata">
                                <span className="post-author">{post.userId}</span>
                                <span className="post-date">{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                        <button className="go-button" onClick={() => navigate(`/post/${post._id}`)}>
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
        </>
    );
}