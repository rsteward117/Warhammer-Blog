import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from './profileSidebar';
import '../styles/userPostManagement.css'; 

const UserPostManagement = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [userposts, setUserposts] = useState([]);
  const [likes, setLikes] = useState(0);
  const [postStats, setPostStats] = useState({
    likeCount: 0,
    viewCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserposts() {
      try {
        const res = await axios.get('http://localhost:5000/api/post/userpost', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` }
        });
        setUserposts(res.data.getUserPost);
      } catch (err) {
        setGetErrors("Failed to load posts");
      }
    }

    async function getUserpostsNumbers() {
      try {
        const res = await axios.get('http://localhost:5000/api/post/userpost/numbers', {
          headers: { Authorization: `Bearer ${jsonwebtoken}` }
        });
        setPostStats({
          likeCount: res.data.likeCount,
          viewCount: res.data.viewCount,
        });
      } catch (err) {
        setGetErrors("Failed to load posts");
      }
    }
  
    getUserpostsNumbers();
    getUserposts();
  }, [jsonwebtoken]);

  const previewpost = (postId) => {
    navigate(`/previewpost/${postId}`);
  };

  const editPost = (postId) => {
    navigate(`/editPost/${postId}`);
  };

  const publishPost = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/post/${postId}/publish`, {}, {
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
      await axios.delete(`http://localhost:5000/api/post/${postId}/deletepost`, {
        headers: { Authorization: `Bearer ${jsonwebtoken}` }
      });
      window.location.reload();
    } catch (err) {
      setGetErrors("Failed to delete post");
    }
  };

  return (
    <div className="user-post-management-container">
      {/* Sidebar */}
      <ProfileSidebar />

      {/* Main Content */}
      <div className="user-post-management-content">
        {/* Header / Title */}
        <header className="user-post-management-header">
          <h1 className="user-post-management-title">
            Post Management & Analytics
          </h1>
          <p className="user-post-management-subtitle">
            Review and manage all posts you’ve created.
          </p>
        </header>

        {/* Analytics / Stats section */}
        <section className="post-analytics">
          <div className="analytics-card">
            <h2>Total Posts</h2>
            <p>{userposts.length}</p>
          </div>
          <div className="analytics-card">
            <h2>Views</h2>
            <p>{postStats.viewCount}</p>
          </div>
          <div className="analytics-card">
            <h2>Likes</h2>
            <p>{postStats.likeCount}</p>
          </div>
        </section>

        {/* Posts Table or Grid */}
        <section className="posts-management-list">
          <h2 className="section-title">Your Posts</h2>

          {/* Replace this with a table or grid listing your posts */}
          <div className="posts-table">
            <div className="table-header">
              <span>Title</span>
              <span>Image</span>
              <span>Date</span>
              <span>Status</span>
              <span>Views</span>
              <span>Likes</span>
              <span>Actions</span>
            </div>

            {userposts.length > 0 ? (
              userposts.map((post) => (
                <div key={post._id} className="table-row">
                  <span>{post.title}</span>
                  <span> 
                      <img
                      src={post.postImageUrl}
                      alt={post.title}
                      className="user-post-image"
                    />
                  </span>
                  <span>{post.createdAt?.slice(0, 10)}</span>
                  <span>{post.status}</span>
                  <span>{post.viewCount}</span>
                  <span>{post.likeCount}</span>
                  <div className="actions-cell">
                    <button 
                      className="edit-button"
                      onClick={() => editPost(post.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="preview-button"
                      onClick={() => previewpost(post.id)}
                    >
                      Preview Post
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </div>
          <div className="create-post-container">
            <button 
              className="create-post-button" 
            >
              <span className="plus-icon">+</span> Create Post
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserPostManagement;
