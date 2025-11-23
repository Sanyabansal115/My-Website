/**
 * Contact.jsx - Enhanced Contact Component with Backend Integration
 * 
 * This component provides visitors with two clean containers side by side:
 * - Contact Information Container: Personal details and professional links
 * - Contact Form Container: Interactive messaging form with backend integration
 * 
 * Features:
 * - Backend API integration for message storage
 * - Admin panel for message management (admin users only)
 * - Email notification via EmailJS
 * - Role-based access control
 * - Message history and status tracking
 * 
 * @author Sanya Bansal
 * @version 3.0.0 - Added backend integration and admin features
 * @since 2025-10-11
 */

// Import React hooks and routing utilities
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAuth } from '../contexts/AuthContext';
import { contactAPI } from '../services/apiService';


/**
 * Enhanced Contact Component
 * 
 * Renders a contact section with:
 * 1. Contact Information Container - Personal details and professional links
 * 2. Contact Form Container - Interactive messaging form with backend integration
 * 3. Admin Panel - Message management for admin users (conditional rendering)
 * 
 * Features backend API integration, role-based access, and message tracking.
 * 
 * @returns {JSX.Element} Complete contact section with backend integration
 */
export default function Contact() {
  // Navigation and authentication hooks
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  /**
   * State Management
   */
  
  // Form data state - pre-fill for authenticated users
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Loading and UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  
  // Admin panel states
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Pre-fill form for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  /**
   * Form Input Change Handler
   * 
   * Updates the form state when user types in any input field.
   * Uses the spread operator to maintain other field values while
   * updating the specific field that changed.
   * 
   * @param {Event} e - The input change event
   * @param {string} e.target.name - The name attribute of the input field
   * @param {string} e.target.value - The current value of the input field
   */
  const handleChange = (inputChangeEvent) => {
    setFormData({ 
      ...formData, 
      [inputChangeEvent.target.name]: inputChangeEvent.target.value 
    });
  };

  /**
   * Form Submission Handler with Backend Integration
   * 
   * Processes form submission with:
   * 1. Backend API storage (primary method)
   * 2. EmailJS notification
   * 3. Local storage fallback
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (formSubmissionEvent) => {
    formSubmissionEvent.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');
    
    try {
      // Prepare message data
      const messageData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim()
      };

      // Submit to backend API
      const response = await contactAPI.createMessage(messageData);
      
      if (response.success) {
        // Send email notification via EmailJS
        try {
          emailjs.init('iKwx-_dL0Kt8ZrWJR');
          
          const templateParams = {
            from_name: `${messageData.firstName} ${messageData.lastName}`,
            from_email: messageData.email,
            phone: messageData.phone,
            message: messageData.message,
            to_email: 'sanya.bansal.115@gmail.com',
            reply_to: messageData.email
          };
          
          await emailjs.send(
            'service_m8v5s8f',
            'template_rq7t7gm',
            templateParams
          );
        } catch (emailError) {
          console.warn('EmailJS failed, but message saved to backend:', emailError);
        }
        
        setSubmitMessage(
          `Thank you, ${messageData.firstName}! Your message has been sent successfully. I'll get back to you within 4-6 hours!`
        );
        
        // Reset form - preserve auth user info if logged in
        if (isAuthenticated && user) {
          setFormData({
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            phone: '',
            message: ''
          });
        } else {
          setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        }
        
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError('There was an error sending your message. Please try again or email me directly.');
      
      // Fallback: Save to localStorage
      const localMessages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
      localMessages.push({
        timestamp: new Date().toISOString(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      localStorage.setItem('portfolioMessages', JSON.stringify(localMessages));
      
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Admin Panel Functions
   */
  
  // Load messages for admin panel
  const loadMessages = async () => {
    if (!isAdmin) return;
    
    setLoadingMessages(true);
    try {
      const response = await contactAPI.getMessages();
      if (response.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Load messages when admin panel is opened
  useEffect(() => {
    if (showAdminPanel && isAdmin) {
      loadMessages();
    }
  }, [showAdminPanel, isAdmin]);

  // Update message status
  const updateMessageStatus = async (messageId, status) => {
    try {
      const response = await contactAPI.updateMessage(messageId, { status });
      if (response.success) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, status } : msg
        ));
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await contactAPI.deleteMessage(messageId);
        if (response.success) {
          setMessages(messages.filter(msg => msg._id !== messageId));
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <section className="contact-section">
      <div className="section-header">
        <h2 className="section-title">Let's Connect</h2>
        <p className="section-subtitle">
          Ready to bring your data science vision to life? Let's discuss your project!
        </p>
        
        {/* Admin Panel Toggle */}
        {isAdmin && (
          <div className="admin-controls">
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="btn btn-admin"
            >
              {showAdminPanel ? 'Hide Messages' : 'Manage Messages'}
            </button>
          </div>
        )}
      </div>
      
      {/* Centered Contact Grid - Two Hover Cards */}
      <div className="contact-grid">
        
        {/* Contact Information Card */}
        <div className="contact-card contact-info-card">
          <div className="card-header">
            <span className="card-icon">🤝</span>
            <h3>Get In Touch</h3>
          </div>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">👨‍💻</span>
              <div className="contact-content">
                <strong>Sanya Bansal</strong>
                <p>AI & Data Science Specialist</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div className="contact-content">
                <strong>Email</strong>
                <p>
                  <a href="mailto:sanya.bansal.115@gmail.com">
                    sanya.bansal.115@gmail.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <div className="contact-content">
                <strong>Phone</strong>
                <p>
                  <a href="tel:+14377331773">
                    +1 (437) 733-1773
                  </a>
                </p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div className="contact-content">
                <strong>Location</strong>
                <p>Toronto, Ontario, Canada</p>
              </div>
            </div>
            
            <div className="social-links">
              <h4>Connect With Me</h4>
              <div className="social-buttons">
                <a 
                  href="https://www.linkedin.com/in/sanya-bansal-824830302/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn linkedin"
                >
                  <span>💼</span>
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/Sanyabansal115" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn github"
                >
                  <span>💻</span>
                  GitHub
                </a>
              </div>
            </div>
            
            <div className="availability">
              <span className="status-dot">🟢</span>
              <p>Available for freelance projects and full-time opportunities</p>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="contact-card contact-form-card">
          <div className="card-header">
            <span className="card-icon">📝</span>
            <h3>Send Me a Message</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  placeholder="John" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Doe" 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Contact Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+1 (123) 456-7890" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Project Details / Message *</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                placeholder="Tell me about your project, goals, and how I can help..."
                rows="5"
              ></textarea>
            </div>
            
            {/* Success/Error Messages */}
            {submitMessage && (
              <div className="alert alert-success">
                {submitMessage}
              </div>
            )}
            
            {submitError && (
              <div className="alert alert-error">
                {submitError}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message to Sanya'}
            </button>
          </form>
          
          <div className="form-footer">
            <p>
              <span>⏱️</span>
              Typical response time: 4-6 hours
            </p>
            {isAuthenticated && (
              <p className="auth-note">
                <span>✓</span>
                Logged in as {user?.name} - form pre-filled
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {isAdmin && showAdminPanel && (
        <div className="admin-panel">
          <div className="admin-header">
            <h3>Message Management</h3>
            <button onClick={loadMessages} className="btn btn-secondary" disabled={loadingMessages}>
              {loadingMessages ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loadingMessages ? (
            <div className="loading-spinner">Loading messages...</div>
          ) : (
            <div className="admin-content">
              {/* Messages List */}
              <div className="messages-list">
                <h4>Recent Messages ({messages.length})</h4>
                {messages.length === 0 ? (
                  <p className="no-messages">No messages found.</p>
                ) : (
                  <div className="message-cards">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`message-card ${selectedMessage?._id === message._id ? 'selected' : ''} ${message.status}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="message-header">
                          <div className="message-sender">
                            <strong>{message.firstName} {message.lastName}</strong>
                            <span className="message-email">{message.email}</span>
                          </div>
                          <div className="message-meta">
                            <span className={`status-badge ${message.status}`}>
                              {message.status}
                            </span>
                            <span className="message-date">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="message-preview">
                          {message.message.substring(0, 100)}
                          {message.message.length > 100 && '...'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Details */}
              {selectedMessage && (
                <div className="message-details">
                  <div className="details-header">
                    <h4>Message Details</h4>
                    <div className="details-actions">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => updateMessageStatus(selectedMessage._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => deleteMessage(selectedMessage._id)}
                        className="btn btn-danger btn-small"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="message-full">
                    <div className="contact-info">
                      <p><strong>Name:</strong> {selectedMessage.firstName} {selectedMessage.lastName}</p>
                      <p><strong>Email:</strong> 
                        <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                      </p>
                      {selectedMessage.phone && (
                        <p><strong>Phone:</strong> 
                          <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>
                        </p>
                      )}
                      <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="message-content">
                      <p><strong>Message:</strong></p>
                      <div className="message-text">
                        {selectedMessage.message}
                      </div>
                    </div>

                    <div className="quick-actions">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: Your message to Sanya Bansal&body=Hi ${selectedMessage.firstName},%0D%0A%0D%0AThank you for your message. `}
                        className="btn btn-primary"
                      >
                        Reply via Email
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}