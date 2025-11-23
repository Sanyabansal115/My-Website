/**
 * Authentication Middleware
 * 
 * Provides middleware functions for protecting routes and checking user roles.
 * Handles JWT token verification and user authentication status.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Middleware to protect routes - requires authentication
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies first, then Authorization header
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Get user from database
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid. User not found.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Token is invalid or expired.'
        });
    }
};

/**
 * Middleware to check if user is admin
 */
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

/**
 * Middleware to check if user is admin or the resource owner
 */
export const adminOrOwner = (resourceUserField = 'createdBy') => {
    return (req, res, next) => {
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user owns the resource
        if (req.resource && req.resource[resourceUserField]) {
            if (req.resource[resourceUserField].toString() === req.user._id.toString()) {
                return next();
            }
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied. Insufficient permissions.'
        });
    };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};