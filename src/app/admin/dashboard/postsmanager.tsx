import React, { useState } from 'react';

interface Post {
  _id: string;
  title: string;
  brief: string;
  category: string;
  img: string;
  author: string;
  date: string;
}

interface PostsManagerProps {
  posts: Post[];
  fetchPosts: () => void;
}

const PostsManager: React.FC<PostsManagerProps> = ({ posts, fetchPosts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPosts();
      } else {
        setError('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('An error occurred while deleting the post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2 className="manager-title">Manage Posts</h2>
        <a href="/admin/posts/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add New Post
        </a>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loading-text">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No posts found. Create a new post to get started.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-img">
                <img
                  src={post.img || '/placeholder-post.jpg'}
                  alt={post.title}
                  onError={(e) => {
                    const imgSrc = post.img;
                    if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
                      (e.target as HTMLImageElement).src = '/' + imgSrc;
                    } else {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjNkI3MjgwIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                    }
                  }}
                />
              </div>
              <div className="post-content">
                <span className="post-category">{post.category}</span>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-brief">{post.brief}</p>
                <div className="post-footer">
                  <span className="post-author">{post.author}</span>
                  <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex mt-4 gap-2">
                  <a href={`/admin/posts/edit/${post._id}`} className="btn btn-secondary">
                    Edit
                  </a>
                  <button 
                    onClick={() => deletePost(post._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsManager;
