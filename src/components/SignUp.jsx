/**
 * SignUp Component
 * 
 * User registration form with validation, error handling, and state management.
 * Supports role-based registration with proper form validation.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const SignUp = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
    
    // Track if we just completed registration
    const [justRegistered, setJustRegistered] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        phone: '',
        bio: ''
    });

    // Form validation state
    const [validation, setValidation] = useState({
        firstName: { isValid: true, message: '' },
        lastName: { isValid: true, message: '' },
        email: { isValid: true, message: '' },
        password: { isValid: true, message: '' },
        confirmPassword: { isValid: true, message: '' },
        phone: { isValid: true, message: '' }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Clear errors and success message when component mounts
    useEffect(() => {
        clearError();
        setSuccessMessage('');
    }, [clearError]);

    // Handle automatic redirect after successful registration
    useEffect(() => {
        if (isAuthenticated && justRegistered) {
            console.log('User authenticated after signup, redirecting...');
            // Give users time to read the success message before redirecting
            const redirectTimer = setTimeout(() => {
                navigate('/', { 
                    replace: true,
                    state: { message: 'Welcome to the portfolio! You are now signed in.' }
                });
            }, 2000); // 2 second delay
            
            return () => clearTimeout(redirectTimer);
        }
    }, [isAuthenticated, justRegistered, navigate]);

    // Redirect if already authenticated (for component initialization)
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Validation rules
    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    return { isValid: false, message: `${name === 'firstName' ? 'First' : 'Last'} name is required` };
                }
                if (value.trim().length < 2) {
                    return { isValid: false, message: `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters` };
                }
                return { isValid: true, message: '' };

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
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
                }
                return { isValid: true, message: '' };

            case 'confirmPassword':
                if (!value) {
                    return { isValid: false, message: 'Please confirm your password' };
                }
                if (value !== formData.password) {
                    return { isValid: false, message: 'Passwords do not match' };
                }
                return { isValid: true, message: '' };

            case 'phone':
                if (value && !/^\+?[\d\s-()]+$/.test(value)) {
                    return { isValid: false, message: 'Please enter a valid phone number' };
                }
                return { isValid: true, message: '' };

            default:
                return { isValid: true, message: '' };
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Clear success message when user starts typing
        if (successMessage) {
            setSuccessMessage('');
        }
        
        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate field
        if (validation[name]) {
            const fieldValidation = validateField(name, value);
            setValidation(prev => ({
                ...prev,
                [name]: fieldValidation
            }));
        }

        // Also validate confirm password if password changes
        if (name === 'password' && formData.confirmPassword) {
            const confirmPasswordValidation = validateField('confirmPassword', formData.confirmPassword);
            setValidation(prev => ({
                ...prev,
                confirmPassword: confirmPasswordValidation
            }));
        }

        // Clear any global errors
        clearError();
    };

    // Validate entire form
    const validateForm = () => {
        const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone'];
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
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Starting registration process...');
            const result = await register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                role: formData.role,
                phone: formData.phone.trim(),
                bio: formData.bio.trim()
            });

            console.log('Registration result:', result);
            
            // The useEffect will handle navigation once isAuthenticated becomes true
            if (!result.success) {
                console.error('Registration failed:', result.error);
            } else {
                console.log('Registration successful, waiting for auth state update...');
                setSuccessMessage('Account created successfully! You are now signed in. Redirecting...');
                setJustRegistered(true);
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join our portfolio community</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {/* Global Error Display */}
                    {error && (
                        <div className="error-message global-error">
                            <i className="fas fa-exclamation-triangle"></i>
                            {error}
                        </div>
                    )}

                    {/* Success Message Display */}
                    {successMessage && (
                        <div className="success-message global-success">
                            <i className="fas fa-check-circle"></i>
                            {successMessage}
                        </div>
                    )}

                    {/* Name Fields */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`form-control ${!validation.firstName.isValid ? 'error' : ''}`}
                                placeholder="Enter your first name"
                                disabled={isLoading || isSubmitting}
                                required
                            />
                            {!validation.firstName.isValid && (
                                <span className="error-message">
                                    {validation.firstName.message}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`form-control ${!validation.lastName.isValid ? 'error' : ''}`}
                                placeholder="Enter your last name"
                                disabled={isLoading || isSubmitting}
                                required
                            />
                            {!validation.lastName.isValid && (
                                <span className="error-message">
                                    {validation.lastName.message}
                                </span>
                            )}
                        </div>
                    </div>

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
                        />
                        {!validation.email.isValid && (
                            <span className="error-message">
                                {validation.email.message}
                            </span>
                        )}
                    </div>

                    {/* Password Fields */}
                    <div className="form-row">
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
                                    placeholder="Create a strong password"
                                    disabled={isLoading || isSubmitting}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password *</label>
                            <div className="password-input">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`form-control ${!validation.confirmPassword.isValid ? 'error' : ''}`}
                                    placeholder="Confirm your password"
                                    disabled={isLoading || isSubmitting}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    <i className={`fas fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                                </button>
                            </div>
                            {!validation.confirmPassword.isValid && (
                                <span className="error-message">
                                    {validation.confirmPassword.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Phone Field */}
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`form-control ${!validation.phone.isValid ? 'error' : ''}`}
                            placeholder="Enter your phone number (optional)"
                            disabled={isLoading || isSubmitting}
                            autoComplete="tel"
                        />
                        {!validation.phone.isValid && (
                            <span className="error-message">
                                {validation.phone.message}
                            </span>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="form-control"
                            disabled={isLoading || isSubmitting}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Bio Field */}
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Tell us about yourself (optional)"
                            rows="3"
                            disabled={isLoading || isSubmitting}
                        />
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
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/signin" className="auth-link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;