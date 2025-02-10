import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileSidebar.css';
import ProfileMoblieMenu from './profileMoblieMenu';

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="profile-sidebar">

      <div className="profile-sidebar-hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
      </div>

      <ProfileMoblieMenu isOpen={menuOpen} onClose={closeMenu} />

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
