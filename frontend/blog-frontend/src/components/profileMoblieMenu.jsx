import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileMoblieMenu.css'; 

const ProfileMoblieMenu = ({isOpen, onClose}) => {
  const navigate = useNavigate();

  return (
    <nav className={`profile-mobile-menu ${isOpen ? 'active' : ''}`}>
      
      <button className="close-button" onClick={onClose}>X</button>

      <ul className="profile-mobile-sidebar-menu">
        <li 
          className="profile-mobile-sidebar-menu-item"
          onClick={() =>{
            navigate('/profiledashboard')
            onClose()
          }}
        >
          Profile Dashboard
        </li>
        <li 
          className="profile-mobile-sidebar-menu-item"
          onClick={() =>{
            navigate('/profile/post/management')
            onClose()
          }}
        >
          Your Posts
        </li>
        <li 
          className="profile-mobile-sidebar-menu-item"
          onClick={() =>{ 
            navigate('/profile/management')
            onClose()

          }}
        >
          Manage Profile
        </li>
      </ul>
    </nav>
  );
};

export default ProfileMoblieMenu;
