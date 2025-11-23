/**
 * Admin Dashboard Component
 * 
 * Administrative interface for managing portfolio content including
 * education records, projects, contact messages, and user management.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contactAPI, educationAPI, projectAPI, userAPI } from '../services/apiService';


const AdminDashboard = () => {
    const { user } = useAuth();
    
    // Active tab state
    const [activeTab, setActiveTab] = useState('overview');
    
    // Data states
    const [stats, setStats] = useState({
        totalContacts: 0,
        totalEducation: 0,
        totalProjects: 0,
        totalUsers: 0
    });
    
    const [contacts, setContacts] = useState([]);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    
    // Loading and error states
    const [loading, setLoading] = useState({
        contacts: false,
        education: false,
        projects: false,
        users: false,
        stats: false
    });
    
    const [error, setError] = useState(null);
    
    // Form states for education and projects
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingEducation, setEditingEducation] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    
    // Form data states
    const [educationForm, setEducationForm] = useState({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        isCurrentlyStudying: false,
        grade: '',
        percentage: '',
        description: '',
        isVisible: true
    });
    
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        shortDescription: '',
        category: 'web-development',
        technologies: [],
        features: [],
        links: {
            live: '',
            github: '',
            demo: ''
        },
        images: [],
        startDate: '',
        endDate: '',
        isCurrentlyWorking: false,
        status: 'completed',
        isVisible: true,
        isFeatured: false
    });

    // Load dashboard data on mount
    useEffect(() => {
        loadDashboardData();
    }, []);

    // Load all dashboard data
    const loadDashboardData = async () => {
        try {
            setLoading(prev => ({ ...prev, stats: true }));
            await Promise.all([
                loadContacts(),
                loadEducation(),
                loadProjects(),
                loadUsers()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    // Load contacts
    const loadContacts = async () => {
        try {
            setLoading(prev => ({ ...prev, contacts: true }));
            const response = await contactAPI.getAllContacts({ limit: 10 });
            setContacts(response.contacts || []);
            setStats(prev => ({ ...prev, totalContacts: response.total || 0 }));
        } catch (error) {
            console.error('Error loading contacts:', error);
        } finally {
            setLoading(prev => ({ ...prev, contacts: false }));
        }
    };

    // Load education records
    const loadEducation = async () => {
        try {
            setLoading(prev => ({ ...prev, education: true }));
            const response = await educationAPI.getAllEducation({ limit: 10 });
            setEducation(response.education || []);
            setStats(prev => ({ ...prev, totalEducation: response.total || 0 }));
        } catch (error) {
            console.error('Error loading education:', error);
        } finally {
            setLoading(prev => ({ ...prev, education: false }));
        }
    };

    // Load projects
    const loadProjects = async () => {
        try {
            setLoading(prev => ({ ...prev, projects: true }));
            const response = await projectAPI.getAllProjects({ limit: 10 });
            setProjects(response.projects || []);
            setStats(prev => ({ ...prev, totalProjects: response.total || 0 }));
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(prev => ({ ...prev, projects: false }));
        }
    };

    // Load users
    const loadUsers = async () => {
        try {
            setLoading(prev => ({ ...prev, users: true }));
            const response = await userAPI.getAllUsers({ limit: 10 });
            setUsers(response.users || []);
            setStats(prev => ({ ...prev, totalUsers: response.total || 0 }));
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    // Handle contact status update
    const updateContactStatus = async (id, status) => {
        try {
            await contactAPI.updateContact(id, { status });
            await loadContacts(); // Reload contacts
        } catch (error) {
            console.error('Error updating contact status:', error);
            setError('Failed to update contact status');
        }
    };

    // Handle user role update
    const updateUserRole = async (id, role) => {
        try {
            await userAPI.updateUserRole(id, { role });
            await loadUsers(); // Reload users
        } catch (error) {
            console.error('Error updating user role:', error);
            setError('Failed to update user role');
        }
    };

    // Education management functions
    const handleEducationSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEducation) {
                await educationAPI.updateEducation(editingEducation._id, educationForm);
            } else {
                await educationAPI.createEducation(educationForm);
            }
            setShowEducationForm(false);
            setEditingEducation(null);
            resetEducationForm();
            await loadEducation();
        } catch (error) {
            console.error('Error saving education:', error);
            setError('Failed to save education record');
        }
    };

    const handleEducationEdit = (education) => {
        setEditingEducation(education);
        setEducationForm({
            institution: education.institution || '',
            degree: education.degree || '',
            fieldOfStudy: education.fieldOfStudy || '',
            startDate: education.startDate ? education.startDate.split('T')[0] : '',
            endDate: education.endDate ? education.endDate.split('T')[0] : '',
            isCurrentlyStudying: education.isCurrentlyStudying || false,
            grade: education.grade || '',
            percentage: education.percentage || '',
            description: education.description || '',
            isVisible: education.isVisible !== false
        });
        setShowEducationForm(true);
    };

    const handleEducationDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this education record?')) {
            try {
                await educationAPI.deleteEducation(id);
                await loadEducation();
            } catch (error) {
                console.error('Error deleting education:', error);
                setError('Failed to delete education record');
            }
        }
    };

    const resetEducationForm = () => {
        setEducationForm({
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            isCurrentlyStudying: false,
            grade: '',
            percentage: '',
            description: '',
            isVisible: true
        });
    };

    // Project management functions
    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...projectForm,
                technologies: Array.isArray(projectForm.technologies) 
                    ? projectForm.technologies 
                    : projectForm.technologies.split(',').map(t => t.trim()).filter(t => t),
                features: Array.isArray(projectForm.features) 
                    ? projectForm.features 
                    : projectForm.features.split(',').map(f => f.trim()).filter(f => f)
            };
            
            if (editingProject) {
                await projectAPI.updateProject(editingProject._id, projectData);
            } else {
                await projectAPI.createProject(projectData);
            }
            setShowProjectForm(false);
            setEditingProject(null);
            resetProjectForm();
            await loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            setError('Failed to save project');
        }
    };

    const handleProjectEdit = (project) => {
        setEditingProject(project);
        setProjectForm({
            title: project.title || '',
            description: project.description || '',
            shortDescription: project.shortDescription || '',
            category: project.category || 'web-development',
            technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
            features: Array.isArray(project.features) ? project.features.join(', ') : '',
            links: {
                live: project.links?.live || '',
                github: project.links?.github || '',
                demo: project.links?.demo || ''
            },
            images: project.images || [],
            startDate: project.startDate ? project.startDate.split('T')[0] : '',
            endDate: project.endDate ? project.endDate.split('T')[0] : '',
            isCurrentlyWorking: project.isCurrentlyWorking || false,
            status: project.status || 'completed',
            isVisible: project.isVisible !== false,
            isFeatured: project.isFeatured || false
        });
        setShowProjectForm(true);
    };

    const handleProjectDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectAPI.deleteProject(id);
                await loadProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
                setError('Failed to delete project');
            }
        }
    };

    const resetProjectForm = () => {
        setProjectForm({
            title: '',
            description: '',
            shortDescription: '',
            category: 'web-development',
            technologies: [],
            features: [],
            links: {
                live: '',
                github: '',
                demo: ''
            },
            images: [],
            startDate: '',
            endDate: '',
            isCurrentlyWorking: false,
            status: 'completed',
            isVisible: true,
            isFeatured: false
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Render overview tab
    const renderOverview = () => (
        <div className="overview-section">
            <h2>Dashboard Overview</h2>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalContacts}</h3>
                        <p>Contact Messages</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalEducation}</h3>
                        <p>Education Records</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-project-diagram"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalProjects}</h3>
                        <p>Projects</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h3>Recent Contact Messages</h3>
                <div className="activity-list">
                    {contacts.slice(0, 5).map(contact => (
                        <div key={contact._id} className="activity-item">
                            <div className="activity-info">
                                <h4>{contact.name}</h4>
                                <p>{contact.subject}</p>
                                <small>From: {contact.email}</small>
                            </div>
                            <div className="activity-meta">
                                <span className={`status ${contact.status}`}>
                                    {contact.status}
                                </span>
                                <small>{formatDate(contact.createdAt)}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Render contacts tab
    const renderContacts = () => (
        <div className="contacts-section">
            <div className="section-header">
                <h2>Contact Messages</h2>
                <button 
                    className="btn btn-secondary"
                    onClick={loadContacts}
                    disabled={loading.contacts}
                >
                    {loading.contacts ? (
                        <><i className="fas fa-spinner fa-spin"></i> Loading...</>
                    ) : (
                        <><i className="fas fa-sync-alt"></i> Refresh</>
                    )}
                </button>
            </div>
            
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact._id}>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.subject}</td>
                                <td>
                                    <select 
                                        value={contact.status}
                                        onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                                        className={`status-select ${contact.status}`}
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="responded">Responded</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </td>
                                <td>{formatDate(contact.createdAt)}</td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        onClick={() => {/* View message modal */}}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Render users tab
    const renderUsers = () => (
        <div className="users-section">
            <div className="section-header">
                <h2>User Management</h2>
                <button 
                    className="btn btn-secondary"
                    onClick={loadUsers}
                    disabled={loading.users}
                >
                    {loading.users ? (
                        <><i className="fas fa-spinner fa-spin"></i> Loading...</>
                    ) : (
                        <><i className="fas fa-sync-alt"></i> Refresh</>
                    )}
                </button>
            </div>
            
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(userItem => (
                            <tr key={userItem._id}>
                                <td>{userItem.firstName} {userItem.lastName}</td>
                                <td>{userItem.email}</td>
                                <td>
                                    <select 
                                        value={userItem.role}
                                        onChange={(e) => updateUserRole(userItem._id, e.target.value)}
                                        className="role-select"
                                        disabled={userItem._id === user._id}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`status ${userItem.isActive ? 'active' : 'inactive'}`}>
                                        {userItem.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>{formatDate(userItem.createdAt)}</td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        disabled={userItem._id === user._id}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Render education tab
    const renderEducation = () => (
        <div className="education-section">
            <div className="section-header">
                <h2>Education Management</h2>
                <div className="header-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setShowEducationForm(true);
                            setEditingEducation(null);
                            resetEducationForm();
                        }}
                    >
                        <i className="fas fa-plus"></i> Add Education
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={loadEducation}
                        disabled={loading.education}
                    >
                        {loading.education ? (
                            <><i className="fas fa-spinner fa-spin"></i> Loading...</>
                        ) : (
                            <><i className="fas fa-sync-alt"></i> Refresh</>
                        )}
                    </button>
                </div>
            </div>

            {showEducationForm && (
                <div className="form-modal">
                    <div className="form-container">
                        <div className="form-header">
                            <h3>{editingEducation ? 'Edit Education' : 'Add Education'}</h3>
                            <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                    setShowEducationForm(false);
                                    setEditingEducation(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleEducationSubmit} className="crud-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Institution *</label>
                                    <input
                                        type="text"
                                        value={educationForm.institution}
                                        onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                                        required
                                        maxLength="200"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Degree/Qualification *</label>
                                    <input
                                        type="text"
                                        value={educationForm.degree}
                                        onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                                        required
                                        maxLength="150"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Field of Study *</label>
                                    <input
                                        type="text"
                                        value={educationForm.fieldOfStudy}
                                        onChange={(e) => setEducationForm({...educationForm, fieldOfStudy: e.target.value})}
                                        required
                                        maxLength="150"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Grade/GPA</label>
                                    <input
                                        type="text"
                                        value={educationForm.grade}
                                        onChange={(e) => setEducationForm({...educationForm, grade: e.target.value})}
                                        maxLength="50"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input
                                        type="date"
                                        value={educationForm.startDate}
                                        onChange={(e) => setEducationForm({...educationForm, startDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={educationForm.endDate}
                                        onChange={(e) => setEducationForm({...educationForm, endDate: e.target.value})}
                                        disabled={educationForm.isCurrentlyStudying}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Percentage/Score</label>
                                    <input
                                        type="number"
                                        value={educationForm.percentage}
                                        onChange={(e) => setEducationForm({...educationForm, percentage: e.target.value})}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={educationForm.isCurrentlyStudying}
                                                onChange={(e) => setEducationForm({
                                                    ...educationForm, 
                                                    isCurrentlyStudying: e.target.checked,
                                                    endDate: e.target.checked ? '' : educationForm.endDate
                                                })}
                                            />
                                            Currently Studying
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={educationForm.isVisible}
                                                onChange={(e) => setEducationForm({...educationForm, isVisible: e.target.checked})}
                                            />
                                            Visible on Website
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={educationForm.description}
                                    onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                                    rows="3"
                                    maxLength="500"
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i> Save Education
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowEducationForm(false);
                                        setEditingEducation(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Institution</th>
                            <th>Degree</th>
                            <th>Field of Study</th>
                            <th>Period</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {education.map(edu => (
                            <tr key={edu._id}>
                                <td>{edu.institution}</td>
                                <td>{edu.degree}</td>
                                <td>{edu.fieldOfStudy}</td>
                                <td>
                                    {formatDate(edu.startDate)} - {
                                        edu.isCurrentlyStudying ? 'Present' : 
                                        edu.endDate ? formatDate(edu.endDate) : 'N/A'
                                    }
                                </td>
                                <td>{edu.grade || edu.percentage ? `${edu.grade || ''} ${edu.percentage ? edu.percentage + '%' : ''}`.trim() : 'N/A'}</td>
                                <td>
                                    <span className={`status ${edu.isVisible ? 'visible' : 'hidden'}`}>
                                        {edu.isVisible ? 'Visible' : 'Hidden'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleEducationEdit(edu)}
                                        >
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleEducationDelete(edu._id)}
                                        >
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Render projects tab
    const renderProjects = () => (
        <div className="projects-section">
            <div className="section-header">
                <h2>Projects Management</h2>
                <div className="header-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setShowProjectForm(true);
                            setEditingProject(null);
                            resetProjectForm();
                        }}
                    >
                        <i className="fas fa-plus"></i> Add Project
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={loadProjects}
                        disabled={loading.projects}
                    >
                        {loading.projects ? (
                            <><i className="fas fa-spinner fa-spin"></i> Loading...</>
                        ) : (
                            <><i className="fas fa-sync-alt"></i> Refresh</>
                        )}
                    </button>
                </div>
            </div>

            {showProjectForm && (
                <div className="form-modal">
                    <div className="form-container">
                        <div className="form-header">
                            <h3>{editingProject ? 'Edit Project' : 'Add Project'}</h3>
                            <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                    setShowProjectForm(false);
                                    setEditingProject(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleProjectSubmit} className="crud-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project Title *</label>
                                    <input
                                        type="text"
                                        value={projectForm.title}
                                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                                        required
                                        maxLength="200"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={projectForm.category}
                                        onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                                        required
                                    >
                                        <option value="web-development">Web Development</option>
                                        <option value="mobile-app">Mobile App</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="ai-machine-learning">AI/Machine Learning</option>
                                        <option value="desktop-app">Desktop App</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Short Description</label>
                                <input
                                    type="text"
                                    value={projectForm.shortDescription}
                                    onChange={(e) => setProjectForm({...projectForm, shortDescription: e.target.value})}
                                    maxLength="300"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Full Description *</label>
                                <textarea
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                                    required
                                    rows="4"
                                    maxLength="2000"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Technologies (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={projectForm.technologies}
                                        onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Key Features (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={projectForm.features}
                                        onChange={(e) => setProjectForm({...projectForm, features: e.target.value})}
                                        placeholder="User authentication, Real-time updates"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Project Links</label>
                                <div className="links-group">
                                    <input
                                        type="url"
                                        value={projectForm.links.live}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm, 
                                            links: {...projectForm.links, live: e.target.value}
                                        })}
                                        placeholder="Live Demo URL"
                                    />
                                    <input
                                        type="url"
                                        value={projectForm.links.github}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm, 
                                            links: {...projectForm.links, github: e.target.value}
                                        })}
                                        placeholder="GitHub Repository URL"
                                    />
                                    <input
                                        type="url"
                                        value={projectForm.links.demo}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm, 
                                            links: {...projectForm.links, demo: e.target.value}
                                        })}
                                        placeholder="Demo Video URL"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        value={projectForm.startDate}
                                        onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={projectForm.endDate}
                                        onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                                        disabled={projectForm.isCurrentlyWorking}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project Status</label>
                                    <select
                                        value={projectForm.status}
                                        onChange={(e) => setProjectForm({...projectForm, status: e.target.value})}
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="planned">Planned</option>
                                        <option value="on-hold">On Hold</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={projectForm.isCurrentlyWorking}
                                                onChange={(e) => setProjectForm({
                                                    ...projectForm, 
                                                    isCurrentlyWorking: e.target.checked,
                                                    endDate: e.target.checked ? '' : projectForm.endDate
                                                })}
                                            />
                                            Currently Working
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={projectForm.isVisible}
                                                onChange={(e) => setProjectForm({...projectForm, isVisible: e.target.checked})}
                                            />
                                            Visible on Website
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={projectForm.isFeatured}
                                                onChange={(e) => setProjectForm({...projectForm, isFeatured: e.target.checked})}
                                            />
                                            Featured Project
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i> Save Project
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowProjectForm(false);
                                        setEditingProject(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Technologies</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Visibility</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project._id}>
                                <td>
                                    <div className="project-info">
                                        <strong>{project.title}</strong>
                                        {project.shortDescription && (
                                            <div className="project-desc">{project.shortDescription}</div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className={`category-badge ${project.category}`}>
                                        {project.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </td>
                                <td>
                                    <div className="tech-tags">
                                        {project.technologies?.slice(0, 3).map((tech, index) => (
                                            <span key={index} className="tech-tag">{tech}</span>
                                        ))}
                                        {project.technologies?.length > 3 && (
                                            <span className="tech-more">+{project.technologies.length - 3}</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className={`status ${project.status}`}>
                                        {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </td>
                                <td>
                                    <span className={`featured ${project.isFeatured ? 'yes' : 'no'}`}>
                                        {project.isFeatured ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status ${project.isVisible ? 'visible' : 'hidden'}`}>
                                        {project.isVisible ? 'Visible' : 'Hidden'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleProjectEdit(project)}
                                        >
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleProjectDelete(project._id)}
                                        >
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, {user.firstName}!</p>
            </div>

            {error && (
                <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="dashboard-nav">
                <button 
                    className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <i className="fas fa-chart-line"></i>
                    Overview
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contacts')}
                >
                    <i className="fas fa-envelope"></i>
                    Contacts
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'education' ? 'active' : ''}`}
                    onClick={() => setActiveTab('education')}
                >
                    <i className="fas fa-graduation-cap"></i>
                    Education
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    <i className="fas fa-project-diagram"></i>
                    Projects
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <i className="fas fa-users"></i>
                    Users
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'contacts' && renderContacts()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'education' && renderEducation()}
                {activeTab === 'projects' && renderProjects()}
            </div>
        </div>
    );
};

export default AdminDashboard;