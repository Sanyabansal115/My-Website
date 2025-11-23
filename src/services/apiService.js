/**
 * Authentication API Services
 * 
 * Provides functions for user authentication including signup, signin,
 * signout, profile management, and password changes.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import api from '../utils/api.js';

/**
 * Authentication API endpoints
 */
export const authAPI = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} API response
     */
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    /**
     * Login user
     * @param {Object} credentials - Email and password
     * @returns {Promise} API response
     */
    signin: async (credentials) => {
        const response = await api.post('/auth/signin', credentials);
        return response.data;
    },

    /**
     * Logout user
     * @returns {Promise} API response
     */
    signout: async () => {
        const response = await api.get('/auth/signout');
        return response.data;
    },

    /**
     * Get current user profile
     * @returns {Promise} API response
     */
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Update user profile
     * @param {Object} profileData - Updated profile data
     * @returns {Promise} API response
     */
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    /**
     * Change user password
     * @param {Object} passwordData - Current and new password
     * @returns {Promise} API response
     */
    changePassword: async (passwordData) => {
        const response = await api.put('/auth/change-password', passwordData);
        return response.data;
    }
};

/**
 * Contact API endpoints
 */
export const contactAPI = {
    /**
     * Submit contact form
     * @param {Object} contactData - Contact form data
     * @returns {Promise} API response
     */
    submit: async (contactData) => {
        const response = await api.post('/contact', contactData);
        return response.data;
    },

    /**
     * Get all contacts (Admin only)
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getAll: async (params = {}) => {
        const response = await api.get('/contact', { params });
        return response.data;
    },

    /**
     * Get single contact (Admin only)
     * @param {string} id - Contact ID
     * @returns {Promise} API response
     */
    getById: async (id) => {
        const response = await api.get(`/contact/${id}`);
        return response.data;
    },

    /**
     * Update contact (Admin only)
     * @param {string} id - Contact ID
     * @param {Object} updateData - Updated contact data
     * @returns {Promise} API response
     */
    update: async (id, updateData) => {
        const response = await api.put(`/contact/${id}`, updateData);
        return response.data;
    },

    /**
     * Delete contact (Admin only)
     * @param {string} id - Contact ID
     * @returns {Promise} API response
     */
    delete: async (id) => {
        const response = await api.delete(`/contact/${id}`);
        return response.data;
    },

    /**
     * Get contact statistics (Admin only)
     * @returns {Promise} API response
     */
    getStats: async () => {
        const response = await api.get('/contact/stats/dashboard');
        return response.data;
    }
};

/**
 * Education API endpoints
 */
export const educationAPI = {
    /**
     * Get all education records
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getAll: async (params = {}) => {
        const response = await api.get('/education', { params });
        return response.data;
    },

    /**
     * Get single education record
     * @param {string} id - Education ID
     * @returns {Promise} API response
     */
    getById: async (id) => {
        const response = await api.get(`/education/${id}`);
        return response.data;
    },

    /**
     * Create education record (Admin only)
     * @param {Object} educationData - Education data
     * @returns {Promise} API response
     */
    create: async (educationData) => {
        const response = await api.post('/education', educationData);
        return response.data;
    },

    /**
     * Update education record (Admin only)
     * @param {string} id - Education ID
     * @param {Object} updateData - Updated education data
     * @returns {Promise} API response
     */
    update: async (id, updateData) => {
        const response = await api.put(`/education/${id}`, updateData);
        return response.data;
    },

    /**
     * Delete education record (Admin only)
     * @param {string} id - Education ID
     * @returns {Promise} API response
     */
    delete: async (id) => {
        const response = await api.delete(`/education/${id}`);
        return response.data;
    },

    /**
     * Toggle education visibility (Admin only)
     * @param {string} id - Education ID
     * @returns {Promise} API response
     */
    toggleVisibility: async (id) => {
        const response = await api.put(`/education/${id}/visibility`);
        return response.data;
    },

    /**
     * Get all education records for admin (Admin only)
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getAllAdmin: async (params = {}) => {
        const response = await api.get('/education/admin/all', { params });
        return response.data;
    }
};

/**
 * Project API endpoints
 */
export const projectAPI = {
    /**
     * Get all projects
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getAll: async (params = {}) => {
        const response = await api.get('/projects', { params });
        return response.data;
    },

    /**
     * Get featured projects
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getFeatured: async (params = {}) => {
        const response = await api.get('/projects/featured', { params });
        return response.data;
    },

    /**
     * Get single project
     * @param {string} id - Project ID
     * @returns {Promise} API response
     */
    getById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    /**
     * Create project (Admin only)
     * @param {Object} projectData - Project data
     * @returns {Promise} API response
     */
    create: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    /**
     * Update project (Admin only)
     * @param {string} id - Project ID
     * @param {Object} updateData - Updated project data
     * @returns {Promise} API response
     */
    update: async (id, updateData) => {
        const response = await api.put(`/projects/${id}`, updateData);
        return response.data;
    },

    /**
     * Delete project (Admin only)
     * @param {string} id - Project ID
     * @returns {Promise} API response
     */
    delete: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },

    /**
     * Toggle project visibility (Admin only)
     * @param {string} id - Project ID
     * @returns {Promise} API response
     */
    toggleVisibility: async (id) => {
        const response = await api.put(`/projects/${id}/visibility`);
        return response.data;
    },

    /**
     * Toggle project featured status (Admin only)
     * @param {string} id - Project ID
     * @returns {Promise} API response
     */
    toggleFeatured: async (id) => {
        const response = await api.put(`/projects/${id}/featured`);
        return response.data;
    },

    /**
     * Like/unlike project (Authenticated users)
     * @param {string} id - Project ID
     * @returns {Promise} API response
     */
    toggleLike: async (id) => {
        const response = await api.post(`/projects/${id}/like`);
        return response.data;
    },

    /**
     * Get project categories
     * @returns {Promise} API response
     */
    getCategories: async () => {
        const response = await api.get('/projects/categories/list');
        return response.data;
    }
};

/**
 * User management API endpoints (Admin only)
 */
export const userAPI = {
    /**
     * Get all users (Admin only)
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getAll: async (params = {}) => {
        const response = await api.get('/user/all', { params });
        return response.data;
    },

    /**
     * Get user by ID (Admin only)
     * @param {string} id - User ID
     * @returns {Promise} API response
     */
    getById: async (id) => {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },

    /**
     * Update user role (Admin only)
     * @param {string} id - User ID
     * @param {string} role - New role
     * @returns {Promise} API response
     */
    updateRole: async (id, role) => {
        const response = await api.put(`/user/${id}/role`, { role });
        return response.data;
    },

    /**
     * Update user status (Admin only)
     * @param {string} id - User ID
     * @param {boolean} isActive - Active status
     * @returns {Promise} API response
     */
    updateStatus: async (id, isActive) => {
        const response = await api.put(`/user/${id}/status`, { isActive });
        return response.data;
    },

    /**
     * Delete user (Admin only)
     * @param {string} id - User ID
     * @returns {Promise} API response
     */
    delete: async (id) => {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    },

    /**
     * Get user statistics (Admin only)
     * @returns {Promise} API response
     */
    getStats: async () => {
        const response = await api.get('/user/stats/dashboard');
        return response.data;
    }
};