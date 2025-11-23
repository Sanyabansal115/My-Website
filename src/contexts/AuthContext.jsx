/**
 * Authentication Context
 * 
 * Provides authentication state management across the application.
 * Handles user login, logout, registration, and profile management.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/apiService.js';

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('auth_token') || null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    UPDATE_USER: 'UPDATE_USER'
};

// Reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
                error: null
            };
        
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };
        
        case AUTH_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        
        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        
        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };
        
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('auth_token');
            
            if (token) {
                try {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
                    const response = await authAPI.getProfile();
                    
                    dispatch({
                        type: AUTH_ACTIONS.LOGIN_SUCCESS,
                        payload: {
                            user: response.user,
                            token
                        }
                    });
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } else {
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

            const response = await authAPI.signin(credentials);
            
            // Store token and user data
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                    user: response.user,
                    token: response.token
                }
            });

            return { success: true, data: response };
        } catch (error) {
            const errorMessage = error.message || 'Login failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

            const response = await authAPI.signup(userData);
            
            // Store token and user data
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                    user: response.user,
                    token: response.token
                }
            });

            return { success: true, data: response };
        } catch (error) {
            const errorMessage = error.message || 'Registration failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            return { success: false, error: errorMessage };
        } finally {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.signout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage and state
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    // Update profile function
    const updateProfile = async (profileData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
            const response = await authAPI.updateProfile(profileData);
            
            dispatch({
                type: AUTH_ACTIONS.UPDATE_USER,
                payload: response.user
            });

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(response.user));

            return { success: true, data: response };
        } catch (error) {
            const errorMessage = error.message || 'Profile update failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    // Change password function
    const changePassword = async (passwordData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
            const response = await authAPI.changePassword(passwordData);
            
            return { success: true, data: response };
        } catch (error) {
            const errorMessage = error.message || 'Password change failed';
            dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Check if user is admin
    const isAdmin = () => {
        return state.user && state.user.role === 'admin';
    };

    // Check if user is authenticated and active
    const isUserAuthenticated = () => {
        return state.isAuthenticated && state.user && state.user.isActive !== false;
    };

    const value = {
        // State
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        
        // Actions
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        clearError,
        
        // Utility functions
        isAdmin,
        isUserAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};