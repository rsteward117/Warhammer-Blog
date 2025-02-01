import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../authContext';
import SearchBar from '../components/searchBar';
import MobileMenu from './moblieMenu';
import aquilaimage from '../assets/40k_imperial_aquila__transparent__by_fuguestock_d91enql.png'
import '../styles/nav.css';

function Nav() {
  const { user, logOut } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="nav-logo">
        <Link to="/">
          <img src={aquilaimage} alt="Aquila" className="logo-image" />
        </Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} user={user} logOut={logOut} />

      {/* Center Links */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li>
              <Link to="/createpost">Create Post</Link>
            </li>
            <li>
              <Link to="/userposts">Your Posts</Link>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/admindashboard">Admin Dashboard</Link>
              </li>
            )}
            <li>
              <Link onClick={logOut}>Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Log In</Link>
            </li>
          </>
        )}
      </ul>

      {/* Right Section: Profile Pic & Search */}
      <div className="nav-right">
        {user && (
          <Link to="/profiledashboard">
            <img
              src={user.profilePicUrl || `${BACKEND_URL}/static/blank-profile-picture-973460.svg`}
              alt="Profile"
              className="profile-pic"
            />
          </Link>
        )}
        <SearchBar />
      </div>
    </nav>
  );
}

export default Nav;
