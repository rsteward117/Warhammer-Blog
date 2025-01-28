import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileSidebar.css'; 

const ProfileSidebar = () => {
  const navigate = useNavigate();

  return (
    <nav className="profile-sidebar">
      <h2 className="profile-title">Profile Panel</h2>
      <ul className="profile-sidebar-menu">
        <li 
          className="profile-sidebar-menu-item"
          onClick={() => navigate('/profiledashboard')}
        >
          Profile Dashboard
        </li>
        <li 
          className="profile-sidebar-menu-item"
          onClick={() => navigate('/profile/post/management')}
        >
          Your Posts
        </li>
        <li 
          className="profile-sidebar-menu-item"
          onClick={() => navigate('/profile/management')}
        >
          Manage Profile
        </li>
      </ul>
    </nav>
  );
};

export default ProfileSidebar;
