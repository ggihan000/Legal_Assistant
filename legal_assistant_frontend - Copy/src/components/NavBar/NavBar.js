// components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('authToken') !== null;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Law Assistant
        </Link>

        {/* Mobile menu button */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {/*<li>
              <Link 
                to="/home" 
                className={location.pathname === '/' ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>*/}
            
            {isLoggedIn ? (
              <>
                <li>
                  <Link 
                    to="/chat" 
                    className={location.pathname === '/chat' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/home" 
                    className={location.pathname === '/' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className={location.pathname === '/login' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className={location.pathname === '/register' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;