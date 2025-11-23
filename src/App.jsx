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
import { AuthProvider } from './contexts/AuthContext';


/**
 * Main Application Component
 * 
 * Serves as the entry point for the entire React application.
 * Wraps the MainRouter with BrowserRouter and AuthProvider to enable 
 * client-side routing and authentication state management.
 * 
 * @returns {JSX.Element} The complete application wrapped in Router and AuthProvider
 */
const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* MainRouter handles all page routing and navigation */}
        <MainRouter />
      </AuthProvider>
    </Router>
  );
};

// Export the App component as the default export
export default App;