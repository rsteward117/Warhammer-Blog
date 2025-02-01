import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { TextField, Box, Grid, Button, Grid2 } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import '../styles/createPost.css';
import { BACKEND_URL } from '../config';

const CreatePost = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    excerpt: ''
  });
  const [images, setImages] = useState(null);
  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();
  const [popularTags, setPopularTags] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      try {
        const tagsRes = await axios.get(`${BACKEND_URL}/api/post/post/tags`);
        const categoriesRes = await axios.get(`${BACKEND_URL}/api/post/post/categories`);

        setPopularTags(tagsRes.data);
        setPopularCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTagsAndCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('excerpt', formData.excerpt);
    data.append('images', images);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/post/createpost`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jsonwebtoken}`,
        },
      });
      if (res.status === 200) {
        setServerResponse(res.data.message);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setGetErrors(err.response.data.message);
      console.error(err);
    }
  };

  const draftPost = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('excerpt', formData.excerpt);
    data.append('images', images);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/post/draftpost`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jsonwebtoken}`,
        },
      });

      if (res.status === 200) {
        setServerResponse(res.data.message);
        setTimeout(() => {
          navigate('/userposts');
        }, 1000);
      }
    } catch (err) {
      setGetErrors(err.response.data.message);
      console.error(err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "category" || name === "tags") {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/post/search/suggestions?term=${value}`);
        const { searchCategories, searchTags } = res.data;
        if (name === "category") {
          setCategorySuggestions(searchCategories);
        } else if (name === "tags") {
          setTagSuggestions(searchTags);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }
  };

  const handleSuggestionClick = (name, suggestion) => {
    if (name === "category") {
      setFormData((prevData) => ({
        ...prevData,
        category: suggestion,
      }));
      setCategorySuggestions([]);
    } else if (name === "tags") {
      setFormData((prevData) => ({
        ...prevData,
        tags: prevData.tags
          ? `${prevData.tags},${suggestion}`
          : suggestion,
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleImagesChange = (e) => {
    setImages(e.target.files[0]);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="create-post-container">
      <Box className="create-post-box">
        <h1 className="create-post-title">Create A Post</h1>
        <form className="create-post-form" onSubmit={handleSubmit} enctype="multipart/form-data">
          {getErrors && <p className="error-message">{getErrors}</p>}
          {serverResponse && <p className="success-message">{serverResponse}</p>}

          <Grid2 xs={12} className="form-field">
            <TextField
              label="Post's Title"
              name="title"
              variant="outlined"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </Grid2>

          <Grid2 xs={12} className="form-field">
            <label htmlFor="content" className="form-label">Post's Content</label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              theme="snow"
              modules={quillModules}
              className="quill-editor"
            />
          </Grid2>

          <Grid2 xs={12} className="form-field">
            <TextField
              label="Post Excerpt (optional)"
              name="excerpt"
              variant="outlined"
              fullWidth
              value={formData.excerpt}
              onChange={handleChange}
              className="form-input"
            />
          </Grid2>

          <Grid2 xs={12} className="form-field">
            <label htmlFor="images" className="form-label">Post's Images</label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="file-input"
            />
          </Grid2>

          <Grid2 xs={12} className="form-field">
            <TextField
              label="Post's Category"
              name="category"
              variant="outlined"
              fullWidth
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            />
            {categorySuggestions.length > 0 && (
              <Box className="suggestions-box">
                {categorySuggestions.map((category, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick("category", category.name)}
                  >
                    {category.name}
                  </div>
                ))}
              </Box>
            )}
          </Grid2>

          <Grid2 xs={12} className="form-field">
            <TextField
              label="Post's Tags (comma-separated)"
              name="tags"
              variant="outlined"
              fullWidth
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
            />
            {tagSuggestions.length > 0 && (
              <Box className="suggestions-box">
                {tagSuggestions.map((tag, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick("tags", tag.name)}
                  >
                    {tag.name}
                  </div>
                ))}
              </Box>
            )}
          </Grid2>

          <Grid2 xs={12} className="form-actions">
            <Button variant="contained" color="primary" type="submit" fullWidth className="submit-button">
              Create Post
            </Button>
            <Button onClick={draftPost} variant="contained" color="primary" type="button" fullWidth className="draft-button">
              Save Post as Draft
            </Button>
          </Grid2>
        </form>
      </Box>
    </div>
  );
};

export default CreatePost;
