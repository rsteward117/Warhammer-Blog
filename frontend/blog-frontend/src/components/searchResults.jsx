import React, { useContext } from 'react';
import { AuthContext } from '../authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/searchResults.css';

const SearchResults = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // The search results passed from searchBar component via React Router's location state
  const searchResults = location.state?.results || [];

  const label = location.state?.label || 'Search Results';

  const displayPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="search-results-container">
      <h2>{label}</h2>
      {searchResults.length > 0 ? (
        <ul className="search-results-list">
          {searchResults.map((post) => (
            <li key={post.id} onClick={() => displayPost(post.id)} className="search-result-item">
              <h3
                className="search-result-title">
                {post.title}
              </h3>
              <p className="search-result-excerpt">
                {post.excerpt}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-results-message">
          No Search Results.
        </p>
      )}
    </div>
  );
};

export default SearchResults;
