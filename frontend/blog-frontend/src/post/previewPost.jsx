import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import LoadingSpinner from '../components/loadingspinner';
import '../styles/previewPost.css'; // Make sure to create and import this CSS file

const PreviewPost = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [post, setPosts] = useState();
  const [getErrors, setGetErrors] = useState();
  const {postId} = useParams();
  const navigate = useNavigate();

  useEffect(() =>{
    async function getPost() {
      try {
        const res = await axios.get(`http://localhost:5000/api/post/${postId}`, {
          headers: { Authorization: `Bearer ${jsonwebtoken}` }
        });
        setPosts(res.data);
      } catch (err) {
        setGetErrors(err.response?.data?.message || "An error occurred");
      }
    }
    getPost();
  }, [jsonwebtoken, postId]);

  const editPost = () => {
    navigate(`/editPost/${postId}`);
  };

  const publishPost = async () => {
    try {
      await axios.put(`http://localhost:5000/api/post/${postId}/publish`, {}, {
        headers: { Authorization: `Bearer ${jsonwebtoken}` }
      });
      navigate('/userposts');
    } catch (err) {
      setGetErrors(err.response?.data?.message || "An error occurred");
    }
  };

  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/post/${postId}/deletepost`, {
        headers: { Authorization: `Bearer ${jsonwebtoken}` }
      });
      navigate('/userposts');
    } catch (err) {
      setGetErrors(err.response?.data?.message || "An error occurred");
    }
  };

  const htmlDecode = (content) => {
    let e = document.createElement('div');
    e.innerHTML = DOMPurify.sanitize(content);
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

if (!post) {
  return <LoadingSpinner />
}
  return (
    <div className="preview-post-container">
      <div className="preview-post-box">
        {getErrors && <p className="error-message">{getErrors}</p>}

        <h1 className="preview-post-title">{post.title}</h1>

        <div className="preview-image-section">
          {post.postImageUrl && (
            <img
              src={post.postImageUrl}
              alt={post.title}
              className="preview-post-image"
            />
          )}
        </div>

        <div className="preview-author">
          <img
            src={post.author.profilePicUrl}
            alt="user profile picture"
            className="preview-author-img"
          />
          <h2 className="preview-author-name">Author: {post.author.username}</h2>
        </div>

        <div className="preview-meta-section">
          <div className="preview-category">
            <h4 className="preview-heading">Category</h4>
            {post.categories.map((category) => (
              <p key={category.id} className="preview-category-item">{category.name}</p>
            ))}
          </div>
          <div className="preview-tags">
            <h4 className="preview-heading">Tags</h4>
            {post.tags.length > 0 ? (
              <ul className="preview-tag-list">
                {post.tags.map((tag) => (
                  <li key={tag.id} className="preview-tag-item">{tag.name}</li>
                ))}
              </ul>
            ) : (
              <p className="no-tags-message">No tags assigned to this post.</p>
            )}
          </div>
        </div>

        <section
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: htmlDecode(post.content) }}
        />

        <h3 className="preview-status">Post Status: {post.status}</h3>

        <div className="preview-actions">
          <button className="preview-action-button publish-button" onClick={publishPost}>Publish This Post</button>
          <button className="preview-action-button delete-button" onClick={deletePost}>Delete This Post</button>
          <button className="preview-action-button edit-button" onClick={editPost}>Edit This Post</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPost;
