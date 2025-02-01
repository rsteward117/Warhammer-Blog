import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/userPosts.css'; // Make sure to import the new CSS file
import { BACKEND_URL } from '../config';

const UserPosts = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [userposts, setUserposts] = useState([]);
  const [getErrors, setGetErrors] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserposts() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/post/userpost`, {
          headers: { Authorization: `Bearer ${jsonwebtoken}` }
        });
        setUserposts(res.data.getUserPost);
      } catch (err) {
        setGetErrors("Failed to load posts");
      }
    }
    getUserposts();
  }, [jsonwebtoken]);

  const previewpost = (postId) => {
    navigate(`/previewpost/${postId}`);
  };

  const publishPost = async (postId) => {
    try {
      await axios.put(`${BACKEND_URL}/api/post/${postId}/publish`, {}, {
        headers: { Authorization: `Bearer ${jsonwebtoken}` }
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setGetErrors(err.response?.data?.message || "Failed to publish post");
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/post/${postId}/deletepost`, {
        headers: { Authorization: `Bearer ${jsonwebtoken}` }
      });
      window.location.reload();
    } catch (err) {
      setGetErrors("Failed to delete post");
    }
  };

  return (
    <div className="user-posts-container">
      <h1 className="user-posts-title">Your Posts</h1>
      {getErrors && <p className="error-message">{getErrors}</p>}
      {!getErrors && (
        userposts.length > 0 ? (
          <div className="user-posts-list">
            {userposts.map((post) => (
              <div key={post.id} className="user-post-item">
                <h2 className="user-post-item-title">{post.title}</h2>
                {post.postImageUrl && (
                  <img
                    src={post.postImageUrl}
                    alt={post.title}
                    className="user-post-image"
                  />
                )}
                <p className="user-post-excerpt">{post.excerpt}...</p>
                <h3 className="user-post-status">Post Status: {post.status}</h3>
                <div className="user-post-actions">
                  <button
                    className="user-post-button preview-button"
                    onClick={() => previewpost(post.id)}
                  >
                    Preview Post
                  </button>
                  <button
                    className="user-post-button publish-button"
                    onClick={() => publishPost(post.id)}
                  >
                    Publish Post
                  </button>
                  <button
                    className="user-post-button delete-button"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-posts-message">You have no posts.</p>
        )
      )}
    </div>
  );
};

export default UserPosts;
