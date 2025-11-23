/**
 * EducationForm Component
 * 
 * Form for adding and editing education records with full validation.
 * Supports both create and update operations with role-based access.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { educationAPI } from '../services/apiService';


const EducationForm = ({ 
    educationId = null, 
    onSuccess = () => {}, 
    onCancel = () => {},
    initialData = null 
}) => {
    const { user } = useAuth();
    
    // Form state
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        description: '',
        isVisible: true,
        achievements: ['']
    });

    // Form validation state
    const [validation, setValidation] = useState({
        institution: { isValid: true, message: '' },
        degree: { isValid: true, message: '' },
        fieldOfStudy: { isValid: true, message: '' },
        startDate: { isValid: true, message: '' },
        endDate: { isValid: true, message: '' }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Load existing education data if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                institution: initialData.institution || '',
                degree: initialData.degree || '',
                fieldOfStudy: initialData.fieldOfStudy || '',
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
                grade: initialData.grade || '',
                description: initialData.description || '',
                isVisible: initialData.isVisible !== false,
                achievements: initialData.achievements && initialData.achievements.length > 0 
                    ? initialData.achievements 
                    : ['']
            });
        }
    }, [initialData]);

    // Validation rules
    const validateField = (name, value) => {
        switch (name) {
            case 'institution':
                if (!value.trim()) {
                    return { isValid: false, message: 'Institution name is required' };
                }
                if (value.trim().length < 2) {
                    return { isValid: false, message: 'Institution name must be at least 2 characters' };
                }
                return { isValid: true, message: '' };

            case 'degree':
                if (!value.trim()) {
                    return { isValid: false, message: 'Degree is required' };
                }
                return { isValid: true, message: '' };

            case 'fieldOfStudy':
                if (!value.trim()) {
                    return { isValid: false, message: 'Field of study is required' };
                }
                return { isValid: true, message: '' };

            case 'startDate':
                if (!value) {
                    return { isValid: false, message: 'Start date is required' };
                }
                return { isValid: true, message: '' };

            case 'endDate':
                if (value && formData.startDate && new Date(value) <= new Date(formData.startDate)) {
                    return { isValid: false, message: 'End date must be after start date' };
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

        // Validate field
        if (validation[name]) {
            const fieldValidation = validateField(name, value);
            setValidation(prev => ({
                ...prev,
                [name]: fieldValidation
            }));
        }

        // Clear any global errors
        setError(null);
    };

    // Handle achievements array changes
    const handleAchievementChange = (index, value) => {
        const newAchievements = [...formData.achievements];
        newAchievements[index] = value;
        setFormData(prev => ({
            ...prev,
            achievements: newAchievements
        }));
    };

    const addAchievement = () => {
        setFormData(prev => ({
            ...prev,
            achievements: [...prev.achievements, '']
        }));
    };

    const removeAchievement = (index) => {
        if (formData.achievements.length > 1) {
            setFormData(prev => ({
                ...prev,
                achievements: prev.achievements.filter((_, i) => i !== index)
            }));
        }
    };

    // Validate entire form
    const validateForm = () => {
        const fields = ['institution', 'degree', 'fieldOfStudy', 'startDate', 'endDate'];
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
        setError(null);

        try {
            const submitData = {
                ...formData,
                achievements: formData.achievements.filter(achievement => achievement.trim())
            };

            let response;
            if (educationId) {
                // Update existing education
                response = await educationAPI.updateEducation(educationId, submitData);
            } else {
                // Create new education
                response = await educationAPI.createEducation(submitData);
            }

            if (response) {
                onSuccess(response);
            }
        } catch (error) {
            console.error('Error submitting education form:', error);
            setError(error.message || 'Failed to save education record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="education-form" noValidate>
                <div className="form-header">
                    <h2>{educationId ? 'Edit Education Record' : 'Add Education Record'}</h2>
                    <p>Fill in the details below to {educationId ? 'update' : 'add'} an education record.</p>
                </div>

                {/* Global Error Display */}
                {error && (
                    <div className="error-message global-error">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                {/* Institution Field */}
                <div className="form-group">
                    <label htmlFor="institution">Institution *</label>
                    <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        className={`form-control ${!validation.institution.isValid ? 'error' : ''}`}
                        placeholder="Enter institution name"
                        disabled={isSubmitting}
                        required
                    />
                    {!validation.institution.isValid && (
                        <span className="error-message">
                            {validation.institution.message}
                        </span>
                    )}
                </div>

                {/* Degree Field */}
                <div className="form-group">
                    <label htmlFor="degree">Degree *</label>
                    <input
                        type="text"
                        id="degree"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className={`form-control ${!validation.degree.isValid ? 'error' : ''}`}
                        placeholder="e.g., Bachelor of Science, Master of Arts"
                        disabled={isSubmitting}
                        required
                    />
                    {!validation.degree.isValid && (
                        <span className="error-message">
                            {validation.degree.message}
                        </span>
                    )}
                </div>

                {/* Field of Study */}
                <div className="form-group">
                    <label htmlFor="fieldOfStudy">Field of Study *</label>
                    <input
                        type="text"
                        id="fieldOfStudy"
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleInputChange}
                        className={`form-control ${!validation.fieldOfStudy.isValid ? 'error' : ''}`}
                        placeholder="e.g., Computer Science, Business Administration"
                        disabled={isSubmitting}
                        required
                    />
                    {!validation.fieldOfStudy.isValid && (
                        <span className="error-message">
                            {validation.fieldOfStudy.message}
                        </span>
                    )}
                </div>

                {/* Date Fields */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date *</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className={`form-control ${!validation.startDate.isValid ? 'error' : ''}`}
                            disabled={isSubmitting}
                            required
                        />
                        {!validation.startDate.isValid && (
                            <span className="error-message">
                                {validation.startDate.message}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className={`form-control ${!validation.endDate.isValid ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                        {!validation.endDate.isValid && (
                            <span className="error-message">
                                {validation.endDate.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Grade Field */}
                <div className="form-group">
                    <label htmlFor="grade">Grade/GPA</label>
                    <input
                        type="text"
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="e.g., 3.8/4.0, First Class, 85%"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Description Field */}
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Describe your experience, coursework, or activities..."
                        rows="4"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Achievements Field */}
                <div className="form-group">
                    <label>Achievements & Activities</label>
                    {formData.achievements.map((achievement, index) => (
                        <div key={index} className="achievement-input">
                            <input
                                type="text"
                                value={achievement}
                                onChange={(e) => handleAchievementChange(index, e.target.value)}
                                className="form-control"
                                placeholder="Enter an achievement or activity"
                                disabled={isSubmitting}
                            />
                            {formData.achievements.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeAchievement(index)}
                                    className="btn btn-sm btn-danger"
                                    disabled={isSubmitting}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addAchievement}
                        className="btn btn-sm btn-secondary"
                        disabled={isSubmitting}
                    >
                        <i className="fas fa-plus"></i>
                        Add Achievement
                    </button>
                </div>

                {/* Visibility Toggle */}
                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isVisible"
                            checked={formData.isVisible}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                        <span className="checkmark"></span>
                        Make this education record visible on the portfolio
                    </label>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                {educationId ? 'Updating...' : 'Saving...'}
                            </>
                        ) : (
                            educationId ? 'Update Education' : 'Save Education'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EducationForm;