import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/searchBar';
import '../styles/mobileMenu.css';

function MobileMenu({ isOpen, onClose, user, logOut }) {
  return (
    <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <ul className="mobile-links">
        <li><Link to="/" onClick={onClose}>Home</Link></li>
        {user ? (
          <>
            <li><Link to="/createpost" onClick={onClose}>Create Post</Link></li>
            <li><Link to="/userposts" onClick={onClose}>Your Posts</Link></li>
            {user.role === 'admin' && (
              <li><Link to="/admindashboard" onClick={onClose}>Admin Dashboard</Link></li>
            )}
            <li><Link onClick={() => { logOut(); onClose(); }}>Logout</Link></li>

            <Link to="/profiledashboard">
            <img
              src={user.profilePicUrl || `${BACKEND_URL}/static/blank-profile-picture-973460.svg`}
              alt="Profile"
              className="profile-pic"
              onClick={onClose}
            />
          </Link>
          </>
        ) : (
          <>
            <li><Link to="/signup" onClick={onClose}>Sign Up</Link></li>
            <li><Link to="/login" onClick={onClose}>Log In</Link></li>
          </>
        )}
      </ul>
      <SearchBar />
    </div>
  );
}

export default MobileMenu;
