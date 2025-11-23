/**
 * SignIn Component
 * 
 * User login form with validation, error handling, and state management.
 * Supports remember me functionality and automatic redirection.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

    // Get redirect path from location state or default to home
    const from = location.state?.from?.pathname || '/';

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    // Form validation state
    const [validation, setValidation] = useState({
        email: { isValid: true, message: '' },
        password: { isValid: true, message: '' }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Load remembered email on mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setFormData(prev => ({
                ...prev,
                email: rememberedEmail,
                rememberMe: true
            }));
        }
    }, []);

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    // Validation rules
    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    return { isValid: false, message: 'Email is required' };
                }
                if (!emailRegex.test(value)) {
                    return { isValid: false, message: 'Please enter a valid email address' };
                }
                return { isValid: true, message: '' };

            case 'password':
                if (!value) {
                    return { isValid: false, message: 'Password is required' };
                }
                if (value.length < 6) {
                    return { isValid: false, message: 'Password must be at least 6 characters' };
                }
                return { isValid: true, message: '' };

            default:
                return { isValid: true, message: '' };
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Validate field (only for text/email/password inputs)
        if (type !== 'checkbox' && validation[name]) {
            const fieldValidation = validateField(name, value);
            setValidation(prev => ({
                ...prev,
                [name]: fieldValidation
            }));
        }

        // Clear any global errors
        clearError();
    };

    // Validate entire form
    const validateForm = () => {
        const fields = ['email', 'password'];
        const newValidation = { ...validation };
        let isFormValid = true;

        fields.forEach(field => {
            const fieldValidation = validateField(field, formData[field]);
            newValidation[field] = fieldValidation;
            if (!fieldValidation.isValid) {
                isFormValid = false;
            }
        });

        setValidation(newValidation);
        return isFormValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Form submitted:', formData);
        
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        console.log('Starting login process...');
        setIsSubmitting(true);

        try {
            const result = await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            console.log('Login result:', result);

            if (result.success) {
                console.log('Login successful, navigating...');
                // Handle remember me functionality
                if (formData.rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email.trim().toLowerCase());
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Navigate to the intended destination
                navigate(from, { 
                    replace: true,
                    state: { message: 'Welcome back! You are now signed in.' }
                });
            } else {
                console.log('Login failed:', result.message);
                alert(`Login failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(`Login error: ${error.message}`);
        } finally {
            console.log('Login process completed, setting isSubmitting to false');
            setIsSubmitting(false);
        }
    };

    // Handle forgot password (placeholder for future implementation)
    const handleForgotPassword = () => {
        alert('Forgot password functionality will be implemented soon!');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {/* Global Error Display */}
                    {error && (
                        <div className="error-message global-error">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </div>
                    )}

                    {/* Redirect Message */}
                    {location.state?.message && (
                        <div className="info-message">
                            <i className="fas fa-info-circle"></i>
                            {location.state.message}
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-control ${!validation.email.isValid ? 'error' : ''}`}
                            placeholder="Enter your email address"
                            disabled={isLoading || isSubmitting}
                            required
                            autoComplete="email"
                            autoFocus
                        />
                        {!validation.email.isValid && (
                            <span className="error-message">
                                {validation.email.message}
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`form-control ${!validation.password.isValid ? 'error' : ''}`}
                                placeholder="Enter your password"
                                disabled={isLoading || isSubmitting}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                disabled={isLoading || isSubmitting}
                            >
                                <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                            </button>
                        </div>
                        {!validation.password.isValid && (
                            <span className="error-message">
                                {validation.password.message}
                            </span>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                disabled={isLoading || isSubmitting}
                            />
                            <span className="checkmark"></span>
                            Remember me
                        </label>

                        <button
                            type="button"
                            className="forgot-password-link"
                            onClick={handleForgotPassword}
                            disabled={isLoading || isSubmitting}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isLoading || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="auth-link">
                            Create Account
                        </Link>
                    </p>
                    <p>
                        <Link to="/" className="auth-link">
                            Back to Home
                        </Link>
                    </p>
                </div>

                {/* Demo Credentials (for development/testing) */}
                <div className="demo-credentials">
                    <details>
                        <summary>Demo Credentials</summary>
                        <div className="demo-info">
                            <p><strong>Admin:</strong> admin@portfolio.com / Admin123</p>
                            <p><strong>User:</strong> user@portfolio.com / User123</p>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default SignIn;