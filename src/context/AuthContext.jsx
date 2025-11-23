/**
 * Authentication Context
 * 
 * Provides authentication state management throughout the application.
 * Handles user login/logout, role management, and persistent authentication.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/apiService.js';

// Create Authentication Context
const AuthContext = createContext();

// Auth action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_USER: 'SET_USER',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Auth reducer
function authReducer(state, action) {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
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

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload
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

        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isLoading: false
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
}

// AuthProvider component
export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing authentication on app load
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    // Verify token is still valid
                    const response = await authAPI.getProfile();
                    
                    dispatch({
                        type: AUTH_ACTIONS.LOGIN_SUCCESS,
                        payload: {
                            user: response.user,
                            token: token
                        }
                    });
                } catch (error) {
                    // Token is invalid, clear stored data
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } else {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        console.log('AuthContext: Starting login with credentials:', credentials);
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            console.log('AuthContext: Making API call to signin...');
            const response = await authAPI.signin(credentials);
            console.log('AuthContext: API response received:', response);
            
            // Store auth data
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                    user: response.user,
                    token: response.token
                }
            });

            console.log('AuthContext: Login successful');
            return { success: true, message: response.message };
        } catch (error) {
            console.error('AuthContext: Login error:', error);
            const errorMessage = error.message || 'Login failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: errorMessage
            });
            return { success: false, message: errorMessage };
        }
    };

    // Signup function
    const signup = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            const response = await authAPI.signup(userData);
            
            // Store auth data
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                    user: response.user,
                    token: response.token
                }
            });

            return { success: true, message: response.message };
        } catch (error) {
            const errorMessage = error.message || 'Registration failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: errorMessage
            });
            return { success: false, message: errorMessage };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.signout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear stored auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.user));
            
            dispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: response.user
            });

            return { success: true, message: response.message };
        } catch (error) {
            const errorMessage = error.message || 'Profile update failed';
            return { success: false, message: errorMessage };
        }
    };

    // Change password
    const changePassword = async (passwordData) => {
        try {
            const response = await authAPI.changePassword(passwordData);
            return { success: true, message: response.message };
        } catch (error) {
            const errorMessage = error.message || 'Password change failed';
            return { success: false, message: errorMessage };
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Check if user is admin
    const isAdmin = () => {
        return state.user && state.user.role === 'admin';
    };

    // Check if user is authenticated
    const isAuth = () => {
        return state.isAuthenticated;
    };

    const value = {
        ...state,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        clearError,
        isAdmin,
        isAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;