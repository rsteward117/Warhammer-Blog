import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from './profileSidebar';
import '../styles/userProfileManagement.css';
import { BACKEND_URL } from '../config';

const UserProfileManagement = () => {
  const { user, jsonwebtoken } = useContext(AuthContext);
  const [recentPosts, setRecentPosts] = useState([]); 
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ bio: '', username: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [serverResponse, setServerResponse] = useState();
  const [getErrors, setGetErrors] = useState();

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile picture upload changes
  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  // Submit updated profile picture
  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append('profilepic', profilePic);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/profilepic`, newFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jsonwebtoken}`,
        },
      });

      if (res.status === 200) {
        setServerResponse(res.data.message);
        setTimeout(() => location.reload(), 1000);
      }
    } catch (err) {
      setGetErrors(err?.response?.data?.message);
      console.log(err);
    }
  };

  // Submit updated username
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/user/username`,
        { username: formData.username },
        {
          headers: {
            Authorization: `Bearer ${jsonwebtoken}`,
          },
        }
      );
      if (res.status === 200) {
        setServerResponse(res.data.message);
        setTimeout(() => location.reload(), 1000);
      }
    } catch (err) {
      setGetErrors(err?.response?.data?.message);
      console.log(err);
    }
  };

  // Submit updated bio
  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/user/bio`,
        { bio: formData.bio },
        {
          headers: {
            Authorization: `Bearer ${jsonwebtoken}`,
          },
        }
      );
      if (res.status === 200) {
        setServerResponse(res.data.message);
        setTimeout(() => location.reload(), 1000);
      }
    } catch (err) {
      setGetErrors(err?.response?.data?.message);
      console.log(err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-management-container">
      {/* Sidebar (fixed on the left) */}
      <ProfileSidebar />

      {/* Main Content Area */}
      <div className="profile-management-content">
        <header className="profile-management-header">
          <h1 className="profile-management-title">
            {user.username}'s Profile
          </h1>
          <p className="profile-management-subtitle">
            Customize your username, bio, and profile picture.
          </p>
        </header>

        {/* Server response and error messages */}
        <div className="response-messages">
          {getErrors && <p className="error-message">{getErrors}</p>}
          {serverResponse && <p className="success-message">{serverResponse}</p>}
        </div>

        {/* Username Update */}
        <section className="profile-section">
          <h2 className="section-title">Update Username</h2>
          <form onSubmit={handleUsernameSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                New Username
              </label>
              <input
                className="form-input"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter new username"
              />
            </div>
            <button type="submit" className="action-button">
              Update Username
            </button>
          </form>
        </section>

        {/* Email / Profile Picture Display */}
        <section className="profile-section">
          <h2 className="section-title">Your Email</h2>
          <p className="profile-info">{user.email}</p>

          <h2 className="section-title">Current Profile Picture</h2>
          <img
            src={user.profilePicUrl || `${BACKEND_URL}/static/blank-profile-picture-973460.svg`}
            alt="Profile"
            className="profile-pic-display"
          />

          {/* Profile Picture Update */}
          <form onSubmit={handleProfilePicSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="profilepic" className="form-label">
                Upload New Profile Picture
              </label>
              <input
                type="file"
                name="profilepic"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="form-input"
              />
            </div>
            <button type="submit" className="action-button">
              Update Profile Picture
            </button>
          </form>
        </section>

        {/* Bio Update */}
        <section className="profile-section">
          <h2 className="section-title">{user.bio ? 'Update Bio' : 'Add a Bio'}</h2>
          <p className="profile-info">{user.bio}</p>
          <form onSubmit={handleBioSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                {user.bio ? 'New Bio' : 'Bio'}
              </label>
              <textarea
                className="form-textarea"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
              />
            </div>
            <button type="submit" className="action-button">
              {user.bio ? 'Update Bio' : 'Create Bio'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default UserProfileManagement;
