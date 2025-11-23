import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="logo">
        <div className="logo-shape" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <span className="logo-initials">SB</span>
        </div>
        <span className="logo-text">Sanya Bansal</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/education">Education</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}