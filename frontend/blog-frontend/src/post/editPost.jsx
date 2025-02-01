import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import axios from 'axios';
import { TextField, Box, Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../styles/editPost.css'; 
import { BACKEND_URL } from '../config';

const EditPost = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const { postId } = useParams();
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(true);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/post/${postId}`, { 
          headers: { Authorization: `Bearer ${jsonwebtoken}` } 
        });

        setFormData({
          title: res.data.title,
          content: res.data.content,
          category: res.data.categories[0]?.name || '',
          tags: res.data.tags.map(tag => tag.name).join(', '),
          excerpt: res.data.excerpt,
        });
        setLoading(false);
      } catch (err) {
        setGetErrors(err.response?.data?.message || "An error occurred");
      }
    };
    fetchPost();
  }, [postId, jsonwebtoken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('excerpt', formData.excerpt);
    if (images) {
      data.append('images', images);
    }

    try {
      await axios.put(`${BACKEND_URL}/api/post/${postId}/edit`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jsonwebtoken}`,
        },
      });
      navigate(`/userposts`);
    } catch (err) {
      setGetErrors(err.response?.data?.message || "An error occurred");
    }
  };

  const draftEditedPost = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('excerpt', formData.excerpt);
    if (images) {
      data.append('images', images);
    }

    try {
      const res = await axios.put(`${BACKEND_URL}/api/post/${postId}/draftpost/edit`, data, {
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
      setGetErrors(err.response?.data?.message || "An error occurred");
      console.log(err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Fetch suggestions for categories or tags
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
      setTagSuggestions((prevSuggestions) =>
        prevSuggestions.filter((tag) => tag.name !== suggestion)
      );
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

  const htmlDecode = (content) => {
    let e = document.createElement('div');
    e.innerHTML = DOMPurify.sanitize(content);
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue || e.innerHTML;
  };

  const quillModules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  if (loading) return <p className="loading-message">Loading...</p>;

  return (
    <div className="edit-post-container">
      <Box className="edit-post-box">
        <h1 className="edit-post-title">Update Post</h1>
        <form className="edit-post-form" onSubmit={handleSubmit} encType="multipart/form-data">
          {getErrors && <p className="error-message">{getErrors}</p>}
          {serverResponse && <p className="success-message">{serverResponse}</p>}

          <div className="form-field">
            <TextField
              label="Post's Title"
              name="title"
              variant="outlined"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="content" className="form-label">Post's Content</label>
            <ReactQuill
              value={htmlDecode(formData.content)}
              onChange={handleContentChange}
              theme="snow"
              modules={quillModules}
              className="quill-editor"
            />
          </div>

          <div className="form-field">
            <TextField
              label="Post Excerpt (optional)"
              name="excerpt"
              variant="outlined"
              fullWidth
              value={formData.excerpt}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="images" className="form-label">Post's Images</label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="file-input"
            />
          </div>

          <div className="form-field">
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
          </div>

          <div className="form-field">
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
          </div>

          <div className="form-actions">
            <Button variant="contained" color="primary" type="submit" fullWidth className="submit-button">
              Update Post
            </Button>
            <Button
              onClick={draftEditedPost}
              variant="contained"
              color="primary"
              type="button"
              fullWidth
              className="draft-button"
            >
              Save Post as Draft
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
};

export default EditPost;
