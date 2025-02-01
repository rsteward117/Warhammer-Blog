import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import CreateComment from '../comment/createComment';
import Comments from '../comment/comments';
import '../styles/post.css';
import LoadingSpinner from '../components/loadingspinner';
import LikeButton from '../components/postLikeButton';
import BookmarkButton from '../components/postBookmarkButton';
import { BACKEND_URL } from '../config';

const Post = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [post, setPosts] = useState();
  const [getErrors, setGetErrors] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getPost() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/post/${postId}`);
        setPosts(res.data);
      } catch (err) {
        setGetErrors(err.response?.data?.message || "An error occurred");
      }
    }
    getPost();
  }, [postId]);

  const handleSearchTerm = async (term) => {

    try{
      const res = await axios.get(`${BACKEND_URL}/api/post/search/tags/category`, {
        params: {term: term}
      });
      setSearchResults(res.data);
      // this passes in the data from the search results data recived from the backend, and stores it in "results", and pass it the route navaigate is going to.
      navigate('/search-results', {state: {
        results: res.data,
        label: `Posts for "${term}"`
      } 
    });
      setSearchResults([]);
      
    } catch (err){

    }
  }

  const htmlDecode = (content) => {
    let e = document.createElement('div');
    e.innerHTML = DOMPurify.sanitize(content);
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  const displayUserProfile = (userId) => {
    navigate(`/user/${userId}`);
  }

  if (!post) return <LoadingSpinner />;

  return (
    <div className="post-container">
      {getErrors && <p className="error-message">{getErrors}</p>}

      <div className="post-box">
        <h1 className="post-title">{post.title}</h1>

        {post.postImageUrl && (
          <div className="post-image-section">
            <img
              src={post.postImageUrl}
              alt={post.title}
              className="post-featured-image"
            />
          </div>
        )}

      <div className="post-author-section">
          <img
            onClick={() => displayUserProfile(post.author.id)}
            src={post.author.profilePicUrl || `${BACKEND_URL}/static/blank-profile-picture-973460.svg`}
            alt="User profile picture"
            className="post-author-img"
          />
          <h2
            className="post-author-name"
            onClick={() => displayUserProfile(post.author.id)}
          >
            Created by {post.author.username}
          </h2>
        </div>

        <div className="post-meta-section">
          <div className="post-categories">
            <h4 className="meta-heading">Category</h4>
            {post.categories.map((category) => (
              <p key={category.id} onClick={() => handleSearchTerm(category.name)} className="post-category-item">{category.name}</p>
            ))}
          </div>

          <div className="post-tags">
            <h4 className="meta-heading">Tags</h4>
            {post.tags.length > 0 ? (
              <ul className="post-tag-list">
                {post.tags.map((tag) => (
                  <li key={tag.id} onClick={() => handleSearchTerm(tag.name)} className="post-tag-item">{tag.name}</li>
                ))}
              </ul>
            ) : (
              <p className="no-tags-message">No tags assigned to this post.</p>
            )}
          </div>
        </div>

        <section
          className="post-content"
          dangerouslySetInnerHTML={{ __html: htmlDecode(post.content) }}
        />

        <div className="post-actions">
          
          <LikeButton postId={postId} />
          <BookmarkButton postId={postId} />
        </div>

        <div className="comment-section">
          <CreateComment postId={postId} />
          <Comments postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default Post;
