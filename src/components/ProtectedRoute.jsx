/**
 * ProtectedRoute Component
 * 
 * Higher-order component that provides route protection based on authentication
 * and role-based access control. Redirects unauthorized users appropriately.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} [props.requiredRole] - Required role for access ('admin', 'user')
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 * @param {string} [props.redirectTo="/signin"] - Where to redirect unauthorized users
 * @returns {JSX.Element} Protected content or redirect
 */
const ProtectedRoute = ({ 
    children, 
    requiredRole = null, 
    requireAuth = true, 
    redirectTo = "/signin" 
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
        return (
            <Navigate 
                to={redirectTo} 
                state={{ from: location, message: 'Please sign in to access this page.' }}
                replace 
            />
        );
    }

    // Check role-based access if role is specified
    if (requiredRole && user?.role !== requiredRole) {
        const message = requiredRole === 'admin' 
            ? 'Admin access required for this page.'
            : `${requiredRole} role required for this page.`;

        return (
            <Navigate 
                to="/" 
                state={{ 
                    message, 
                    type: 'error' 
                }}
                replace 
            />
        );
    }

    // Render protected content
    return children;
};

/**
 * AdminRoute - Shortcut for admin-only routes
 */
export const AdminRoute = ({ children, ...props }) => (
    <ProtectedRoute requiredRole="admin" {...props}>
        {children}
    </ProtectedRoute>
);

/**
 * AuthRoute - Shortcut for authenticated user routes
 */
export const AuthRoute = ({ children, ...props }) => (
    <ProtectedRoute requireAuth={true} {...props}>
        {children}
    </ProtectedRoute>
);

/**
 * PublicRoute - Route that redirects authenticated users (for login/register pages)
 */
export const PublicRoute = ({ children, redirectTo = "/" }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Render public content
    return children;
};

export default ProtectedRoute;