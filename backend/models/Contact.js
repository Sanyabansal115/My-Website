/**
 * Contact Model - MongoDB Schema for Contact Form Submissions
 * 
 * Stores contact form submissions with user information and message details.
 * Supports status tracking for admin management.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ]
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Admin notes cannot exceed 500 characters']
    },
    ipAddress: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient querying
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

export default mongoose.model('Contact', contactSchema);