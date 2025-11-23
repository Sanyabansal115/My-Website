/**
 * API Configuration and Base Setup
 * 
 * Configures Axios instance with base settings for backend communication.
 * Handles request/response interceptors, authentication tokens, and error handling.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    withCredentials: true, // Important for cookie-based auth
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            // Handle authentication errors
            if (status === 401) {
                // Clear stored auth data
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                
                // Redirect to login if not already there
                if (window.location.pathname !== '/signin') {
                    window.location.href = '/signin';
                }
            }
            
            // Extract error message
            const errorMessage = data?.message || data?.error || 'An error occurred';
            error.message = errorMessage;
        } else if (error.request) {
            // Network error
            error.message = 'Network error. Please check your connection.';
        }
        
        return Promise.reject(error);
    }
);

export default api;