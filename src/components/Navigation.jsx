import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  const handleNavLinkClick = () => {
    closeSideNav();
  };

  // Close side nav on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeSideNav();
      }
    };

    if (isSideNavOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isSideNavOpen]);

  return (
    <>
      <nav className="navigation">
        <div className="logo">
          <div className="logo-shape" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <span className="logo-initials">SB</span>
          </div>
          <span className="logo-text">Sanya Bansal</span>
          {/* Mobile user name when signed in */}
          {isAuthenticated && (
            <span className="mobile-user-name">Hi, {user.firstName}</span>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleSideNav} aria-label="Open menu">
          <i className="fas fa-bars"></i>
          {/* Fallback hamburger icon */}
          <div className="hamburger-icon">
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </button>
        
        {/* Desktop Navigation */}
        <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/education">Education</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        
        {/* Authentication and user menu */}
        {isAuthenticated ? (
          <li className="user-menu">
            <button 
              className="user-menu-toggle"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <i className="fas fa-user-circle"></i>
              <span>{user.firstName}</span>
              <i className={`fas fa-chevron-down ${isUserMenuOpen ? 'rotated' : ''}`}></i>
            </button>
            
            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p><strong>{user.firstName} {user.lastName}</strong></p>
                  <p className="user-email">{user.email}</p>
                  <p className="user-role">{user.role}</p>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-links">
                  {isAdmin() && (
                    <Link to="/admin" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-cog"></i>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </li>
        ) : (
          <>
            <li><Link to="/signin" className="auth-link">Sign In</Link></li>
            <li><Link to="/signup" className="auth-link signup">Sign Up</Link></li>
          </>
        )}
      </ul>
      </nav>

      {/* Mobile Side Navigation Overlay */}
      <div 
        className={`nav-overlay ${isSideNavOpen ? 'active' : ''}`}
        onClick={closeSideNav}
      ></div>

      {/* Mobile Side Navigation */}
      <nav className={`side-nav ${isSideNavOpen ? 'active' : ''}`}>
        <div className="side-nav-header">
          <button className="side-nav-close" onClick={closeSideNav} aria-label="Close menu">
            <i className="fas fa-times"></i>
            {/* Fallback close icon */}
            <span className="close-icon">×</span>
          </button>
          <div className="side-nav-logo">
            <div className="logo-shape" onClick={handleLogoClick}>
              <span className="logo-initials">SB</span>
            </div>
            <span className="logo-text">Sanya Bansal</span>
          </div>
        </div>

        <ul className="nav-links">
          <li><Link to="/" onClick={handleNavLinkClick}>Home</Link></li>
          <li><Link to="/about" onClick={handleNavLinkClick}>About</Link></li>
          <li><Link to="/projects" onClick={handleNavLinkClick}>Projects</Link></li>
          <li><Link to="/education" onClick={handleNavLinkClick}>Education</Link></li>
          <li><Link to="/services" onClick={handleNavLinkClick}>Services</Link></li>
          <li><Link to="/contact" onClick={handleNavLinkClick}>Contact</Link></li>
          
          {/* Authentication links in side nav */}
          {isAuthenticated ? (
            <>
              {isAdmin() && (
                <li>
                  <Link to="/admin" onClick={handleNavLinkClick}>
                    <i className="fas fa-cog"></i> Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <button onClick={() => { handleLogout(); closeSideNav(); }} className="nav-logout-btn">
                  <i className="fas fa-sign-out-alt"></i> Sign Out ({user.firstName})
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/signin" onClick={handleNavLinkClick}>Sign In</Link></li>
              <li><Link to="/signup" onClick={handleNavLinkClick}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}