import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/searchBar.css';
import { BACKEND_URL } from '../config';

 
const SearchBar = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [formData, setFormData] = useState({search: ''});
  const [searchResults, setSearchResults] = useState([]);
  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();
  const navigate = useNavigate();



  const handleSearch = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.get(`${BACKEND_URL}/api/post/search`, {
        params: {term: formData.search}
      });
      setSearchResults(res.data);
      // this passes in the data from the search results data recived from the backend, and stores it in "results", and pass it the route navaigate is going to.
      navigate('/search-results', {state: {
        results: res.data,
        label: `Posts for "${formData.search}"`
      } 
    });
      setSearchResults([]);
      
    } catch (err){

    }
  }

  console.log(formData);

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const displayPost = (postId) => {
    navigate(`/${postId}`)
  }

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSearch} className="searchbar-form">
        <input
          className="searchbar-input"
          type="text"
          name="search"
          value={formData.search}
          onChange={handleChange}
          placeholder="Search..."
        />
        <button className="searchbar-button" type="submit">
          Search
        </button>
      </form>
      {getErrors && <p className="searchbar-error">{getErrors}</p>}
    </div>
  );
};

export default SearchBar;