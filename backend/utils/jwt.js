/**
 * JWT Utilities - Token Generation and Verification
 * 
 * Provides utility functions for JWT token operations including
 * generation, verification, and cookie management.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Generate JWT token for user authentication
 * @param {Object} payload - User data to include in token
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        config.jwtSecret,
        { 
            expiresIn: config.jwtExpire,
            issuer: 'sanya-portfolio'
        }
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

/**
 * Set JWT token as HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 */
export const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('token', token, cookieOptions);
};

/**
 * Clear authentication cookie
 * @param {Object} res - Express response object
 */
export const clearTokenCookie = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'strict'
    });
};