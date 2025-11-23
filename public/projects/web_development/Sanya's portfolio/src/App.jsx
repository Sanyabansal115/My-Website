/**
 * App.jsx - Main Application Component
 * 
 * This is the root component of Sanya Bansal's portfolio website.
 * It sets up the React Router for client-side navigation and renders
 * the MainRouter component which handles all route configurations.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 * @since 2025-09-30
 */

// Import necessary React and routing dependencies
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Import custom components and styles
import MainRouter from './MainRouter';
import './index.css';

/**
 * Main Application Component
 * 
 * Serves as the entry point for the entire React application.
 * Wraps the MainRouter with BrowserRouter to enable client-side routing.
 * 
 * @returns {JSX.Element} The complete application wrapped in Router
 */
const App = () => {
  return (
    <Router>
      {/* MainRouter handles all page routing and navigation */}
      <MainRouter />
    </Router>
  );
};

// Export the App component as the default export
export default App;