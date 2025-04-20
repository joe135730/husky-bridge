import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as client from '../Posts/client';
import { Post, PostFilters } from '../Posts/client';
import './MyPosts.css';

interface FilterState {
  postType?: {
    'My Requests': boolean;
    'My Offer': boolean;
  };
  category?: {
    'General': boolean;
    'Tutoring': boolean;
    'Housing': boolean;
    'Borrow/Lend': boolean;
  };
  location?: {
    'Snell Library': boolean;
    'Curry Student Center': boolean;
    'International Village': boolean;
    'East Village': boolean;
  };
  dateRange?: {
    'All': boolean;
    'Last Hour': boolean;
    'Last 24 Hours': boolean;
    'Last 7 Days': boolean;
    'Last 30 Days': boolean;
  };
}

export default function MyPosts() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [filterState, setFilterState] = useState<FilterState>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, [sort, filterState]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Convert filter state to API filters
      const apiFilters: PostFilters = {
        sort,
        postType: filterState.postType?.['My Requests'] ? 'request' : 
                 filterState.postType?.['My Offer'] ? 'offer' : undefined,
        category: filterState.category?.['General'] ? 'general' :
                 filterState.category?.['Housing'] ? 'housing' :
                 filterState.category?.['Tutoring'] ? 'tutoring' :
                 filterState.category?.['Borrow/Lend'] ? 'lend-borrow' : undefined,
        location: Object.entries(filterState.location || {}).find(([_, value]) => value)?.[0],
        dateRange: filterState.dateRange?.['Last Hour'] ? 1 :
                  filterState.dateRange?.['Last 24 Hours'] ? 24 :
                  filterState.dateRange?.['Last 7 Days'] ? 168 :
                  filterState.dateRange?.['Last 30 Days'] ? 720 : undefined
      };
      
      // Load both created and participating posts
      const [myPosts, participatingPosts] = await Promise.all([
        client.findMyPosts(),
        client.findParticipatingPosts()
      ]);
      
      // Combine posts
      let allPosts = [...myPosts];
      
      // Only add participating posts that aren't already in myPosts
      for (const post of participatingPosts) {
        if (!myPosts.some((p: Post) => p._id === post._id)) {
          allPosts.push(post);
        }
      }

      // Apply filters
      // Filter by post type (can select both requests and offers)
      if (filterState.postType) {
        const selectedTypes = Object.entries(filterState.postType)
          .filter(([_, selected]) => selected)
          .map(([type]) => type === 'My Requests' ? 'request' : 'offer');
        
        if (selectedTypes.length > 0) {
          allPosts = allPosts.filter(post => selectedTypes.includes(post.postType));
        }
      }

      // Filter by category (can select multiple categories)
      if (filterState.category) {
        const selectedCategories = Object.entries(filterState.category)
          .filter(([_, selected]) => selected)
          .map(([category]) => {
            const categoryMap: { [key: string]: string } = {
              'General': 'general',
              'Tutoring': 'tutoring',
              'Housing': 'housing',
              'Borrow/Lend': 'lend-borrow'
            };
            return categoryMap[category];
          });

        if (selectedCategories.length > 0) {
          allPosts = allPosts.filter(post => selectedCategories.includes(post.category));
        }
      }

      // Filter by date range (keep the most restrictive range if multiple selected)
      if (filterState.dateRange) {
        const selectedRanges = Object.entries(filterState.dateRange)
          .filter(([_, selected]) => selected)
          .map(([range]) => {
            switch (range) {
              case 'Last Hour': return 1;
              case 'Last 24 Hours': return 24;
              case 'Last 7 Days': return 168;
              case 'Last 30 Days': return 720;
              case 'All': return 0;
              default: return 0;
            }
          })
          .filter(hours => hours > 0);

        if (selectedRanges.length > 0) {
          const mostRestrictiveRange = Math.min(...selectedRanges);
          const cutoff = new Date(new Date().getTime() - (mostRestrictiveRange * 60 * 60 * 1000));
          allPosts = allPosts.filter(post => new Date(post.createdAt) >= cutoff);
        }
      }

      // Apply sorting
      allPosts.sort((a, b) => {
        if (sort === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      });
      
      setPosts(allPosts);
    } catch (error: any) {
      console.error("Error loading posts:", error);
      setError(error.response?.data?.message || 'Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as 'latest' | 'oldest');
  };

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [value]: !(prev[category] as Record<string, boolean>)?.[value]
      }
    }));
  };

  const handleComplete = async (postId: string) => {
    try {
      await client.markPostAsCompletedByOwner(postId);
      loadPosts(); // Reload posts to get updated data
    } catch (error: any) {
      console.error("Error completing post:", error);
      setError(error.response?.data?.message || 'Error completing post');
    }
  };

  const handleViewDetails = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div className="my-posts-container">
        <div className="my-posts-header">
          <h2>My Posts</h2>

          <div className="filter-dropdown">
            <label htmlFor="sort-posts">Sort by:</label>
            <select id="sort-posts" value={sort} onChange={handleSortChange}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="posts-content">
          <div className="filters-sidebar">
            <div className="filter-section">
              <h4>General</h4>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.postType?.['My Requests'] || false}
                  onChange={() => handleCheckboxChange('postType', 'My Requests')} 
                /> My Requests
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.postType?.['My Offer'] || false}
                  onChange={() => handleCheckboxChange('postType', 'My Offer')} 
                /> My Offer
              </label>
            </div>
            <div className="filter-section">
              <h4>Category</h4>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.category?.['General'] || false}
                  onChange={() => handleCheckboxChange('category', 'General')} 
                /> General
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.category?.['Tutoring'] || false}
                  onChange={() => handleCheckboxChange('category', 'Tutoring')} 
                /> Tutoring
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.category?.['Housing'] || false}
                  onChange={() => handleCheckboxChange('category', 'Housing')} 
                /> Housing
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.category?.['Borrow/Lend'] || false}
                  onChange={() => handleCheckboxChange('category', 'Borrow/Lend')} 
                /> Borrow/Lend
              </label>
            </div>
            <div className="filter-section">
              <h4>Date Posted</h4>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.dateRange?.['All'] || false}
                  onChange={() => handleCheckboxChange('dateRange', 'All')} 
                /> All
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.dateRange?.['Last Hour'] || false}
                  onChange={() => handleCheckboxChange('dateRange', 'Last Hour')} 
                /> Last Hour
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.dateRange?.['Last 24 Hours'] || false}
                  onChange={() => handleCheckboxChange('dateRange', 'Last 24 Hours')} 
                /> Last 24 Hours
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.dateRange?.['Last 7 Days'] || false}
                  onChange={() => handleCheckboxChange('dateRange', 'Last 7 Days')} 
                /> Last 7 Days
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterState.dateRange?.['Last 30 Days'] || false}
                  onChange={() => handleCheckboxChange('dateRange', 'Last 30 Days')} 
                /> Last 30 Days
              </label>
            </div>
          </div>

          <div className="posts-list">
            {posts.map(post => (
              <div key={post._id} className={`post-item ${post.status}`}>
                <h3>{post.title} ({post.status} – {post.category})</h3>
                <p>📍 {post.location} | 📅 Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
                <p>{post.userRelationship === 'owner' ? 'You created this post' : 'You are participating in this post'}</p>
                <button className="details-btn" onClick={() => handleViewDetails(post._id!)}>View Details</button>
                {post.userRelationship === 'owner' && post.status === 'In Progress' && !post.ownerCompleted && (
                  <button className="complete-btn" onClick={() => handleComplete(post._id!)}>Mark as Completed</button>
                )}
                {post.status === 'Complete' && (
                  <div className="completed-badge">Completed</div>
                )}
              </div>
            ))}

            {posts.length === 0 && (
              <div className="no-posts">
                <p>No posts found. Create your first post!</p>
                <button onClick={() => navigate('/create-post')} className="create-post-btn">Create Post</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}